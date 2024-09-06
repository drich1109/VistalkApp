import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import Menu from '../components/Menu'; // Adjust the import path as needed
import Svg, { Circle } from 'react-native-svg';

const Dashboard: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<number | null>(null);

  let progressnumber = 17; // Example progress number

  const openModal = (section: number) => {
    setCurrentSection(section);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCurrentSection(null);
  };

  return (
    <ImageBackground
      source={require('../assets/bg.png')} // Adjust the path to your background image
      style={styles.background}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={require('../assets/cebuano.png')} // Adjust the path to your profile picture
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require('../assets/cebuano.png')} // Adjust the path to your notification icon
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image
              source={require('../assets/cebuano.png')} // Adjust the path to your help icon
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.center}>
        <Text style={styles.centerText}>Cebuano</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(section => (
          <View key={section} style={styles.sectionWrapper}>
            <TouchableOpacity style={styles.sectionContainer} onPress={() => openModal(section)}>
              <View style={styles.sectionContent}>
                <Text style={styles.sectionTitle}>SECTION {section}</Text>
                <Text style={styles.unitText}>10 units</Text>
              </View>
            </TouchableOpacity>
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
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <TouchableOpacity activeOpacity={1} style={styles.modalInnerContent} onPress={() => {}}>
              <View style={styles.modalDescriptionWrapper}>
                <Text style={styles.modalTitle}>SECTION {currentSection}</Text>
                <Text style={styles.modalUnits}>10 units</Text>
                <Text style={styles.modalDescription}>
                  This is a brief description of Section.
                  This is a brief description of Section.
                  This is a brief description of Section.
                  This is a brief description of Section {currentSection}.
                </Text>
              </View>
              <View style={styles.modalBottomContent}>
                <TouchableOpacity style={styles.playButton} onPress={closeModal}>
                  <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Menu />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  center: {
    alignItems: 'center',
    marginBottom: 20,
  },
  centerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff', // White text
  },
  content: {
    padding: 20,
  },
  sectionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centering the section
    marginBottom: 20,
  },
  sectionContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10, // Reduced height for a more professional look
    paddingHorizontal: 35, // Increased width for a more professional look
    borderRadius: 25, // More rounded corners
  },
  sectionContent: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20, // Slightly larger text for more emphasis
    fontWeight: 'bold',
    color: '#000',
    textTransform: 'uppercase',
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
  progressCircleWrapper: {
    width: 80, // Slightly increased size
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  progressText: {
    fontSize: 18,
    color: '#ffff',
    fontWeight: 'bold',
    position: 'absolute', // Center text inside the circle
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Position modal at the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black for overlay
  },
  modalContent: {
    backgroundColor: '#000', // Completely black background
    borderTopLeftRadius: 25, // Rounded top corners
    borderTopRightRadius: 25, // Rounded top corners
    width: '100%',
    alignSelf: 'flex-end',
  },
  modalInnerContent: {
    backgroundColor: '#000', // Completely black background for modal's inner content
    borderTopLeftRadius: 25, // Rounded top corners
    borderTopRightRadius: 25, // Rounded top corners
  },
  modalBottomContent: {
    paddingBottom: 40, // Bottom padding
    paddingHorizontal: 40,
  },
  modalDescriptionWrapper: {
    padding: 40, // Padding for the description area
  },
  modalTitle: {
    fontSize: 28, // Larger font for the section title
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalUnits: {
    fontSize: 20, // Added the "10 units" text
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#fff', // White button
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
  },
  playButtonText: {
    fontSize: 18,
    color: '#000', // Black text
    fontWeight: 'bold',
  },
});

export default Dashboard;
