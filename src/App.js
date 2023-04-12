import { useState } from "react";
import "./css/App.css";
import axios from "axios";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder] = useState(
    "Un aventurier part retrouver un trésor perdu, ambiance futuriste."
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    generateImage();
    generateText();
  }

  const generateImage = async () => {
    // Send a request to the server with the prompt
    axios
      .post("http://localhost:8000/image", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const generateText = () => {
    // Send a request to the server with the prompt
    axios
      .post("http://localhost:8000/chat", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponseText(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="app-main">
        <>
          <h2>Créer une histoire grâce à Open AI API</h2>

          <form onSubmit={handleSubmit} className="app-form">
            <textarea
              className="app-input"
              placeholder={placeholder}
              onChange={(e) => setPrompt(e.target.value)}
              rows="10"
              cols="40"
            />
            <button type="submit">Générer</button>
          </form>

          {loading ? (
            <div className="app-load">
              <h2>Génération de votre histoire...</h2>
              <div className="lds-ripple">
                <div></div>
                <div></div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <div className="app-result">
            {response.length > 0 ? (
              <img className="result-image" src={response} alt="result" />
            ) : (
              <></>
            )}
            {responseText.length > 0 ? (
              <p>Votre histoire : {responseText}</p>
            ) : (
              <></>
            )}
          </div>
        </>
    </div>
  );
}

export default App;
