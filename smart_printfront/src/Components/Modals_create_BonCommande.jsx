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
        formData.append("commande", file); // ✅ ici le nom est corrigé
        formData.append("facture", facture);

        try {
            const response = await fetch(getApiUrl('boncommandes/add'), {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            console.log("Réponse du serveur :", data);
            if (response.ok) {
                alert("Fichier envoyé avec succès !");
                console.log(data);
            } else {
                console.error("Erreur complète :", data);
                alert("Erreur : " + (data.error || data.message || "Erreur inconnue"));
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
                <InputText value={facture} className="w-100" />
            </div>

            <div className="mb-3">
                <label>Fichier Bon de Commande :</label>
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
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
