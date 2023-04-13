import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"

function Connexion() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();


  const handleValidation = (event) => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(`Utilisateur ${email} connecté!`)
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Erreur lors de l'enregistrement de l'utilisateur : ${errorCode} - ${errorMessage}`)
        setLoginError("Erreur lors de l'authentification");
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
          <h2 className="mt-2">Connexion</h2>
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
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
export default Connexion;
