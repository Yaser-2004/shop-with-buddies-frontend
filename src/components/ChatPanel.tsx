import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { socket } from '@/lib/socket'; // make sure your socket is exported from a shared file
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
  // const { username, roomCode } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const { user } = useAppContext();

  const toggleChat = () => setIsOpen(!isOpen);
  const bottomRef = useRef(null);

  const roomCode = localStorage.getItem('roomCode') || '';

  useEffect(() => {
    if (!roomCode || !user) return;

    const handleConnect = () => {
      console.log("Connected:", socket.id);

      socket.emit("join-room", {
        roomCode,
        userId: user._id, // ✅ correct
      });
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("receive-message", (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on("message-updated", (updatedMsg) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === updatedMsg.id
            ? { ...msg, ...updatedMsg }
            : msg
        )
      );
    });

    socket.on("search-results", (data) => {
      setMessages(prev => [
        ...prev,
        {
          sender: "System",
          type: "product_results",
          products: data.products,
          timestamp: new Date().toISOString(),
        }
      ]);
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive-message");
      socket.off("message-updated");
      socket.off("search-results");
    };
  }, [roomCode, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      id: Date.now(), // ✅ unique id
      sender: user?.firstName || 'Anonymous',
      text: input,
      timestamp: new Date().toISOString(),
    };

    // Emit message to server
    socket.emit('send-message', { roomCode, message: messageData });

    // Add to local state immediately
    // setMessages(prev => [...prev, messageData]);

    setInput('');
  };

  const handleSearch = (metadata) => {
    socket.emit('search-products', { roomCode, metadata });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
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
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
              <span className="font-semibold">Room Chat</span>
              <button onClick={toggleChat}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === user?.firstName ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${msg.sender === user?.firstName
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                      }`}
                  >
                    <p className="text-xs font-semibold mb-1">{msg.sender}</p>

                    {/* Normal message */}
                    {msg.type !== "product_results" && (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    )}

                    {/* 🔥 Search button */}
                    {msg.intent === "product_search" && (
                      <button
                        onClick={() => handleSearch(msg.metadata)}
                        className="mt-2 px-2 py-1 text-xs bg-green-500 text-white rounded"
                      >
                        Search Products
                      </button>
                    )}

                    {/* 🔥 Product results */}
                    {msg.type === "product_results" && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {msg.products.map((p, i) => (
                          <Link to={`/product/${p._id}`} key={i} className="bg-white text-black text-xs p-2 rounded shadow">
                            <img src={p.image} className="w-full h-16 object-cover rounded" />
                            <div className="font-semibold mt-1">{p.title}</div>
                            <div>₹{p.price}</div>
                          </Link>
                        ))}
                      </div>
                    )}
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
                className="flex-1 border text-black rounded-l px-3 py-2 text-sm outline-none"
                placeholder="Send a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-r text-sm"
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
