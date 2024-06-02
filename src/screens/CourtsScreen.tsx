// MobileApp/App/src/screens/CourtsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
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

  const renderCourt = ({ item }: { item: { name: string, location: string, available_seats: number, image: string } }) => (
    <View style={styles.courtContainer}>
      <Image source={{ uri: item.image }} style={styles.courtImage} />
      <View style={styles.courtDetails}>
        <Text style={styles.courtName}>{item.name}</Text>
        <Text>{item.location}</Text>
        <Text>{item.available_seats} seats available</Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
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
});

export default CourtsScreen;