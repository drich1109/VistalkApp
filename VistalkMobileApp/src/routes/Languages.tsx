import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {getLanguages, register} from './repo'; // Adjust the import path
import type {Languages, UserDto} from './type'; // Adjust the import path
import {StackScreenProps} from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import LinearGradient from 'react-native-linear-gradient';

type Props = StackScreenProps<RootStackParamList, 'Languages'>;

const LanguageList: React.FC<Props> = ({route, navigation}) => {
  const {userDto} = route.params;

  const [languages, setLanguages] = useState<Languages[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const result = await getLanguages();
        setLanguages(result.data);
      } catch (err) {
        setError('Failed to fetch languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  const selectLanguage = async (
    userDto: UserDto | undefined,
    languageId: number,
  ) => {
    if (!userDto) {
      console.error('UserDto is not provided');
      return;
    }

    // Update userDto with the selected language ID
    const updatedUserDto: UserDto = {...userDto, languageId};

    try {
      const result = await register(updatedUserDto);
      if (result.isSuccess) {
        // Navigate to the Languages screen with updated userDto
        navigation.navigate('Dashboard');
      } else {
        // Handle registration failure
        console.log('Registration failed:', result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  console.log(languages);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient colors={['#6addd0', '#f7c188']} className="flex-1 justify-center items-center">
      <View className="items-center mb-8">
          <Image source={require('../assets/White.png')} className="w-44 h-44" />
          <Text className="text-white text-4xl font-bold" style={{ color: '#ffffff', fontFamily: 'cursive' }}>
              Vistalk
          </Text>
        </View>
      {languages.map((language, index) => (
          <View className="flex-row items-center mt-4 px-4">
            <Image
              source={require('../assets/cebuano.png')}
              style={{width: 100, height: 100}}
            />
            <TouchableOpacity
              key={index}
              style={{flex: 1}}
              onPress={() => selectLanguage(userDto, language.languageID)}>
              <View style={styles.languageContainer}>
                <Text style={styles.languageText}>{language.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    marginVertical: 40,
    alignSelf: 'center',
  },
  background: {
    flex: 1,
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  languageContainer: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    marginStart: 16,
  },
  languageText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  userInfoContainer: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    elevation: 1,
  },
  userInfoText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default LanguageList;
