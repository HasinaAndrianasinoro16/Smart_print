import React, { useEffect, useState } from "react";
import { getApiUrl, getCookie } from "../Link/URL";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export default function Modals_update_users({ idUser, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: null
    });
    const [loading, setLoading] = useState({
        fetch: true,
        submit: false
    });
    const [error, setError] = useState('');

    const RoleStatic = [
        { id: 1, nom: 'Facturier' },
        { id: 2, nom: 'Manager' },
        { id: 0, nom: 'Administrateur' },
    ];

    const getCsrfToken = async () => {
        try {
            await fetch(getCookie(), {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN'))
                ?.split('=')[1];

            return decodeURIComponent(cookieValue || '');
        } catch (error) {
            console.error("Erreur CSRF token:", error);
            throw error;
        }
    };

    const fetchUserInfo = async () => {
        try {
            const response = await fetch(getApiUrl(`users/${idUser}`), {
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error("User not found");
            }

            const data = await response.json();
            const user = Array.isArray(data) ? data[0] : data;

            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '', // Ne pas afficher le mot de passe existant pour des raisons de sécurité
                role: user.role || null,
            });
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de récupérer les informations de l'utilisateur.");
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, [idUser]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setError('');
    };

    const handleRoleChange = (e) => {
        setFormData(prev => ({ ...prev, role: e.value }));
        setError('');
    };

    const updateUser = async () => {
        if (!formData.name.trim() || !formData.email.trim() || formData.role === null) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
        }

        // Validation basique de l'email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Veuillez entrer une adresse email valide");
            return;
        }

        setLoading(prev => ({ ...prev, submit: true }));
        setError('');

        try {
            const csrfToken = await getCsrfToken();
            const response = await fetch(getApiUrl(`users/update/${idUser}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    ...(formData.password.trim() && { password: formData.password.trim() }),
                    role: formData.role
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la modification de l'utilisateur.");
            }

            alert("Utilisateur modifié avec succès!");
            if (onClose) onClose();
        } catch (error) {
            console.error("Erreur:", error);
            setError(error.message || "Une erreur est survenue lors de la modification.");
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    };

    if (loading.fetch) {
        return (
            <div className="d-flex justify-content-center align-items-center p-5">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            {error && (
                <div className="alert alert-danger mb-4 d-flex align-items-center">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}

            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">E-mail:</label>
                        <InputText
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            disabled={loading.submit}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Mot de passe:</label>
                        <InputText
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="******"
                            disabled={loading.submit}
                        />
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nom:</label>
                        <InputText
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                            disabled={loading.submit}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="role" className="form-label">Rôle :</label>
                        <Dropdown
                            value={formData.role}
                            onChange={handleRoleChange}
                            options={RoleStatic}
                            optionLabel="nom"
                            optionValue="id"
                            placeholder="Sélectionner un rôle"
                            className="w-100"
                            disabled={loading.submit}
                        />
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={updateUser}
                    disabled={loading.submit}
                    className={`btn btn-warning text-white ${loading.submit ? 'disabled' : ''}`}
                >
                    {loading.submit ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Modification en cours...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save me-2"></i>
                            Enregistrer les modifications
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}