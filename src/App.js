import Navbar from "./layout/navbar"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Inscription from "./components/inscription";
import Home from "./components/home";

function App() {
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
    </div>
  );
}

export default App;
