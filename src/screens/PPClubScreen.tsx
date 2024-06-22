// MobileApp/App/src/screens/PPClubScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { getPPClubProducts, buyProduct } from '../services/api';

const PPClubScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getPPClubProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching PP Club products:', error);
        Alert.alert('Error', 'Failed to fetch products. Please try again later.');
      }
    };
    fetchProducts();
  }, []);

  const handleBuy = async (productId: string) => {
    const userId = '123'; // Replace this with the actual user ID obtained from button click or user context
    try {
      const response = await buyProduct(productId, userId);
      if (response.success) {
        Alert.alert('Purchased', 'The product has been added to your Cart!');
      } else {
        Alert.alert('Error', response.message);
      }
    } catch (error) {
      console.error('Error purchasing product:', error);
      Alert.alert('Error', 'An error occurred while purchasing the product.');
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(item.id)}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.title}>PP Club Products</Text>}
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
  buyButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 25,
  },
  buyButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PPClubScreen;