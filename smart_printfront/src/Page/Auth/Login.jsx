import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyLogo from "../assets/img/upscalemedia-transformed.jpeg";

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
                credentials: "include", // très important pour la session
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error("Identifiants invalides");
            }

            // récupérer les infos de l'utilisateur connecté
            const userResponse = await fetch("http://localhost:8000/api/user", {
                credentials: "include"
            });

            if (!userResponse.ok) throw new Error("Impossible de récupérer l'utilisateur");

            const user = await userResponse.json();
            setUser(user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl border">
                <div className="text-center mb-6">
                    <img src={MyLogo} alt="Logo" className="h-20 mx-auto mb-2" />
                    <h1 className="text-2xl font-semibold text-gray-700">Connexion</h1>
                </div>
                {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm text-gray-600">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}
