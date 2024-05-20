// MobileApp/App/src/screens/CourtsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../Navigation';
import { getCourts } from '../services/api';

type Props = StackScreenProps<RootStackParamList, 'Courts'>;

const CourtsScreen: React.FC<Props> = () => {
  const [courts, setCourts] = React.useState([]);

  React.useEffect(() => {
    const fetchCourts = async () => {
      try {
        const courtsData = await getCourts();
        setCourts(courtsData);
      } catch (error) {
        console.error('Error fetching courts:', error);
      }
    };
    fetchCourts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Courts</Text>
      {courts.map((court: { name: string, location: string, available_seats: number }, index) => (
        <View key={index} style={styles.courtContainer}>
          <Text style={styles.courtName}>{court.name}</Text>
          <Text style={styles.courtDetails}>{court.location}</Text>
          <Text style={styles.courtDetails}>{court.available_seats} seats available</Text>
        </View>
      ))}
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
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  courtName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  courtDetails: {
    fontSize: 16,
  },
});

export default CourtsScreen;