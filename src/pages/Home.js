import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { FaLock, FaMobileAlt, FaUserFriends, FaKey, FaGlobe, FaChevronDown, FaSignOutAlt, FaAddressBook } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const Feature = ({ icon, title, text }) => {
  return (
    <VStack
      align="start"
      p={5}
      bg="white"
      rounded="md"
      shadow="md"
      borderWidth="1px"
      borderColor="gray.100"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-5px)', shadow: 'lg' }}
    >
      <Flex
        w={12}
        h={12}
        align="center"
        justify="center"
        rounded="full"
        bg="blue.100"
        color="blue.500"
        mb={4}
      >
        <Icon as={icon} w={6} h={6} />
      </Flex>
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text color="gray.600">{text}</Text>
    </VStack>
  );
};

const Home = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LostMyPhone",
    "description": "A service to store and access your emergency contacts when your phone is lost or damaged.",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Store emergency contacts securely",
      "Access contacts from any device",
      "Simple authentication",
      "Mobile-friendly interface"
    ]
  };

  return (
    <>
      <SEO 
        title="LostMyPhone - Never Lose Your Emergency Contacts Again"
        description="Store your essential contacts securely and access them from any device when you need them most, even when your phone is lost or damaged."
        canonicalUrl="/"
      />
      
      {/* JSON-LD structured data */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Box bg="gray.50" minH="100vh">
        {/* Hero Section */}
        <Box bg="blue.600" color="white" py={16}>
          <Container maxW="container.xl">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={10}
              align="center"
              justify="space-between"
            >
              <VStack
                spacing={6}
                align={{ base: 'center', md: 'start' }}
                textAlign={{ base: 'center', md: 'left' }}
                maxW={{ base: 'full', md: '50%' }}
              >
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  {isAuthenticated 
                    ? `Welcome back, ${user?.fullName?.split(' ')[0] || 'Friend'}!` 
                    : 'Never Lose Your Important Contacts Again'}
                </Heading>
                <Text fontSize="xl" opacity={0.9}>
                  {isAuthenticated 
                    ? 'Your emergency contacts are safely stored and ready when you need them.' 
                    : 'Store your essential contacts securely and access them from any device when you need them most.'}
                </Text>
                <HStack spacing={4}>
                  {isAuthenticated ? (
                    <Button
                      as={RouterLink}
                      to="/contacts"
                      colorScheme="white"
                      size={buttonSize}
                      fontWeight="bold"
                      rounded="md"
                      px={8}
                      leftIcon={<FaAddressBook />}
                    >
                      View My Contacts
                    </Button>
                  ) : (
                    <>
                      <Button
                        as={RouterLink}
                        to="/register"
                        colorScheme="white"
                        size={buttonSize}
                        fontWeight="bold"
                        rounded="md"
                        px={8}
                      >
                        Get Started
                      </Button>
                      <Button
                        as={RouterLink}
                        to="/login"
                        variant="outline"
                        colorScheme="white"
                        size={buttonSize}
                        fontWeight="bold"
                        rounded="md"
                        px={8}
                      >
                        Log In
                      </Button>
                    </>
                  )}
                </HStack>
              </VStack>
              <Box
                maxW={{ base: '300px', md: '400px' }}
                display={{ base: 'none', md: 'block' }}
              >
                {/* Placeholder for a hero image */}
                <Box
                  bg="blue.400"
                  w="100%"
                  h="300px"
                  rounded="lg"
                  shadow="lg"
                  position="relative"
                  overflow="hidden"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box fontSize="6xl">📱</Box>
                </Box>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Features Section */}
        <Container maxW="container.xl" py={16}>
          <VStack spacing={12}>
            <VStack spacing={3} textAlign="center" maxW="container.md" mx="auto">
              <Heading as="h2" size="xl">
                Why Use LostMyPhone?
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Your emergency contact solution for when you're without your phone
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} width="full">
              <Feature
                icon={FaLock}
                title="Secure Storage"
                text="Your contacts are safe and encrypted, accessible only by you."
              />
              <Feature
                icon={FaMobileAlt}
                title="Easy Access"
                text="Access your contacts from any device with internet connection."
              />
              <Feature
                icon={FaUserFriends}
                title="Limited Contacts"
                text="Store only your most essential contacts (up to 5 numbers)."
              />
              <Feature
                icon={FaKey}
                title="Simple Authentication"
                text="Log in with information you can easily remember."
              />
              <Feature
                icon={FaGlobe}
                title="Mobile-Friendly"
                text="Fully responsive design works on any device."
              />
              <Feature
                icon={FaMobileAlt}
                title="Emergency Ready"
                text="Access your contacts in emergencies when your phone is lost or damaged."
              />
            </SimpleGrid>
          </VStack>
        </Container>

        {/* CTA Section */}
        <Box bg="blue.50" py={16}>
          <Container maxW="container.md" textAlign="center">
            <VStack spacing={6}>
              <Heading as="h2" size="xl">
                {isAuthenticated 
                  ? "Manage Your Emergency Contacts" 
                  : "Ready to Secure Your Essential Contacts?"}
              </Heading>
              <Text fontSize="lg" color="gray.600" maxW="container.sm" mx="auto">
                {isAuthenticated 
                  ? "Access, update, or add new contacts to ensure you're always prepared for emergencies."
                  : "Don't wait until it's too late. Create an account now and store your most important contacts for when you need them."}
              </Text>
              {isAuthenticated ? (
                <Button
                  as={RouterLink}
                  to="/contacts"
                  colorScheme="blue"
                  size="lg"
                  px={8}
                  fontWeight="bold"
                  rounded="md"
                  shadow="md"
                  leftIcon={<FaAddressBook />}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                >
                  View My Contacts
                </Button>
              ) : (
                <Button
                  as={RouterLink}
                  to="/register"
                  colorScheme="blue"
                  size="lg"
                  px={8}
                  fontWeight="bold"
                  rounded="md"
                  shadow="md"
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                >
                  Create Your Account
                </Button>
              )}
            </VStack>
          </Container>
        </Box>

        {/* Footer */}
        <Box bg="gray.800" color="white" py={8}>
          <Container maxW="container.xl">
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={8}
              justify="space-between"
              align={{ base: 'center', md: 'start' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
                <Heading as="h3" size="md">
                  LostMyPhone
                </Heading>
                <Text color="gray.400">Emergency contact access solution</Text>
              </VStack>
              <HStack spacing={6}>
                {isAuthenticated ? (
                  <>
                    <Link as={RouterLink} to="/contacts">
                      My Contacts
                    </Link>
                    <Link onClick={handleLogout} cursor="pointer">
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link as={RouterLink} to="/login">
                      Login
                    </Link>
                    <Link as={RouterLink} to="/register">
                      Register
                    </Link>
                  </>
                )}
              </HStack>
            </Stack>
            <Text mt={8} fontSize="sm" color="gray.400" textAlign="center">
              © 2024 LostMyPhone. All rights reserved.
            </Text>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Home; 