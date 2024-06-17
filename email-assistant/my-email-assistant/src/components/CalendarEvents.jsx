import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Text,
  VStack,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import CreateEventForm from "./CreateEventForm";

const CalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEvents(5); // Fetch initial 5 events on component mount
  }, []);

  const fetchEvents = async (numEvents) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:5003/fetch-events", {
        numEvents: numEvents,
      });
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
        <Button
          mt={4}
          colorScheme="blue"
          onClick={() => fetchEvents(events.length + 5)} // Fetch additional 5 events
        >
          Refresh Upcoming Events
        </Button>
        {isLoading ? (
          <Box textAlign="center" mt={4}>
            <Spinner size="lg" color="blue.500" />
          </Box>
        ) : (
          <Grid
            templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
            gap={4}
            mt={4}
          >
            {events.map((event, index) => (
              <GridItem key={index} borderWidth={1} borderRadius="md" p={4}>
                <Text fontWeight="bold">{event.summary}</Text>
                <Text mt={2}>{event.start}</Text>
                {/* Additional information like attendees and description */}
                {event.attendees && (
                  <Text mt={2}>Attendees: {event.attendees.join(", ")}</Text>
                )}
                {event.description && (
                  <Text mt={2}>Description: {event.description}</Text>
                )}
              </GridItem>
            ))}
          </Grid>
        )}
      </Box>

      <Box margin="18px" borderWidth={1} borderRadius="md" p={4}>
        <CreateEventForm />
      </Box>
    </>
  );
};

export default CalendarEvents;
