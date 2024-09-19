import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import SearchIcon from "../assets/svg/SearchIcon";
import { useState } from "react";
import SpeakerIcon from "../assets/svg/SpeakerIcon";
import Menu from "../components/Menu";

const DictionaryMeaning: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    return(
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
                <View style={styles.content3}>
                    <Text style={styles.text1}>Kapoy</Text>
                    <Text style={styles.text3}>(Tired)</Text>
                </View>
                <View style={styles.content2}>
                    <Text style={styles.text2}>["ka-poy"]</Text>
                    <TouchableOpacity>
                        <SpeakerIcon style={styles.speaker} />
                    </TouchableOpacity>
                </View>
                <View style={styles.content4}>
                    <Text style={styles.text4}>:drained of strength and energy</Text>
                    <Text style={styles.text4}>:fatigued often to the point of exhaustion.</Text>
                </View>
            </View>
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
      speaker: {
        height: 25,
        width: 25,
        marginLeft: 10, // Add margin to space between text and icon
      },
      input: {
        flex: 1,
        height: '100%',
        color: 'black',
        fontSize: 16,
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
      content3: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
      },
      content4: {
        alignSelf: 'flex-start', // Align to the left
        marginLeft: 20, // Add margin for spacing
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 40,
        width: '80%', // Adjusted width for better layout
        height: 40,
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
      text3: {
        fontSize: 28,
        fontStyle: 'italic',
        fontWeight: '300',
        color: 'white',
      },
      text4: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold'
      }
});

export default DictionaryMeaning;