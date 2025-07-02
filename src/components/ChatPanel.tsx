import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { socket } from '@/lib/socket'; // make sure your socket is exported from a shared file
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  // const { username, roomCode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);
  const bottomRef = useRef(null);

  const username = localStorage.getItem('username') || '';
  const roomCode = localStorage.getItem('roomCode') || '';

  useEffect(() => {
    if (!socket || !roomCode || !username) return;
    if (!socket.connected) socket.connect();

    // Join the room on socket connection
    // socket.emit('join-room', { roomCode, username });

    // Listen for incoming messages
    socket.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [roomCode, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      sender: username,
      text: input,
      timestamp: new Date().toISOString(),
    };

    // Emit message to server
    socket.emit('send-message', { roomCode, message: messageData });

    // Add to local state immediately
    setMessages(prev => [...prev, messageData]);

    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="w-80 h-[450px] bg-white rounded-lg shadow-xl flex flex-col"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-t-lg flex justify-between items-center">
              <span className="font-semibold">Room Chat</span>
              <button onClick={toggleChat}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-3 py-2 bg-pink-500 rounded-lg max-w-[80%] text-sm ${
                      msg.sender === username
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-2 border-t flex">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="flex-1 border rounded-l px-3 py-2 text-sm outline-none"
                placeholder="Send a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-r text-sm"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInterface;
