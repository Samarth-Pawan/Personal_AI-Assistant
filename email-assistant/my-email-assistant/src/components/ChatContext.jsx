// ChatContext.js
import React, { createContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
