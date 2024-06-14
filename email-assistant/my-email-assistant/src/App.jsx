import React, { useState } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";
import ChatWindow from "./components/ChatWindow";
import StyledLogin from "./components/StyledLogin";
import FitnessManager from "./components/FitnessManager";
import EmailComposer from "./components/EmailComposer";
import EmailList from "./components/EmailList";
import HomePage from "./components/HomePage";
import axios from "axios";

const App = () => {
  const [auth, setAuth] = useState(null);
  const [emails, setEmails] = useState([]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [userName, setUserName] = useState(null);

  const handleLogin = (authData, username) => {
    setAuth(authData);

    // make usrname capitalised
    function capitalise(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    username = capitalise(username);

    setUserName(username);
    console.log("Logged in with auth data:", authData, userName);
  };

  const handleGenerate = async (prompt) => {
    try {
      const response = await axios.post(
        "http://localhost:5003/generate-email",
        {
          prompt,
        }
      );
      setGeneratedEmail(response.data.text);
    } catch (error) {
      console.error(
        "Error generating email:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <ChakraProvider>
      <Router>
        <Box>
          {auth ? (
            <Routes>
              <Route path="/" element={<HomePage username={userName} />} />
              <Route path="/fitness-manager" element={<FitnessManager />} />
              <Route
                path="/calendar-scheduling"
                element={
                  <EmailComposer
                    onGenerate={handleGenerate}
                    generatedEmail={generatedEmail}
                  />
                }
              />
              <Route path="/nutrition-tracker" element={<FitnessManager />} />
              <Route path="/weather" element={<ChatWindow />} />
              <Route path="/news" element={<ChatWindow />} />
              <Route
                path="/email-composer"
                element={
                  <EmailComposer
                    onGenerate={handleGenerate}
                    generatedEmail={generatedEmail}
                  />
                }
              />
              <Route
                path="/email-list"
                element={<EmailList emails={emails} />}
              />
              {/* Add other routes here */}
            </Routes>
          ) : (
            // <GoogleOAuthProvider clientId="701574296601-kd5v8akn6qb5iat85d666oatjqicf2t7.apps.googleusercontent.com">
            //   <Login onLogin={handleLogin} />
            // </GoogleOAuthProvider>
            <GoogleOAuthProvider clientId="701574296601-kd5v8akn6qb5iat85d666oatjqicf2t7.apps.googleusercontent.com">
              <StyledLogin onLogin={handleLogin} />
            </GoogleOAuthProvider>
          )}
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
