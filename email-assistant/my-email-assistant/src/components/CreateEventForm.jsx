import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  Input,
  useColorModeValue,
  useToast,
  Textarea,
  Flex,
} from "@chakra-ui/react";
import DateTimePicker from "./DateTimePicker";
import axios from "axios";

const CreateEventForm = () => {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [attendees, setAttendees] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      summary,
      description,
      startTime,
      duration,
      attendees: attendees.split(","),
    };

    try {
      console.log("Creating event with data:", data);
      const response = await axios.post(
        "http://localhost:5003/create-event",
        data
      );
      console.log("Create Event Response:", response.data);
      toast({
        title: "Event created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Clear form fields after successful submission
      setSummary("");
      setDescription("");
      setStartTime("");
      setDuration("");
      setAttendees("");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const inputBgColor = useColorModeValue("white", "gray.800");
  const inputBorderColor = useColorModeValue("gray.200", "gray.600");
  const inputTextColor = useColorModeValue("gray.700", "gray.300");
  const buttonBgColor = useColorModeValue("blue.500", "blue.300");
  const buttonTextColor = useColorModeValue("white", "gray.800");

  return (
    <Box
      mt={4}
      borderWidth={1}
      borderRadius="md"
      p={4}
      bg={inputBgColor}
      boxShadow="md"
      margin="18px"
    >
      <form onSubmit={handleSubmit}>
        <Flex direction="row" justifyContent="space-between">
          <VStack
            align="stretch"
            spacing={4}
            w="80%"
            pr={8}
            borderRight="1px solid"
            borderRightColor={inputBorderColor}
          >
            <Text fontSize="2xl" mb={4} fontWeight="bold">
              Create Event
            </Text>
            <Input
              placeholder="Summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              bg={inputBgColor}
              borderColor={inputBorderColor}
              color={inputTextColor}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              bg={inputBgColor}
              borderColor={inputBorderColor}
              color={inputTextColor}
              resize="vertical" // Prevent resizing by the user
              minH="80px" // Set a minimum height
              css={{
                height: "auto", // Allow the height to adjust based on content
                overflow: "hidden", // Hide overflow to avoid scrollbars
                paddingTop: "8px", // Adjust padding for better alignment
                paddingBottom: "8px",
                lineHeight: "base", // Match the line height of input text
                boxShadow: "none", // Remove default box shadow
                transition: "height 0.2s", // Smooth transition for height changes
                "&:focus": {
                  borderColor: "blue.400", // Adjust focus color if needed
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  // Insert newline without submitting form
                  setDescription(description + "\n");
                }
              }}
            />

            <Input
              placeholder="Duration (in hours)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              bg={inputBgColor}
              borderColor={inputBorderColor}
              color={inputTextColor}
            />
            <Input
              placeholder="Attendees (comma-separated emails)"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              bg={inputBgColor}
              borderColor={inputBorderColor}
              color={inputTextColor}
            />

            <Button
              type="submit"
              bg={buttonBgColor}
              color={buttonTextColor}
              _hover={{ bg: buttonBgColor, opacity: 0.8 }}
              width="40%"
              minWidth="200px"
              alignSelf={"center"}
            >
              Create Event
            </Button>
          </VStack>
          <Flex direction="column">
            <Text fontSize="2xl" mb={4} fontWeight="bold">
              Choose Event Time
            </Text>
            <DateTimePicker
              selectedDate={startTime}
              onChange={(date) => setStartTime(date)}
              w="20%"
            />
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};

export default CreateEventForm;
