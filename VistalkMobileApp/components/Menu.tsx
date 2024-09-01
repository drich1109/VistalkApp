import React, { useState } from 'react';
import { View, Button, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MenuScreenNavigationProp, RootStackParamList } from '../types'; // Adjust the import path

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
      <Button title="Menu" onPress={toggleExpand} />
      {expanded && (
        <Animated.View style={styles.menu}>
          <Button title="Dashboard" onPress={() => navigateToScreen('Dashboard')} />
          <Button title="Shop" onPress={() => navigateToScreen('Shop')} />
          <Button title="Dictionary" onPress={() => navigateToScreen('Dictionary')} />
          <Button title="Practice" onPress={() => navigateToScreen('Practice')} />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    color:"black"
  },
  menu: {
    marginTop: 10,
    color:"black"

  },
});

export default Menu;
