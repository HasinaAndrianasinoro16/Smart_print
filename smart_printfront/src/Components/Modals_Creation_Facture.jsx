import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from "primereact/inputtextarea";
import { ProgressSpinner } from "primereact/progressspinner";
import {getApiUrl, getCookie} from "../Link/URL";

export default function Modals_Creation_Facture({ onSuccess, onClose }) {
    const [formData, setFormData] = useState({
        client: null,
        date_emission: null,
        date_echeance: null,
        condition_paiement: ''
    });
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const fetchClients = async () => {
        try {
            const response = await fetch(getApiUrl('clients'), {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des clients");
            }

            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger la liste des clients");
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleSubmit = async () => {
        if (!formData.client || !formData.date_emission || !formData.date_echeance) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const csrfToken = await getCsrfToken();
            console.log(formData);

            const response = await fetch(getApiUrl('factures/add'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    client: formData.client.id,
                    date_emission: formData.date_emission.toISOString().split('T')[0],
                    date_echeance: formData.date_echeance.toISOString().split('T')[0],
                    condition_paiement: formData.condition_paiement
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la création de la facture");
            }

            const newFacture = await response.json();
            alert("Facture créée avec succès ✅");

            // Réinitialiser le formulaire
            setFormData({
                client: null,
                date_emission: null,
                date_echeance: null,
                condition_paiement: ''
            });

            onClose();

            // Appeler le callback de succès si fourni
            if (onSuccess) onSuccess(newFacture);

        } catch (error) {
            console.error("Erreur:", error);
            setError(error.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
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
                <div className="col-12">
                    <div className="mb-4">
                        <label className="form-label">
                            Client <span className="text-danger">*</span>
                        </label>
                        <Dropdown
                            value={formData.client}
                            onChange={(e) => handleInputChange('client', e.value)}
                            options={clients}
                            optionLabel="nom"
                            placeholder="Sélectionner un client"
                            filter
                            className="w-100"
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-4">
                        <div>
                            <label className="form-label">
                                Date d'émission <span className="text-danger">*</span>
                            </label>
                            <Calendar
                                value={formData.date_emission}
                                onChange={(e) => handleInputChange('date_emission', e.value)}
                                dateFormat="dd/mm/yy"
                                showButtonBar
                                className="w-100"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="form-label">
                                Date d'échéance <span className="text-danger">*</span>
                            </label>
                            <Calendar
                                value={formData.date_echeance}
                                onChange={(e) => handleInputChange('date_echeance', e.value)}
                                dateFormat="dd/mm/yy"
                                showButtonBar
                                className="w-100"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            Conditions de paiement
                        </label>
                        <InputTextarea
                            value={formData.condition_paiement}
                            onChange={(e) => handleInputChange('condition_paiement', e.target.value)}
                            rows={3}
                            className="w-100"
                            disabled={loading}
                        />
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`px-4 py-2 rounded-md text-white font-medium flex items-center bg-primary
                                      ${loading ? 'bg-primary' : 'bg-primary hover:bg-primary'} 
                                      transition-colors duration-200`}
                        >
                        {loading ? (
                            <>
                                <ProgressSpinner
                                    style={{ width: '20px', height: '20px' }}
                                    strokeWidth="6"
                                    className="mr-2"
                                />
                                Création en cours...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-file-invoice mr-2"></i>
                                Créer la facture
                            </>
                        )}
                    </button>
                    </div>
                </div>
            </div>
        </div>
    );
}