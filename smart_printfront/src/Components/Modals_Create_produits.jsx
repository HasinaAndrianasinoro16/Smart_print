import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { getApiUrl } from "../Link/URL";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Modals_Create_produits({ onClose }) {
    const [formData, setFormData] = useState({
        designation: '',
        prix_unitaire: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleNumberChange = (value) => {
        setFormData(prev => ({ ...prev, prix_unitaire: value }));
    };

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

    const save_produits = async () => {
        if (!formData.designation.trim() || formData.prix_unitaire === null) {
            setError("Veuillez remplir tous les champs.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(getApiUrl('produits/add'), {
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
                    prix_unitaire: formData.prix_unitaire
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de l'ajout du produit");
            }

            alert("Produit ajouté avec succès !");
            setFormData({ designation: '', prix_unitaire: null });
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
                <div className="alert alert-danger mb-4">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                </div>
            )}

            <div className="row">
                <div className="col-md-12">
                    <div className="mb-4">
                        <label htmlFor="designation" className="form-label">Désignation :</label>
                        <InputText
                            id="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            className="w-100"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="prix" className="form-label">Prix unitaire :</label>
                        <InputNumber
                            inputId="prix"
                            value={formData.prix_unitaire}
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

            <div className="text-center mt-4">
                <button
                    className="btn btn-success px-4 py-2"
                    onClick={save_produits}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <ProgressSpinner
                                style={{ width: '20px', height: '20px' }}
                                strokeWidth="6"
                                className="me-2"
                            />
                            En cours...
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