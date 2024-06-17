import React from "react";
import {
  Box,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = ({ handleLogout }) => {
  const { toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");

  return (
    <Box bg={bgColor} px={4} py={2} boxShadow="md">
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Link to="/">
            <Button colorScheme="teal" variant="ghost">
              Home
            </Button>
          </Link>
          <Link to="/nutrition-tracker">
            <Button colorScheme="teal" variant="ghost" ml={4}>
              Nutrition Tracker
            </Button>
          </Link>
          <Link to="/calendar">
            <Button colorScheme="teal" variant="ghost" ml={4}>
              Calendar / Schedule Events
            </Button>
          </Link>
          <Link to="/mail-manager">
            <Button colorScheme="teal" variant="ghost" ml={4}>
              Mail Manager
            </Button>
          </Link>
          <Link to="/general-chat">
            <Button colorScheme="teal" variant="ghost" ml={4}>
              General Chat
            </Button>
          </Link>
          <Link to="/task-manager">
            <Button colorScheme="teal" variant="ghost" ml={4}>
              Task Manager
            </Button>
          </Link>
          <Link to="/mail-manager">
            <Button colorScheme="teal" variant="ghost" ml={4}>
              Mail Manager
            </Button>
          </Link>
        </Box>
        <Flex alignItems="center">
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={toggleColorMode}
            mr={4}
          >
            Toggle {useColorModeValue("Dark", "Light")}
          </Button>
          <Button colorScheme="red" variant="solid" onClick={handleLogout}>
            Logout
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
