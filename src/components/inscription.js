import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"

function Inscription() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleValidation = (event) => {

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setemailError("Email Invalide");
      return false;
    } else {
      setemailError("");
    }

    if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
      setpasswordError(
        "Votre mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre"
      );
      return false;
    } else {
      setpasswordError("");
    }

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(`Utilisateur ${email} inscrit!`)
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Erreur lors de l'enregistrement de l'utilisateur : ${errorCode} - ${errorMessage}`)
        setLoginError("Erreur lors de l'enregistrement de l'utilisateur, l'adresse email est peut-être déjà utilisée ?")
      });
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    handleValidation();
  };

  return (
    <div className="row d-flex justify-content-center">
      <div className="col-md-4">
        <form id="loginform" onSubmit={loginSubmit}>
          <h2 className="mt-2">Inscription</h2>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              id="EmailInput"
              name="EmailInput"
              aria-describedby="emailHelp"
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Mot de passe"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="login-error mt-2">
            <small id="errors" className="text-danger form-text">
              {passwordError} {emailError} {loginError}
            </small>
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Envoyer
            </button>
        </form>
      </div>
    </div>
  );
}
export default Inscription;
