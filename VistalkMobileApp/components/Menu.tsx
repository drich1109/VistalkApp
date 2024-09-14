import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MenuScreenNavigationProp, RootStackParamList } from '../types'; // Adjust the import path
import MenuIcon from '../assets/svg/MenuIcon';
import DashboardIcon from '../assets/svg/DashboardIcon';
import ShopIcon from '../assets/svg/ShopIcon';
import DictionaryIcon from '../assets/svg/DictionaryIcon';
import PracticeIcon from '../assets/svg/PracticeIcon';

const Menu: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<MenuScreenNavigationProp>();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const navigateToScreen = (screen: keyof RootStackParamList) => {
    console.log(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
        <Animated.View style={styles.menu}>
          <DashboardIcon style={[styles.icon]} onPress={() => navigateToScreen('Dashboard')}/>
          <ShopIcon style={[styles.icon]} onPress={() => navigateToScreen('Shop')}/>
          <DictionaryIcon style={[styles.icon]} onPress={() => navigateToScreen('Dictionary')}/>
          <PracticeIcon style={[styles.icon]} onPress={() => navigateToScreen('Practice')}/>
        </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    color: "black",
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    position: 'absolute',
    marginTop: 30,
    bottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 10,
    gap: 20,
    padding: 10,
    cursor: 'auto',
  },  
  icon: {
    width: 25,
    height: 25,
    color: 'black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconmenu: {
    width: 30,
    height: 30,
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 30,
  },
});

export default Menu;
