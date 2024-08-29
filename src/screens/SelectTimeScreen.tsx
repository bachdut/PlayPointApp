import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAvailableTimeSlots, createGame } from '../services/api';

type RouteParams = {
  courtId: number;
  token: string;
  date: string;  // Ensure date is passed correctly
};

const SelectTimeScreen: React.FC = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState<{ start_time: string; end_time: string } | null>(null);
  const navigation = useNavigation();
  const route = useRoute();

  const { courtId, token, date } = route.params as RouteParams;

  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const availableSlots = await getAvailableTimeSlots(courtId, date);
        setAvailableTimes(availableSlots.available_slots);
        if (availableSlots.available_slots.length > 0) {
          setSelectedTime(availableSlots.available_slots[0]);
        }
      } catch (error) {
        console.error('Error fetching time slots:', error);
        Alert.alert('Error', 'Failed to load available time slots');
      }
    };

    fetchAvailableTimes();
  }, [courtId, date]);

  const handleCreateGame = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    // Combine the selected date and time
    const startDateTime = `${date} ${selectedTime.start_time}`;
    const endDateTime = `${date} ${selectedTime.end_time}`;

    try {
      const response = await createGame(courtId, startDateTime, endDateTime, token);
      if (response.message === 'Game created successfully') {
        Alert.alert('Success', 'Game created successfully');
        navigation.navigate('PlayPoints', { token });
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create game');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Time Slot</Text>
      <Picker
        selectedValue={selectedTime}
        onValueChange={(itemValue) => setSelectedTime(itemValue)}
        style={styles.picker}
      >
        {availableTimes.map((slot, index) => (
          <Picker.Item key={index} label={`${slot.start_time} - ${slot.end_time}`} value={slot} />
        ))}
      </Picker>
      <Button title="Create Game" onPress={handleCreateGame} />
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
});

export default SelectTimeScreen;