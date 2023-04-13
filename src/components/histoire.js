import { useSearchParams } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/fbConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"

function Histoire(props) {
    const auth = getAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [docFirestore, setDocFirestore] = useState({});
    console.log(`searchParams : ${searchParams}`)

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                console.log(`L'utilisateur ${uid} est connecté`);
                console.log(`Informations sur l'utilisateur : ${user.email}`)
                getFirestoreDocument(user.email);
            } else {
                // User is signed out
                console.log("Pas d'utilisateur connecté")
                navigate("/")
            }
        });
    }, [])

    const getFirestoreDocument = async (userEmail) => {
        console.log(`Liste vide, ajout des éléments`)
        console.log(`Récupération des documents de l'utilisateur ${userEmail}`)
        const docRef = doc(db, "histoires", searchParams.toString().replace('id=', ''))

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setDocFirestore(docSnap.data())
        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    return (
        <div className="app-main">
            <h2 className="text-white">{docFirestore.titre}</h2>
            {
                docFirestore ? (
                    <div className="app-result">
                        <img className="result-image" src={docFirestore.imageUrl} alt="img" />
                            <p className="text-white">Votre histoire : {docFirestore.texte}</p>
                            {/* <button
                                onClick={() => {
                                    let followStory = "Ecris moi la suite de cette histoire : " + docFirestore.texte;
                                    setNextStory(nextStory + 2);
                                    setPrompt(followStory);
                                }}
                                className="btn btn-primary">Continuer l'histoire
                            </button> */}
                    </div>
                )
                    :
                    <>
                        <div className="app-result">
                            <span className="text-danger">Erreur dans la récupération de l'histoire</span>
                        </div>
                    </>
            }

        </div>

        // <div className="app-result">
        //     <h2>{titre}</h2>
        //     {response.length > 0 ? (
        //       <img className="result-image" src={`data:image/jpeg;base64,${response}`} alt="result" />
        //     ) : (
        //       <></>
        //     )}
        //     {responseText.length > 0 ? (
        //       <>
        //         <p className="text-white">Votre histoire : {responseText}</p>
        //         <button 
        //           onClick={() => {
        //             let followStory = "Ecris moi la suite de cette histoire : " + responseText;
        //             setNextStory(nextStory+2);
        //             setPrompt(followStory);
        //           }} 
        //           className="btn btn-primary">Continuer l'histoire
        //         </button>
        //       </>
        //     ) : (
        //       <></>
        //     )}
        //   </div>
    )
}

export default Histoire