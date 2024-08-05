import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const payload = {
      email: email,
      password: password,
    };

    console.log(payload);  // Log the payload
    const queryString = new URLSearchParams(payload).toString();  
    try {
      const response = await fetch(`http://192.168.1.8:5000/login?${queryString}`, {
        method: 'GET',  // Use GET method
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response)
      if (!response.ok && response.status !== 401) {
            throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);  // Log the response data

      if (data.token) {
        Alert.alert('Login Successful', `Welcome ${data.name}!`);
        // Store the token in local storage or context
        // For example:
        // await AsyncStorage.setItem('userToken', data.token);
        // Navigate to another screen or perform other actions
      } else {
        Alert.alert('Login Failed', data.error);
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
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
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

export default LoginPage;
