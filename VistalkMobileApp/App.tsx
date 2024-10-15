import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/routes/Home';
import LogIn from './src/routes/LogIn'; 
import Register from './src/routes/Register';
import Languages  from './src/routes/Languages'; 
import { RootStackParamList } from './types'; // Ensure this import path is correct
import Dashboard from './src/routes/Dashboard';
import Dictionary from './src/routes/Dictionary';
import Practice from './src/routes/Practice';
import Shop from './src/routes/Shop';
import ForgotPassword from './src/routes/ForgotPassword';
import SetNewPassword from './src/routes/SetNewPassword';
import DictionaryMeaning from './src/routes/DictionaryMeaning';
import UserProfile from './src/routes/UserProfile';
import Settings from './src/routes/Settings';
import EditProfile from './src/routes/EditProfile';
import ChangePassword from './src/routes/ChangePassword';
import Unit from './src/routes/Unit';
import UnitContent from './src/routes/UnitContent';
import WordMatchGame from './src/routes/WordMatchGame';

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
          <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Unit"
          component={Unit}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UnitContent"
          component={UnitContent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WordMatchGame"
          component={WordMatchGame}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
