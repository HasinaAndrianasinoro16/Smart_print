import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import {getApiUrl, getCookie} from "../Link/URL";

export default function ModalsAjoutClient({onCLose}) {
    const [formData, setFormData] = useState({
        nom: '',
        adresse: '',
        email: '',
        telephone: '',
        nif: null,
        stat: null,
        rcs: '',
        code: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNumberChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            return decodeURIComponent(cookieValue || '');
        } catch (error) {
            console.error("Erreur CSRF token:", error);
            throw error;
        }
    };

    const saveCLients = async () => {
        // Validation
        if (Object.values(formData).some(val => val === '' || val === null)) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            // 1. Récupérer le token CSRF
            const csrfToken = await getCsrfToken();

            // 2. Envoyer les données
            const response = await fetch(getApiUrl('clients/add'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'ajout du client");
            }

            // Réinitialiser le formulaire après succès
            setFormData({
                nom: '',
                adresse: '',
                email: '',
                telephone: '',
                nif: null,
                stat: null,
                rcs: '',
                code: ''
            });
            onCLose();

            alert("Client ajouté avec succès !");

        } catch (error) {
            console.error("Erreur:", error.message);
            setError(error.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {error && (
                <div className="alert alert-danger mb-4">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}

            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">Nom du client :</label>
                        <InputText
                            id="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            className="w-100"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="adresse">Adresse :</label>
                        <InputText
                            id="adresse"
                            value={formData.adresse}
                            onChange={handleChange}
                            className="w-100"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Adresse Email :</label>
                        <InputText
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-100"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telephone">Téléphone :</label>
                        <InputText
                            id="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            className="w-100"
                            required
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="code">Code client :</label>
                        <InputText
                            id="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="w-100"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nif">NIF :</label>
                        <InputNumber
                            inputId="nif"
                            value={formData.nif}
                            onValueChange={(e) => handleNumberChange('nif', e.value)}
                            mode="decimal"
                            useGrouping={false}
                            className="w-100"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="stat">STAT :</label>
                        <InputNumber
                            inputId="stat"
                            value={formData.stat}
                            onValueChange={(e) => handleNumberChange('stat', e.value)}
                            mode="decimal"
                            useGrouping={false}
                            className="w-100"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rcs">RCS :</label>
                        <InputText
                            id="rcs"
                            value={formData.rcs}
                            onChange={handleChange}
                            className="w-100"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className="btn btn-success px-4 py-2"
                    onClick={saveCLients}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save me-2"></i>
                            Enregistrer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}