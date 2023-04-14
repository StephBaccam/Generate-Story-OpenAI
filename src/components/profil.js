import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useNavigate, createSearchParams, Link } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../config/fbConfig";
import { useState, useEffect } from "react";

function Profil() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [listDocFirestore, setListDocFirestore] = useState([]);
    let listDoc = [];

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                const uid = user.uid;
                console.log(`L'utilisateur ${uid} est connecté`);
                console.log(`Informations sur l'utilisateur : ${user.email}`)
                getFirestoreDocuments(user.email);
            } else {
                // User is signed out
                console.log("Pas d'utilisateur connecté")
                navigate("/")
            }
        });
    }, [])

    const getFirestoreDocuments = async (userEmail) => {
        if(listDoc.length === 0) {
            console.log(`Liste vide, ajout des éléments`)
            console.log(`Récupération des documents de l'utilisateur ${userEmail}`)
            const q = query(collection(db, "histoires"), where("utilisateur", "==", userEmail), orderBy('createdAt', 'asc'));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                if (listDoc.some(el => el.id === doc.id)) {
                    console.log("Id déjà enregistré!");
                }
                else {
                    console.log("Id inconnu, enregistrement dans le tableau")
                    listDoc.push({
                        id: doc.id,
                        data: doc.data()
                    })
                }
            });
            setListDocFirestore(listDoc);
        }
    }

    return (
        <div className="app-main">
            <h2>Mes histoires</h2>
            <ul className="list-group">
                {
                    // console.log(listDocFirestore)
                    listDocFirestore.map((doc) => {
                        console.log(`ID doc : ${doc.id}`)
                        return <Link to={{
                            pathname: `/histoire/${doc.id}`,
                            search: createSearchParams({
                                id: doc.id
                            }).toString()
                        }} className="list-group-item list-group-item-action">{doc.data.titre}</Link>
                    })
                }
            </ul>
        </div>
    )
}

export default Profil