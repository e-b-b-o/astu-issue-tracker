import React, { createContext, useState, useEffect, useContext } from 'react';
import { ROLES } from '../utils/constants';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock token decoding/validation during demo phase
    if (token) {
      try {
        // Simplified mock decode logic
        const mockPayload = token === 'demo-student-token' ? { role: ROLES.STUDENT, name: 'Demo Student' } :
                            token === 'demo-staff-token' ? { role: ROLES.STAFF, name: 'Demo Staff' } :
                            token === 'demo-admin-token' ? { role: ROLES.ADMIN, name: 'Demo Admin' } : null;
        
        if (mockPayload) {
          setUser(mockPayload);
        } else {
          logout(); // Invalid token
        }
      } catch (err) {
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
