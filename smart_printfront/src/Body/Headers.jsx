import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import Mylogo from '../assets/img/upscalemedia-transformed.jpeg';
import { getApiUrl } from "../Link/URL";

import '../assets/dist/css/bootstrap.min.css';
import '../assets/dist/js/bootstrap.bundle.min';
import '../assets/fontawesome-5/css/all.min.css';
import '../assets/fontawesome-5/css/all.css';

export default function Headers({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 1. Récupérer le cookie CSRF
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // 2. Extraire le token CSRF
            const getCookie = (name) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            };
            const csrfToken = getCookie('XSRF-TOKEN');

            // 3. Faire la déconnexion
            const response = await fetch(getApiUrl("logout"), {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": csrfToken ? decodeURIComponent(csrfToken) : '',
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: "include"
            });

            if (response.ok) {
                setUser(null);
                navigate("/login");

                // Nettoyer les cookies côté client
                document.cookie = 'XSRF-TOKEN=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'laravel_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            } else {
                console.error("Erreur de déconnexion:", await response.text());
            }
        } catch (error) {
            console.error("Erreur réseau lors de la déconnexion:", error);
        }
    };

    return (
        <header className="navbar navbar-dark bg-dark shadow-sm px-4 mb-4" style={{ height: '70px' }}>
            <div className="container-fluid d-flex align-items-center justify-content-between h-100">

                {/* Logo */}
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <img src={Mylogo} alt="Smart Print" style={{ height: '45px' }} />
                    <span className="text-white fw-bold fs-5">Smart Print & Design</span>
                </Link>

                {user && (
                    <>
                        <ul className="nav align-items-center ms-auto me-3" style={{gap: '15px'}}>
                            <li><Link to="/" className="nav-link text-white">
                                <i className="fas fa-money-check-alt"></i> Facturation
                            </Link></li>
                            <li><Link to="/liste_client" className="nav-link text-white">
                                <i className="fas fa-users"></i> Clients
                            </Link></li>
                            <li><Link to="/liste_produit" className="nav-link text-white">
                                <i className="fas fa-box-open"></i> Produits
                            </Link></li>
                            <li><Link to="/liste_service" className="nav-link text-white">
                                <i className="fas fa-tools"></i> Services
                            </Link></li>
                            {user.is_admin && (
                                <li><Link to="/liste_utilisateur" className="nav-link text-white">
                                    <i className="fas fa-user-friends"></i> Utilisateurs
                                </Link></li>
                            )}
                            <li><Link to="/Historique" className="nav-link text-white">
                                <i className="fas fa-folder-open"></i> Historique
                            </Link></li>
                        </ul>

                        <div className="d-flex align-items-center gap-3">
                            <span className="text-white d-none d-md-inline">
                                <i className="fas fa-user-circle me-2"></i>
                                {user.name}
                            </span>
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={handleLogout}
                            >
                                <i className="fas fa-sign-out-alt me-2"></i>
                                Déconnexion
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}