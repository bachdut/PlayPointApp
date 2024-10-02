import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar, Dimensions, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getCourts } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../Navigation';

type HostScreenRouteProp = RouteProp<RootStackParamList, 'Host'>;
type HostScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Host'>;

type Props = {
  route: HostScreenRouteProp;
  navigation: HostScreenNavigationProp;
};

const { height, width } = Dimensions.get('window');

const HostScreen: React.FC<Props> = ({ route, navigation }) => {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState<{ id: string; name: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { token } = route.params;

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getCourts();
        setCourts(data);
        if (data.length > 0) {
          setSelectedCourt({ id: data[0].id.toString(), name: data[0].name });
        }
      } catch (error) {
        console.error('Error fetching available courts:', error);
        Alert.alert('Error', 'Failed to load courts');
      }
    };
    fetchCourts();
  }, []);

  const handleNext = () => {
    if (!selectedCourt) {
      Alert.alert('Please select a court');
      return;
    }
    const selectedDate = '2024-08-21'; // Example hardcoded date
    navigation.navigate('SelectTime', { courtId: parseInt(selectedCourt.id), token, date: selectedDate });
  };

  const handleViewHostedGames = () => {
    navigation.navigate('MyHostedGames', { token });
  };

  const renderCourtItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courtItem}
      onPress={() => {
        setSelectedCourt({ id: item.id.toString(), name: item.name });
        setModalVisible(false);
      }}
    >
      <Text style={styles.courtItemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.container}>
        <View style={styles.pickerSection}>
          <TouchableOpacity style={styles.pickerContainer} onPress={() => setModalVisible(true)}>
            <Icon name="basketball-outline" size={24} color="#1E90FF" style={styles.pickerIcon} />
            <Text style={styles.pickerText}>
              {selectedCourt ? selectedCourt.name : 'Select a Court'}
            </Text>
            <Icon name="chevron-down-outline" size={24} color="#1E90FF" style={styles.pickerIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
            <Icon name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewHostedGames}>
            <Text style={styles.secondaryButtonText}>My Hosted Games</Text>
            <Icon name="list" size={24} color="#1E90FF" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <FlatList
            data={courts}
            renderItem={renderCourtItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  pickerSection: {
    height: height / 3,
    justifyContent: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  pickerIcon: {
    marginHorizontal: 10,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  buttonSection: {
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#1E90FF',
  },
  secondaryButtonText: {
    color: '#1E90FF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    padding: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
    marginTop: height / 3, // Start the modal at the top third of the screen
    maxHeight: (height / 3) * 2, // Limit the height to 2/3 of the screen
  },
  courtItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: width - 80,
  },
  courtItemText: {
    fontSize: 16,
  },
});

export default HostScreen;