import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import CartContext from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotal = () => {
      const total = cartItems.reduce((sum, item) => sum + item.price, 0);
      setTotalAmount(total);
    };
    calculateTotal();
  }, [cartItems]);

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    Alert.alert('Removed', 'Item removed from cart');
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cart</Text>
      </View>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>Your cart is empty</Text>}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Amount: ${totalAmount.toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
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
    flexGrow: 1,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#FF6F00',
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#FF5733',
    padding: 8,
    borderRadius: 20,
  },
  removeButtonText: {
    color: '#F5F5F5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 18,
    marginTop: 40,
  },
  totalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#F5F5F5',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;