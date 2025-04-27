import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/api';
import { formatErrorMessage, logError } from '../utils/errorHandler';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  HStack,
  useToast,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  Badge,
  Select,
  Tooltip,
  useClipboard,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaPhone, FaPlus, FaTrash, FaSignOutAlt, FaCopy, FaPhoneAlt } from 'react-icons/fa';
import SEO from '../components/SEO';

const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .required('Name is required'),
  countryCode: Yup.string()
    .required('Country code is required'),
  phoneNumber: Yup.string()
    .matches(
      /^\d{6,14}$/,
      'Phone number must be 6-14 digits'
    )
    .required('Phone number is required'),
});

// Common country codes array (same as in Login.js and Register.js)
const countryCodes = [
  { code: '+91', country: 'India' },  // India first as default
  { code: '+1', country: 'United States/Canada' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+93', country: 'Afghanistan' },
  { code: '+355', country: 'Albania' },
  { code: '+213', country: 'Algeria' },
  { code: '+376', country: 'Andorra' },
  { code: '+244', country: 'Angola' },
  { code: '+54', country: 'Argentina' },
  { code: '+374', country: 'Armenia' },
  { code: '+61', country: 'Australia' },
  { code: '+43', country: 'Austria' },
  { code: '+994', country: 'Azerbaijan' },
  { code: '+973', country: 'Bahrain' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+375', country: 'Belarus' },
  { code: '+32', country: 'Belgium' },
  { code: '+501', country: 'Belize' },
  { code: '+229', country: 'Benin' },
  { code: '+975', country: 'Bhutan' },
  { code: '+591', country: 'Bolivia' },
  { code: '+387', country: 'Bosnia and Herzegovina' },
  { code: '+267', country: 'Botswana' },
  { code: '+55', country: 'Brazil' },
  { code: '+673', country: 'Brunei' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+257', country: 'Burundi' },
  { code: '+855', country: 'Cambodia' },
  { code: '+237', country: 'Cameroon' },
  { code: '+238', country: 'Cape Verde' },
  { code: '+236', country: 'Central African Republic' },
  { code: '+235', country: 'Chad' },
  { code: '+56', country: 'Chile' },
  { code: '+86', country: 'China' },
  { code: '+57', country: 'Colombia' },
  { code: '+269', country: 'Comoros' },
  { code: '+242', country: 'Congo' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+385', country: 'Croatia' },
  { code: '+53', country: 'Cuba' },
  { code: '+357', country: 'Cyprus' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+45', country: 'Denmark' },
  { code: '+253', country: 'Djibouti' },
  { code: '+670', country: 'East Timor' },
  { code: '+20', country: 'Egypt' },
  { code: '+503', country: 'El Salvador' },
  { code: '+240', country: 'Equatorial Guinea' },
  { code: '+291', country: 'Eritrea' },
  { code: '+372', country: 'Estonia' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+679', country: 'Fiji' },
  { code: '+358', country: 'Finland' },
  { code: '+33', country: 'France' },
  { code: '+241', country: 'Gabon' },
  { code: '+220', country: 'Gambia' },
  { code: '+995', country: 'Georgia' },
  { code: '+49', country: 'Germany' },
  { code: '+233', country: 'Ghana' },
  { code: '+30', country: 'Greece' },
  { code: '+502', country: 'Guatemala' },
  { code: '+224', country: 'Guinea' },
  { code: '+245', country: 'Guinea-Bissau' },
  { code: '+592', country: 'Guyana' },
  { code: '+509', country: 'Haiti' },
  { code: '+504', country: 'Honduras' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+36', country: 'Hungary' },
  { code: '+354', country: 'Iceland' },
  { code: '+62', country: 'Indonesia' },
  { code: '+98', country: 'Iran' },
  { code: '+964', country: 'Iraq' },
  { code: '+353', country: 'Ireland' },
  { code: '+972', country: 'Israel' },
  { code: '+39', country: 'Italy' },
  { code: '+225', country: 'Ivory Coast' },
  { code: '+81', country: 'Japan' },
  { code: '+962', country: 'Jordan' },
  { code: '+7', country: 'Kazakhstan' },
  { code: '+254', country: 'Kenya' },
  { code: '+965', country: 'Kuwait' },
  { code: '+996', country: 'Kyrgyzstan' },
  { code: '+856', country: 'Laos' },
  { code: '+371', country: 'Latvia' },
  { code: '+961', country: 'Lebanon' },
  { code: '+266', country: 'Lesotho' },
  { code: '+231', country: 'Liberia' },
  { code: '+218', country: 'Libya' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+370', country: 'Lithuania' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+853', country: 'Macau' },
  { code: '+389', country: 'Macedonia' },
  { code: '+261', country: 'Madagascar' },
  { code: '+265', country: 'Malawi' },
  { code: '+60', country: 'Malaysia' },
  { code: '+960', country: 'Maldives' },
  { code: '+223', country: 'Mali' },
  { code: '+356', country: 'Malta' },
  { code: '+222', country: 'Mauritania' },
  { code: '+230', country: 'Mauritius' },
  { code: '+52', country: 'Mexico' },
  { code: '+373', country: 'Moldova' },
  { code: '+377', country: 'Monaco' },
  { code: '+976', country: 'Mongolia' },
  { code: '+382', country: 'Montenegro' },
  { code: '+212', country: 'Morocco' },
  { code: '+258', country: 'Mozambique' },
  { code: '+95', country: 'Myanmar' },
  { code: '+264', country: 'Namibia' },
  { code: '+977', country: 'Nepal' },
  { code: '+31', country: 'Netherlands' },
  { code: '+64', country: 'New Zealand' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+227', country: 'Niger' },
  { code: '+234', country: 'Nigeria' },
  { code: '+850', country: 'North Korea' },
  { code: '+47', country: 'Norway' },
  { code: '+968', country: 'Oman' },
  { code: '+92', country: 'Pakistan' },
  { code: '+970', country: 'Palestine' },
  { code: '+507', country: 'Panama' },
  { code: '+675', country: 'Papua New Guinea' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Peru' },
  { code: '+63', country: 'Philippines' },
  { code: '+48', country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+974', country: 'Qatar' },
  { code: '+40', country: 'Romania' },
  { code: '+7', country: 'Russia' },
  { code: '+250', country: 'Rwanda' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+221', country: 'Senegal' },
  { code: '+381', country: 'Serbia' },
  { code: '+65', country: 'Singapore' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+252', country: 'Somalia' },
  { code: '+27', country: 'South Africa' },
  { code: '+82', country: 'South Korea' },
  { code: '+211', country: 'South Sudan' },
  { code: '+34', country: 'Spain' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+249', country: 'Sudan' },
  { code: '+46', country: 'Sweden' },
  { code: '+41', country: 'Switzerland' },
  { code: '+963', country: 'Syria' },
  { code: '+886', country: 'Taiwan' },
  { code: '+992', country: 'Tajikistan' },
  { code: '+255', country: 'Tanzania' },
  { code: '+66', country: 'Thailand' },
  { code: '+228', country: 'Togo' },
  { code: '+216', country: 'Tunisia' },
  { code: '+90', country: 'Turkey' },
  { code: '+993', country: 'Turkmenistan' },
  { code: '+256', country: 'Uganda' },
  { code: '+380', country: 'Ukraine' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+598', country: 'Uruguay' },
  { code: '+998', country: 'Uzbekistan' },
  { code: '+58', country: 'Venezuela' },
  { code: '+84', country: 'Vietnam' },
  { code: '+967', country: 'Yemen' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
];

// Generate options for days, months, and years
const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i.toString().padStart(2, '0'));
  }
  return days;
};

const Contacts = () => {
  const { logout, user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { onCopy, hasCopied } = useClipboard("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const { data } = await contactService.getContacts();
        setContacts(data || []);
      } catch (error) {
        logError(error, 'fetchContacts');
        setError(formatErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleAddContact = async (values, { resetForm }) => {
    try {
      setLoading(true);
      // Format the phone number with country code
      const formattedPhoneNumber = `${values.countryCode}${values.phoneNumber}`;
      
      const contactData = {
        name: values.name.trim(),
        phoneNumber: formattedPhoneNumber
      };
      
      const response = await contactService.addContact(contactData);
      
      // Ensure we have a proper contact object with required fields
      const newContact = {
        id: response.id || response._id || Date.now().toString(), // Fallback if ID is missing
        name: response.name || values.name,
        phoneNumber: response.phoneNumber || formattedPhoneNumber
      };
      
      // Update the contacts list
      setContacts(prevContacts => [...prevContacts, newContact]);
      resetForm();
      onClose();
      toast({
        title: 'Contact added',
        description: 'The contact has been added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      logError(error, 'addContact');
      toast({
        title: 'Error adding contact',
        description: formatErrorMessage(error),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const response = await contactService.deleteContact(id);
        
        // Update the contacts list by filtering out the deleted contact
        setContacts(prevContacts => prevContacts.filter(contact => {
          // Remove the contact if either ID matches
          return !(contact.id === id || contact._id === id);
        }));
        
        toast({
          title: 'Contact deleted',
          description: 'The contact has been deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        logError(error, 'deleteContact');
        toast({
          title: 'Error deleting contact',
          description: formatErrorMessage(error),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCopyNumber = (number) => {
    onCopy(number);
    toast({
      title: 'Phone number copied',
      description: 'Phone number copied to clipboard',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCallNumber = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <>
      <SEO 
        title="My Emergency Contacts - LostMyPhone"
        description="Manage your emergency contacts. Add, view, and delete important phone numbers that you can access in case of emergency."
        canonicalUrl="/contacts"
      />
      
      <Container maxW="container.md" py={6}>
        <VStack spacing={6} align="stretch">
          <Flex justifyContent="space-between" alignItems="center">
            <Box>
              <Heading as="h1" size="xl">
                Emergency Contacts
              </Heading>
              {user && (
                <Text color="gray.600" mt={1}>
                  Welcome, {user.fullName}
                </Text>
              )}
            </Box>
            <Button 
              leftIcon={<FaSignOutAlt />} 
              colorScheme="red" 
              variant="outline"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Flex>

          <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Heading as="h2" size="md">
                Your Contacts
              </Heading>
              <Button 
                leftIcon={<FaPlus />} 
                colorScheme="blue"
                onClick={onOpen}
                isDisabled={contacts.length >= 5}
              >
                Add Contact
              </Button>
            </Flex>

            {loading ? (
              <Flex justify="center" align="center" h="200px">
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : error ? (
              <Box textAlign="center" p={4} color="red.500">
                {error}
              </Box>
            ) : contacts.length === 0 ? (
              <Box textAlign="center" p={4} color="gray.500">
                You don't have any contacts yet. Add some emergency contacts to get started.
              </Box>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Phone Number</Th>
                    <Th width="120px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contacts.map((contact) => {
                    // Ensure we handle contact with either id or _id
                    const contactId = contact.id || contact._id || '';
                    
                    return (
                      <Tr key={contactId}>
                        <Td>{contact.name || 'Unnamed'}</Td>
                        <Td>{contact.phoneNumber || 'No number'}</Td>
                        <Td>
                          <HStack spacing={2}>
                            <Tooltip label="Call" hasArrow>
                              <IconButton
                                aria-label="Call contact"
                                icon={<FaPhoneAlt />}
                                colorScheme="green"
                                size="sm"
                                onClick={() => handleCallNumber(contact.phoneNumber)}
                              />
                            </Tooltip>
                            <Tooltip label="Copy number" hasArrow>
                              <IconButton
                                aria-label="Copy number"
                                icon={<FaCopy />}
                                colorScheme="blue"
                                size="sm"
                                onClick={() => handleCopyNumber(contact.phoneNumber)}
                              />
                            </Tooltip>
                            <Tooltip label="Delete" hasArrow>
                              <IconButton
                                aria-label="Delete contact"
                                icon={<FaTrash />}
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleDeleteContact(contactId)}
                              />
                            </Tooltip>
                          </HStack>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}

            <HStack mt={4} justifyContent="space-between">
              <Text fontSize="sm" color="gray.500">
                {contacts.length} / 5 contacts stored
              </Text>
              <Badge colorScheme={contacts.length >= 5 ? 'red' : 'green'} borderRadius="full" px={2}>
                {contacts.length >= 5 ? 'Limit reached' : 'Space available'}
              </Badge>
            </HStack>
          </Box>

          <Box bg="blue.50" p={4} borderRadius="md">
            <Text fontSize="sm" color="blue.700">
              <strong>Remember:</strong> In case you lose your phone, you can access these contacts
              from any device by logging in with your name, date of birth, and phone number.
            </Text>
          </Box>
        </VStack>

        {/* Add Contact Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Emergency Contact</ModalHeader>
            <ModalCloseButton />
            <Formik
              initialValues={{
                name: '',
                countryCode: '+91', // Set India as default
                phoneNumber: '',
              }}
              validationSchema={ContactSchema}
              onSubmit={handleAddContact}
            >
              {(props) => (
                <Form>
                  <ModalBody>
                    <VStack spacing={4}>
                      <Field name="name">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel>Name</FormLabel>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <FaUser color="gray.300" />
                              </InputLeftElement>
                              <Input
                                {...field}
                                placeholder="Contact Name"
                                type="text"
                              />
                            </InputGroup>
                            <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <FormControl>
                        <FormLabel>Phone Number</FormLabel>
                        <HStack>
                          <Field name="countryCode">
                            {({ field, form }) => (
                              <Select 
                                {...field} 
                                w="130px"
                                isInvalid={form.errors.countryCode && form.touched.countryCode}
                              >
                                {countryCodes.map(country => (
                                  <option key={country.code} value={country.code}>
                                    {country.code} ({country.country})
                                  </option>
                                ))}
                              </Select>
                            )}
                          </Field>
                          <Field name="phoneNumber">
                            {({ field, form }) => (
                              <FormControl
                                isInvalid={form.errors.phoneNumber && form.touched.phoneNumber}
                              >
                                <InputGroup>
                                  <InputLeftElement pointerEvents="none">
                                    <FaPhone color="gray.300" />
                                  </InputLeftElement>
                                  <Input
                                    {...field}
                                    placeholder="Phone number (digits only)"
                                    type="tel"
                                  />
                                </InputGroup>
                                <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </HStack>
                      </FormControl>
                    </VStack>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      colorScheme="blue"
                      isLoading={props.isSubmitting}
                      type="submit"
                    >
                      Save Contact
                    </Button>
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};

export default Contacts; 