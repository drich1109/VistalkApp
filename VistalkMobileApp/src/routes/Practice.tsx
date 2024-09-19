import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import Menu from '../components/Menu'; // Adjust the import path as needed
import HistoryIcon from '../assets/svg/HistoryIcon';
import SearchIcon from '../assets/svg/SearchIcon';
import SpeakerIcon from '../assets/svg/SpeakerIcon';
import { Circle, Svg } from 'react-native-svg';
import MicrophoneIcon from '../assets/svg/MicrophoneIcon';

const Practice: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  let progressnumber = 17;
  return (
    <ImageBackground source={require('../assets/bg.png')} style={styles.background}>
      <TouchableOpacity style={styles.history}>
        <HistoryIcon style={styles.historyicon} />
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.centerText}>Pronounce</Text>
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
      <TouchableOpacity style={styles.center}>
        <Text style={styles.button}>
          Random Words
        </Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.text1}>Maayong Buntag</Text>
        <View style={styles.content2}>
        <Text style={styles.text2}>["ma-a-yong bun-tag"]</Text>
        <TouchableOpacity>
          <SpeakerIcon style={styles.speaker} />
        </TouchableOpacity>
      </View>
      </View>
      
      <View style={styles.center}>
        <Text style={styles.centerText2}>Excellent !!!</Text>
      </View>
      <View style={styles.progressCircleWrapper}>
              <Svg width="80" height="80">
                <Circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#ffffff"
                  strokeWidth="5"
                  fill="none"
                />
                <Circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="#000000" // Adjust the color for the progress
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray={`${progressnumber / 100 * 2 * Math.PI * 35} ${2 * Math.PI * 35 - progressnumber / 100 * 2 * Math.PI * 35}`}
                  strokeDashoffset={Math.PI / 2 * 35}                />
              </Svg>
              <Text style={styles.progressText}>{progressnumber}%</Text>
    </View>
    <TouchableOpacity style={styles.center}>
        <MicrophoneIcon style={styles.microphone}/>
    </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  historyicon: {
    height: 35,
    width: 35,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  history: {
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 20,
    marginRight: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleWrapper: {
    width: 80, // Slightly increased size
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  progressText: {
    fontSize: 18,
    color: '#ffff',
    fontWeight: 'bold',
    position: 'absolute', // Center text inside the circle
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
  centerText2: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  content: {
    alignSelf: 'flex-start', // Align to the left
    marginLeft: 80, // Add margin for spacing
    marginBottom: 10,
  },
  content2: {
    alignSelf: 'flex-start', // Align to the left
    marginLeft: 20, // Add margin for spacing
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Center vertically
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%', // Adjusted width for better layout
    height: 40,
  },
  search: {
    display: 'flex',
    flexDirection: 'row', // Align icon and input horizontally
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '80%', // Adjusted width for better layout
    height: 40, // Adjusted height for a better look
  },
  searchicon: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  speaker: {
    height: 25,
    width: 25,
    marginLeft: 10, // Add margin to space between text and icon
  },
  microphone: {
    height: 40,
    width: 40,
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 40
  },
  input: {
    flex: 1, // Takes the remaining space in the row
    height: '100%',
    color: 'black',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    fontWeight: 'semibold',
    color: 'black'
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  text2: {
    fontSize: 24, // Adjusted size for better fit
    fontStyle: 'italic',
    fontWeight: '300',
    color: 'white',
  },
});

export default Practice;
