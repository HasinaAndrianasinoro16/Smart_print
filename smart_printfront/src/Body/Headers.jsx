import React from "react";
import { Link } from 'react-router-dom';
import Mylogo from '../assets/img/upscalemedia-transformed.jpeg';

// Styles CSS
import '../assets/dist/css/bootstrap.min.css';
import '../assets/dist/js/bootstrap.bundle.min';
import '../assets/fontawesome-5/css/all.min.css';
import '../assets/fontawesome-5/css/all.css';

export default function Headers() {
    return (
        <header className="navbar navbar-dark bg-dark shadow-sm px-4 mb-4" style={{ height: '70px' }}>
        {/*// <header className="navbar navbar-dark bg-dark shadow-sm px-4 mb-4" style={{height: '70px'}}>*/}
            <div className="container-fluid d-flex align-items-center justify-content-between h-100">

                {/* Logo */}
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <img src={Mylogo} alt="Smart Print" style={{ height: '45px' }} />
                    <span className="text-white fw-bold fs-5">Smart Print & Design</span>
                </Link>

                {/* Navigation Links */}
                <ul className="nav align-items-center ms-auto me-3" style={{gap: '15px'}}>
                    <li><Link to="/" className="nav-link text-white"><i
                        className="fas fa-money-check-alt"></i> Facturation</Link></li>
                    <li><Link to="/liste_client" className="nav-link text-white"><i
                        className="fas fa-users"></i> Clients</Link></li>
                    <li><Link to="/liste_produit" className="nav-link text-white"><i
                        className="fas fa-box-open"></i> Produits</Link></li>
                    <li><Link to="/liste_service" className="nav-link text-white"><i
                        className="fas fa-tools"></i> Services</Link></li>
                    <li><Link to="/Historique" className="nav-link text-white"><i
                        className="fas fa-folder-open"></i> Historique</Link></li>
                </ul>

                {/* Logout Button */}
                <div>
                    <button type="button" className="btn btn-success">Log out</button>
                </div>
            </div>
        </header>

    );
}
