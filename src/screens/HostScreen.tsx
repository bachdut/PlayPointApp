// MobileApp/App/src/screens/HostScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HostScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host a Game</Text>
      {/* Add your hosting game UI here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HostScreen;