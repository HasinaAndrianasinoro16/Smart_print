import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ProgressSpinner } from "primereact/progressspinner";
import {getApiUrl, getCookie} from "../Link/URL";

export default function Modals_Create_Service({ onClose }) {
    const [formData, setFormData] = useState({
        designation: '',
        prix: null
    });
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

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNumberChange = (value) => {
        setFormData(prev => ({ ...prev, prix: value }));
    };



    const saveService = async () => {
        if (!formData.designation.trim() || formData.prix === null) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(getApiUrl('services/add'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({
                    designation: formData.designation.trim(),
                    prix: formData.prix
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'ajout du service");
            }

            alert("Service ajouté avec succès ✅");
            setFormData({ designation: '', prix: null });
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
                <div className="col-md-12">
                    <div className="mb-4">
                        <label htmlFor="designation" className="form-label">
                            Désignation :
                        </label>
                        <InputText
                            id="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            className="w-100"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="prix" className="form-label">
                            Prix unitaire (MGA) :
                        </label>
                        <InputNumber
                            inputId="prix"
                            value={formData.prix}
                            onValueChange={(e) => handleNumberChange(e.value)}
                            mode="currency"
                            currency="MGA"
                            locale="fr-FR"
                            className="w-100"
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={saveService}
                    disabled={loading}
                    className={`px-4 py-2 rounded-md text-white font-medium flex items-center bg-success
                              ${loading ? 'bg-sucsess' : 'bg-sucsess hover:bg-sucsess'} 
                              transition-colors duration-200`}
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
                            Enregistrer le service
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}