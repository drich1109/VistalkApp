import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, ImageBackground, Image, View, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
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

  function clickRegister() {
    if (passwordMatch && password) {
      console.log(userDto);
      navigation.navigate('Languages', { userDto });
    } else {
      console.warn("Passwords do not match.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/bg.png')} style={styles.background} resizeMode="cover">
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <View style={styles.inner}>
          <TextInput
            style={[styles.input, { color: '#000' }]}
            placeholder="Full Name"
            placeholderTextColor="#fff"
            onChangeText={setName}
            value={name}
          />

          <TextInput
            style={[styles.input, { color: '#000' }]}
            placeholder="Email"
            placeholderTextColor="#fff"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress" 
          />

          <TextInput
            style={[styles.input, { color: '#000' }]}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={handlePasswordChange}
            value={password}
          />
          <TextInput
            style={[styles.input, { color: '#000' }]}
            placeholder="Confirm Password"
            placeholderTextColor="#fff"
            secureTextEntry
            onChangeText={handleConfirmPasswordChange}
            value={confirmPassword}
          />
          {!passwordMatch && password.length > 0 && confirmPassword.length > 0 && <Text style={styles.errorText}>Passwords do not match</Text>}

          <TouchableOpacity style={styles.button} onPress={clickRegister}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.haveanaccountContainer}
            onPress={() => navigation.navigate('LogIn')}
          >
            <Text style={styles.haveanaccount}>Already have an account?</Text>
          </TouchableOpacity>
        </View>
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
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
});

export default Register;