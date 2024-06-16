import React, { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PromptRedirector = () => {
  const [inputText, setInputText] = useState("");
  const [prompt, setPrompt] = useState(
    "Provide a number from 1 to 7 based on the following text: "
  );
  const navigate = useNavigate();

  const handleRedirect = async () => {
    try {
      const response = await axios.post("http://localhost:5003/redirect", {
        prompt: `${prompt} ${inputText}`,
      });

      console.log(response.data.choice);

      const number = parseInt(response.data.choice);

      switch (number) {
        case 1:
          navigate("/fitness-manager");
          break;
        case 2:
          navigate("/task-manager");
          break;
        case 3:
          navigate("/news");
          break;
        case 4:
          navigate("/calendar");
          break;
        case 5:
          navigate("/messages");
          break;
        case 6:
          navigate("/settings");
          break;
        case 7:
          navigate("/profile");
          break;
        default:
          console.error("Invalid number received from API");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
        <Input
          placeholder="Enter your text here"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          mb={3}
        />
        <Button onClick={handleRedirect} colorScheme="blue">
          Submit
        </Button>
      </Box>
    </VStack>
  );
};

export default PromptRedirector;
