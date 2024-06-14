const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());

require("dotenv").config();
const OpenAI = require("openai");

// 701574296601 - kd5v8akn6qb5iat85d666oatjqicf2t7.apps.googleusercontent.com;
const CLIENT_ID = "";
// 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
const CLIENT_SECRET = "";
//sk-proj-r0qYWgauOF65oQoz3X3LT3BlbkFJDfapdZu0gmI3XAWMrsoW
const REDIRECT_URI = "http://localhost:5173";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// sk - proj - rqqybaFLFQCAkJnJ2kewT3BlbkFJXqd45y7ex3ypKac8dMHz;
const openai = new OpenAI({
  apiKey: "",
});

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
    // const completion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: message }, { role: "assistant" }],
    //   model: "gpt-3.5-turbo",
    // });

    // Return AI response
    res.status(200).json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

const PORT = 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
