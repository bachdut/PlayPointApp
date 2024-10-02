import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import CartContext from '../context/CartContext';
import { getPPClubProducts } from '../services/api';

const PPClubScreen = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

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

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Added to Cart', 'The product has been added to your cart!');
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PP Club Products</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1E90FF',
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F5F5F5',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
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
    color: '#212121',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6F00',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#FF6F00',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#F5F5F5',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PPClubScreen;