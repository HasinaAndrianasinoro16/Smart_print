import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Mylogo from "../assets/img/upscalemedia-transformed.jpeg";
import { getApiUrl } from "../Link/URL";

export default function Headers({ user, setUser }) {
    const navigate = useNavigate();
    const [count, setCount] = useState(0);
    const [showSidebar, setShowSidebar] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8000/sanctum/csrf-cookie", { credentials: "include" });
            const response = await fetch(getApiUrl("logout"), {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                },
                credentials: "include",
            });
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error(error);
            setUser(null);
            navigate("/login");
        }
    };

    const count_factures = async () => {
        try {
            const response = await fetch(getApiUrl("factures/count_facture_statut/0"));
            if (!response.ok) throw new Error("Erreur lors du comptage");
            const data = await response.json();
            setCount(data || 0);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        count_factures();
    }, []);

    return (
        <>
            {/* Top Navigation - Mobile */}
            <nav className="navbar navbar-dark bg-dark px-3 d-md-none">
                <div className="container-fluid">
                    <button
                        className="btn btn-outline-light me-2"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>
                    <Link to="/" className="navbar-brand">
                        <img src={Mylogo} alt="Logo" height="30" style={{borderRadius:'50%'}} className="d-inline-block align-top me-2" />
                        Smart Print
                    </Link>
                    {/*<button className="btn btn-outline-light" onClick={handleLogout}>*/}
                    {/*    <i className="fas fa-sign-out-alt"></i>*/}
                    {/*</button>*/}
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`sidebar bg-dark text-white ${showSidebar ? 'show' : ''}`}>
                <div className="sidebar-header p-3 d-flex justify-content-between align-items-center">
                    <Link to="/" className="text-white text-decoration-none d-flex align-items-center">
                        <img src={Mylogo} alt="Logo" height="30" style={{borderRadius:'50%'}} className="me-2" />
                        <span className="fs-5">Smart Print</span>
                    </Link>
                    <button
                        className="btn-close btn-close-white d-md-none"
                        onClick={() => setShowSidebar(false)}
                    ></button>
                </div>

                <ul className="nav flex-column px-2 my-3">
                    <li className="nav-item">
                        <Link to="/" className="nav-link text-white" onClick={() => setShowSidebar(false)}>
                            <i className="fas fa-home me-2"></i> Accueil
                        </Link>
                    </li>

                    {user?.role === 2 && (
                        <>
                            <li className="nav-item">
                                <Link to="/factures" className="nav-link text-white" onClick={() => setShowSidebar(false)}>
                                    <i className="fas fa-money-check-alt me-2"></i> Factures
                                    {count > 0 && <span className="badge bg-danger ms-2">{count}</span>}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/liste_produit" className="nav-link text-white" onClick={() => setShowSidebar(false)}>
                                    <i className="fas fa-box-open me-2"></i> Produits
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/liste_service" className="nav-link text-white" onClick={() => setShowSidebar(false)}>
                                    <i className="fas fa-tools me-2"></i> Services
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/Historique" className="nav-link text-white" onClick={() => setShowSidebar(false)}>
                                    <i className="fas fa-folder-open me-2"></i> Historique
                                </Link>
                            </li>
                        </>
                    )}
                    {user.role === 1 && (
                        <>
                            <li className="nav-item"><Link to="/liste_facture" className="nav-link text-white">
                                <i className="fas fa-money-check-alt"></i> Facturation
                            </Link></li>
                            <li className="nav-item"><Link to="/liste_client" className="nav-link text-white">
                                <i className="fas fa-users"></i> Clients
                            </Link></li>
                            <li className="nav-item"><Link to="/Historique" className="nav-link text-white">
                                <i className="fas fa-folder-open"></i> Historique
                            </Link></li>
                        </>
                    )}
                    {user.role === 0 && (
                        <>
                            <li className="nav-item my-2"><Link to="/liste_utilisateur" className="nav-link text-white">
                                <i className="fas fa-user-friends"></i> Utilisateurs
                            </Link></li>
                            <li className="nav-item my-2"><Link to="/liste_produit" className="nav-link text-white">
                                <i className="fas fa-box-open"></i> Produits
                            </Link></li>
                            <li className="nav-item my-2"><Link to="/liste_service" className="nav-link text-white">
                                <i className="fas fa-tools"></i> Services
                            </Link></li>
                        </>
                    )}
                </ul>

                <div className="sidebar-footer p-3 mt-auto">
                    <button className="btn btn-danger w-100" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i> Déconnexion
                    </button>
                </div>
            </div>

            {/* Overlay pour mobile */}
            {showSidebar && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setShowSidebar(false)}
                ></div>
            )}

            {/* CSS intégré */}
            <style jsx>{`
                .sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 250px;
                    z-index: 1000;
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar.show {
                    transform: translateX(0);
                }

                .sidebar-content {
                    flex: 1;
                    overflow-y: auto;
                }

                .sidebar-footer {
                    background-color: rgba(0, 0, 0, 0.2);
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    display: none;
                }

                .nav-link {
                    border-radius: 4px;
                    transition: all 0.2s;
                }

                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    padding-left: 10px;
                }

                @media (max-width: 767.98px) {
                    .sidebar-overlay {
                        display: block;
                    }
                }

                @media (min-width: 768px) {
                    .sidebar {
                        transform: translateX(0);
                    }

                    .main-content {
                        margin-left: 250px;
                    }
                }
            `}</style>
        </>
    );
}

