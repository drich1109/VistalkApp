import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ImageBackground, Image, View, StyleSheet, Modal, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { sendCodetoEmail, verifyCode } from './repo';

type Props = StackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPassword: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSendCode = async () => {
    if (email) {
        const result = await sendCodetoEmail(email);
        if(result.isSuccess == true)
            setIsModalVisible(true);
        else
        {
            Alert.alert(result.message);
        }
    } else {
      console.warn('Please enter a valid email address.');
    }
  };

  const handleConfirmCode = async () => {
    if (confirmationCode) {
        const result = await verifyCode(email, confirmationCode);
        if(result.isSuccess == true){
            setIsModalVisible(false);
            navigation.navigate('SetNewPassword',{email});
        }
        else
        {
            return;
        }
    } else {
      console.warn('Please enter the confirmation code.');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground source={require('../assets/bg.png')} className="flex-1 justify-center items-center" resizeMode="cover">
        <Image source={require('../assets/logo.png')} className="w-44 h-44 mb-10" resizeMode="contain" />

        <View className="w-[100%] px-5 items-center">
          <TextInput
            style={[styles.input, { color: '#ffffff' }]}
            className="w-[100%] h-13 border-2 border-white mb-5 px-2.5 rounded-lg bg-transparent text-white"
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <TouchableOpacity className="bg-white w-[100%] rounded-3xl items-center p-3 mb-3" onPress={handleSendCode}>
            <Text className="text-[#99BC85] font-bold text-xl">Send Code</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for entering confirmation code */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-[#00000080]">
            <View className="w-4/5 bg-[#99BC85] p-5 rounded-lg items-center">
              <Text className="text-xl font-bold mb-4 text-white">Enter Confirmation Code</Text>

              <TextInput
                className="w-full h-12 border border-white border-2 mb-4 px-2 rounded-md bg-transparent text-white"
                placeholder="Confirmation Code"
                placeholderTextColor="white"
                onChangeText={setConfirmationCode}
                value={confirmationCode}
                keyboardType="numeric"
              />

              <View className="flex-row items-center justify-between w-[100%] gap-2">
                <TouchableOpacity className="flex-1 p-2 bg-white rounded-md items-center" onPress={handleConfirmCode}>
                  <Text className="text-base text-black">Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex-1 p-2 bg-white rounded-md items-center" onPress={() => setIsModalVisible(false)}>
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

export default ForgotPassword;
