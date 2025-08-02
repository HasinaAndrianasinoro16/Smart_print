import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyLogo from "../assets/img/upscalemedia-transformed-removebg.png";
import '../assets/dist/js/bootstrap.bundle.min';
import '../assets/fontawesome-5/css/all.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import '../assets/fontawesome-5/css/all.css';
import '../assets/dist/css/bootstrap.min.css';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error("Identifiants invalides");
            }

            const userResponse = await fetch("http://localhost:8000/api/user", {
                credentials: "include"
            });

            if (!userResponse.ok) throw new Error("Impossible de récupérer l'utilisateur");

            const user = await userResponse.json();
            setUser(user);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container col-xl-10 col-xxl-8 px-4 py-5">
            <div className="row align-items-center g-lg-5 py-5">
                <div className="col-lg-7 text-center text-lg-start">
                    <h1 className="display-4 fw-bold lh-1 mb-3">Smart Print + Design </h1>
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
                            />
                            <label htmlFor="floatingPassword">Mot de passe</label>
                        </div>

                        <button className="w-100 btn btn-lg btn-success" type="submit">
                            Connexion
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
