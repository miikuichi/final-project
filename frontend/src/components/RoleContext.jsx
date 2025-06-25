import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export function useRole() {
  return useContext(RoleContext);
}

export function RoleProvider({ children }) {
  const [role, setRole] = useState(() => {
    // Try to get from localStorage for persistence
    return localStorage.getItem('userRole') || '';
  });

  const loginAs = (newRole) => {
    setRole(newRole);
    localStorage.setItem('userRole', newRole);
  };

  const logout = () => {
    setRole('');
    localStorage.removeItem('userRole');
  };

  return (
    <RoleContext.Provider value={{ role, loginAs, logout }}>
      {children}
    </RoleContext.Provider>
  );
}
