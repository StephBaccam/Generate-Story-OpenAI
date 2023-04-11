import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import "./App.css";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(
    "Search Bears with Paint Brushes the Starry Night, painted by Vincent Van Gogh.."
  );
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    generateImage();
    generateText();
    setLoading(false);
  }

  const generateImage = async () => {
    setPlaceholder(`Search ${prompt}..`);
    setLoading(true);
    // Send a request to the server with the prompt
    axios
      .post("http://localhost:8081/image", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const generateText = () => {
    setLoading(true)
    // Send a request to the server with the prompt
    axios
      .post("http://localhost:8081/chat", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponseText(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      {loading ? (
        <>
          <h2>Generating..Please Wait..</h2>
          <div>
            <div></div>
            <div></div>
          </div>
        </>
      ) : (
        <>
          <h2>Generate an Image using Open AI API</h2>
          <form onSubmit={handleSubmit}>
          <textarea
            // className="app-input"
            placeholder={placeholder}
            onChange={(e) => setPrompt(e.target.value)}
            rows="10"
            cols="40"
          />
          {response.length > 0 ? (
            <img src={response} alt="result" />
          ) : (
            <></>
          )}

          <p>Text from chat GPT : {responseText}</p>
          <button type="submit">Submit</button>
          </form>
          

        </>
      )}
    </div>
  );
}

export default App;
