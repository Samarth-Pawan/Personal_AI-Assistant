const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const { mongoose } = require("mongoose");
const dotenv = require("dotenv").config();
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "sk-proj-YI3t0WADcvP2YaOzzBmvT3BlbkFJPEKLI2zyRzxeTcNkmhml",
});

const CLIENT_ID =
  "701574296601-kd5v8akn6qb5iat85d666oatjqicf2t7.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:5173";
const MONGO_URL =
  "mongodb+srv://samarthpawan:QYalU3cvQ1HdpME2@cluster0.pizurq1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

app.post("/auth/google", async (req, res) => {
  const { code } = req.body;
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(url, values);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json(error.response.data);
  }
});

app.post("/send-email", async (req, res) => {
  const { accessToken, to, subject, body } = req.body;
  const encodedMessage = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\n\r\n${body}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      { raw: encodedMessage },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json(error.response.data);
  }
});

app.get("/fetch-emails", async (req, res) => {
  const { accessToken } = req.query;

  try {
    const response = await axios.get(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json(error.response.data);
  }
});

app.post("/generate-email", async (req, res) => {
  const { prompt } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Generate a professional email based on the following prompt: ${prompt}`,
        },
      ],
      model: "gpt-3.5-turbo",
    });

    res.status(200).json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error(
      "Error generating email:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate email" });
  }
});

// this is where the chat server begins
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    // Send user message to OpenAI Chat API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: message }],
    });

    // Return AI response
    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error(
      "Error processing chat message:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to process message" });
  }
});

let tasks = [];
let completedTasks = [];
let taskIdCounter = 1;

app.use((req, res, next) => {
  req.taskId = taskIdCounter++;
  next();
});

app.get("/tasks", (req, res) => {
  res.json({ tasks, completedTasks });
});

app.post("/tasks", (req, res) => {
  const { title, description, priority } = req.body;

  const newTask = {
    id: Date.now(),
    title,
    description,
    priority,
  };
  tasks.push(newTask);
  res.json({ task: newTask });
});

app.post("/tasks/complete", (req, res) => {
  // console.log(req.body);
  const { taskId } = req.body;
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex > -1) {
    const completedTask = tasks.splice(taskIndex, 1)[0];
    completedTasks.push(completedTask);
    res.status(200).send("Task completed");
  } else {
    res.status(404).send("Task not found");
  }
});

app.post("/generate-task", async (req, res) => {
  const { prompt } = req.body;

  try {
    // Use OpenAI to generate task details based on the prompt
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
    });

    // Extract task details from OpenAI's response
    const generatedTask = {
      title: completion.choices[0].message.content.title,
      description: completion.choices[0].message.content.description,
      priority: completion.choices[0].message.content.priority,
    };

    res.status(200).json({ task: generatedTask });
  } catch (error) {
    console.error("Error generating task:", error);
    res.status(500).json({ error: "Failed to generate task" });
  }
});

// handling redirect
app.post("/redirect", async (req, res) => {
  const engineered_prompt = `You are an API that responds with a number only, based on the user's request category. Respond with the number corresponding to the user's query category from the list below. If the category does not match any of the listed ones, respond with default.
Categories and corresponding numbers:
1. Fitness Manager
2. Task Manager
3. News
4. Calendar
5. Messages
6. Settings
7. Profile

Examples:

User: I want to manage my fitness routine.
Response: 1

User: Could you open the section where I can track my daily workouts and view my fitness progress over the past week?
Response: 1

User: Show me my tasks for today.
Response: 2

User: Can you display my task manager? I need to see all the pending tasks I have for today and the deadlines for each.
Response: 2

User: What's the latest news?
Response: 3

User: Please provide me with the latest news updates, including any breaking news stories and top headlines from today.
Response: 3

User: Open my calendar.
Response: 4

User: Can you show me my calendar for today? I need to see all my appointments and meetings scheduled for the day.
Response: 4

User: Check my messages.
Response: 5

User: Could you please open my messaging app and show me any new messages or unread notifications?
Response: 5

User: I need to adjust my app settings.
Response: 6

User: Can you navigate to the settings page where I can modify my notification preferences and change my account details?
Response: 6

User: Show me my profile.
Response: 7

User: Please open my profile page where I can update my personal information and view my account details.
Response: 7

User: I want to listen to music.
Response: default

User: Could you play some music for me? I'm in the mood for some relaxing tunes.
Response: default`;

  const user_prompt = req.body.prompt;
  // console.log(user_prompt);
  // console.log(engineered_prompt);

  try {
    // Use OpenAI to generate task details based on the prompt
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: engineered_prompt },
        { role: "user", content: user_prompt },
      ],
      model: "gpt-3.5-turbo",
    });

    // Extract task details from OpenAI's response
    console.log(completion.choices[0].message.content);

    res.status(200).json({ choice: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error generating task:", error);
    res.status(500).json({ error: "Failed to generate task" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
