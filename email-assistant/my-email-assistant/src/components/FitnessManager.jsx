import React from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Flex,
  Text,
  CircularProgress,
  CircularProgressLabel,
  Divider,
} from "@chakra-ui/react";

const FitnessManager = () => {
  // Dummy data for nutrition info and calories
  const nutritionData = {
    caloriesGoal: 2000,
    caloriesConsumed: 1500,
    proteinGoal: 150,
    proteinConsumed: 100,
    carbsGoal: 300,
    carbsConsumed: 250,
    fatsGoal: 70,
    fatsConsumed: 60,
  };

  return (
    <Box p={5}>
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        Fitness Manager
      </Heading>

      {/* Nutrition Cards */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={6}>
        <GridItem colSpan={1}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="md" mb={4}>
              Nutrition Goals
            </Heading>
            <Flex justifyContent="space-between">
              <Text>Calories:</Text>
              <Text>{nutritionData.caloriesGoal} kcal</Text>
            </Flex>
            <Divider my={2} />
            <Flex justifyContent="space-between">
              <Text>Protein:</Text>
              <Text>{nutritionData.proteinGoal} g</Text>
            </Flex>
            <Divider my={2} />
            <Flex justifyContent="space-between">
              <Text>Carbs:</Text>
              <Text>{nutritionData.carbsGoal} g</Text>
            </Flex>
            <Divider my={2} />
            <Flex justifyContent="space-between">
              <Text>Fats:</Text>
              <Text>{nutritionData.fatsGoal} g</Text>
            </Flex>
          </Box>
        </GridItem>
        <GridItem colSpan={1}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="md" mb={4}>
              Nutrition Progress
            </Heading>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text>Calories Consumed:</Text>
              <CircularProgress
                value={
                  (nutritionData.caloriesConsumed /
                    nutritionData.caloriesGoal) *
                  100
                }
                color="green.400"
                size="80px"
              >
                <CircularProgressLabel>
                  {nutritionData.caloriesConsumed} kcal
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
            <Divider my={2} />
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text>Protein Consumed:</Text>
              <CircularProgress
                value={
                  (nutritionData.proteinConsumed / nutritionData.proteinGoal) *
                  100
                }
                color="blue.400"
                size="80px"
              >
                <CircularProgressLabel>
                  {nutritionData.proteinConsumed} g
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
            <Divider my={2} />
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text>Carbs Consumed:</Text>
              <CircularProgress
                value={
                  (nutritionData.carbsConsumed / nutritionData.carbsGoal) * 100
                }
                color="purple.400"
                size="80px"
              >
                <CircularProgressLabel>
                  {nutritionData.carbsConsumed} g
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
            <Divider my={2} />
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text>Fats Consumed:</Text>
              <CircularProgress
                value={
                  (nutritionData.fatsConsumed / nutritionData.fatsGoal) * 100
                }
                color="orange.400"
                size="80px"
              >
                <CircularProgressLabel>
                  {nutritionData.fatsConsumed} g
                </CircularProgressLabel>
              </CircularProgress>
            </Flex>
          </Box>
        </GridItem>
      </Grid>

      {/* Add more cards or components for workouts, progress tracking, etc. */}
    </Box>
  );
};

export default FitnessManager;
