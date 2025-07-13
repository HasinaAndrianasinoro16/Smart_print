import React, { useEffect, useState } from "react";
import { getApiUrl } from "../Link/URL";
import { InputText } from "primereact/inputtext";

export default function Modal_update_service({ idService, onClose }) {
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(getApiUrl('services/' + idService));
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération du service");
                }

                const data = await response.json();
                const service = Array.isArray(data) ? data[0] : data;

                if (service && service.designation) {
                    setDesignation(service.designation);
                }
            } catch (e) {
                console.error("Erreur:", e.message);
                alert("Erreur lors du chargement des données du service.");
            }
        };

        fetchData();
    }, [idService]);

    const update_service = async () => {
        if (designation.trim() === "") {
            alert("Veuillez remplir le champ de désignation.");
            return;
        }

        const serviceData = {
            designation: designation.trim(),
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
                            required
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
