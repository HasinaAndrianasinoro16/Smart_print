import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './assets/dist/js/bootstrap.bundle.min';
import './assets/fontawesome-5/css/all.min.css';
import './assets/fontawesome-5/css/all.css';
import './assets/dist/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "./App.css";

import Headers from "./Body/Headers";
import Facturation from "./Page/Facturation";
import InfoFacture from "./Components/InfoFacture";
import HistoiqueFacture from "./Page/HitsoriqueFacture";
import ListeClient from "./Page/ListeClient";
import ListeProduit from "./Page/ListeProduit";
import ListeService from "./Page/ListeService";
import ListeFactureManager from "./Page/ListeFactureManager";
import Login from "./Page/Login";
import Home from "./Page/Home";
import ListUsers from "./Page/ListUsers";
import { getApiUrl } from "./Link/URL";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // 1. Récupérer le cookie CSRF en premier
                await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                // 2. Récupérer les infos utilisateur
                const response = await fetch(getApiUrl("user"), {
                    credentials: "include",
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });

                if (!response.ok) throw new Error("Non connecté");
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div className="d-flex justify-content-center mt-5">Chargement...</div>;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            </Routes>
            <div  className="app-container">
            {user && <Headers user={user} setUser={setUser} />}
                <main className="main-content">
            <Routes>
                <Route path="/" element={user ? <Home user={user}/> : <Navigate to="/login" /> }/>
                <Route path="/liste_facture" element={user ? <Facturation user={user} /> : <Navigate to="/login" />} />
                <Route path="/info" element={user ? <InfoFacture /> : <Navigate to="/login" />} />
                <Route path="/factures" element={user ? <ListeFactureManager/> : <Navigate to="/login"/>}/>
                <Route path="/Historique" element={user ? <HistoiqueFacture /> : <Navigate to="/login" />} />
                <Route path="/liste_client" element={user ? <ListeClient /> : <Navigate to="/login" />} />
                <Route path="/liste_produit" element={user ? <ListeProduit /> : <Navigate to="/login" />} />
                <Route path="/liste_service" element={user ? <ListeService /> : <Navigate to="/login" />} />
                <Route path="/liste_utilisateur" element={user ? <ListUsers /> : <Navigate to="/login" />} />
            </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;