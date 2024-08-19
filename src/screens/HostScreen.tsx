import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getCourts } from '../services/api';

type RouteParams = {
  token: string;
};

const HostScreen: React.FC = () => {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  const { token } = route.params as RouteParams;

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const data = await getCourts();
        setCourts(data);
        if (data.length > 0) {
          setSelectedCourt(data[0].id); // Updated to use ID
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
    navigation.navigate('SelectTime', { courtId: parseInt(selectedCourt), token, date: selectedDate });
  };

  const handleViewHostedGames = () => {
    navigation.navigate('MyHostedGames', { token });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host a Game</Text>
      <Picker
        selectedValue={selectedCourt}
        onValueChange={(itemValue) => setSelectedCourt(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a Court" value="" />
        {courts.map((court, index) => (
          <Picker.Item key={index} label={court.name} value={court.id} /> // Updated to use ID
        ))}
      </Picker>
      <View style={styles.buttonContainer}>
        <Button title="Next" onPress={handleNext} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="My Hosted Games" onPress={handleViewHostedGames} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default HostScreen;