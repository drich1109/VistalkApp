import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the import path
import { loginUser } from './repo';
import { UserDto } from './type'; // Adjust the import path

type Props = StackScreenProps<RootStackParamList, 'Register'>;

const Register: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); // New state to handle password match

  let userDto: UserDto = {
    name,
    email,
    password,
    languageId: 0
  };

    const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordMatch(text === confirmPassword);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setPasswordMatch(password === text);
  };

  function clickRegister()
  {
    console.log(userDto);
    navigation.navigate('Languages', { userDto })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Name"
          placeholderTextColor="#666"
          onChangeText={setName}
          value={name}
        />
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
          onChangeText={handlePasswordChange}
          value={password}
        />
        <TextInput
          style={[styles.input, { color: '#000' }]}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          secureTextEntry
          onChangeText={handleConfirmPasswordChange}
          value={confirmPassword}
        />
        {!passwordMatch && password.length > 0 && confirmPassword.length > 0 && <Text style={styles.errorText}>Passwords do not match</Text>
    }

        <TouchableOpacity style={styles.button} onPress={clickRegister}>
          <Text style={styles.buttonText}>Register</Text>
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
    color: 'black'
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Register;
