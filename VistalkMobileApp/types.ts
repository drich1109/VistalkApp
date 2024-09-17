// types.ts

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserDto } from './src/routes/type';

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
  UserProfile:undefined;
  Settings:undefined;
  EditProfile:undefined;
  ChangePassword:undefined;
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
export type UserProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserProfile'>;
export type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;
export type EditProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;
export type ChangePasswordScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ChangePassword'>;

export type MenuScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, keyof RootStackParamList>;




