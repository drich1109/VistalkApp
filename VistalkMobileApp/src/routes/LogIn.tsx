import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, ImageBackground, Image, Modal } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { loginUser, reActivateVista, sendCodetoEmail, verifyCode } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import LoaderModal from '../components/LoaderModal';

type Props = StackScreenProps<RootStackParamList, 'LogIn'>;

const LogIn: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('Email');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Password');
  const [resendModal, setResendModal] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationCodePlaceHolder, setConfirmationCodePlaceHolder] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);

      if (response.isSuccess === true) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userID', response.data.id);
        
        navigation.navigate('Dashboard')
      } else {
        if (response.message === 'Inactive') {
          Alert.alert(
              'Login Failed',
              'Do you want to reactivate your account?',
              [
                  {
                      text: 'No',
                      onPress: () => console.log('Reactivation declined'),
                      style: 'cancel',
                  },
                  {
                      text: 'Yes',
                      onPress: () => handleSendCode(email),
                  },
              ],
              { cancelable: false }
          );
      } 
        else
          Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  async function handleSendCode(email:string)
  {
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
  }

  const handleConfirmCode = async () => {
    if (confirmationCode) {
      setResendModal(false);
      const result = await verifyCode(email, confirmationCode);
      setConfirmationCode('');
      if (result.isSuccess == true) {
        setIsModalVisible(false);
        const result2 = await reActivateVista(email);
        if(result2.isSuccess == true)
          handleLogin();
      } else {
        setResendModal(true);
      }
    } else {
      console.warn('Please enter the confirmation code.');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
        <View className="items-center mb-8">
          <Image source={require('../assets/White.png')} className="w-44 h-44" />
          <Text className="text-white text-4xl font-bold" style={{ color: '#ffffff', fontFamily: 'cursive' }}>
              Vistalk
          </Text>
        </View>
        <TextInput
          className="w-4/5 h-13 border-2 border-white mb-5 px-3 rounded-xl bg-transparent text-white"
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

        <TextInput
          className="w-4/5 h-13 border-2 border-white mb-5 px-3 rounded-xl bg-transparent text-white"
          placeholder={passwordPlaceholder}
          placeholderTextColor="white"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          onFocus={() => setPasswordPlaceholder('')}
          onBlur={() => setPasswordPlaceholder('Password')}
        />

        <TouchableOpacity className="border border-2 border-white p-3 w-[80%] rounded-xl items-center mb-4" onPress={handleLogin}>
          <Text className="text-white text-xl font-bold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-4/5 items-end"
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text className="text-white mt-0 text-right font-bold text-base">Forgot password?</Text>
        </TouchableOpacity>
        </LinearGradient>

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
                <TouchableOpacity className="flex-1 p-2 bg-white rounded-md items-center" onPress={() => handleSendCode(email)}>
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

export default LogIn;