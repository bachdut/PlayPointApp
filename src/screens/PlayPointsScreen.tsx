import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, FlatList } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation';
import { getCourts, makeReservation, cancelReservation } from '../services/api';

type Props = StackScreenProps<RootStackParamList, 'PlayPoints'> & {
  token: string | null;
};

const PlayPointsScreen: React.FC<Props> = ({ token, navigation }) => {
  const [courts, setCourts] = React.useState([]);
  const [reservations, setReservations] = React.useState<{ [key: string]: boolean }>({});

  React.useEffect(() => {
    const fetchCourts = async () => {
      try {
        const courtsData = await getCourts();
        setCourts(courtsData);
        console.log('Courts fetched:', courtsData); // Debug log
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };
    fetchCourts();
  }, []);

  const updateCourtSeats = (courtName: string, seats: number) => {
    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.name === courtName ? { ...court, available_seats: seats } : court
      )
    );
  };

  const handleJoin = async (courtName: string) => {
    console.log('Join button clicked for court:', courtName); // Debug log
    if (!token) {
      console.log('No token found. User must be logged in.');
      Alert.alert('Error', 'You must be logged in to join');
      return;
    }

    try {
      console.log('Making reservation API call with token:', token);
      const response = await makeReservation(courtName, token);
      console.log('Reservation response:', response); // Debug log
      setReservations((prev) => ({ ...prev, [courtName]: true }));
      updateCourtSeats(courtName, response.remaining_seats);
      Alert.alert('Joined successfully', `Remaining seats: ${response.remaining_seats}`);
    } catch (error) {
      console.error('Error joining court:', error); // Debug log
      Alert.alert('Error', 'Unable to join');
    }
  };

  const handleUnjoin = async (courtName: string) => {
    console.log('Unjoin button clicked for court:', courtName); // Debug log
    if (!token) {
      console.log('No token found. User must be logged in.');
      Alert.alert('Error', 'You must be logged in to unjoin');
      return;
    }

    try {
      console.log('Cancelling reservation API call with token:', token);
      const response = await cancelReservation(courtName, token);
      console.log('Cancel reservation response:', response); // Debug log
      setReservations((prev) => {
        const newReservations = { ...prev };
        delete newReservations[courtName];
        return newReservations;
      });
      updateCourtSeats(courtName, response.remaining_seats);
      Alert.alert('Unjoined successfully', `Remaining seats: ${response.remaining_seats}`);
    } catch (error) {
      console.error('Error unjoining court:', error); // Debug log
      Alert.alert('Error', 'Unable to unjoin');
    }
  };

  const renderCourt = ({ item }: { item: { name: string, location: string, available_seats: number, image: string } }) => (
    <View style={styles.courtContainer}>
      <Image source={{ uri: item.image }} style={styles.courtImage} />
      <View style={styles.courtDetails}>
        <Text style={styles.courtName}>{item.name}</Text>
        <Text>{item.location}</Text>
        <Text>{item.available_seats} seats available</Text>
        {reservations[item.name] ? (
          <TouchableOpacity onPress={() => handleUnjoin(item.name)} style={styles.unjoinButton}>
            <Text style={styles.unjoinButtonText}>Unjoin</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => handleJoin(item.name)} style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={courts}
        renderItem={renderCourt}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={<Text style={styles.title}>Courts</Text>}
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
  courtDetails: {
    flex: 1,
    padding: 16,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
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
  unjoinButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginTop: 8,
  },
  unjoinButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PlayPointsScreen;