import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './assets/dist/js/bootstrap.bundle.min';
import './assets/fontawesome-5/css/all.min.css';
import './assets/fontawesome-5/css/all.css';
import './assets/dist/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";

import Headers from "./Body/Headers";
import Facturation from "./Page/Facturation";
import Info_facture from "./Components/Info_facture";
import Histoique_facture from "./Page/Hitsorique_facture";
import Liste_Client from "./Page/Liste_Client";
import Liste_produit from "./Page/Liste_produit";
import Liste_service from "./Page/Liste_service";
import Login from "./Page/Login";
import List_users from "./Page/List_users";
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
            {user && <Headers user={user} setUser={setUser} />}
            <Routes>
                <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <Facturation /> : <Navigate to="/login" />} />
                <Route path="/info" element={user ? <Info_facture /> : <Navigate to="/login" />} />
                <Route path="/Historique" element={user ? <Histoique_facture /> : <Navigate to="/login" />} />
                <Route path="/liste_client" element={user ? <Liste_Client /> : <Navigate to="/login" />} />
                <Route path="/liste_produit" element={user ? <Liste_produit /> : <Navigate to="/login" />} />
                <Route path="/liste_service" element={user ? <Liste_service /> : <Navigate to="/login" />} />
                <Route path="/liste_utilisateur" element={user ? <List_users /> : <Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;