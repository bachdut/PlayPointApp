// MobileApp/App/src/screens/AboutScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About Us</Text>
      <Text style={styles.text}>
        Welcome to PlayPoint, the premier platform for connecting sports enthusiasts and organizing team activities. Our mission is to build communities, promote healthy living, and provide inclusive, enjoyable sports experiences for everyone.
      </Text>
      <Text style={styles.subtitle}>Our Vision:</Text>
      <Text style={styles.text}>
        To create a global network where sports unite people, enhance well-being, and foster lasting connections.
      </Text>
      <Text style={styles.subtitle}>Our Mission:</Text>
      <Text style={styles.text}>
        To deliver an intuitive platform that connects players of all skill levels, facilitating easy organization and participation in sports activities.
      </Text>
      <Text style={styles.subtitle}>Core Values:</Text>
      <Text style={styles.text}>
        • Community: Fostering a supportive and engaged sports network.{'\n'}
        • Inclusivity: Welcoming participants of all backgrounds and skill levels.{'\n'}
        • Health: Encouraging active, healthy lifestyles through regular sports engagement.{'\n'}
        • Enjoyment: Ensuring every sports encounter is fun and rewarding.
      </Text>
      <Text style={styles.subtitle}>Meet the Team</Text>
      <Text style={styles.text}>
        Our team consists of dedicated sports and technology professionals committed to enhancing your sports experience. We continually innovate to provide the best tools for organizing and enjoying sports activities.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingTop: 55, // Add padding to the top to account for the notch
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default AboutScreen;