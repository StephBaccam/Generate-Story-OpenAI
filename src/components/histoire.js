import { useSearchParams } from 'react-router-dom'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import axios from "axios";
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { db, storage } from "../config/fbConfig";

function Histoire() {
    const auth = getAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [docFirestore, setDocFirestore] = useState({});
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState("");
    const [responseText, setResponseText] = useState("");
    let nextStory = 1;
    let titreToSave = "";
    let histoireTexte = "";
    let histoireImageUrl = "";
    let histoireImagePath = "";
    const authUser = auth.currentUser;
    let prompt = "";
    let promptImage = "";

    console.log(`searchParams : ${searchParams}`)

    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'col'
        },
        section: {
            margin: 2,
            padding: 2,
            textAlign: 'center',
            fontSize: '14px'
        }
    });

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

    const createFirestoreDocument = async () => {
        console.log(`User : ${authUser.email}`)
        console.log("Text to Add : " + histoireTexte);
        console.log("ImageUrl to Add : " + histoireImageUrl);
        console.log("ImagePath to Add : " + histoireImagePath);
        const docRef = await addDoc(collection(db, "histoires"), {
            titre: titreToSave,
            texte: histoireTexte,
            imageUrl: histoireImageUrl,
            imagePath: histoireImagePath,
            utilisateur: authUser.email,
            createdAt: new Date()
        });
        console.log("Document created with ID : " + docRef.id)
        setLoading(false);
    }

    const generateSequel = () => {
        if(prompt === "") {
            prompt = `Ecris moi la suite de cette histoire : ${docFirestore.texte}. Maximum 8 phrases.`;
            promptImage = `Fais moi un dessin en fonction de cette histoire : ${docFirestore.texte.slice(0, 50)}`;
        }
        else {
            prompt = `Ecris moi la suite de cette histoire : ${histoireTexte}. Maximum 8 phrases.`;
            promptImage = `Fais moi un dessin en fonction de cette histoire : " + ${histoireTexte.slice(0, 50)}`;
        }
        nextStory += 1;
        if (nextStory === 2) {
            titreToSave = `${docFirestore.titre}-${nextStory}`
        }
        else {
            titreToSave = `${docFirestore.titre.slice(0, -1)}-${nextStory}`
        }
        setLoading(true);
        generateStory();
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

    // Create Document Component
    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={[styles.section, { fontSize: '22px' }]}>
                    <Text>{docFirestore.titre}</Text>
                </View>
                <View style={styles.section}>
                    <Image src={docFirestore.imageUrl}>Section #1</Image>
                </View>
                <View style={styles.section}>
                    <Text>{docFirestore.texte}</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <div className="app-main" ref={ref}>
            <h2>{docFirestore.titre}</h2>
            {
                docFirestore ? (
                    <div className="app-result">
                        <img className="result-image" src={docFirestore.imageUrl} alt="img" />
                        <p><b>Votre histoire :</b> {docFirestore.texte}</p>
                        <button
                            onClick={generateSequel}
                            className="btn btn-primary">Continuer l'histoire
                            </button>
                    </div>
                )
                    :
                    <>
                        <div className="app-result">
                            <span className="text-danger">Erreur dans la récupération de l'histoire</span>
                        </div>
                    </>
            }
            <PDFDownloadLink document={<MyDocument />} fileName={`${docFirestore.titre}.pdf`}>
                {({ blob, url, loading, error }) => 'Télécharger en version PDF!'}
            </PDFDownloadLink>
            <small class="text-muted">Les suites d'histoires sont téléchargeables à leur propre page (Revenir à la page profil)</small>
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
                        <h2>{titreToSave}</h2>
                        {response.length > 0 ? (
                            <img className="result-image" src={`data:image/jpeg;base64,${response}`} alt="result" />
                        ) : (
                            <></>
                        )}
                        {responseText.length > 0 ? (
                            <>
                                <p><b>Votre histoire :</b> {responseText}</p>
                            </>
                        ) : (
                            <></>
                        )}
                    </div>
                </>
            )}
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
        //             let prompt = "Ecris moi la suite de cette histoire : " + responseText;
        //             setNextStory(nextStory+2);
        //             setPrompt(prompt);
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