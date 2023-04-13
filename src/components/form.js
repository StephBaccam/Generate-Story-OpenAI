import React, { useState } from "react";

function Form(props) {
    const [titre, setTitre] = useState("");
    const [nomPerso1, setNomPerso1] = useState("");
    const [nomPerso2, setNomPerso2] = useState("");
    const [prompt, setPrompt] = useState("");
    const [genre, setGenre] = useState("");
    const [style, setStyle] = useState("");

    const [titreError, setTitreError] = useState("");
    const [persoError, setPersoError] = useState("");
    const [promptError, setPromptError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        let formIsValid = true;

        // Vérification des données du formulaire
        if (titre === "") {
            formIsValid = false;
            setTitreError("Veuillez écrire le titre de votre histoire");
        }

        if (prompt === "") {
            formIsValid = false;
            setPromptError("Sujet vide");
        } else {
            setPromptError("");
        }

        prompt.split(" ").map(mot => {
            if (mot.toLowerCase() == "sex" || mot.toLowerCase() == "penis") {
                formIsValid = false;
                setPromptError("Sujet innaproprié");
            }
        })

        if (nomPerso1 === "" && nomPerso2 !== "") {
            formIsValid = false;
            setPersoError("Il faut d'abord avoir un premier personnage");
        } 

        if (formIsValid) {
            setPromptError("");
            setTitreError("");
            setPersoError("");
        }
        // Fin vérification

        let promptFormatText  = "Raconte moi une histoire ";
        let promptFormatImage = "";

        if (formIsValid) {

            promptFormatImage += prompt;

            if (style !== "") {
                promptFormatImage += ", style " + style;
            }

            if (genre !== "") {
                promptFormatImage += ", pour un livre de " + genre.toLowerCase();

                if(genre === "Pour enfants"){
                    promptFormatText += genre.toLowerCase();
                }else{
                    promptFormatText += "du genre " + genre.toLowerCase();
                }
            }

            promptFormatText += " à propos de " + prompt;

            if (nomPerso1 !== "") {
                promptFormatText += ", le personnage s'appel " + nomPerso1;
            }
            if (nomPerso2 !== "") {
                promptFormatText += ", le deuxième personnage s'appel " + nomPerso2;
            }

            props.handleCallBack(promptFormatText, promptFormatImage, titre);
        }
    }

    const genreLivre = ["", "Conte de fées", "Aventure", "Historique", "Science-fiction", "Humoristique", "Pour enfants"]
    const styleImage = ["", "BD", "Manga", "Cartoon", "Pixel art", "Flat design", "3D"]
    const placeholder = "Un jeune garçon part retrouver un trésor perdu";

    return (
        <div className="container">
            <div className="row d-flex justify-content-center">
                <div className="col-md-5">
                    <form id="loginform" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Titre de l'histoire</label>
                            <input
                                type="text"
                                className="form-control"
                                id="titre"
                                name="titre"
                                placeholder="Obligatoire"
                                onChange={(event) => setTitre(event.target.value)}
                            />
                        </div>
                        <small id="prompterror" className="text-danger form-text">
                            {titreError}
                        </small>
                        <div className="form-group">
                            <label>Nom du premier personnage</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name_1"
                                name="name_1"
                                placeholder="Facultatif"
                                onChange={(event) => setNomPerso1(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nom du deuxième personnage</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name_2"
                                name="name_2"
                                aria-describedby="persoerror"
                                placeholder="Facultatif"
                                onChange={(event) => setNomPerso2(event.target.value)}
                            />
                            <small id="persoerror" className="text-danger form-text">
                                {persoError}
                            </small>
                        </div>
                        <div className="form-group">
                            <label>Sujet</label>
                            <textarea
                                id="prompt"
                                className="form-control"
                                aria-describedby="prompterror"
                                placeholder={placeholder}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows="10"
                                cols="40"
                            />
                            <small id="prompterror" className="text-danger form-text">
                                {promptError}
                            </small>
                        </div>
                        <div className="form-group">
                            <label>Genre de l'histoire</label>
                            <select className="form-control" id="genre" name="genre" onChange={(e) => setGenre(e.target.value)}>
                                {genreLivre.map(arrayItem => <option value={arrayItem} key={arrayItem}>{arrayItem}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Style des images</label>
                            <select className="form-control" id="style" name="style" onChange={(e) => setStyle(e.target.value)}>
                                {styleImage.map(arrayItem => <option value={arrayItem} key={arrayItem}>{arrayItem}</option>)}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary btn-lg">Générer</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Form;
