import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Menu from '../components/Menu'; // Adjust the import path as needed

const Practice: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi, this is the practice</Text>
      <Menu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'black',
  },
});

export default Practice;
