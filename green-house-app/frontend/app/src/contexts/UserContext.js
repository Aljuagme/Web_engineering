// src/contexts/UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext(null);

// Create a custom provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const value = {
    user,
    setUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Create a custom hook for easy use of the context
export const useUser = () => useContext(UserContext);