import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";

const ToDoList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Low",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5003/tasks");
      setTasks(response.data.tasks);
      setCompletedTasks(response.data.completedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post("http://localhost:5003/tasks", newTask);
      const addedTask = response.data.task;
      setTasks([...tasks, addedTask]);
      setNewTask({ title: "", description: "", priority: "Low" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const completeTask = async (taskId) => {
    console.log("Adding task:", newTask, taskId);

    try {
      await axios.post(`http://localhost:5003/tasks/complete`, {
        taskId,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const generateTask = async (task) => {
    try {
      const prompt = `Generate a task with title: ${task.title}, description: ${task.description}, priority: ${task.priority}`;
      const response = await axios.post("http://localhost:5003/generate-task", {
        prompt,
      });
      return { ...task, ...response.data.task };
    } catch (error) {
      console.error("Error generating task:", error);
      return task; // Fallback to original task
    }
  };

  return (
    <Box p={5}>
      <Heading as="h1" size="xl" textAlign="center" mb={6}>
        To-Do List
      </Heading>
      <VStack spacing={4} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading as="h2" size="md" mb={4}>
            Add New Task
          </Heading>
          <Input
            placeholder="Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            mb={3}
          />
          <Input
            placeholder="Description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            mb={3}
          />
          <Input
            placeholder="Priority"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            mb={3}
          />
          <Button onClick={addTask} colorScheme="blue">
            Add Task
          </Button>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading as="h2" size="md" mb={4}>
            Tasks
          </Heading>
          {tasks.slice(0, 5).map((task) => (
            <HStack key={task._id} justify="space-between">
              <Checkbox onChange={() => completeTask(task.id)}>
                {task.title}
              </Checkbox>
              <Text>{task.description}</Text>
              <Text>{task.priority}</Text>
            </HStack>
          ))}
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading as="h2" size="md" mb={4}>
            Completed Tasks
          </Heading>
          {completedTasks.map((task) => (
            <HStack key={task.id} justify="space-between">
              <Text as="del">{task.title}</Text>
              <Text as="del">{task.description}</Text>
              <Text as="del">{task.priority}</Text>
            </HStack>
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

export default ToDoList;
