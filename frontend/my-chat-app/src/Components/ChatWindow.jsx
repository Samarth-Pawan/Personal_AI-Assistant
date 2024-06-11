import React, { useState } from "react";
import { Box, Input, Button, VStack, HStack, Text } from "@chakra-ui/react";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Here, you would also call the backend API to get a response from the AI
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        overflowY="auto"
        height="400px"
      >
        {messages.map((msg, index) => (
          <HStack
            key={index}
            justify={msg.sender === "user" ? "flex-end" : "flex-start"}
          >
            <Box
              bg={msg.sender === "user" ? "blue.500" : "gray.500"}
              color="white"
              p={2}
              borderRadius="md"
            >
              <Text>{msg.text}</Text>
            </Box>
          </HStack>
        ))}
      </Box>
      <HStack>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <Button onClick={sendMessage}>Send</Button>
      </HStack>
    </VStack>
  );
};

export default ChatWindow;
