import './assets/dist/js/bootstrap.bundle.min';
import './assets/fontawesome-5/css/all.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './assets/fontawesome-5/css/all.css';
import './assets/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Headers from "./Body/Headers";
import Facturation from "./Page/Facturation";


function App() {
  return (
    <Router>
      <Headers/>
      <Routes>
          <Route path='/' element={<Facturation/>}/>
      </Routes>
    </Router>
  );
}

export default App;
