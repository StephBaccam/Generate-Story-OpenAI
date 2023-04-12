import { useState } from "react";
import "./css/App.css";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { db, storage } from "./config/fbConfig";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [placeholder] = useState(
    "Un aventurier part retrouver un trésor perdu, ambiance futuriste."
  );

  let histoireTexte = "";
  let histoireImageUrl = "";
  let histoireImagePath = "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    generateStory();
  }

  const createFirestoreDocument = async () => {
    console.log("Text to Add : " + histoireTexte);
    console.log("ImageUrl to Add : " + histoireImageUrl);
    console.log("ImagePath to Add : " + histoireImagePath);
    const docRef = await addDoc(collection(db, "histoires"), {
      texte: histoireTexte,
      imageUrl: histoireImageUrl,
      imagePath: histoireImagePath
    });
    console.log("Document created with ID : " + docRef.id)
    setLoading(false);
  }

  const generateImage = async () => {
    // Send a request to the server with the prompt
    await axios
      .post("http://localhost:8000/image", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponse(res.data.data[0].b64_json);
        const metadata = {
          contentType: 'image/jpeg',
        };
        const storageRef = ref(storage, `images/${res.data.created}.jpeg`);
        uploadString(storageRef, res.data.data[0].b64_json, 'base64', metadata).then((snapshot) => {
          console.log('Uploaded a base64 string! to storage');
          getDownloadURL(storageRef)
          .then((url) => {
            // Insert url into an <img> tag to "download"
            console.log('URL Fetched! : ' + url);
            histoireImageUrl = url;
            histoireImagePath = `gs://generate-story-openai.appspot.com/images/${res.data.created}.jpeg`;
            createFirestoreDocument()
          })
        })
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const generateStory = async () => {
    // Send a request to the server with the prompt
    await axios
      .post("http://localhost:8000/chat", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponseText(res.data);
        histoireTexte = res.data;
      })
      .catch((err) => {
        console.error(err);
      });
      await generateImage();
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
              <img className="result-image" src={`data:image/jpeg;base64,${response}`} alt="result" />
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
