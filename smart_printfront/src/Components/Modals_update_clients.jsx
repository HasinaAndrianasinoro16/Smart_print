import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ProgressSpinner } from "primereact/progressspinner";
import { getApiUrl } from "../Link/URL";

export default function Modals_update_clients({ idClients, onClose }) {
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

    const getCsrfToken = async () => {
        try {
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
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

    const fetchClientInfo = async () => {
        try {
            const response = await fetch(getApiUrl(`clients/${idClients}`), {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération du client");
            }

            const data = await response.json();
            setFormData({
                nom: data.nom || '',
                adresse: data.adresse || '',
                email: data.email || '',
                telephone: data.telephone || '',
                nif: data.nif || null,
                stat: data.stat || null,
                rcs: data.rcs || '',
                code: data.code || ''
            });
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger les informations du client");
        }
    };

    useEffect(() => {
        fetchClientInfo();
    }, [idClients]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setError('');
    };

    const handleNumberChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const updateClient = async () => {
        // Validation
        if (Object.values(formData).some(val => val === '' || val === null)) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(getApiUrl(`clients/update/${idClients}`), {
                method: 'PUT',
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
                throw new Error(errorData.message || "Erreur lors de la modification du client");
            }

            alert("Client modifié avec succès ✅");
            if (onClose) onClose();

        } catch (error) {
            console.error("Erreur:", error);
            setError(error.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {error && (
                <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md flex items-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>
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
                            onChange={handleInputChange}
                            className="w-100"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="adresse">Adresse :</label>
                        <InputText
                            id="adresse"
                            value={formData.adresse}
                            onChange={handleInputChange}
                            className="w-100"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email :</label>
                        <InputText
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-100"
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telephone">Téléphone :</label>
                        <InputText
                            id="telephone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            className="w-100"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="code">Code client :</label>
                        <InputText
                            id="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            className="w-100"
                            required
                            disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rcs">RCS :</label>
                        <InputText
                            id="rcs"
                            value={formData.rcs}
                            onChange={handleInputChange}
                            className="w-100"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center mt-4">
                <button
                    className={`px-4 py-2 rounded-md text-white font-medium
                              ${loading ? 'bg-warning' : 'bg-warning hover:bg-warning'}
                              transition-colors duration-200`}
                    onClick={updateClient}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <ProgressSpinner
                                style={{ width: '20px', height: '20px' }}
                                strokeWidth="6"
                                className="mr-2"
                            />
                            Enregistrement...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-save mr-2"></i>
                            Modifier le client
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}