// import React, {useEffect, useState} from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import Mylogo from '../assets/img/upscalemedia-transformed.jpeg';
// import { getApiUrl } from "../Link/URL";
//
// export default function Headers({ user, setUser }) {
//     const navigate = useNavigate();
//     const [count, setCount] = useState(null);
//
//     const handleLogout = async () => {
//         try {
//             // First ensure we have CSRF cookies
//             await fetch("http://localhost:8000/sanctum/csrf-cookie", {
//                 credentials: 'include',
//                 headers: {
//                     'Accept': 'application/json',
//                     'X-Requested-With': 'XMLHttpRequest'
//                 }
//             });
//
//             // Then make the logout request with proper headers
//             const response = await fetch(getApiUrl("logout"), {
//                 method: "POST",
//                 headers: {
//                     "Accept": "application/json",
//                     "Content-Type": "application/json",
//                     "X-Requested-With": "XMLHttpRequest"
//                 },
//                 credentials: "include" // Important for sending cookies
//             });
//
//             // Handle response regardless of status for logout
//             if (response.ok || response.status === 401) {
//                 // 401 means already logged out, which is fine
//                 setUser(null);
//                 navigate("/login");
//             } else {
//                 const errorText = await response.text();
//                 console.error("Logout error:", errorText);
//
//                 // Still redirect to login even if logout failed on server
//                 setUser(null);
//                 navigate("/login");
//             }
//         } catch (error) {
//             console.error("Network error during logout:", error);
//
//             // Still redirect to login even if network error occurred
//             setUser(null);
//             navigate("/login");
//         }
//     };
//
//     const count_factures = async () => {
//         try {
//             const reponse = await fetch(getApiUrl('factures/count_facture_statut/0'));
//             if (!reponse.ok){
//                 throw new Error("erreur lors du compte");
//             }
//             const data = await reponse.json();
//             setCount(data || 0);
//
//         }catch (e) {
//             console.error(e.message);
//             alert("on peut pas compter")
//         }
//     }
//
//     useEffect(() => {
//         count_factures();
//     }, []);
//
//     return (
//         <header className="navbar navbar-dark bg-dark shadow-sm px-4 mb-4" style={{ height: '70px' }}>
//             <div className="container-fluid d-flex align-items-center justify-content-between h-100">
//
//                 {/* Logo */}
//                 <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
//                     <img src={Mylogo} alt="Smart Print" style={{ height: '35px', borderRadius:'50%' }} />
//                     <span className="text-white fw-bold fs-5">Smart Print & Design</span>
//                 </Link>
//
//                 {user && (
//                     <>
//                         <ul className="nav align-items-center ms-auto me-3" style={{gap: '15px'}}>
//                             <li><Link to="/" className="nav-link text-white">
//                                 <i className="fas fa-home"></i> Home
//                             </Link></li>
//                             {user.role === 2 && (
//                                 <>
//                                     <li><Link to="/factures" className="nav-link text-white">
//                                         <i className="fas fa-money-check-alt"></i> Factures <sup className="badge rounded-pill bg-danger">{count}</sup>
//                                     </Link></li>
//                                     {/*<li><Link to="/liste_client" className="nav-link text-white">*/}
//                                     {/*    <i className="fas fa-users"></i> Clients*/}
//                                     {/*</Link></li>*/}
//                                     <li><Link to="/liste_produit" className="nav-link text-white">
//                                         <i className="fas fa-box-open"></i> Produits
//                                     </Link></li>
//                                     <li><Link to="/liste_service" className="nav-link text-white">
//                                         <i className="fas fa-tools"></i> Services
//                                     </Link></li>
//                                     <li><Link to="/Historique" className="nav-link text-white">
//                                         <i className="fas fa-folder-open"></i> Historique
//                                     </Link></li>
//                                 </>
//                             )}
//                             {user.role === 1 && (
//                                 <>
//                                     <li><Link to="/liste_facture" className="nav-link text-white">
//                                         <i className="fas fa-money-check-alt"></i> Facturation
//                                     </Link></li>
//                                     <li><Link to="/liste_client" className="nav-link text-white">
//                                         <i className="fas fa-users"></i> Clients
//                                     </Link></li>
//                                     <li><Link to="/Historique" className="nav-link text-white">
//                                         <i className="fas fa-folder-open"></i> Historique
//                                     </Link></li>
//                                 </>
//                             )}
//                             {user.role === 0 && (
//                                 <>
//                                     <li><Link to="/liste_utilisateur" className="nav-link text-white">
//                                         <i className="fas fa-user-friends"></i> Utilisateurs
//                                     </Link></li>
//                                     <li><Link to="/liste_produit" className="nav-link text-white">
//                                         <i className="fas fa-box-open"></i> Produits
//                                     </Link></li>
//                                     <li><Link to="/liste_service" className="nav-link text-white">
//                                         <i className="fas fa-tools"></i> Services
//                                     </Link></li>
//                                 </>
//                             )}
//                         </ul>
//
//                         <div className="d-flex align-items-center gap-3">
//                             {/*<span className="text-white d-none d-md-inline">*/}
//                             {/*    <i className="fas fa-user-circle me-2"></i>*/}
//                             {/*    {user.name}*/}
//                             {/*</span>*/}
//                             <button
//                                 type="button"
//                                 className="btn btn-outline-light"
//                                 onClick={handleLogout}
//                             >
//                                 <i className="fas fa-sign-out-alt me-2"></i>
//                                 Déconnexion
//                             </button>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </header>
//     );
// }