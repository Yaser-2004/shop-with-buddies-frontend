// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { socket } from '@/lib/socket';
import axios from 'axios';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [roomCode, setRoomCode] = useState(localStorage.getItem("roomCode") || null);
  const [sharedCart, setSharedCart] = useState([]);
  const [users, setUsers] = useState([]); 
  const [personalCart, setPersonalCart] = useState([]);
  const [products, setProducts] = useState([]);

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

  // useEffect(() => {
  //   if (!socket || !user || !roomCode) return;

  //   // Emit join-room again on initial load / reconnect
  //   socket.emit("join-room", {
  //     roomCode,
  //     userId: user._id,
  //   });
  // }, [socket, user, roomCode]);


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
      setUsers,
      products,
      setProducts,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
