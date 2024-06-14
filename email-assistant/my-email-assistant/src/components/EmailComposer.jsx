import React, { useState } from "react";
import { Box, Input, Textarea, Button, VStack, Text } from "@chakra-ui/react";
import axios from "axios";

const EmailComposer = ({ onGenerate, generatedEmail, auth }) => {
  const [prompt, setPrompt] = useState("");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);

  const handleGenerate = () => {
    onGenerate(prompt);
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await axios.post("http://localhost:5003/send-email", {
        accessToken: auth.access_token,
        to: recipient,
        subject: subject,
        body: generatedEmail,
      });
      setSendSuccess(true);
    } catch (error) {
      console.error("Error sending email:", error);
      setSendSuccess(false);
    }
    setIsSending(false);
  };

  return (
    <Box>
      <VStack spacing={4}>
        <Input
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button onClick={handleGenerate}>Generate Email</Button>
        {generatedEmail && (
          <>
            <Box p={4} mt={4} borderWidth={1} borderRadius="md">
              <Text>{generatedEmail}</Text>
            </Box>
            <Input
              placeholder="Recipient Email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Button onClick={handleSend} isLoading={isSending}>
              Send Email
            </Button>
            {sendSuccess !== null && (
              <Text>
                {sendSuccess
                  ? "Email sent successfully!"
                  : "Failed to send email."}
              </Text>
            )}
          </>
        )}
      </VStack>
    </Box>
  );
};

export default EmailComposer;
