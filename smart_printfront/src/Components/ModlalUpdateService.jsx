import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { ProgressSpinner } from "primereact/progressspinner";
import {getApiUrl, getCookie} from "../Link/URL";

export default function Modal_update_service({ idService, onClose }) {
    const [formData, setFormData] = useState({
        designation: '',
        prix: null
    });
    const [loading, setLoading] = useState({
        fetch: true,
        submit: false
    });
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

    const fetchServiceInfo = async () => {
        try {
            const response = await fetch(getApiUrl(`services/${idService}`), {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la récupération du service");
            }

            const data = await response.json();
            const service = Array.isArray(data) ? data[0] : data;

            if (!service?.designation || service?.prix === undefined) {
                throw new Error("Données de service invalides");
            }

            setFormData({
                designation: service.designation,
                prix: service.prix
            });
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger les informations du service");
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchServiceInfo();
    }, [idService]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setError('');
    };

    const handleNumberChange = (value) => {
        setFormData(prev => ({ ...prev, prix: value }));
        setError('');
    };

    const updateService = async () => {
        if (!formData.designation.trim() || formData.prix === null) {
            setError("Veuillez remplir tous les champs");
            return;
        }

        setLoading(prev => ({ ...prev, submit: true }));
        setError('');

        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(getApiUrl(`services/update/${idService}`), {
                method: 'PUT',
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
                throw new Error(errorData.message || "Erreur lors de la modification du service");
            }

            alert("Service modifié avec succès ✅");
            if (onClose) onClose();

        } catch (error) {
            console.error("Erreur:", error);
            setError(error.message || "Une erreur est survenue");
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    };

    if (loading.fetch) {
        return (
            <div className="flex justify-center items-center p-8">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="p-4">
            {error && (
                <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md flex items-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {error}
                </div>
            )}

            <div className="row">
                {/*<div className="col-md-12">*/}
                    <div className="col-md-6 mb-4">
                        <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                            Désignation :
                        </label>
                        <div className="py-1"/>
                        <InputText
                            id="designation"
                            value={formData.designation}
                            onChange={handleInputChange}
                            className="w-full"
                            required
                            disabled={loading.submit}
                        />
                    </div>

                    <div className="col-md-6 mb-4">
                        <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
                            Prix unitaire (MGA) :
                        </label>
                        <div className="py-1"/>
                        <InputNumber
                            inputId="prix"
                            value={formData.prix}
                            onValueChange={(e) => handleNumberChange(e.value)}
                            mode="currency"
                            currency="MGA"
                            locale="fr-FR"
                            className="w-full"
                            disabled={loading.submit}
                        />
                    </div>
                {/*</div>*/}
            </div>

            <div className="text-center flex justify-center mt-6">
                <button
                    onClick={updateService}
                    disabled={loading.submit}
                    className={`px-4 py-2 rounded-md text-white font-medium flex items-center
                              ${loading.submit ? 'bg-warning' : 'bg-warning hover:bg-warning'} 
                              transition-colors duration-200`}
                >
                    {loading.submit ? (
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
                            Enregistrer les modifications
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}