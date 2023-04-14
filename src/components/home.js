import { useState, useEffect } from "react";
import "../css/App.css";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { db, storage } from "../config/fbConfig";
import Form from "../components/form";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Home() {
  const [titre, setTitre] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptImage, setPromptImage] = useState("");
  const [response, setResponse] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [nextStory, setNextStory] = useState(0);
  const [storyCount, setStoryCount] = useState(0);

  const auth = getAuth();
  const authUser = auth.currentUser;
  let isAuth = false;
  let titreToSave = "";

  function CallBack(formPrompt, formPromptImage, titre) {
    setPrompt(formPrompt);
    setPromptImage(formPromptImage);
    setTitre(titre);
    setStoryCount(storyCount+1);
  }

  // Utilisation de useEffect pour récuperer la valeur de prompt une fois modifié
  useEffect(() => {
    if (prompt !== "" && promptImage !== "" && storyCount == 1 && nextStory == 0) {
      console.log("PREMIERE HISTOIRE");
      setLoading(true);
      generateStory();
    }else if(nextStory > storyCount){
      console.log("SUITE");
      if(nextStory === 2) {
        setTitre(`${titre} ${nextStory}`);
        titreToSave = `${titre} ${nextStory}`
      }
      else {
        setTitre(`${titre.slice(0, -1)} ${nextStory-1}`);
        titreToSave = `${titre.slice(0, -1)} ${nextStory-1}`
      }
      setLoading(true);
      generateStory();
    }
    
  }, [prompt,promptImage,nextStory,storyCount])

  let histoireTexte = "";
  let histoireImageUrl = "";
  let histoireImagePath = "";

  const isUserAuth = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(`L'utilisateur ${uid} est connecté`);
        console.log(`Informations sur l'utilisateur : ${user.email}`)
        isAuth = true;
      } else {
        // User is signed out
        console.log("Pas d'utilisateur connecté")
      }
    });
  }

  const createFirestoreDocument = async () => {
    await isUserAuth();
    console.log("isAuth value : " + isAuth)
    console.log("Text to Add : " + histoireTexte);
    console.log("ImageUrl to Add : " + histoireImageUrl);
    console.log("ImagePath to Add : " + histoireImagePath);
    if(titreToSave === "") {
      titreToSave = titre;
    }
    const docRef = await addDoc(collection(db, "histoires"), {
      titre: titreToSave,
      texte: histoireTexte,
      imageUrl: histoireImageUrl,
      imagePath: histoireImagePath,
      utilisateur: isAuth ? authUser.email : "",
      createdAt: new Date()
    });
    console.log("Document created with ID : " + docRef.id)
    setLoading(false);
  }

  const generateStory = async () => {
    console.log("CHAT " + prompt);
    console.log("IMAGE " + promptImage);
    // Send a request to the server with the prompt
    await axios
      .post("http://localhost:8081/chat", { prompt })
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

  const generateImage = async () => {
    // Send a request to the server with the prompt
    await axios
      .post("http://localhost:8081/image", { promptImage })
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
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  };


  return (
    <div className="app-main">

      <Form handleCallBack={CallBack} />

      {loading ? (
        <div className="app-load">
          <h2>Génération de votre histoire...</h2>
          <div className="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <>
          <div className="app-result">
            <h2>{titre}</h2>
            {response.length > 0 ? (
              <img className="result-image" src={`data:image/jpeg;base64,${response}`} alt="result" />
            ) : (
              <></>
            )}
            {responseText.length > 0 ? (
              <>
                <p><b>Votre histoire :</b> {responseText}</p>
                <button 
                  onClick={() => {
                    let followStory = "Raconte moi la suite de l'histoire : " + responseText + ". Maximum 8 phrases.";
                    setNextStory(nextStory+2);
                    setPrompt(followStory);
                  }} 
                  className="btn btn-primary">Continuer l'histoire
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </>
      )}


    </div>
  )
}

export default Home;