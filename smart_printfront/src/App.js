import './assets/dist/js/bootstrap.bundle.min';
import './assets/fontawesome-5/css/all.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './assets/fontawesome-5/css/all.css';
import './assets/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Headers from "./Body/Headers";
import Facturation from "./Page/Facturation";
import Info_facture from "./Components/Info_facture";
import Histoique_facture from "./Page/Hitsorique_facture";
import Liste_Client from "./Page/Liste_Client";
import Liste_produit from "./Page/Liste_produit";
import Liste_service from "./Page/Liste_service";
import Login from "./Page/Login";



function App() {
  return (
    <Router>
      {/*<Headers/>*/}
      <Routes>
          <Route path='/' element={<Facturation/>}/>
          <Route path='/info' element={<Info_facture/>}/>
          <Route path='/Historique' element={<Histoique_facture/>}/>
          <Route path='/liste_client' element={<Liste_Client/>}/>
          <Route path='/liste_produit' element={<Liste_produit/>}/>
          <Route path='/liste_service' element={<Liste_service/>}/>
          <Route path='/login' element={<Login/>}/>
      </Routes>
    </Router>
  );
}

export default App;
