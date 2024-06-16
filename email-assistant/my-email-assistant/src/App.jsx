import React, { useState } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";
import ChatWindow from "./components/ChatWindow";
import StyledLogin from "./components/StyledLogin";
import FitnessManager from "./components/FitnessManager";
import EmailComposer from "./components/EmailComposer";
import EmailList from "./components/EmailList";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import axios from "axios";
import ToDoList from "./components/ToDoList";
import PromptRedirector from "./components/PromptRedirecter";

const App = () => {
  const [auth, setAuth] = useState(null);
  const [emails, setEmails] = useState([]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [userName, setUserName] = useState(null);

  const handleLogin = (authData, username) => {
    setAuth(authData);

    // make username capitalized
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    username = capitalize(username);

    setUserName(username);
    console.log("Logged in with auth data:", authData, userName);
  };

  const handleLogout = () => {
    setAuth(null);
    setUserName(null);
    console.log("Logged out");
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
            <>
              <Navbar handleLogout={handleLogout} />
              <Routes>
                <Route path="/" element={<HomePage username={userName} />} />
                <Route
                  path="/prompt-redirecter"
                  element={<PromptRedirector />}
                />
                <Route path="/nutrition-tracker" element={<FitnessManager />} />
                <Route path="/general-chat" element={<ChatWindow />} />
                <Route path="task-manager" element={<ToDoList />} />
                <Route
                  path="/mail-manager"
                  element={
                    <>
                      <EmailComposer
                        onGenerate={handleGenerate}
                        generatedEmail={generatedEmail}
                      />
                      <EmailList emails={emails} />
                    </>
                  }
                />
              </Routes>
            </>
          ) : (
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
