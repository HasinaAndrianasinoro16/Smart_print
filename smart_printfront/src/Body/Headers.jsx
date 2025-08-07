import React, {useEffect, useState} from "react";
import { Link, useNavigate } from 'react-router-dom';
import Mylogo from '../assets/img/upscalemedia-transformed.jpeg';
import { getApiUrl } from "../Link/URL";

export default function Headers({ user, setUser }) {
    const navigate = useNavigate();
    const [count, setCount] = useState(null);

    const handleLogout = async () => {
        try {
            // First ensure we have CSRF cookies
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // Then make the logout request with proper headers
            const response = await fetch(getApiUrl("logout"), {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: "include" // Important for sending cookies
            });

            // Handle response regardless of status for logout
            if (response.ok || response.status === 401) {
                // 401 means already logged out, which is fine
                setUser(null);
                navigate("/login");
            } else {
                const errorText = await response.text();
                console.error("Logout error:", errorText);

                // Still redirect to login even if logout failed on server
                setUser(null);
                navigate("/login");
            }
        } catch (error) {
            console.error("Network error during logout:", error);

            // Still redirect to login even if network error occurred
            setUser(null);
            navigate("/login");
        }
    };

    const count_factures = async () => {
        try {
            const reponse = await fetch(getApiUrl('factures/count_facture_statut/0'));
            if (!reponse.ok){
                throw new Error("erreur lors du compte");
            }
            const data = await reponse.json();
            setCount(data || 0);

        }catch (e) {
            console.error(e.message);
            alert("on peut pas compter")
        }
    }

    useEffect(() => {
        count_factures();
    }, []);

    return (
        <header className="navbar navbar-dark bg-dark shadow-sm px-4 mb-4" style={{ height: '70px' }}>
            <div className="container-fluid d-flex align-items-center justify-content-between h-100">

                {/* Logo */}
                <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                    <img src={Mylogo} alt="Smart Print" style={{ height: '35px', borderRadius:'50%' }} />
                    <span className="text-white fw-bold fs-5">Smart Print & Design</span>
                </Link>

                {user && (
                    <>
                        <ul className="nav align-items-center ms-auto me-3" style={{gap: '15px'}}>
                            <li><Link to="/" className="nav-link text-white">
                                <i className="fas fa-home"></i> Home
                            </Link></li>
                            {user.role === 2 && (
                                <>
                                    <li><Link to="/factures" className="nav-link text-white">
                                        <i className="fas fa-money-check-alt"></i> Factures <sup className="badge rounded-pill bg-success">{count}</sup>
                                    </Link></li>
                                    {/*<li><Link to="/liste_client" className="nav-link text-white">*/}
                                    {/*    <i className="fas fa-users"></i> Clients*/}
                                    {/*</Link></li>*/}
                                    <li><Link to="/liste_produit" className="nav-link text-white">
                                        <i className="fas fa-box-open"></i> Produits
                                    </Link></li>
                                    <li><Link to="/liste_service" className="nav-link text-white">
                                        <i className="fas fa-tools"></i> Services
                                    </Link></li>
                                    <li><Link to="/Historique" className="nav-link text-white">
                                        <i className="fas fa-folder-open"></i> Historique
                                    </Link></li>
                                </>
                            )}
                            {user.role === 1 && (
                                <>
                                    <li><Link to="/liste_facture" className="nav-link text-white">
                                        <i className="fas fa-money-check-alt"></i> Facturation
                                    </Link></li>
                                    <li><Link to="/liste_client" className="nav-link text-white">
                                        <i className="fas fa-users"></i> Clients
                                    </Link></li>
                                    <li><Link to="/Historique" className="nav-link text-white">
                                        <i className="fas fa-folder-open"></i> Historique
                                    </Link></li>
                                </>
                            )}
                            {user.role === 0 && (
                                <>
                                    <li><Link to="/liste_utilisateur" className="nav-link text-white">
                                        <i className="fas fa-user-friends"></i> Utilisateurs
                                    </Link></li>
                                    <li><Link to="/liste_produit" className="nav-link text-white">
                                        <i className="fas fa-box-open"></i> Produits
                                    </Link></li>
                                    <li><Link to="/liste_service" className="nav-link text-white">
                                        <i className="fas fa-tools"></i> Services
                                    </Link></li>
                                </>
                            )}
                        </ul>

                        <div className="d-flex align-items-center gap-3">
                            {/*<span className="text-white d-none d-md-inline">*/}
                            {/*    <i className="fas fa-user-circle me-2"></i>*/}
                            {/*    {user.name}*/}
                            {/*</span>*/}
                            <button
                                type="button"
                                className="btn btn-outline-light"
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