import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage } from '../utils/errorHandler';
import SEO from '../components/SEO';
import {
  Box,
  Button,
  Container,
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
  Link,
  Select,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaUser, FaCalendarAlt, FaPhone } from 'react-icons/fa';

const RegisterSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .required('Full name is required'),
  birthYear: Yup.string()
    .required('Year is required'),
  birthMonth: Yup.string()
    .required('Month is required'),
  birthDay: Yup.string()
    .required('Day is required'),
  countryCode: Yup.string()
    .required('Country code is required'),
  phoneNumber: Yup.string()
    .matches(
      /^\d{6,14}$/,
      'Phone number must be 6-14 digits'
    )
    .required('Phone number is required'),
});

// Generate options for days, months, and years
const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i.toString().padStart(2, '0'));
  }
  return days;
};

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const generateYears = () => {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 100; i--) {
    years.push(i.toString());
  }
  return years;
};

// Common country codes
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

const Register = () => {
  const { register } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setRegisterError(''); // Clear any previous errors
    
    try {
      // Format the date of birth as YYYY-MM-DD
      const dateOfBirth = `${values.birthYear}-${values.birthMonth}-${values.birthDay}`;
      
      // Format the phone number with country code
      const phoneNumber = `${values.countryCode}${values.phoneNumber}`;
      
      // Create the final form data
      const formData = {
        fullName: values.fullName.trim(),
        dateOfBirth: dateOfBirth,
        phoneNumber: phoneNumber
      };
      
      console.log('Register page: Attempting registration');
      
      const response = await register(formData).catch(error => {
        console.error('Register page: Registration promise rejected:', error);
        
        // Set error message
        const errorMessage = formatErrorMessage(error);
        setRegisterError(errorMessage);
        
        // Show toast notification
        toast({
          title: 'Registration failed',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        
        // Return null to indicate error
        return null;
      });
      
      // Only proceed if registration was successful
      if (response) {
        console.log('Register page: Registration successful');
        
        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        navigate('/contacts');
      }
    } catch (error) {
      console.error('Register page: Unexpected error in registration handler:', error);
      
      // Handle any unexpected errors that weren't caught by the .catch()
      const errorMessage = formatErrorMessage(error);
      setRegisterError(errorMessage);
      
      toast({
        title: 'Registration error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Create Account - LostMyPhone"
        description="Sign up for LostMyPhone to securely store your emergency contacts. Access them from any device when you need them most."
        canonicalUrl="/register"
      />
      
      <Box 
        bg="gray.50" 
        minH="calc(100vh - 60px)" 
        py={12}
      >
        <Container maxW="md" py={12}>
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading as="h1" size="xl" mb={2}>
                LostMyPhone
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Create an account
              </Text>
            </Box>

            <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
              {/* Display registration error if present */}
              {registerError && (
                <Box mb={4} p={3} bg="red.50" color="red.600" borderRadius="md">
                  <Text>{registerError}</Text>
                </Box>
              )}
            
              <Formik
                initialValues={{
                  fullName: '',
                  birthYear: new Date().getFullYear().toString(),
                  birthMonth: '01',
                  birthDay: '01',
                  countryCode: '+91', // Set India as default
                  phoneNumber: '',
                }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {(props) => (
                  <Form>
                    <VStack spacing={4}>
                      <Field name="fullName">
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.fullName && form.touched.fullName}
                          >
                            <FormLabel>Full Name</FormLabel>
                            <InputGroup>
                              <InputLeftElement pointerEvents="none">
                                <FaUser color="gray.300" />
                              </InputLeftElement>
                              <Input
                                {...field}
                                placeholder="John Doe"
                                type="text"
                              />
                            </InputGroup>
                            <FormErrorMessage>{form.errors.fullName}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <FormControl>
                        <FormLabel>Date of Birth</FormLabel>
                        <HStack>
                          <Field name="birthMonth">
                            {({ field, form }) => (
                              <FormControl isInvalid={form.errors.birthMonth && form.touched.birthMonth} width="auto" flex={1}>
                                <InputGroup>
                                  <InputLeftElement pointerEvents="none">
                                    <FaCalendarAlt color="gray.300" />
                                  </InputLeftElement>
                                  <Select 
                                    {...field} 
                                    placeholder="Month" 
                                    pl={10}
                                  >
                                    {months.map(month => (
                                      <option key={month.value} value={month.value}>
                                        {month.label}
                                      </option>
                                    ))}
                                  </Select>
                                </InputGroup>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="birthDay">
                            {({ field, form }) => (
                              <FormControl isInvalid={form.errors.birthDay && form.touched.birthDay} width="auto" flex={1}>
                                <Select 
                                  {...field} 
                                  placeholder="Day" 
                                >
                                  {generateDays().map(day => (
                                    <option key={day} value={day}>{day}</option>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Field>
                          <Field name="birthYear">
                            {({ field, form }) => (
                              <FormControl isInvalid={form.errors.birthYear && form.touched.birthYear} width="auto" flex={1}>
                                <Select 
                                  {...field} 
                                  placeholder="Year" 
                                >
                                  {generateYears().map(year => (
                                    <option key={year} value={year}>{year}</option>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </Field>
                        </HStack>
                        {(props.touched.birthDay && props.errors.birthDay) || 
                         (props.touched.birthMonth && props.errors.birthMonth) || 
                         (props.touched.birthYear && props.errors.birthYear) ? (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            Please select a valid date of birth
                          </Text>
                        ) : null}
                      </FormControl>

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
                                    type="tel"
                                    placeholder="Phone number (digits only)"
                                  />
                                </InputGroup>
                                <FormErrorMessage>{form.errors.phoneNumber}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </HStack>
                      </FormControl>

                      <Text fontSize="sm" color="gray.500" mt={2}>
                        Note: Store information you can easily remember in an emergency.
                      </Text>

                      <Button
                        mt={4}
                        colorScheme="blue"
                        isLoading={isSubmitting}
                        type="submit"
                        width="full"
                      >
                        Register
                      </Button>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </Box>

            <HStack justifyContent="center">
              <Text>Already have an account?</Text>
              <Link as={RouterLink} to="/login" color="blue.500">
                Log In
              </Link>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default Register; 