const API_URL = 'http://127.0.0.1:8888'; // Adjust if your backend is hosted elsewhere

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