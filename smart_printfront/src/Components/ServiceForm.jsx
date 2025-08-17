import React, { useEffect, useState } from "react";
import {getApiUrl, getCookie} from "../Link/URL";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

export default function ServiceForm({ facture, onSuccess }) {
    const [lignes, setLignes] = useState([{ service: null, prixUnitaire: 0 }]);
    const [services, setServices] = useState([]);
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

    const fetchServices = async () => {
        try {
            const response = await fetch(getApiUrl('services'), {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Erreur lors de la récupération des services");

            const data = await response.json();
            const formattedServices = data.map(service => ({
                ...service,
                prix: parseFloat(service.prix) || 0
            }));

            setServices(formattedServices);
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger la liste des services");
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...lignes];
        updated[index][field] = value;

        if (field === 'service' && value) {
            updated[index]['prixUnitaire'] = parseFloat(value.prix) || 0;
        }

        setLignes(updated);
        setError('');
    };

    const addLigne = () => {
        setLignes([...lignes, { service: null, prixUnitaire: 0 }]);
    };

    const removeLigne = (index) => {
        if (lignes.length <= 1) return;
        const updated = lignes.filter((_, i) => i !== index);
        setLignes(updated);
    };

    const calculTotalHT = () =>
        lignes.reduce((total, ligne) => {
            const prix = typeof ligne.prixUnitaire === 'number'
                ? ligne.prixUnitaire
                : parseFloat(ligne.prixUnitaire) || 0;
            return total + prix;
        }, 0);

    const validateForm = () => {
        const hasEmptyService = lignes.some(ligne => !ligne.service);
        if (hasEmptyService) {
            setError("Veuillez sélectionner un service pour chaque ligne");
            return false;
        }
        return true;
    };

    const submitForm = async () => {
        if (!validateForm()) return;

        setLoading(prev => ({ ...prev, submit: true }));
        setError('');

        try {
            const csrfToken = await getCsrfToken();
            const promises = lignes.map(ligne => {
                if (!ligne.service) return Promise.resolve();

                const payload = {
                    facture: facture,
                    designation: ligne.service.designation,
                    prix: ligne.prixUnitaire
                };

                return fetch(getApiUrl('services/service-facture'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
            });

            const results = await Promise.all(promises);
            const allSuccess = results.every(res => !res || res.ok);

            if (!allSuccess) {
                throw new Error("Certains services n'ont pas pu être ajoutés");
            }

            alert("Services ajoutés avec succès ✅");
            setLignes([{ service: null, prixUnitaire: 0 }]);
            if (onSuccess) onSuccess();

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

            <h3 className="mb-4 text-xl font-semibold">Facture : {facture || 'N/A'}</h3>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Service</th>
                        <th className="p-3 text-left">Prix unitaire HT</th>
                        <th className="p-3 text-left">Prix total HT</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lignes.map((ligne, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3">
                                <Dropdown
                                    value={ligne.service}
                                    options={services}
                                    onChange={(e) => handleChange(index, 'service', e.value)}
                                    optionLabel="designation"
                                    placeholder="Sélectionner un service"
                                    className="w-full"
                                    disabled={loading.submit}
                                />
                            </td>
                            <td className="p-3">
                                <InputNumber
                                    value={ligne.prixUnitaire}
                                    disabled
                                    mode="currency"
                                    currency="MGA"
                                    locale="fr-FR"
                                />
                            </td>
                            <td className="p-3">
                                {(typeof ligne.prixUnitaire === 'number'
                                        ? ligne.prixUnitaire
                                        : parseFloat(ligne.prixUnitaire) || 0
                                ).toLocaleString('fr-FR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })} Ar
                            </td>
                            <td className="p-3">
                                <Button
                                    icon="fas fa-trash"
                                    className="p-button-danger p-button-sm"
                                    onClick={() => removeLigne(index)}
                                    disabled={lignes.length <= 1 || loading.submit}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3">
                <Button
                    icon="fas fa-plus"
                    label="Ajouter une ligne"
                    onClick={addLigne}
                    disabled={loading.submit}
                    className="p-button-secondary"
                />
            </div>

            <div className="mt-5 flex justify-end">
                <table className="w-auto">
                    <tbody>
                    <tr>
                        <td className="p-2"><strong>Total HT:</strong></td>
                        <td className="p-2 text-right">
                            {calculTotalHT().toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} Ar
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-4">
                <Button
                    label={loading.submit ? "Enregistrement..." : "Ajouter le(s) service(s)"}
                    icon={loading.submit ? "pi pi-spinner pi-spin" : "pi pi-check"}
                    onClick={submitForm}
                    disabled={loading.submit}
                    className="btn btn-success"
                />
            </div>
        </div>
    );
}