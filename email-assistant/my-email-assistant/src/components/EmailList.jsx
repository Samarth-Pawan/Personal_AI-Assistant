import React, { useState, useEffect } from "react";
import { Button, Box, Text, VStack } from "@chakra-ui/react";
import axios from "axios";

const EmailList = ({ auth }) => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   fetchEmails();
  // }, []);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5003/fetch-emails");
      setEmails(response.data.messages);
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
    setIsLoading(false);
  };

  return (
    <Box mt={4} borderWidth={1} borderRadius="md" p={4}>
      <Text fontSize="xl" mb={4}>
        Emails
      </Text>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <VStack align="stretch" spacing={4}>
          {emails.map((email, index) => (
            <Box key={index} borderWidth={1} borderRadius="md" p={4}>
              <Text fontWeight="bold" fontSize="lg" mb={2}>
                {email.Subject}
              </Text>
              <Text mb={1}>{email.Snippet}</Text>
              <Text mb={1} fontSize="sm" color="gray.600">
                {email.Date}
              </Text>
              <Text mb={1} fontSize="sm" color="gray.600">
                {email.Sender}
              </Text>
              <Text>{email.Message_body}</Text>
            </Box>
          ))}
        </VStack>
      )}

      <Button mt={4} colorScheme="blue" onClick={fetchEmails}>
        Refresh Emails
      </Button>
    </Box>
  );
};

export default EmailList;
