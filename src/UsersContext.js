import React, { createContext, useState } from "react";

export const UsersContext = createContext();

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([]);

  const addUser = (user) => {
    // user: { id, name, address, latitude, longitude }
    setUsers((prev) => [...prev, user]);
  };

  const clearUsers = () => setUsers([]);

  return (
    <UsersContext.Provider value={{ users, addUser, clearUsers }}>
      {children}
    </UsersContext.Provider>
  );
}

export default UsersContext;
