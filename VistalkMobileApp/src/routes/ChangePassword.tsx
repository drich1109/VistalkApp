import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { getUserDetails, updatePassword } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfileDto } from './type';
import { Path, Svg } from 'react-native-svg';

type Props = StackScreenProps<RootStackParamList, 'ChangePassword'>;

const ChangePassword: React.FC<Props> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [userDetails, setUserDetails] = useState<UserProfileDto>();


  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSubmit = async () => {
    if (newPassword === confirmPassword) {
        const userID = await AsyncStorage.getItem('userID');
        const userResult = await getUserDetails(Number(userID));
        setUserDetails(userResult.data);
      if (validatePassword(newPassword) && userResult.data.email) {
       const result = await updatePassword(userResult.data.email, newPassword, currentPassword);
        if (result.isSuccess) {
          navigation.navigate('LogIn');
        } else {
          Alert.alert('Update Password Failed');
        } 
      } else {
        Alert.alert('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
      }
    } else {
      Alert.alert('Passwords do not match');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground source={require('../assets/bg.png')} className="flex-1 justify-center items-center" resizeMode="cover">
      <View className="flex-row justify-between w-full px-5 absolute top-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Svg width="30" height="30" className='bg-white text-[#99BC85] rounded-lg' viewBox="0 0 24 24">
                <Path
                  fill="currentColor"
                  d="M3.636 11.293a1 1 0 000 1.414l5.657 5.657a1 1 0 001.414-1.414L6.757 13H20a1 1 0 100-2H6.757l3.95-3.95a1 1 0 00-1.414-1.414z"
                />
          </Svg>
        </TouchableOpacity>
      </View>
        <View className='flex justify-center'>
          <Text className="text-white text-2xl font-bold mb-6">Change Password</Text>
          <TextInput
            className=" border border-white border-2 rounded-lg p-3 mb-4 text-white bg-transparent"
            placeholder="Current Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={setCurrentPassword}
            value={currentPassword}
          />
          <TextInput
            className=" border border-white border-2 rounded-lg p-3 mb-4 text-white bg-transparent"
            placeholder="New Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={(text) => {
              setNewPassword(text);
              setIsPasswordValid(validatePassword(text));
            }}
            value={newPassword}
          />
          <TextInput
            className="border border-white border-2 rounded-lg p-3 mb-4 text-white bg-transparent"
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />

          <TouchableOpacity className="bg-white p-2 rounded-lg items-center" onPress={handleSubmit}>
            <Text className="text-[#99BC85] text-lg">Submit</Text>
          </TouchableOpacity>

          {!isPasswordValid && (
            <Text className="text-red-500 mt-4">
              Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.
            </Text>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ChangePassword;
