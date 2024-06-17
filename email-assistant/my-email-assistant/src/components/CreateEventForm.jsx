import React, { useState } from "react";
import { Box, Text, VStack, Button, Input } from "@chakra-ui/react";
import axios from "axios";

const CreateEventForm = () => {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [attendees, setAttendees] = useState("");

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
      // Handle response.data based on your requirements
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <Box mt={4} borderWidth={1} borderRadius="md" p={4}>
      <Text fontSize="xl" mb={4}>
        Create Event
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack align="stretch" spacing={4}>
          <Input
            placeholder="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            placeholder="Start Time (YYYY-MM-DD HH:MM)"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            placeholder="Duration (in hours)"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Input
            placeholder="Attendees (comma-separated emails)"
            value={attendees}
            onChange={(e) => setAttendees(e.target.value)}
          />
          <Button type="submit">Create Event</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CreateEventForm;
