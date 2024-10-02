import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar, Modal, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAvailableTimeSlots, createGame } from '../services/api';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { RootStackParamList } from '../Navigation';

type SelectTimeScreenRouteProp = RouteProp<RootStackParamList, 'SelectTime'>;
type SelectTimeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SelectTime'>;

type Props = {
  route: SelectTimeScreenRouteProp;
  navigation: SelectTimeScreenNavigationProp;
};

const SelectTimeScreen: React.FC<Props> = ({ route, navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const { courtId, token } = route.params;

  const handleDateSelect = (day: any) => {
    setDate(new Date(day.timestamp));
    setShowCalendar(false);
    setAvailableSlots([]);
    setSelectedSlot(null);
    setShowTimeSlots(false);
  };

  const fetchAvailableTimes = async () => {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const slots = await getAvailableTimeSlots(courtId, formattedDate);

      if (slots && slots.length > 0) {
        setAvailableSlots(slots);
        setShowTimeSlots(true);
      } else {
        Alert.alert('No available slots', 'No available time slots for the selected date.');
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
      Alert.alert('Error', 'Failed to load available time slots');
    }
  };

  const handleCreateGame = async () => {
    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    const [start_time, end_time] = selectedSlot.split('-').map(time => time.trim());
    const formattedDate = date.toISOString().split('T')[0];
    const formattedStartTime = `${formattedDate} ${start_time}`;
    const formattedEndTime = `${formattedDate} ${end_time}`;

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <View style={styles.container}>
        <Text style={styles.title}>Select a Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowCalendar(true)}>
          <Icon name="calendar-outline" size={24} color="#1E90FF" style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {date.toDateString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton} onPress={fetchAvailableTimes}>
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {showTimeSlots && (
          <View style={styles.slotsContainer}>
            <Text style={styles.slotsTitle}>Select a Time Slot</Text>
            <FlatList
              data={availableSlots}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.slotItem,
                    selectedSlot === item && styles.selectedSlot
                  ]}
                  onPress={() => setSelectedSlot(item)}
                >
                  <Text style={[
                    styles.slotText,
                    selectedSlot === item && styles.selectedSlotText
                  ]}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          </View>
        )}

        {selectedSlot && (
          <TouchableOpacity style={styles.createButton} onPress={handleCreateGame}>
            <Text style={styles.createButtonText}>Create Game</Text>
          </TouchableOpacity>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [date.toISOString().split('T')[0]]: {selected: true, selectedColor: '#1E90FF'},
              }}
              minDate={new Date().toISOString().split('T')[0]}
            />
          </View>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#212121',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 18,
    color: '#212121',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  slotsContainer: {
    marginTop: 20,
  },
  slotsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212121',
  },
  slotItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  selectedSlot: {
    backgroundColor: '#1E90FF',
  },
  slotText: {
    fontSize: 16,
    color: '#212121',
    textAlign: 'center',
  },
  selectedSlotText: {
    color: '#FFFFFF',
  },
  createButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default SelectTimeScreen;