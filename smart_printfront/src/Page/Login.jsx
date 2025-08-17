import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyLogo from "../assets/img/upscalemedia-transformed-removebg.png";
import {getApiUrl, getCookie} from "../Link/URL";
import '../assets/dist/js/bootstrap.bundle.min';
import '../assets/fontawesome-5/css/all.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import '../assets/fontawesome-5/css/all.css';
import '../assets/dist/css/bootstrap.min.css';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Récupérer le cookie CSRF
            const csrfResponse = await fetch(getCookie(), {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!csrfResponse.ok) {
                throw new Error("Échec de la récupération du cookie CSRF");
            }

            // 2. Extraire le token CSRF des cookies
            const getCookie = (name) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            };
            const csrfToken = getCookie('XSRF-TOKEN');

            // 3. Faire le login avec le token CSRF
            const response = await fetch(getApiUrl("login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-XSRF-TOKEN": csrfToken ? decodeURIComponent(csrfToken) : '',
                    "X-Requested-With": "XMLHttpRequest"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Identifiants invalides");
            }

            // 4. Récupérer les infos utilisateur
            const userResponse = await fetch(getApiUrl("user"), {
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                }
            });

            if (!userResponse.ok) throw new Error("Impossible de récupérer l'utilisateur");

            const user = await userResponse.json();
            setUser(user);

            if(user.role === 0){
                console.log('Redirecting admin to user management');
                navigate('/liste_utilisateur');
            }else if (user.role === 1){
                console.log('Redirecting standard user to home');
                navigate('/liste_facture');
            }else if (user.role === 2){
                console.log('Redirecting privileged user to history');
                navigate('/Historique');
            }else{
                console.warn(`Unknown user role: ${user.role}`);
                navigate('/lol');
            }

            // Redirection basée sur le rôle avec messages de debug
            // switch(user.role) {
            //     case 0:

            //         break;
            //     case 1:

            //         break;
            //     case 2:

            //         break;
            //     default:

            // }
        } catch (err) {
            setError(err.message || "Une erreur est survenue lors de la connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 mb-3">Smart Print + Design</h1>
                    <p className="col-lg-10 fs-4">
                        Bienvenue sur Smart Print + Design, ceci est la page de connexion pour les Utilisateurs.
                    </p>
                </div>
                <div className="col-md-10 mx-auto col-lg-5">
                    <form className="p-4 p-md-5 border rounded-3 bg-light" onSubmit={handleSubmit}>
                        <div className="text-center">
                            <img src={MyLogo} alt="Logo" width="140" className="mb-3" />
                            <h2 className="h4 mb-4">Connexion administrateur</h2>
                        </div>

                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="form-floating mb-3">
                            <input
                                type="email"
                                className="form-control"
                                id="floatingInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <label htmlFor="floatingInput">Adresse Email</label>
                        </div>

                        <div className="form-floating mb-3">
                            <input
                                type="password"
                                className="form-control"
                                id="floatingPassword"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <label htmlFor="floatingPassword">Mot de passe</label>
                        </div>

                        <button
                            className="w-100 btn btn-lg btn-success"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Connexion en cours...
                                </>
                            ) : (
                                'Connexion'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}