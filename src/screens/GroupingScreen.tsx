// MobileApp/App/src/screens/GroupingScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getGroupProducts, joinGroupPurchase } from '../services/api';
import * as Progress from 'react-native-progress';

const GroupingScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getGroupProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Error', 'Failed to fetch products. Please try again later.');
      }
    };
    fetchProducts();
  }, []);

  const handleJoin = async (productId: string) => {
    try {
      const response = await joinGroupPurchase(productId);
      if (response.success) {
        Alert.alert('Joined', 'You have successfully joined the group purchase!');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error joining group purchase:', error);
      Alert.alert('Error', 'An error occurred while joining the group purchase.');
    }
  };

  const renderProduct = ({ item }) => {
    const progress = item.current_participants / item.total_needed;
    const discount = ((item.original_price - item.price) / item.original_price) * 100;

    return (
      <View style={styles.productContainer}>
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          <Text style={styles.originalPrice}>${item.original_price}</Text>
          <Text style={styles.discountRate}>{discount.toFixed(0)}% OFF</Text>
          <Progress.Bar progress={progress} width={200} color={'#FF5733'} />
          <Text style={styles.participants}>
            {item.current_participants}/{item.total_needed} ({(progress * 100).toFixed(0)}%)
          </Text>
          <TouchableOpacity style={styles.joinButton} onPress={() => handleJoin(item.id)}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.title}>Group Purchases</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  productContainer: {
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
  productImage: {
    width: 100,
    height: 100,
  },
  productDetails: {
    flex: 1,
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#666',
  },
  discountRate: {
    fontSize: 14,
    color: '#FF5733',
  },
  participants: {
    fontSize: 14,
    color: '#666',
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

export default GroupingScreen;