import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-proj-YI3t0WADcvP2YaOzzBmvT3BlbkFJPEKLI2zyRzxeTcNkmhml",
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "what is the capital of china" }],
    model: "gpt-3.5-turbo",
  });

  console.log(completion.choices[0]);
}

main();
