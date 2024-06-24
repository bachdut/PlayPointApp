// src/context/CartContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCartItems = async () => {
      const storedCartItems = await AsyncStorage.getItem('cart');
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }
    };
    loadCartItems();
  }, []);

  const addToCart = (item: CartItem) => {
    const updatedCartItems = [...cartItems, item];
    setCartItems(updatedCartItems);
    AsyncStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  const removeFromCart = (id: number) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    AsyncStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;