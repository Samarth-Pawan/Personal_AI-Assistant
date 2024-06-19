import React from "react";
import { Flex, Box, SimpleGrid, Text, Link, VStack } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  IoFitness,
  IoCalendar,
  IoNutrition,
  IoCloudy,
  IoChatbubbleEllipses,
  IoMail,
  IoCalendarClear,
} from "react-icons/io5";

const HomePage = ({ username }) => {
  const features = [
    { name: "Mail Manager", path: "/mail-manager", icon: IoMail },
    {
      name: "Calendar Scheduling",
      path: "/calendar-scheduling",
      icon: IoCalendar,
    },
    {
      name: "Nutrition Tracker",
      path: "/nutrition-tracker",
      icon: IoNutrition,
    },
    { name: "Task Manager", path: "/task-manager", icon: IoCloudy },
    { name: "General Chat", path: "/general-chat", icon: IoChatbubbleEllipses },
    { name: "Schedule Events", path: "/calendar", icon: IoCalendarClear },
  ];

  return (
    <Flex
      p={5}
      direction="column"
      // justifyContent="center"
      alignItems="center"
      h="100vh"
    >
      {username && (
        <Text
          as="h1"
          fontSize="4xl"
          textAlign="center"
          mb={6}
          fontWeight="bold"
          bgGradient="linear(to-r, teal.400, blue.500)"
          bg-clip="text"
          //   bg="gray.200"
          p={4}
          borderRadius="lg"
          w="100%"
        >
          Welcome, {username}!
        </Text>
      )}
      <SimpleGrid columns={{ sm: 2, md: 3 }} spacing={10} w="100%" mt="100px">
        {features.map((feature, index) => (
          <Link
            as={RouterLink}
            to={feature.path}
            key={index}
            style={{ textDecoration: "none" }}
            minWidth="25%"
          >
            <Box
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              //   _hover={{ shadow: "lg", backgroundColor: "gray.50" }}
              textAlign="center"
              _hover={{
                shadow: "lg",
                background: "linear-gradient(to right, #26A69A, #119DA4)",
                "& > .text": {
                  transition: "opacity 0.3s ease",
                  opacity: 1,
                },
              }}
            >
              <VStack>
                <feature.icon size="50px" />
                <Text fontSize="xl">{feature.name}</Text>
              </VStack>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default HomePage;
