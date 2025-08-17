import React, {useState} from "react";
import {getApiUrl, getCookie} from "../Link/URL";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";

export default function Modal_Create_Users({onClose}){
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const RoleStatic = [
        { id: 1, nom: 'Facturier' },
        { id: 2, nom: 'Manager' },
        { id: 0, nom: 'Administrateur' },
    ];

    const getCsrfToken = async () => {
        try {
            // Récupérer le cookie CSRF
            await fetch(getCookie(), {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            // Extraire le token des cookies
            const value = `; ${document.cookie}`;
            const parts = value.split(`; XSRF-TOKEN=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        } catch (error) {
            console.error("Erreur CSRF token:", error);
            throw error;
        }
    };

    const save_users = async () => {
        if (nom.trim() === "" || email.trim() === "" || password.trim() === "" || role === null){
            alert("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);

        try {
            // 1. Récupérer le token CSRF
            const csrfToken = await getCsrfToken();

            // 2. Préparer les données
            const userData = {
                name: nom.trim(),
                email: email.trim(),
                password: password.trim(),
                role: role,
            };

            // 3. Envoyer la requête
            const response = await fetch(getApiUrl('users/add'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken ? decodeURIComponent(csrfToken) : '',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'ajout de l'utilisateur");
            }

            alert("Utilisateur ajouté avec succès");
            setNom("");
            setEmail("");
            setPassword("");
            setRole(null);
            onClose();

        } catch (error) {
            console.error("Erreur:", error.message);
            alert(error.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">Nom utilisateur :</label>
                        <InputText
                            id="nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            className="w-100"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email :</label>
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-100"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mot de passe :</label>
                        <InputText
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-100"
                            required
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label htmlFor="role" className="form-label">Role :</label>
                        <Dropdown
                            value={role}
                            onChange={(e) => setRole(e.value)}
                            options={RoleStatic}
                            optionLabel="nom"
                            optionValue="id"
                            placeholder="Sélectionner un rôle"
                            className="w-100"
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    className="w-50 btn btn-success"
                    onClick={save_users}
                    disabled={loading}
                >
                    {loading ? (
                        <span>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            En cours...
                        </span>
                    ) : (
                        <span>
                            Ajouter <i className="fas fa-plus"/>
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}