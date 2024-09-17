import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Modal, StyleSheet, Alert, TextInput } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deactivateVistaAccount, sendFeedback } from './repo'; // Ensure sendFeedback is imported from the repo

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
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-row justify-between w-full px-5 absolute top-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-white text-lg">Back</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-center items-center space-y-4">
        <TouchableOpacity className="w-4/5 py-3 bg-blue-600 rounded" onPress={() => navigation.navigate("EditProfile")}>
          <Text className="text-white text-center">Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-4/5 py-3 bg-green-600 rounded" onPress={() => navigation.navigate("ChangePassword")}>
          <Text className="text-white text-center">Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-4/5 py-3 bg-red-600 rounded" onPress={handleDeactivateAccount}>
          <Text className="text-white text-center">Deactivate Account</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-4/5 py-3 bg-yellow-600 rounded" onPress={() => setIsFeedbackModalVisible(true)}>
          <Text className="text-white text-center">Send Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-4/5 py-3 bg-green-600 rounded" onPress={handleSignOut}>
          <Text className="text-white text-center">Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Deactivate Account</Text>
            <Text style={styles.modalMessage}>Are you sure you want to deactivate your account?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmDeactivate}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelDeactivate}>
                <Text style={styles.buttonText}>No</Text>
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
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Send Feedback</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Enter your feedback here..."
              value={feedbackText}
              onChangeText={setFeedbackText}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleSendFeedback}>
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelFeedback}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Settings;
