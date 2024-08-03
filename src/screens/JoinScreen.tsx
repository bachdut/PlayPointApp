import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Court, getCourts } from '../services/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface JoinScreenProps {
  token: string;
}

type RootStackParamList = {
  Home: undefined;
  Join: { token: string }; 
  GameDetails: { courtId: number; token: string };
};

const JoinScreen: React.FC<JoinScreenProps> = ({ token }) => {
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: Date | null, endDate: Date | null }>({ startDate: null, endDate: null });
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [courts, setCourts] = useState<Court[]>([]);
  const [filteredCourts, setFilteredCourts] = useState<Court[]>(courts);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchCourtsData = async () => {
      try {
        const courtsData = await getCourts();
        setCourts(courtsData);
        setFilteredCourts(courtsData);
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };

    fetchCourtsData();
  }, []);

  const filterCourts = () => {
    let filtered = courts;

    if (location) {
      filtered = filtered.filter(court => court.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (price !== null) {
      filtered = filtered.filter(court => court.price <= price);
    }

    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(court => {
        const courtDate = new Date(court.available_date);
        return dateRange.startDate && dateRange.endDate && courtDate >= dateRange.startDate && courtDate <= dateRange.endDate;
      });
    }

    if (startTime && endTime) {
      const startTimeString = formatTime(startTime);
      const endTimeString = formatTime(endTime);
      filtered = filtered.filter(court => {
        const [courtStartTime, courtEndTime] = court.available_time.split(' - ');
        return (courtStartTime >= startTimeString && courtStartTime < endTimeString) || 
               (courtEndTime > startTimeString && courtEndTime <= endTimeString) ||
               (courtStartTime <= startTimeString && courtEndTime >= endTimeString);
      });
    }

    setFilteredCourts(filtered);
  };

  const formatTime = (time: Date | null) => {
    if (!time) return '';
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleJoinCourt = (court: Court) => {
    if (court.id) {
      console.log('Joining court with ID:', court.id);  // Debug log
      navigation.navigate('GameDetails', { courtId: court.id, token });
    } else {
      console.error('Court ID is undefined');
    }
  };

  const renderCourt = ({ item }: { item: Court }) => (
    <View style={styles.courtContainer}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.courtImage} /> : <View style={styles.courtImagePlaceholder} />}
      <View style={styles.courtDetails}>
        <Text style={styles.courtName}>{item.name || 'Unnamed Court'}</Text>
        <Text>{item.location || 'Unknown Location'}</Text>
        <Text>{item.available_seats !== undefined ? `${item.available_seats} seats available` : 'Seats not specified'}</Text>
        <Text>{item.price !== undefined ? `${item.price} USD` : 'Price not specified'}</Text>
        <Text>{item.available_date || 'Date not specified'}</Text>
        <Text>{item.available_time || 'Time not specified'}</Text>
        <TouchableOpacity onPress={() => handleJoinCourt(item)} style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Courts</Text>

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <Text>Price (up to): {price !== null ? `$${price}` : 'Any'}</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={10}
        value={price || 0}
        onValueChange={setPrice}
      />

      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateTimeInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Start Date"
            value={dateRange.startDate ? dateRange.startDate.toDateString() : ''}
            editable={false}
            pointerEvents="none" // This will make sure the touchable area covers the input
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateTimeInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="End Date"
            value={dateRange.endDate ? dateRange.endDate.toDateString() : ''}
            editable={false}
            pointerEvents="none" // This will make sure the touchable area covers the input
          />
        </TouchableOpacity>
      </View>

      {showStartDatePicker && (
        <DateTimePicker
          value={dateRange.startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) {
              setDateRange({ ...dateRange, startDate: date });
            }
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={dateRange.endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) {
              setDateRange({ ...dateRange, endDate: date });
            }
          }}
        />
      )}

      <View style={styles.dateTimeContainer}>
        <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.dateTimeInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Start Time"
            value={startTime ? formatTime(startTime) : ''}
            editable={false}
            pointerEvents="none" // This will make sure the touchable area covers the input
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.dateTimeInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="End Time"
            value={endTime ? formatTime(endTime) : ''}
            editable={false}
            pointerEvents="none" // This will make sure the touchable area covers the input
          />
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={showStartTimePicker}
        mode="time"
        onConfirm={(time) => {
          setStartTime(time);
          setShowStartTimePicker(false);
        }}
        onCancel={() => setShowStartTimePicker(false)}
      />

      <DateTimePickerModal
        isVisible={showEndTimePicker}
        mode="time"
        onConfirm={(time) => {
          setEndTime(time);
          setShowEndTimePicker(false);
        }}
        onCancel={() => setShowEndTimePicker(false)}
      />

      <Button title="Filter" onPress={filterCourts} />

      <Text style={styles.sectionTitle}>Courts</Text>
      <FlatList
        data={filteredCourts}
        keyExtractor={(item) => item.name}
        renderItem={renderCourt}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  courtContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  courtImage: {
    width: 100,
    height: 100,
  },
  courtImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#ccc',
  },
  courtDetails: {
    flex: 1,
    padding: 16,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeInputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  joinButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 8,
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default JoinScreen;