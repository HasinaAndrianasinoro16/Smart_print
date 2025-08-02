import React, { useState } from "react";
import { getApiUrl } from "../Link/URL";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export default function Modals_Create_Service({ onClose }) {
    const [designation, setDesignation] = useState('');
    const [prix, setPrix] = useState(null);

    const save_services = async () => {
        if (designation.trim() === "" || prix === null) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        const serviceData = {
            designation: designation.trim(),
            prix,
        };

        try {
            const reponse = await fetch(getApiUrl('services/add'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(serviceData),
            });

            if (!reponse.ok) {
                throw new Error("Erreur lors de l'ajout du service");
            }

            alert("Service ajouté avec succès ✅");
            setDesignation("");
            setPrix(null);
            onClose();
        } catch (e) {
            alert("Erreur : " + e.message);
            console.error(e);
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">Désignation :</label>
                        <InputText
                            id="nom"
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
                <button className="w-50 btn btn-success" onClick={save_services}>
                    Ajouter <i className="fas fa-plus" />
                </button>
            </div>
        </div>
    );
}
