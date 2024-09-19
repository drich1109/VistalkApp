import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert, Image, Modal, ImageBackground } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getIsEmailUsed, getUserDetails, getUserImageUrl, sendCodetoEmail, verifyCode, editVistaProfile} from './repo'; // Ensure updateUserProfile is imported
import { EditProfileVista, UserProfileDto } from './type';
import { launchImageLibrary } from 'react-native-image-picker';
import { Path, Svg } from 'react-native-svg';

type Props = StackScreenProps<RootStackParamList, 'EditProfile'>;

const EditProfile: React.FC<Props> = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState<UserProfileDto | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');

  const fetchUserData = async () => {
    try {
      const userID = await AsyncStorage.getItem('userID');
      if (userID) {
        const result = await getUserDetails(Number(userID));
        setUserDetails(result.data);
        setName(result.data.name);
        setEmail(result.data.email);
        if (result.data.imagePath) {
            const newFileUrl = getUserImageUrl(result.data.imagePath);
            setFileUrl(newFileUrl);
        }
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
      Alert.alert('An error occurred while fetching user details.');
    }
  };

  useEffect(() => {
    fetchUserData();
    const unsubscribe = navigation.addListener('focus', fetchUserData);
    
    return unsubscribe;
  }, [navigation]);

  const handleImageSelect = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('An error occurred while selecting image.');
      } else if (response.assets && response.assets.length > 0) {
        setFileUrl(response.assets[0].uri || null);
      } else {
        Alert.alert('No image selected');
      }
    });
  };

  const handleSave = async () => {
    try {
      if (name && email) {
        if (email !== userDetails?.email) {
          const checkEmail = await getIsEmailUsed(email);
          if (checkEmail.isSuccess) {
            const result = await sendCodetoEmail(email);
            if (result.isSuccess) {
              setIsModalVisible(true);
            } else {
              Alert.alert(result.message);
            }
          } else {
            Alert.alert(checkEmail.message);
          }
        } else {
          await updateProfile();
        }
      } else {
        Alert.alert('Please fill in all fields');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('An error occurred while updating your profile.');
    }
  };

  const updateProfile = async () => {
    const userID = await AsyncStorage.getItem('userID');
     if (userID) {
        const formData = new FormData();
            formData.append('userId', String(userID));
            formData.append('name', name);
            formData.append('email', email);
            if (fileUrl) {
                formData.append('file', {
                    uri: fileUrl,
                    name: `${name}${userID}.jpg`,
                    type: 'image/jpeg',
                } as any);
            }
            const result = await editVistaProfile(formData);
      if (result.isSuccess) {
        Alert.alert(result.message);
        fetchUserData();
        navigation.goBack();
      } else {
        Alert.alert('Update failed', result.message);
      }
    } 
  };

  const handleConfirmCode = async () => {
    if (confirmationCode) {
      try {
        const verificationResult = await verifyCode(email, confirmationCode);
        if (verificationResult.isSuccess) {
          setIsModalVisible(false);
          await updateProfile();
        } else {
          Alert.alert('Verification failed', verificationResult.message);
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        Alert.alert('An error occurred while verifying the code.');
      }
    } else {
      Alert.alert('Please enter the confirmation code.');
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
      <View className="flex-1 justify-center">
        <View className="items-center mb-4">
          <Text className="text-white text-2xl font-bold">Edit Profile</Text>
        </View>
        <View className="items-center mb-4">
          <TouchableOpacity onPress={handleImageSelect}>
            {fileUrl ? (
              <Image
                source={{ uri: fileUrl }}
                className="w-20 h-20 rounded-full border-2 border-white"
                
              />
            ) : (
              <View className="w-20 h-20 rounded-full border-2 border-white bg-gray-600 justify-center items-center">
                <Text className="text-white text-base">Select Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          className="bg-transparent border-2 border-white text-white p-3 mb-3 rounded-lg"
          placeholder="Name"
          placeholderTextColor="#white"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="bg-transparent border-2 border-white text-white p-3 mb-3 rounded-lg"
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TouchableOpacity className="bg-white p-2 rounded-lg items-center" onPress={handleSave}>
          <Text className="text-[#99BC85] text-lg">Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for email verification */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-800 bg-opacity-50">
          <View className="w-4/5 bg-white p-4 rounded-lg items-center">
            <Text className="text-xl font-bold mb-4">Enter Confirmation Code</Text>
            <TextInput
              className="bg-gray-200 text-gray-900 p-3 mb-4 rounded-lg"
              placeholder="Confirmation Code"
              placeholderTextColor="#999"
              onChangeText={setConfirmationCode}
              value={confirmationCode}
              keyboardType="numeric"
            />
            <TouchableOpacity className="bg-blue-500 p-3 rounded-lg w-full mb-4" onPress={handleConfirmCode}>
              <Text className="text-white text-lg">Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text className="text-gray-600 text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default EditProfile;
