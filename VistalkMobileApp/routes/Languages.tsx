import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getLanguages, register } from './repo'; // Adjust the import path
import type { Languages, UserDto } from './type'; // Adjust the import path
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

type Props = StackScreenProps<RootStackParamList, 'Languages'>;

const LanguageList: React.FC<Props> = ({ route, navigation }) => {
  const { userDto } = route.params; // Extract userDto from the route parameters

  console.log(userDto); // Log userDto to verify it's being received correctly

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

  const selectLanguage = async (userDto: UserDto | undefined, languageId: number) => {
    if (!userDto) {
      console.error('UserDto is not provided');
      return;
    }

    // Update userDto with the selected language ID
    const updatedUserDto: UserDto = { ...userDto, languageId };

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

  return (
    <SafeAreaView style={styles.container}>
      {languages.map((language, index) => (
        <TouchableOpacity key={index} onPress={() => selectLanguage(userDto, language.languageID)}>
          <View style={styles.languageContainer}>
            <Text style={styles.languageText}>{language.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  languageContainer: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  languageText: {
    fontSize: 18,
    color: 'black',
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
