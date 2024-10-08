// MobileApp/App/src/screens/PlaceholderScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is a placeholder screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlaceholderScreen;