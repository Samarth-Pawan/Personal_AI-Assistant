import React, { useState } from "react";
import { Box, Input, Button, VStack, HStack, Text } from "@chakra-ui/react";
import axios from "axios";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim()) {
      // Add user message to state
      const newUserMessage = { text: input, sender: "user" };
      setMessages([...messages, newUserMessage]);
      setInput("");

      try {
        // Send user message to backend
        const response = await axios.post("http://localhost:5003", {
          message: input,
        });

        // Add AI response to state
        const aiResponse = { text: response.data.response, sender: "ai" };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
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
        boxShadow="md"
      >
        {messages.map((msg, index) => (
          <HStack
            key={index}
            justify={msg.sender === "user" ? "flex-end" : "flex-start"}
            mb={2}
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
          variant="filled"
          size="md"
        />
        <Button onClick={sendMessage} colorScheme="blue">
          Send
        </Button>
      </HStack>
    </VStack>
  );
};

export default ChatWindow;
