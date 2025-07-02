// src/context/AppContext.jsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [roomCode, setRoomCode] = useState(null);
  const [sharedCart, setSharedCart] = useState([]);
  const [personalCart, setPersonalCart] = useState([]);

  return (
    <AppContext.Provider value={{
      username,
      setUsername,
      roomCode,
      setRoomCode,
      sharedCart,
      setSharedCart,
      personalCart,
      setPersonalCart
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
