// ChatWindow.js
import React, { useContext, useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  useColorMode,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import axios from "axios";
import ChatContext from "./ChatContext"; // Import your ChatContext

const ChatWindow = () => {
  const { messages, addMessage } = useContext(ChatContext); // Use ChatContext

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { colorMode } = useColorMode();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior (like form submission)
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const newUserMessage = { text: input, sender: "user" };
      addMessage(newUserMessage); // Add message to context
      setInput("");

      try {
        const response = await axios.post("http://localhost:5003/chat", {
          message: input,
        });

        const aiResponse = { text: response.data.response, sender: "ai" };
        addMessage(aiResponse); // Add AI response to context
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <VStack
      spacing={4}
      align="stretch"
      bg={useColorModeValue("gray.50", "gray.800")}
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      h="90vh"
    >
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        overflowY="auto"
        height="400px"
        boxShadow="md"
        bg={useColorModeValue("white", "gray.700")}
        h="100%"
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
              p={3}
              borderRadius="md"
              boxShadow="md"
              maxWidth="80%"
              position="relative"
              _after={
                msg.sender === "user"
                  ? {
                      content: `""`,
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: "10px 0 0 10px",
                      borderColor: `transparent transparent transparent ${useColorModeValue(
                        "teal.500",
                        "teal.500"
                      )}`,
                    }
                  : {
                      content: `""`,
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 0,
                      height: 0,
                      borderStyle: "solid",
                      borderWidth: "10px 10px 0 0",
                      borderColor: `transparent ${useColorModeValue(
                        "gray.200",
                        "gray.200"
                      )} transparent transparent`,
                    }
              }
            >
              <Text>{msg.text}</Text>
            </Box>
          </HStack>
        ))}
      </Box>
      <HStack spacing={4}>
        <Input
          onKeyDown={handleKeyPress}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          variant="filled"
          size="md"
          bg={useColorModeValue("gray.200", "gray.600")}
          _hover={{ bg: useColorModeValue("gray.300", "gray.500") }}
        />
        <IconButton
          onClick={sendMessage}
          colorScheme="blue"
          icon={<FiSend />}
          aria-label="Send message"
        />
      </HStack>
    </VStack>
  );
};

export default ChatWindow;
