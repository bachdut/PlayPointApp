import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAvailableTimeSlots, createGame } from '../services/api';

type RouteParams = {
  courtId: number;
  token: string;
};

const SelectTimeScreen: React.FC = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [slotsFetched, setSlotsFetched] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const { courtId, token } = route.params as RouteParams;

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setSlotsFetched(false); // Mark slots as not fetched yet
  };

  const fetchAvailableTimes = async () => {
    try {
      const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const availableSlots = await getAvailableTimeSlots(courtId, formattedDate);

      if (availableSlots && availableSlots.length > 0) {
        setAvailableTimes(availableSlots);
        setSelectedTime(availableSlots[0]);
      } else {
        Alert.alert('No available slots', 'No available time slots for the selected date.');
      }

      setSlotsFetched(true);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      Alert.alert('Error', 'Failed to load available time slots');
    }
  };

  const handleCreateGame = async () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    const [start_time, end_time] = selectedTime.split('-').map(time => time.trim());

    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    const formattedStartTime = `${localDate} ${start_time}`;
    const formattedEndTime = `${localDate} ${end_time}`;

    try {
      const response = await createGame(courtId, formattedStartTime, formattedEndTime, token);
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
      <Text style={styles.title}>Select a Date</Text>
      <Button title="Pick a date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Text>{date.toDateString()}</Text>
      <Button title="Next" onPress={fetchAvailableTimes} />
      {slotsFetched && (
        <>
          <Text style={styles.title}>Select a Time Slot</Text>
          {availableTimes.length > 0 ? (
            <Picker
              selectedValue={selectedTime}
              onValueChange={(itemValue) => setSelectedTime(itemValue)}
              style={styles.picker}
            >
              {availableTimes.map((slot, index) => (
                <Picker.Item
                  key={index}
                  label={slot}
                  value={slot}
                />
              ))}
            </Picker>
          ) : (
            <Text>No available time slots</Text>
          )}
          <Button title="Create Game" onPress={handleCreateGame} />
        </>
      )}
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