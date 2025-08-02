import React, { useEffect, useState } from "react";
import { getApiUrl } from "../Link/URL";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";

export default function ServiceForm({ facture }) {
    const [lignes, setLignes] = useState([
        { service: null, prixUnitaire: 0 }
    ]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(getApiUrl('services'));
                if (!response.ok) throw new Error("Erreur lors de la récupération des services");
                const data = await response.json();

                const formattedServices = data.map(service => ({
                    ...service,
                    prix: parseFloat(service.prix)
                }));

                setServices(formattedServices);
            } catch (e) {
                console.error(e);
            }
        };
        fetchServices();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...lignes];
        updated[index][field] = value;

        if (field === 'service' && value) {
            updated[index]['prixUnitaire'] = parseFloat(value.prix) || 0;
        }

        setLignes(updated);
    };

    const addLigne = () => {
        setLignes([...lignes, { service: null, prixUnitaire: 0 }]);
    };

    const removeLigne = (index) => {
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

    const submitForm = async () => {
        try {
            for (let ligne of lignes) {
                if (!ligne.service) continue;

                const payload = {
                    facture: facture,
                    designation: ligne.service.designation,
                    prix: ligne.prixUnitaire
                };


                const response = await fetch(getApiUrl('services/service-facture'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de l'ajout");
                }
            }

            alert("Services ajoutés avec succès !");
            setLignes([{ service: null, prixUnitaire: 0 }]);

        } catch (e) {
            console.error(e);
            alert("Erreur lors de l'ajout des services");
        }
    };

    return (
        <div className="p-4">
            <h3 className="mb-4">Facture : {facture ? `${facture}` : ''}</h3>
            <table className="table w-full">
                <thead>
                <tr>
                    <th>Service</th>
                    <th>Prix unitaire HT</th>
                    <th>Prix total HT</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {lignes.map((ligne, index) => (
                    <tr key={index}>
                        <td>
                            <Dropdown
                                value={ligne.service}
                                options={services}
                                onChange={(e) => handleChange(index, 'service', e.value)}
                                optionLabel="designation"
                                placeholder="Sélectionner un service"
                                className="w-full"
                            />
                        </td>
                        <td>
                            <InputNumber
                                value={ligne.prixUnitaire}
                                disabled
                                mode="currency"
                                currency="MGA"
                                locale="fr-FR"
                            />
                        </td>
                        <td>
                            {(typeof ligne.prixUnitaire === 'number'
                                    ? ligne.prixUnitaire
                                    : parseFloat(ligne.prixUnitaire) || 0
                            ).toFixed(2)} Ar
                        </td>
                        <td>
                            <Button
                                icon="fas fa-trash"
                                className="p-button-danger"
                                onClick={() => removeLigne(index)}
                                disabled={lignes.length === 1}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-3">
                <Button icon="fas fa-plus" label="Ajouter une ligne" onClick={addLigne} />
            </div>

            <div className="mt-5 flex justify-content-end">
                <table>
                    <tbody>
                    <tr>
                        <td><strong>Total HT:</strong></td>
                        <td>{calculTotalHT().toFixed(2)} Ar</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-4">
                <Button className="p-button-success" label="Ajouter le(s) service(s)" onClick={submitForm} />
            </div>
        </div>
    );
}
