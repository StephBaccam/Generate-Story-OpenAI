import Navbar from "./layout/navbar"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inscription from "./pages/inscription";
import Home from "./pages/home";
import { useState, useEffect } from "react";
import "./css/App.css";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { db, storage } from "./config/fbConfig";
import Form from "./components/form";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  function CallBack (formPrompt) {
    setPrompt(formPrompt);
  }

  // Utilisation de useEffect pour récuperer la valeur de prompt une fois modifié
  useEffect(() => {
    if(prompt !== ""){
      console.log(prompt);
      setLoading(true);
      generateImage();
      generateText();
    }
  }, [prompt])

  const generateImage = async () => {
    // Send a request to the server with the prompt
    axios
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
            console.log(url)
          })
        })
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const generateText = async () => {
    // Send a request to the server with the prompt
    axios
      .post("http://localhost:8000/chat", { prompt })
      .then((res) => {
        // Update the response state with the server's response
        setResponseText(res.data);
        setDoc(doc(db, "histoire", "testId"), {
          texte: res.data
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (

    <div className="app">
      <>
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route path='/inscription' element={<Inscription />}>
            </Route>
          </Routes>
        </BrowserRouter>
      </>
          <Form handleCallBack={CallBack}/>

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
