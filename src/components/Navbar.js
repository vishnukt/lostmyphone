import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Container,
  Avatar,
  Collapse,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { FaAddressBook, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Extract these values to avoid conditional hook calls
  const textHoverColor = useColorModeValue('blue.500', 'blue.300');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Box position="sticky" top="0" zIndex="sticky">
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        boxShadow="sm"
      >
        <Container maxW="container.xl" px={0}>
          <Flex width="100%" align="center" justify="space-between">
            <Flex align="center">
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onToggle}
                icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
                mr={2}
              />
              <Text
                fontFamily={'heading'}
                color={useColorModeValue('gray.800', 'white')}
                fontWeight="bold"
                as={RouterLink}
                to="/"
              >
                LostMyPhone
              </Text>
            </Flex>

            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <Stack direction={'row'} spacing={4}>
                <Link
                  p={2}
                  fontSize={'sm'}
                  fontWeight={500}
                  _hover={{
                    textDecoration: 'none',
                    color: textHoverColor,
                  }}
                  as={RouterLink}
                  to="/"
                >
                  Home
                </Link>
                {isAuthenticated && (
                  <Link
                    p={2}
                    fontSize={'sm'}
                    fontWeight={500}
                    _hover={{
                      textDecoration: 'none',
                      color: textHoverColor,
                    }}
                    as={RouterLink}
                    to="/contacts"
                  >
                    My Contacts
                  </Link>
                )}
              </Stack>
            </Flex>

            <Stack
              direction={'row'}
              spacing={4}
              align="center"
            >
              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}
                    rightIcon={<ChevronDownIcon />}
                  >
                    <Flex align="center">
                      <Avatar
                        size={'sm'}
                        mr={2}
                        name={user?.fullName || 'User'}
                        bg="blue.500"
                        color="white"
                      />
                      <Text display={{ base: 'none', md: 'block' }}>
                        {user?.fullName?.split(' ')[0] || 'User'}
                      </Text>
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FaAddressBook />} as={RouterLink} to="/contacts">
                      My Contacts
                    </MenuItem>
                    <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Button
                    as={RouterLink}
                    to="/login"
                    fontSize={'sm'}
                    fontWeight={400}
                    variant={'link'}
                  >
                    Sign In
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/register"
                    display={{ base: 'none', md: 'inline-flex' }}
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'blue.500'}
                    _hover={{
                      bg: 'blue.400',
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          </Flex>
        </Container>
      </Flex>

      {/* Mobile nav */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          p={4}
          display={{ md: 'none' }}
          bg={useColorModeValue('white', 'gray.800')}
          shadow="md"
          borderBottom="1px"
          borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Stack as={'nav'} spacing={4}>
            <Link
              py={2}
              as={RouterLink}
              to="/"
              fontWeight={500}
              _hover={{
                textDecoration: 'none',
                color: textHoverColor,
              }}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                py={2}
                as={RouterLink}
                to="/contacts"
                fontWeight={500}
                _hover={{
                  textDecoration: 'none',
                  color: textHoverColor,
                }}
              >
                My Contacts
              </Link>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
} 