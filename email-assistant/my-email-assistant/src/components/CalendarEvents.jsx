import React, { useState, useEffect } from "react";
import { Button, Box, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import CreateEventForm from "./CreateEventForm";

const CalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (numEvents) => {
    console.log(numEvents);
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5003/fetch-events", {
        numEvents: numEvents,
      });
      console.log("Fetch Events Response:", response.data);
      // Handle response.data based on your requirements
      // Example: Update state with events received from the backend
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Handle error state or display an error message
    }
    setIsLoading(false);
  };

  return (
    <>
      <Box margin="18px" borderWidth={1} borderRadius="md" p={4}>
        <Text fontSize="xl" mb={4}>
          Upcoming Events
        </Text>
        <Button mt={4} colorScheme="blue" onClick={() => fetchEvents(5)}>
          Refresh Upcoming Events
        </Button>
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
      </Box>

      <Box margin="18px" borderWidth={1} borderRadius="md" p={4}>
        <CreateEventForm />
      </Box>
    </>
  );
};

export default CalendarEvents;
