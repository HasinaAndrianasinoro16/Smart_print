import React from "react";
import '../assets/dist/css/bootstrap.min.css';
import '../assets/dist/js/bootstrap.bundle.min';
import '../assets/fontawesome-5/css/all.min.css';
import '../assets/fontawesome-5/css/all.css';
import { Link } from 'react-router-dom';
import Mylogo from '../assets/img/Smart Print-logo/vector/default-monochrome.svg';

export default function Headers(){
    return (
        <header className=" navbar navbar-dark bg-dark shadow-sm d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <a href="/" className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
                <img src={Mylogo} alt="Smart Print " width="100%" height="50" />
            </a>

            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0" style={{gap: '15px'}}>
                <li><Link to="/" className="nav-link px-3 text-white h5"><i
                    className="fas fa-money-check-alt"></i> Facturation</Link></li>
                <li><Link to="/liste_client" className="nav-link px-3 text-white"><i className="fas fa-users"></i> Liste
                    des clients</Link></li>
                <li><Link to="/liste_produit" className="nav-link px-3 text-white"><i className="fas fa-box-open"></i> Liste
                    des produits</Link></li>
                <li><Link to="/Historique" className="nav-link px-3 text-white"><i
                    className="fas fa-folder-open"></i> Historique facture</Link></li>
            </ul>


            <div className="col-md-3 text-end">
                {/* <button type="button" onClick={logout} className="btn btn-success btn-lg me-2">Log out</button> */}
            </div>
        </header>

    );
}