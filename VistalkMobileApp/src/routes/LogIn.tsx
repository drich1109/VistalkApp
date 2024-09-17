import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { loginUser } from './repo';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = StackScreenProps<RootStackParamList, 'LogIn'>;

const LogIn: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('Email');
  const [passwordPlaceholder, setPasswordPlaceholder] = useState('Password');

  const handleLogin = async () => {
    try {
      const response = await loginUser(email, password);

      if (response.isSuccess === true) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userID', response.data.id);
        
        navigation.navigate('Dashboard')
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
      <ImageBackground source={require('../assets/bg.png')} style={styles.background} resizeMode="cover">
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <TextInput
          style={styles.input}
          placeholder={emailPlaceholder}
          placeholderTextColor="#fff"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          onFocus={() => setEmailPlaceholder('')}
          onBlur={() => setEmailPlaceholder('Email')}
        />

        <TextInput
          style={styles.input}
          placeholder={passwordPlaceholder}
          placeholderTextColor="#fff"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          onFocus={() => setPasswordPlaceholder('')}
          onBlur={() => setPasswordPlaceholder('Password')}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

  {/*       <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert('Google Sign In')}>
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>
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
  googleButton: {
    backgroundColor: '#fff',
    padding: 12,
    width: '80%',
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButtonText: {
    color: '#99BC85',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'transparent',
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#fff',
    padding: 12,
    width: '80%',
    borderRadius: 40,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    color: '#99BC85',
    fontSize: 20,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    width: '80%',
    alignItems: 'flex-end', 
  },
  forgotPassword: {
    color: '#fff',
    marginTop: 0,
    textAlign: 'right',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LogIn;