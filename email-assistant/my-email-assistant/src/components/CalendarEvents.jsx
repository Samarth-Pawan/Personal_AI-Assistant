import React, { useState, useEffect } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import CreateEventForm from "./CreateEventForm";

const CalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/fetch-events");
      console.log("Fetch Events Response:", response.data);
      // Handle response.data based on your requirements
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setIsLoading(false);
  };

  return (
    <Box mt={4} borderWidth={1} borderRadius="md" p={4}>
      <Text fontSize="xl" mb={4}>
        Upcoming Events
      </Text>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {events.map((event, index) => (
            <Box key={index} borderWidth={1} borderRadius="md" p={2}>
              <Text fontWeight="bold">{event.summary}</Text>
              <Text>{event.start}</Text>
            </Box>
          ))}
        </VStack>
      )}
      <CreateEventForm />
    </Box>
  );
};

export default CalendarEvents;
