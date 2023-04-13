const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Set up the server
const app = express();
app.use(bodyParser.json());
app.use(cors())

// Set up the ChatGPT endpoint
app.post("/chat", async (req, res) => {
  // Get the prompt from the request
  const { prompt } = req.body;

  // Generate a response with ChatGPT
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Ecris moi une histoire de " + prompt,
    max_tokens: 1024
  });
  console.log("CHAT CREATED : " + completion.data.created)
  res.send(completion.data.choices[0].text);
});

// Set up the ChatGPT endpoint
app.post("/image", async (req, res) => {
    // Get the prompt from the request
    const { prompt } = req.body;
  
    // Generate a response with ChatGPT
    const completion = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "512x512",
        response_format: "b64_json"
    });
    console.log("IMAGE CREATED : " + completion.data.created)
    res.send(completion.data);
  });

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Start the server
const port = 8081;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});