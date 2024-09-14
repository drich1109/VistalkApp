import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Menu from '../components/Menu'; // Adjust the import path as needed
import SearchIcon from '../assets/svg/SearchIcon';
import ArrowIcon from '../assets/svg/ArrowIcon';
import { useNavigation } from '@react-navigation/native';
import { DictionaryMeaningScreenNavigationProp, RootStackParamList } from '../types';

const Dictionary: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation<DictionaryMeaningScreenNavigationProp>();
    const navigateToMeaning = (meaning: keyof RootStackParamList) => {
        console.log(meaning);
        navigation.navigate(meaning);
      };
  return (
    <ImageBackground source={require('../assets/bg.png')} style={styles.background}>
      <View style={styles.center}>
        <Text style={styles.centerText}>Dictionary</Text>
      </View>
      <View style={styles.search}>
        <TextInput
          style={styles.input}
          placeholder="Search for a word"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <SearchIcon style={styles.searchicon} />
      </View>
      <View style={styles.content}>
        <Text style={styles.text2}>English</Text>
        <Text style={styles.text2}>Bisaya</Text>
      </View>
      <ScrollView style={styles.scroll}>
        <TouchableOpacity onPress={() => navigateToMeaning('DictionaryMeaning')}>
          <View style={styles.content2} >
            <Text style={styles.textEnglish}>Tired</Text>
            <ArrowIcon style={styles.arrowicon} />
            <Text style={styles.textNative}>Kapoy</Text>
          </View>
        </TouchableOpacity>
      </ScrollView> 
      <Menu />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    marginBottom: 10,
  },
  centerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 110
  },
  content2: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    gap: 60
  },
  scroll: {
    padding: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'black',
  },
  text2: {
    fontSize: 28,
    fontWeight: '300',
    color: 'white',
  },
  textNative: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5B7200',
  },
  textEnglish: {
    fontSize: 24,
    fontStyle: 'italic',
    fontWeight: '300',
    color: '#5B7200',
  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%',
    height: 40,
  },
  searchicon: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  arrowicon: {
    height: 30,
    width: 30,
  },
  input: {
    flex: 1,
    height: '100%',
    color: 'black',
    fontSize: 16,
  },
});

export default Dictionary;
