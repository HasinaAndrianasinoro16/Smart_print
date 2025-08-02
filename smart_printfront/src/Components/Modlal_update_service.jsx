import React, { useEffect, useState } from "react";
import { getApiUrl } from "../Link/URL";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export default function Modal_update_service({ idService, onClose }) {
    const [designation, setDesignation] = useState('');
    const [prix, setPrix] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(getApiUrl('services/' + idService));
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération du service");
                }

                const data = await response.json();
                const service = Array.isArray(data) ? data[0] : data;

                if (service && service.designation && service.prix !== undefined) {
                    setDesignation(service.designation);
                    setPrix(service.prix);
                } else {
                    throw new Error("Données de service invalides");
                }
            } catch (e) {
                console.error("Erreur:", e.message);
                alert("Erreur lors du chargement des données du service.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idService]);

    const update_service = async () => {
        if (designation.trim() === "" || prix === null) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const serviceData = {
            designation: designation.trim(),
            prix,
        };

        try {
            const response = await fetch(getApiUrl('services/update/' + idService), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });

            if (!response.ok) throw new Error("Erreur lors de la modification");

            alert("Service modifié avec succès !");
            onClose();
        } catch (e) {
            console.error("Erreur:", e.message);
            alert("Erreur lors de la modification du service.");
        }
    };

    if (loading) return <div className="text-center py-5">Chargement en cours...</div>;

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="designation" className="form-label">Désignation :</label>
                        <InputText
                            id="designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            className="w-100"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="prix" className="form-label">Prix unitaire :</label>
                        <InputNumber
                            inputId="prix"
                            value={prix}
                            onValueChange={(e) => setPrix(e.value)}
                            useGrouping={true}
                            locale="fr-FR"
                            className="w-100"
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button className="w-50 btn btn-warning" onClick={update_service}>
                    Modifier <i className="fas fa-pen" />
                </button>
            </div>
        </div>
    );
}
