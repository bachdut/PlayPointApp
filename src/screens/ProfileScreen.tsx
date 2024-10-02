import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchUserDetails, updateProfile, logoutUser } from '../services/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = ({ token }) => {
  const navigation = useNavigation();
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    loadUserDetails();
  }, [token]);

  const loadUserDetails = async () => {
    try {
      const userDetails = await fetchUserDetails(token);
      setProfile(userDetails);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load user details:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(token, profile);
      setIsEditing(false);
      // Optionally reload user details to confirm changes
      loadUserDetails();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);
    loadUserDetails(); // Reload original details
  };

  const handleLogout = async () => {
    try {
      await logoutUser(token);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleImagePick = () => {
    launchImageLibrary({}, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfile({ ...profile, profilePicture: response.assets[0].uri });
      }
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setProfile({ ...profile, dateOfBirth: date.toISOString().split('T')[0] });
    hideDatePicker();
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.imageContainer}>
          {profile.profilePicture ? (
            <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder} />
          )}
          {isEditing && (
            <TouchableOpacity onPress={handleImagePick}>
              <Text style={styles.addImageText}>ADD IMAGE</Text>
            </TouchableOpacity>
          )}
        </View>

        <Section title="Basic Info">
          <InfoItem label="Username" value={profile.username} isEditing={isEditing} onChangeText={(text) => setProfile({ ...profile, username: text })} />
          <InfoItem label="Date Of Birth" value={profile.dateOfBirth} isEditing={isEditing} onPress={showDatePicker} />
          <InfoItem label="Gender" value={profile.gender} isEditing={isEditing} onChangeText={(text) => setProfile({ ...profile, gender: text })} />
          <InfoItem label="Health Declaration" value={profile.healthDeclaration ? 'true' : 'false'} isEditing={false} />
        </Section>

        <Section title="Contact Info">
          <InfoItem label="Email" value={profile.email} isEditing={false} />
          <InfoItem label="Phone" value={profile.phone} isEditing={isEditing} onChangeText={(text) => setProfile({ ...profile, phone: text })} />
          <InfoItem label="Address" value={profile.address} isEditing={isEditing} onChangeText={(text) => setProfile({ ...profile, address: text })} />
        </Section>

        <Section title="Preferences">
          <InfoItem label="Favorite Sports" value={profile.favoriteSports} isEditing={isEditing} onChangeText={(text) => setProfile({ ...profile, favoriteSports: text })} />
          <InfoItem label="Skill Level" value={profile.skillLevel} isEditing={isEditing} onChangeText={(text) => setProfile({ ...profile, skillLevel: text })} />
          <InfoItem label="Sport Rule" value={profile.sportRule} isEditing={isEditing} onChangeText={(text) => setProfile({ ...profile, sportRule: text })} />
        </Section>

        <View style={styles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleDiscard}>
                <Text style={styles.buttonText}>Discard</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoItem = ({ label, value, isEditing, onChangeText, onPress }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    {isEditing ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onPressIn={onPress}
      />
    ) : (
      <Text style={styles.infoValue}>{value || 'Not provided'}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#e1e1e1',
  },
  addImageText: {
    color: '#FF5733',
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    fontSize: 16,
    color: '#666',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;