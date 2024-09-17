import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { getUserDetails, updatePassword } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfileDto } from './type';

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
    <SafeAreaView className="flex-1 justify-center px-4 bg-gray-900">
      <View className="items-center">
        <Text className="text-white text-2xl font-bold mb-6">Change Password</Text>

        <TextInput
          className="w-full h-12 border border-gray-600 rounded-lg px-3 mb-4 text-white bg-gray-800"
          placeholder="Current Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={setCurrentPassword}
          value={currentPassword}
        />
        <TextInput
          className="w-full h-12 border border-gray-600 rounded-lg px-3 mb-4 text-white bg-gray-800"
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={(text) => {
            setNewPassword(text);
            setIsPasswordValid(validatePassword(text));
          }}
          value={newPassword}
        />
        <TextInput
          className="w-full h-12 border border-gray-600 rounded-lg px-3 mb-6 text-white bg-gray-800"
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />

        <TouchableOpacity className="w-full bg-blue-500 p-3 rounded-lg items-center" onPress={handleSubmit}>
          <Text className="text-white text-lg">Submit</Text>
        </TouchableOpacity>

        {!isPasswordValid && (
          <Text className="text-red-500 mt-4">
            Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
