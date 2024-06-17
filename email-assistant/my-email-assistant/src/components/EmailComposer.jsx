import React, { useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  VStack,
  Text,
  Heading,
  Alert,
  AlertIcon,
  Container,
  useToast,
  Divider,
} from "@chakra-ui/react";
import axios from "axios";

const EmailComposer = ({ onGenerate, generatedEmail, auth }) => {
  const [prompt, setPrompt] = useState("");
  const [recipient, setRecipient] = useState("");
  const [cc, setCC] = useState("");
  const [bcc, setBCC] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(null);
  const toast = useToast();

  const handleGenerate = () => {
    onGenerate(prompt);
  };

  const handleSend = async () => {
    console.log(
      "Sending email...",
      auth,
      recipient,
      cc,
      bcc,
      subject,
      generatedEmail
    );
    setIsSending(true);
    try {
      const payload = {
        accessToken: auth.access_token,
        to: recipient,
        cc: cc,
        bcc: bcc,
        subject: subject,
        body: generatedEmail,
      };
      console.log("Request Payload:", payload); // Logging the request payload

      await axios.post("http://localhost:5003/send-email", {
        accessToken: auth.access_token,
        to: recipient,
        cc: cc,
        bcc: bcc,
        subject: subject,
        body: generatedEmail,
      });
      setSendSuccess(true);
      toast({
        title: "Email sent.",
        description: "Your email has been sent successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      setSendSuccess(false);
      toast({
        title: "Error.",
        description: "Failed to send email.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsSending(false);
  };

  return (
    <Container maxW="container.md" p={4}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center">
          Email Composer
        </Heading>
        <Input
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          size="lg"
        />
        <Button onClick={handleGenerate} colorScheme="teal" size="lg">
          Generate Email
        </Button>
        {generatedEmail && (
          <>
            <Box p={4} mt={4} borderWidth={1} borderRadius="md" bg="gray.50">
              <Text>{generatedEmail}</Text>
            </Box>
            <Divider />
            <Input
              placeholder="Recipient Email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              size="lg"
            />
            <Input
              placeholder="Carbon Copy: CC"
              value={cc}
              onChange={(e) => setCC(e.target.value)}
              size="lg"
            />
            <Input
              placeholder="Blind Carbon Copy: BCC"
              value={bcc}
              onChange={(e) => setBCC(e.target.value)}
              size="lg"
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              size="lg"
            />
            <Button
              onClick={handleSend}
              colorScheme="teal"
              size="lg"
              isLoading={isSending}
            >
              Send Email
            </Button>
            {sendSuccess !== null && (
              <Alert status={sendSuccess ? "success" : "error"} mt={4}>
                <AlertIcon />
                {sendSuccess
                  ? "Email sent successfully!"
                  : "Failed to send email."}
              </Alert>
            )}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default EmailComposer;
