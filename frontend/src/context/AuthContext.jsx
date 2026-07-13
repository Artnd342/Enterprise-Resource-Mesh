import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      // Instantly attach bearer authorization headers onto all future axios pipelines
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
    const { token: jwtToken, user: userProfile } = response.data;

    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userProfile));
    
    setToken(jwtToken);
    setUser(userProfile);
    return userProfile;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};