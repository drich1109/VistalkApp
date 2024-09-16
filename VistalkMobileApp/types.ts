// types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserDto } from './routes/type';

export type RootStackParamList = {
  Home: undefined;
  LogIn: undefined;
  Register:undefined;
  Languages: { userDto?: UserDto };
  Dashboard:undefined;
  Shop:undefined;
  Dictionary:undefined;
  DictionaryMeaning:undefined;
  Practice:undefined;
  ForgotPassword:undefined;
  SetNewPassword:{email:string};
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type LogInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
export type LanguagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Languages'>;
export type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
export type ShopScreenNavigatorProp = NativeStackNavigationProp<RootStackParamList, 'Shop'>;
export type PracticeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Practice'>;
export type DictionaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dictionary'>;
export type DictionaryMeaningScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DictionaryMeaning'>;
export type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
export type SetNewPasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SetNewPassword'>;

export type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;




