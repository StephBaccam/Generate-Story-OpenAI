import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";

function Navbar() {

    const [userConnected, setUserConnected] = useState(false);

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;
            console.log(`L'utilisateur ${uid} est connecté`);
            console.log(`Informations sur l'utilisateur : ${user.email}`)
            setUserConnected(true);
        } else {
            // User is signed out
            console.log("Pas d'utilisateur connecté")
        }
    });

    const SignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log(`Utilisateur ${auth.currentUser.email} déconnecté!`)
            window.location.reload();
        }).catch((error) => {
            // An error happened.
            console.log(`Erreur lors de la deconnexion de l'utilisateur ${auth.currentUser.email}`)
        });
    }

    return (
        <nav className="navbar navbar-expand-sm sticky-top" style={{ display: "block", backgroundColor: '#2F3643' }}>
            <div className="d-flex">
            <span className="navbar-brand text-white mb-0 h1">Créateur d'histoires</span>
                <div className="mr-auto">
                    <a href='/' className="navbar-text text-white ml-2">
                        Accueil
                    </a>
                    {userConnected ? (
                        <a href='/profil' className="navbar-text text-white ml-2">
                            Profil
                        </a>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="ml-auto ">
                    {!userConnected ? (
                        <>
                        <a href='/connexion' className="navbar-text text-white mr-2">
                            Connexion
                        </a>
                        <a href='/inscription' className="navbar-text text-white mr-2">
                            S'inscrire
                        </a>
                        </>
                    ) : (
                        <a href='/' onClick={SignOut} className="navbar-text text-white mr-2">
                            Deconnexion
                        </a>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar