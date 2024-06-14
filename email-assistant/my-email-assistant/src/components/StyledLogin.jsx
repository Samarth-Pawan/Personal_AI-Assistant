import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const StyledLogin = ({ onLogin }) => {
  const [openAiKey, setOpenAiKey] = useState("");
  //   const [userName, setUserName] = useState(null);
  const toast = useToast();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log("Google Login Success:", response);
      try {
        const { code } = response;

        const res = await axios.post("http://localhost:5003/auth/google", {
          code,
        });
        console.log("Google Login Success:", res);
        const { access_token, id_token } = res.data;

        // Fetch user profile information from Google
        const userInfoRes = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const { given_name } = userInfoRes.data;

        onLogin({ access_token, id_token, openAiKey }, given_name);
      } catch (error) {
        console.error("Login Failed:", error);
        toast({
          title: "Login Failed",
          description: "Please try again later.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    flow: "auth-code",
    clientId:
      "701574296601-kd5v8akn6qb5iat85d666oatjqicf2t7.apps.googleusercontent.com",
    redirectUri: "http://localhost:5173",
  });

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Welcome to Tinsanity!
      </Heading>
      {/* {userName && (
        <Text fontSize="lg" textAlign="center" mb={4}>
          Hello, {userName}!
        </Text>
      )} */}
      <VStack spacing={4}>
        <Input
          placeholder="Enter your OpenAI API Key"
          value={openAiKey}
          onChange={(e) => setOpenAiKey(e.target.value)}
        />
        <Button
          leftIcon={<FcGoogle />}
          colorScheme="teal"
          variant="outline"
          onClick={() => googleLogin()}
          width="full"
        >
          Login with Google
        </Button>
        <Text fontSize="sm" color="gray.500" textAlign="center">
          We'll never share your OpenAI API key.
        </Text>
      </VStack>
    </Box>
  );
};

export default StyledLogin;
