import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, RefreshControl, SafeAreaView } from 'react-native';
import { getGroupProducts, joinGroupPurchase } from '../services/api';

const GroupingScreen = () => {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const productsData = await getGroupProducts();
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  }, []);

  const handleJoin = async (productId) => {
    try {
      const response = await joinGroupPurchase(productId);
      if (response.success) {
        Alert.alert('Joined', 'You have successfully joined the group purchase!');
        fetchProducts();
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
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>${item.price}</Text>
            <Text style={styles.originalPrice}>${item.original_price}</Text>
            <Text style={styles.discountRate}>{discount.toFixed(0)}% OFF</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.participants}>
            {item.current_participants}/{item.total_needed} joined
          </Text>
          <TouchableOpacity style={styles.joinButton} onPress={() => handleJoin(item.id)}>
            <Text style={styles.joinButtonText}>Join Group</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Group Purchases</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E90FF']} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F5F5',
    textAlign: 'center',
  },
  productContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productDetails: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212121',
  },
  productDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
    marginRight: 8,
  },
  discountRate: {
    fontSize: 14,
    color: '#32CD32',
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#32CD32',
  },
  participants: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  joinButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#F5F5F5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupingScreen;