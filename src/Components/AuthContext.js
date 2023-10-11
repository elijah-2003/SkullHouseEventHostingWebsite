import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem('authenticated') === 'true'
  );

  const updateAuthenticated = (value) => {
    setAuthenticated(value);
    localStorage.setItem('authenticated', value);
  };

  return (
    <AuthContext.Provider value={{ authenticated, updateAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export {AuthContext, AuthProvider};