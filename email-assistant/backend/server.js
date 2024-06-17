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
const { spawn } = require("child_process");

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

// Endpoint to send email
app.post("/send-email", (req, res) => {
  const { accessToken, to, cc, bcc, subject, body } = req.body;
  if (!accessToken || !to || !subject || !body) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  senderList = to.split(",").map((email) => email.trim());
  console.log(senderList);
  const process = spawn("python3", [
    "/Users/samarthpawan/Documents/Personal_AI-Assistant/Msoft-sam-tink/gmail_send.py",
    accessToken,
    senderList,
    cc,
    bcc,
    subject,
    body,
  ]);

  process.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    if (code === 0) {
      res.status(200).send("Email sent successfully");
    } else {
      res.status(500).send("Failed to send email");
    }
  });
});

// // Endpoint to read unread emails
// app.get("/read-emails", (req, res) => {
//   const process = spawn("python3", ["checkThreads.py"]);

//   let emails = "";

//   process.stdout.on("data", (data) => {
//     emails += data.toString();
//   });

//   process.stderr.on("data", (data) => {
//     console.error(`stderr: ${data}`);
//   });

//   process.on("close", (code) => {
//     console.log(`child process exited with code ${code}`);
//     if (code === 0) {
//       res.status(200).json(JSON.parse(emails));
//     } else {
//       res.status(500).send("Failed to read emails");
//     }
//   });
// });

app.get("/fetch-emails", (req, res) => {
  const process = spawn("python3", [
    "/Users/samarthpawan/Documents/Personal_AI-Assistant/Msoft-sam-tink/checkThreads.py",
  ]);

  let dataString = "";

  process.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  process.stdout.on("end", () => {
    console.log("Python script output:", dataString);
    try {
      const emails = JSON.parse(dataString);
      res.json({ messages: emails });
    } catch (error) {
      console.error("Error parsing email data:", error);
      res.status(500).json({ error: "Failed to parse email data" });
    }
  });

  process.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  process.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
});

app.post("/generate-email", async (req, res) => {
  const { prompt } = req.body;
  const engineered_prompt = ` You are tasked with generating the content of an email based on user input. The user will provide the main message to be included in the body of the email. Your task is to construct the email content in the following format:

Email Content Format:
Dear Sir/Madam,

[generate a body to the email based on the user's input]

Regards,
[User's Name]

Instructions for the Chat Model:

1. Understand the input: The user will provide the main message that should be included in the email body, which will be in the format "Content: [User's provided message]".

2. Construct the email content: Format the provided message into the email body structure specified above. Ensure that the email starts with a respectful salutation ("Dear Sir/Madam,"), includes the user-provided message, and ends with a closing remark ("Regards, [User's Name]").

3. Maintain professionalism: Ensure that the generated email content follows professional etiquette, is concise, and avoids jargon.

Example Input and Expected Output:

- Example 1:
  - Input:
    Content: write me a mail to inquire about the status of my application.
  - Expected Output:
    Dear Sir/Madam,
    \n\n
    I am writing to inquire about the status of my application. Could you please provide an update at your earliest convenience?
    \n\n
    Regards,\n
    [User's Name]

- Example 2:
  - Input:
    Content: Thank you for considering my request. I look forward to your response.
  - Expected Output:
    Dear Sir/Madam,
    \n\n
    Thank you for considering my request. I look forward to your response.
    \n\n
    Regards,\n
    [User's Name]
 `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: engineered_prompt,
        },
        {
          role: "user",
          content: `${engineered_prompt} Generate a professional email based on the following prompt: ${prompt}`,
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

// app.post("/generate-email", async (req, res) => {
//   const { prompt } = req.body;
//   const engineered_prompt = `
// You are tasked with generating an email draft based on user input. The user will provide details such as the recipient(s), carbon copy (CC), blind carbon copy (BCC), subject, and content of the email. Your task is to construct an email object in the following format:

// Email Object Format:
// {
//   "to": ["Recipient1 Email", "Recipient2 Email", ...],
//   "cc": ["CC1 Email", "CC2 Email", ...],
//   "bcc": ["BCC1 Email", "BCC2 Email", ...],
//   "subject": "Email Subject",
//   "content": "Email Content"
// }`;

//   try {
//     const completion = await openai.chat.completions.create({
//       messages: [
//         { role: "system", content: engineered_prompt },
//         {
//           role: "user",
//           content: ` ${engineered_prompt} Generate a professional email, no jargon, follow email etiquettes, keep it brief, based on the following prompt: ${prompt}`,
//         },
//       ],
//       model: "gpt-3.5-turbo",
//     });

//     const reply = completion.choices[0].message.content;
//     let emailData = JSON.parse(inputString);
//     console.log(emailData);

//     res.status(200).json({ text: emailData });
//   } catch (error) {
//     console.error(
//       "Error generating email:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: "Failed to generate email" });
//   }
// });

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
