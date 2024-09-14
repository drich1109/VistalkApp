import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './routes/Home';
import LogIn from './routes/LogIn'; 
import Register from './routes/Register';
import Languages  from './routes/Languages'; 
import { RootStackParamList } from './types'; // Ensure this import path is correct
import Dashboard from './routes/Dashboard';
import Dictionary from './routes/Dictionary';
import Practice from './routes/Practice';
import Shop from './routes/Shop';
import ForgotPassword from './routes/ForgotPassword';
import SetNewPassword from './routes/SetNewPassword';
import DictionaryMeaning from './routes/DictionaryMeaning';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Languages"
          component={Languages}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dictionary"
          component={Dictionary}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DictionaryMeaning"
          component={DictionaryMeaning}
          options={{ headerShown: false }}
        />
                <Stack.Screen
          name="Practice"
          component={Practice}
          options={{ headerShown: false }}
        />
                <Stack.Screen
          name="Shop"
          component={Shop}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="SetNewPassword"
          component={SetNewPassword}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
