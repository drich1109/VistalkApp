import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Adjust the import path
import { updatePassword } from './repo';

type Props = StackScreenProps<RootStackParamList, 'SetNewPassword'>;

const SetNewPassword: React.FC<Props> = ({ route, navigation }) => {
  const {email} = route.params; 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const validatePassword = (password: string) => {
    // Regular expression to check if password is strong
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    return hasUpperCase && hasNumber && hasSpecialChar && isLongEnough;
  };

  const handleSubmit = async () => {
    if (newPassword === confirmPassword) {
      if (validatePassword(newPassword)) {
        const result = await updatePassword(email, confirmPassword, null)
        if(result.isSuccess == true)
            navigation.navigate('LogIn');
        else{
            Alert.alert("Update Password Failed")
        }
      } else {
        Alert.alert('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.');
      }
    } else {
      Alert.alert('Passwords do not match');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Set New Password</Text>
        
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={(text) => {
            setNewPassword(text);
            setIsPasswordValid(validatePassword(text));
          }}
          value={newPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        
        {!isPasswordValid && (
          <Text style={styles.errorText}>
            Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inner: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default SetNewPassword;
