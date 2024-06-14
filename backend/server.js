const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

app.post("/", async (req, res) => {
  const userMessage = req.body.message;
  console.log(userMessage);
  // res.send("Backend server is walking");

  // Here you would call your Python backend for AI response
  try {
    const aiResponse = await axios.post("http://localhost:8080/api/ai", {
      message: userMessage,
    });
    res.json({ response: aiResponse.data.response });
  } catch (error) {
    res.status(500).send("Error communicating with AI backend");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
