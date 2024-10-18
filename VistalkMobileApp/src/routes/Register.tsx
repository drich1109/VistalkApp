import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ImageBackground, Image, View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { UserDto } from './type'; // Adjust the import path
import LinearGradient from 'react-native-linear-gradient';

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); // New state to handle password match

  let userDto: UserDto = {
    name,
    email,
    password,
    languageId: 0
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordMatch(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordMatch(password === text);
  };

  function clickRegister() {
    if (passwordMatch && password) {
      console.log(userDto);
      navigation.navigate('Languages', { userDto });
    } else {
      console.warn("Passwords do not match.");
    }
  }

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
            className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
            placeholder="Full Name"
            placeholderTextColor="white"
            onChangeText={setName}
            value={name}
          />

          <TextInput
            className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress" 
          />

          <TextInput
            className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
            placeholder="Password"
            placeholderTextColor="white"
            secureTextEntry
            onChangeText={handlePasswordChange}
            value={password}
          />
          <TextInput
            className="w-[80%] h-13 border-2 border-white mb-5 px-2.5 rounded-xl bg-transparent text-white"
            placeholder="Confirm Password"
            placeholderTextColor="white"
            secureTextEntry
            onChangeText={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          {!passwordMatch && password.length > 0 && confirmPassword.length > 0 && <Text className="text-red-500 mb-4 text-center">Passwords do not match</Text>}

          <TouchableOpacity className="border border-2 border-white p-3 w-[80%] rounded-xl items-center mb-3" onPress={clickRegister}>
            <Text className="text-white font-bold text-xl">Create</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-[80%] items-end"
            onPress={() => navigation.navigate('LogIn')}
          >
            <Text className="text-white mt-3 text-center font-bold text-base">Already have an account?</Text>
          </TouchableOpacity>
        </LinearGradient>
    </SafeAreaView>
  );
};

export default Register;