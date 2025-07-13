import React from "react";
import { Link } from 'react-router-dom';
import Mylogo from '../assets/img/Smart Print-logo/vector/default-monochrome.svg';

// Styles CSS
import '../assets/dist/css/bootstrap.min.css';
import '../assets/dist/js/bootstrap.bundle.min';
import '../assets/fontawesome-5/css/all.min.css';
import '../assets/fontawesome-5/css/all.css';

export default function Headers() {
    return (
        <header className="navbar navbar-dark bg-dark shadow-sm py-3 px-4 mb-4">
            <div className="container-fluid d-flex align-items-center justify-content-between">
                {/* Logo */}
                <Link to="/" className="navbar-brand d-flex align-items-center">
                    <img src={Mylogo} alt="Smart Print" height="40" className="me-2" />
                    {/*<span className="text-white fw-bold h5 mb-0">Smart Print</span>*/}
                </Link>

                {/* Navigation Links */}
                <ul className="nav d-flex align-items-center ms-auto me-3" style={{ gap: '15px' }}>
                    <li><Link to="/" className="nav-link text-white"><i className="fas fa-money-check-alt"></i> Facturation</Link></li>
                    <li><Link to="/liste_client" className="nav-link text-white"><i className="fas fa-users"></i> Clients</Link></li>
                    <li><Link to="/liste_produit" className="nav-link text-white"><i className="fas fa-box-open"></i> Produits</Link></li>
                    <li><Link to="/liste_service" className="nav-link text-white"><i className="fas fa-tools"></i> Services</Link></li>
                    <li><Link to="/Historique" className="nav-link text-white"><i className="fas fa-folder-open"></i> Historique</Link></li>
                </ul>

                {/* Logout Button */}
                <div>
                    <button type="button" className="btn btn-success">Log out</button>
                </div>
            </div>
        </header>
    );
}
