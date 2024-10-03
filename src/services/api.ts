const API_URL = 'http://127.0.0.1:8888'; // Adjust if your backend is hosted elsewhere
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Court {
  id: number;
  name: string;
  location: string;
  available_seats: number;
  price: number;
  time_slots: string;
  image: string;
  category: string;
  level: string;
  players_joined: number;
}

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

export const logoutUser = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getCourts = async (): Promise<Court[]> => {
  try {
    const response = await fetch(`${API_URL}/courts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const courts: Court[] = await response.json();
    courts.forEach(court => {
      court.time_slots = JSON.parse(court.time_slots); // Parse the JSON-encoded time slots
    });
    return courts;
  } catch (error) {
    console.error('Error fetching courts:', error);
    throw error;
  }
};

export const makeReservation = async (gameId: number, token: string) => {
  try {
    console.log('Making reservation for game ID:', gameId); // Debug log
    const response = await fetch(`${API_URL}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ game_id: gameId }), // Ensure we're sending game_id
    });
    const data = await response.json();
    console.log('Reservation response data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error making reservation:', error);
    throw error;
  }
};

export const cancelReservation = async (gameId: number, token: string) => {
  try {
    console.log('Cancelling reservation for game ID:', gameId); // Debug log
    const response = await fetch(`${API_URL}/delete-reservation`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ game_id: gameId }), // Use game_id instead of court_name
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

export const getCourtDetails = async (courtId: string, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/court-details/${courtId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching court details:', error);
    throw error;
  }
};


export const getAvailableTimeSlots = async (courtId: number, date: string) => {
  try {
    const response = await fetch(`${API_URL}/court/${courtId}/available-times?date=${date}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching available time slots: ${errorText}`);
    }

    const data = await response.json();
    console.log('Fetched available time slots:', data); 
    return data.available_slots;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
};

// Function to create a game
export const createGame = async (courtId: number, startTime: string, endTime: string, token: string) => {
  try {
    const response = await fetch(`${API_URL}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        court_id: courtId,
        start_time: startTime,
        end_time: endTime,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create game');
    }
    return data;
  } catch (error) {
    console.error('Error creating game:', error);
    throw error;
  }
};

// Function to fetch hosted games by the current user
export const getHostedGames = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/my-hosted-games`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching hosted games:', error);
    throw error;
  }
};

// Function to delete a hosted game by its ID
export const deleteHostedGame = async (gameId: number, token: string) => {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error deleting hosted game:', error);
    throw error;
  }
};

export const getOpenGames = async (
  token: string,
  location?: string,
  start_date?: string,
  end_date?: string,
  price?: string,
  level_of_players?: string
) => {
  try {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);
    if (price) params.append('price', price);
    if (level_of_players) params.append('level_of_players', level_of_players);

    const response = await fetch(`${API_URL}/open-games?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Error fetching open games:', error);
    throw error;
  }
};

export const getGameDetails = async (gameId: string, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/game-details/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

// Add the shuffle Teams API function
export const shuffleTeams = async (gameId: number, shuffleType: 'random' | 'level', token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/shuffle-game/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ shuffle_type: shuffleType }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error shuffling teams:', error);
    throw error;
  }
};

export const fetchChatMessages = async (gameId: number, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/game/${gameId}/chat`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch messages. Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched messages:', data);
    return data;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
};

export const sendMessage = async (gameId: number, message: string, token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/game/${gameId}/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error(`Failed to send message. Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Sent message response:', data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to share game event 
export const createShareLink = async (gameId: number, token: string): Promise<{ share_link: string }> => {
  const response = await fetch(`${API_URL}/create-share-link/${gameId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`, // Use the passed token directly
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to create share link');
  }
  return response.json();
};

export const fetchSharedGame = async (uniqueId: string) => {
  const response = await fetch(`${API_URL}/shared-game/${uniqueId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shared game details');
  }
  return response.json();
};
