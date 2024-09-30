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
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/bg.png')} style={styles.background} resizeMode="cover">
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <View style={styles.inner}>
          <TextInput
            style={[styles.input, { color: '#ffffff' }]}
            placeholder="Email"
            placeholderTextColor="#fff"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>Send Code</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  inner: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    padding: 12,
    width: '100%',
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#99BC85',
    fontSize: 20,
    fontWeight: 'bold',
  },
  haveanaccountContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  haveanaccount: {
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#99BC85',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalCancel: {
    marginTop: 20,
    color: '#999',
    fontSize: 16,
  },
});

export default ForgotPassword;
