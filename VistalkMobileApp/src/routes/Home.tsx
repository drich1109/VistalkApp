import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import LinearGradient from 'react-native-linear-gradient';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={['#6addd0', '#f7c188']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 justify-center p-4"
      >
        <View className="items-center mb-8">
          <Image source={require('../assets/White.png')} className="w-44 h-44" />
          <Text className="text-white text-4xl font-bold" style={{ color: '#ffffff', fontFamily: 'cursive' }}>
              Vistalk
          </Text>
        </View>

        <View className="mt-4 items-center">
          <TouchableOpacity
            className="border border-2 border-white p-3 w-[80%] rounded-xl items-center mb-3"
            onPress={() => navigation.navigate('LogIn')}
          >
          <Text className="text-xl font-bold text-white">
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border border-2 border-white p-3 w-[80%] rounded-xl items-center mb-3"
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-xl font-bold text-white">
              Create an Account
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;
