import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the import path
import { getFromBaseApi } from '../api/apiService';
import { loginUser } from './repo';

type Props = StackScreenProps<RootStackParamList, 'LogIn'>;

const LogIn: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);
      console.log(response);

      if (response.isSuccess == true) {
        Alert.alert('Login Successful', `Welcome ${response.data.name}!`, [
          { text: 'OK', onPress: () => navigation.goBack() }, 
        ]);
      } else {
        Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Email"
          placeholderTextColor="#666"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address" // Set the keyboard type to email
          autoCapitalize="none" // Prevent auto-capitalization
          textContentType="emailAddress" // Provide additional hint for the keyboard
        />

        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  inner: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    marginBottom: 48,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LogIn;
