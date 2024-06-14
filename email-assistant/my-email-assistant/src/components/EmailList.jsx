import React, { useState, useEffect } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import axios from "axios";

const EmailList = ({ auth }) => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5003/fetch-emails", {
        params: { accessToken: auth.access_token },
      });
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
            <Box key={index} borderWidth={1} borderRadius="md" p={2}>
              <Text fontWeight="bold">{email.snippet}</Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default EmailList;