import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import { UserDto } from './type';
import LinearGradient from 'react-native-linear-gradient';
import { sendCodetoEmail, verifyCode } from './repo';
import LoaderModal from '../components/LoaderModal';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [logoVisible, setLogoVisible] = useState(true);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationCodePlaceHolder, setConfirmationCodePlaceHolder] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('Email');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Password');
  const [namePlaceHolder, setNamePlaceholder] = useState('Name');
  const [confirmPasswordPlaceholder, setConfirmPasswordPlaceholder] = useState('Confirm Password');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [requiredFields, setRequiredFields] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [resendModal, setResendModal] = useState(false);


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setLogoVisible(false);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setLogoVisible(true);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  let userDto: UserDto = {
    name,
    email,
    password,
    languageId: 0,
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordMatch(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordMatch(password === text);
  };

  const handleCreatePress = () => {
    let isValid = true;
    const updatedFields = { ...requiredFields };

    if (!name) {
      updatedFields.name = true;
      isValid = false;
    } else {
      updatedFields.name = false;
    }

    if (!email) {
      updatedFields.email = true;
      isValid = false;
    } else {
      updatedFields.email = false;
    }

    if (!password) {
      updatedFields.password = true;
      isValid = false;
    } else {
      updatedFields.password = false;
    }

    if (!confirmPassword) {
      updatedFields.confirmPassword = true;
      isValid = false;
    } else {
      updatedFields.confirmPassword = false;
    }

    if (!passwordMatch) {
      isValid = false;
    }

    setRequiredFields(updatedFields);

    if (isValid) {
      handleSendCode();
    }
  };

  const handleSendCode = async () => {
    if (email) {
      setResendModal(false);
      setLoadingMessage('Sending Verification Code. Please check your Email.');
      setIsLoading(true);
      const result = await sendCodetoEmail(email);
      setIsLoading(false);
      if (result.isSuccess == true) setIsModalVisible(true);
    } else {
      console.warn('Please enter a valid email address.');
    }
  };

  const handleConfirmCode = async () => {
    if (confirmationCode) {
      setResendModal(false);
      const result = await verifyCode(email, confirmationCode);
      setConfirmationCode('');
      if (result.isSuccess == true) {
        setIsModalVisible(false);
        navigation.navigate('Languages', { userDto });
      } else {
        setResendModal(true);
      }
    } else {
      console.warn('Please enter the confirmation code.');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
            <View className="items-center mb-8">
              {logoVisible && (
                <Image source={require('../assets/White.png')} className="w-44 h-44" />
              )}

              <Text className="text-white text-4xl font-bold" style={{ color: '#ffffff', fontFamily: 'cursive' }}>
                Vistalk
              </Text>
            </View>

            {requiredFields.name &&  <Text className="text-red-500 mb-2 text-left w-[80%]">Name is required</Text>
            }
            <TextInput
              className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
              placeholder={namePlaceHolder}
              placeholderTextColor="white"
              onChangeText={setName}
              value={name}
              onFocus={() => setNamePlaceholder('')}
              onBlur={() => setNamePlaceholder('Name')}
            />

            {requiredFields.email && <Text className="text-red-500 mb-2 text-left w-[80%]">Email is required</Text>}
            <TextInput
              className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
              placeholder={emailPlaceholder}
              placeholderTextColor="white"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              onFocus={() => setEmailPlaceholder('')}
              onBlur={() => setEmailPlaceholder('Email')}
            />

            {requiredFields.password && <Text className="text-red-500 mb-2 text-left w-[80%]">Password is required</Text>}
            <TextInput
              className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
              placeholder={passwordPlaceholder}
              placeholderTextColor="white"
              secureTextEntry
              onChangeText={handlePasswordChange}
              value={password}
              onFocus={() => setPasswordPlaceholder('')}
              onBlur={() => setPasswordPlaceholder('Password')}
            />

            {requiredFields.confirmPassword && <Text className="text-red-500 mb-2 text-left w-[80%]">Confirm Password is required</Text>}
            <TextInput
              className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
              placeholder={confirmPasswordPlaceholder}
              placeholderTextColor="white"
              secureTextEntry
              onChangeText={handleConfirmPasswordChange}
              value={confirmPassword}
              onFocus={() => setConfirmPasswordPlaceholder('')}
              onBlur={() => setConfirmPasswordPlaceholder('Confirm Password')}
            />

            {!passwordMatch && password.length > 0 && confirmPassword.length > 0 && (
              <Text className="text-red-500 mb-4 text-center">Passwords do not match</Text>
            )}

            <TouchableOpacity
              className="border border-2 border-white p-3 w-[80%] rounded-xl items-center mb-4"
              onPress={handleCreatePress}
            >
              <Text className={"text-white text-xl font-bold"}>Create</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-[80%] items-end"
              onPress={() => navigation.navigate('LogIn')}
            >
              <Text className="text-white mt-3 text-center font-bold text-base">Already have an account?</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          
          <View className="flex-1 justify-center items-center bg-[#00000080]">
            <LinearGradient colors={['#6addd0', '#f7c188']} className="w-4/5 p-5 rounded-lg items-center">
              <Text className="text-xl font-bold mb-4 text-white">Enter Confirmation Code</Text>

              <TextInput
                className="w-full h-12 border border-white border-2 mb-4 px-2 rounded-md bg-transparent text-white"
                placeholder="Confirmation Code"
                placeholderTextColor="white"
                onChangeText={setConfirmationCode}
                value={confirmationCode}
                keyboardType="numeric"
                onFocus={() => setConfirmationCodePlaceHolder('')}
                onBlur={() => setConfirmationCodePlaceHolder('Confirmation Code')}
              />

              <View className="flex-row items-center justify-between w-[100%] gap-2">
                <TouchableOpacity className="flex-1 p-2 bg-white rounded-md items-center" onPress={handleConfirmCode}>
                  <Text className="text-base text-black">Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 p-2 bg-white rounded-md items-center" onPress={() => setIsModalVisible(false)}>
                  <Text className="text-base text-black">Cancel</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          transparent={true}
          visible={resendModal}
          animationType="slide"
          onRequestClose={() => setResendModal(false)}
        >
          
          <View className="flex-1 justify-center items-center bg-[#00000080]">
            <LinearGradient colors={['#6addd0', '#f7c188']} className="w-4/5 p-5 rounded-lg items-center">
              <Text className="text-xl font-bold mb-4 text-white">An error occurred while sending the code. Please try resending it.
              </Text>

              <View className="flex-row items-center justify-between w-[100%] gap-2">
                <TouchableOpacity className="flex-1 p-2 bg-white rounded-md items-center" onPress={handleSendCode}>
                  <Text className="text-base text-black">Resend</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 p-2 bg-white rounded-md items-center" onPress={() => setResendModal(false)}>
                  <Text className="text-base text-black">Cancel</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>

      <LoaderModal isVisible={isLoading} message={loadingMessage} />
    </SafeAreaView>
  );
};

export default Register;
