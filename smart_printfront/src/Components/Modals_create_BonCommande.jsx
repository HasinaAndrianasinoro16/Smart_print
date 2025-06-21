import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import {getApiUrl} from "../Link/URL";

export default function Modals_create_BonCommande({ facture }) {
    const [file, setFile] = useState(null);

    const form_add_facture = async () => {
        if (!file) {
            alert("Veuillez sélectionner un fichier !");
            return;
        }

        const formData = new FormData();
        formData.append("fichier", file);
        formData.append("facture", facture);
        try {
            const response = await fetch(getApiUrl('boncommandes/add'), {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert("Fichier envoyé avec succès !");
                console.log(data);
            } else {
                alert("Erreur : " + data.message);
            }
        } catch (error) {
            console.error("Erreur lors de l’envoi :", error);
            alert("Erreur lors de l’envoi du fichier !");
        }
    };

    return (
        <div>
            <div className="mb-3">
                <label>Numéro de Facture :</label>
                <InputText value={facture} disabled={true} />
            </div>

            <div className="mb-3">
                <label>Fichier Bon de Commande :</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                />
            </div>

            <div className="text-center">
                <button className="w-50 btn btn-success" onClick={form_add_facture}>
                    Ajouter <i className="fas fa-plus" />
                </button>
            </div>
        </div>
    );
}
