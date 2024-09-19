import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Modal, StyleSheet, Alert, TextInput, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deactivateVistaAccount, sendFeedback } from './repo'; // Ensure sendFeedback is imported from the repo
import { Path, Svg } from 'react-native-svg';

type Props = StackScreenProps<RootStackParamList, 'Settings'>;

const Settings: React.FC<Props> = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleDeactivateAccount = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDeactivate = async () => {
    setIsModalVisible(false);
    const userID = await AsyncStorage.getItem('userID');
    const result = await deactivateVistaAccount(Number(userID));
    if(result.isSuccess){
        Alert.alert('Account Deactivated', 'Your account has been deactivated successfully.');
        navigation.navigate('LogIn');
    } else {
        Alert.alert(result.message);
    }
  };

  const handleCancelDeactivate = () => {
    setIsModalVisible(false);
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('token');
      navigation.navigate('LogIn');
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert('Error', 'Please enter feedback before sending.');
      return;
    }
    try {
      const userID = await AsyncStorage.getItem('userID');
      const result = await sendFeedback(Number(userID), feedbackText);
      if (result.isSuccess) {
        Alert.alert('Feedback Sent', 'Your feedback has been sent successfully.');
        setFeedbackText('');
        setIsFeedbackModalVisible(false);
      } else {
        Alert.alert(result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send feedback.');
    }
  };

  const handleCancelFeedback = () => {
    setIsFeedbackModalVisible(false);
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
      <View className="flex-1 justify-center space-y-4">
        <TouchableOpacity className="p-3 bg-white rounded-md" onPress={() => navigation.navigate("EditProfile")}>
          <Text className="text-black text-center text-lg font-bold">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white rounded-md" onPress={() => navigation.navigate("ChangePassword")}>
          <Text className="text-black text-center text-lg font-bold">Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white rounded-md" onPress={handleDeactivateAccount}>
          <Text className="text-black text-center text-lg font-bold">Deactivate Account</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white rounded-md" onPress={() => setIsFeedbackModalVisible(true)}>
          <Text className="text-black text-center text-lg font-bold">Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-3 bg-white rounded-md" onPress={handleSignOut}>
          <Text className="text-black text-center text-lg font-bold">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
      >
        <View className="flex-1 items-center justify-center bg-[#00000080]">
          <View className="bg-[#99BC85] p-6 w-[80%] rounded-lg items-center">
            <Text className="text-xl font-bold mb-3">Deactivate Account</Text>
            <Text className="text-base mb-4 text-center">Are you sure you want to deactivate your account?</Text>
            <View className="flex-row justify-between w-[100%]">
              <TouchableOpacity className="flex-1 p-2 bg-white rounded-md mr-2 items-center" onPress={handleConfirmDeactivate}>
                <Text className="text-base text-black">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 p-2 bg-white rounded-md mr-2 items-center" onPress={handleCancelDeactivate}>
                <Text className="text-base text-black">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <Modal
        transparent={true}
        visible={isFeedbackModalVisible}
        animationType="slide"
      >
        <View className="flex-1 items-center justify-center bg-[#00000080]">
          <View className="bg-[#99BC85] p-6 w-[80%] rounded-lg items-center">
            <Text className="text-xl font-bold mb-3">Send Feedback</Text>
            <TextInput
              className="w-[100%] h-36 border border-gray-500 rounded-md border-1 p-5 mb-4"
              multiline
              numberOfLines={4}
              placeholder="Enter your feedback here..."
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <View className="flex-row justify-between w-[100%]">
              <TouchableOpacity className="flex-1 p-2 bg-white rounded-md mr-2 items-center" onPress={handleSendFeedback}>
                <Text className="text-base text-black">Send</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 p-2 bg-white rounded-md mr-2 items-center" onPress={handleCancelFeedback}>
                <Text className="text-base text-black">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Settings;
