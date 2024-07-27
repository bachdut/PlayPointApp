import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ShopScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Shop</Text>
      <Button title="Go to Grouping" onPress={() => navigation.navigate('Grouping')} />
      <Button title="Go to PPClub" onPress={() => navigation.navigate('PPClub')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default ShopScreen;