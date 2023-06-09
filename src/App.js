import Navbar from "./layout/navbar"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inscription from "./components/inscription";
import Connexion from "./components/connexion";
import Home from "./components/home";
import Profil from "./components/profil";
import Histoire from "./components/histoire";

function App() {
  return (

    <div className="app">
      <>
        <Navbar />
        <BrowserRouter>
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route path='/inscription' element={<Inscription />}/>
            <Route path='/connexion' element={<Connexion />}/>
            <Route path='/profil' element={<Profil />}/>
            <Route path='/histoire' element={<Histoire />}/>
            <Route path='/histoire/:id' element={<Histoire />}/>
          </Routes>
        </BrowserRouter>
      </>
    </div>
  );
}

export default App;
