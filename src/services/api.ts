const API_URL = 'http://127.0.0.1:8888'; // Adjust if your backend is hosted elsewhere
import axios from 'axios';

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Sending login request:', { email, password });
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const getCourts = async () => {
  try {
    const response = await fetch(`${API_URL}/courts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching courts:', error);
    throw error;
  }
};

export const makeReservation = async (courtName: string, token: string) => {
  try {
    console.log('Making reservation for court:', courtName); // Debug log
    const response = await fetch(`${API_URL}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ court_name: courtName }),
    });
    const data = await response.json();
    console.log('Reservation response data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error making reservation:', error);
    throw error;
  }
};

export const cancelReservation = async (courtName: string, token: string) => {
  try {
    console.log('Cancelling reservation for court:', courtName); // Debug log
    const response = await fetch(`${API_URL}/delete-reservation`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ court_name: courtName }),
    });
    const data = await response.json();
    console.log('Cancel reservation response data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset email');
    }
    return data;
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const joinGroupPurchase = async (productId: string) => {
  try {
    const response = await fetch(`${API_URL}/join-group-purchase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error joining group purchase:', error);
    throw error;
  }
};

export const getPPClubProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/get-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching PP Club products:', error);
    throw error;
  }
};

export const buyProduct = async (productId: string, userId: string) => {
  try {
    const response = await fetch(`${API_URL}/buy-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId, user_id: userId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error purchasing product:', error);
    throw error;
  }
};

export const getGroupProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/get-group-products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching group products:', error);
    throw error;
  }
};

export const fetchUserDetails = async (token: string) => {
  const response = await fetch(`${API_URL}/user-details`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    console.error('Failed to fetch user details:', response.status, response.statusText); // Add this line
    throw new Error('Failed to fetch user details');
  }
  return response.json();
};

export const updateProfile = async (token: string, profileData: any) => {
  try {
    const formData = new FormData();

    for (const key in profileData) {
      if (key === 'profilePicture' && profileData[key]) {
        formData.append(key, {
          uri: profileData[key],
          type: 'image/jpeg',
          name: `${profileData.id}.jpg` // Use the user ID for the filename
        } as any);
      } else {
        formData.append(key, profileData[key]);
      }
    }

    const response = await axios.put(`${API_URL}/update-profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to update profile');
    }

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (token: string, file: any) => {
  try {
    const formData = new FormData();
    formData.append('profile_picture', {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    });

    const response = await axios.post(`${API_URL}/upload-profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to upload profile picture');
    }

    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};