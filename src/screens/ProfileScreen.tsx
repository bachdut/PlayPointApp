import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import { fetchUserDetails, updateProfile } from '../services/api';
import CartContext from '../context/CartContext';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

interface ProfileScreenProps {
  token: string;
}

interface UserProfile {
  username: string;
  dateOfBirth: string;
  gender: string;
  healthDeclaration: string;
  email: string;
  phone: string;
  address: string;
  favoriteSports: string;
  skillLevel: string;
  sportRule: string;
  profilePicture: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ token }) => {
  const { cartItems } = useContext(CartContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalProfile, setOriginalProfile] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    dateOfBirth: '',
    gender: '',
    healthDeclaration: '',
    email: '',
    phone: '',
    address: '',
    favoriteSports: '',
    skillLevel: '',
    sportRule: '',
    profilePicture: '', // Added profilePicture
  });

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userDetails = await fetchUserDetails(token);
        setProfile(userDetails);
        setOriginalProfile(userDetails);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load user details:', error);
        setLoading(false);
      }
    };
    loadUserDetails();
  }, [token]);

  const handleSave = async () => {
    try {
      await updateProfile(token, profile);
      setOriginalProfile(profile);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleDiscard = () => {
    if (originalProfile) {
      setProfile(originalProfile);
    }
    setIsEditing(false);
  };

  const handleImagePick = () => {
    launchImageLibrary({}, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setProfile({ ...profile, profilePicture: uri });
      }
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF5733" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.imageContainer}>
        {profile.profilePicture ? (
          <Image source={{ uri: profile.profilePicture }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>150 x 150</Text>
        )}
        <TouchableOpacity onPress={handleImagePick}>
          <Text style={styles.addImageText}>ADD IMAGE</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Basic Info</Text>
      <ProfileField label="Username" value={profile.username} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, username: text })} />
      <ProfileField label="Date Of Birth" value={profile.dateOfBirth} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, dateOfBirth: text })} />
      <ProfileField label="Gender" value={profile.gender} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, gender: text })} />
      <ProfileField label="Health Declaration" value={profile.healthDeclaration} editable={false} />

      <Text style={styles.sectionTitle}>Contact Info</Text>
      <ProfileField label="Email" value={profile.email} editable={false} />
      <ProfileField label="Phone" value={profile.phone} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, phone: text })} />
      <ProfileField label="Address" value={profile.address} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, address: text })} />

      <Text style={styles.sectionTitle}>Preferences</Text>
      <ProfileField label="Favorite Sports" value={profile.favoriteSports} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, favoriteSports: text })} />
      <ProfileField label="Skill Level" value={profile.skillLevel} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, skillLevel: text })} />
      <ProfileField label="Sport Rule" value={profile.sportRule} editable={isEditing} onChangeText={(text) => setProfile({ ...profile, sportRule: text })} />

      {isEditing ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleDiscard}>
            <Text style={styles.buttonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const ProfileField = ({ label, value, editable, onChangeText }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {editable ? (
      <TextInput style={styles.fieldInput} value={value} onChangeText={onChangeText} />
    ) : (
      <Text style={styles.fieldValue}>{value}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ccc',
    textAlign: 'center',
    lineHeight: 150,
    fontSize: 18,
  },
  addImageText: {
    color: '#FF5733',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fieldLabel: {
    fontSize: 16,
    color: '#333',
  },
  fieldValue: {
    fontSize: 16,
    color: '#666',
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileScreen;