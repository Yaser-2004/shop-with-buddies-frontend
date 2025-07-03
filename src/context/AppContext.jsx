// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [roomCode, setRoomCode] = useState(localStorage.getItem("roomCode") || null);
  const [sharedCart, setSharedCart] = useState([]);
  const [users, setUsers] = useState([]); 
  const [personalCart, setPersonalCart] = useState([]);

  // ✅ New: user & token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ✅ On app mount, restore from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      username,
      setUsername,
      roomCode,
      setRoomCode,
      sharedCart,
      setSharedCart,
      personalCart,
      setPersonalCart,
      user,
      setUser,
      token,
      setToken,
      users,
      setUsers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
