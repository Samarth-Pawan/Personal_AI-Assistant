import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { Box, Input, Button, VStack, Heading } from "@chakra-ui/react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [openAiKey, setOpenAiKey] = useState("");

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
        onLogin({ access_token, id_token, openAiKey });
      } catch (error) {
        console.error("Login Failed:", error);
      }
    },
    flow: "auth-code",
    clientId:
      "701574296601-kd5v8akn6qb5iat85d666oatjqicf2t7.apps.googleusercontent.com",
    redirectUri: "http://localhost:5173",
  });

  return (
    <Box>
      <Heading>Login</Heading>
      <VStack spacing={4}>
        <Input
          placeholder="OpenAI API Key"
          value={openAiKey}
          onChange={(e) => setOpenAiKey(e.target.value)}
        />
        <Button onClick={() => googleLogin()}>Login with Google</Button>
      </VStack>
    </Box>
  );
};

export default Login;
