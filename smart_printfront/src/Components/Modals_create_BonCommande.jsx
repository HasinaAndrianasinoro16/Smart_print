import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { getApiUrl } from "../Link/URL";

export default function Modals_create_BonCommande({ facture }) {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const form_add_facture = async () => {
        if (!file) {
            alert("Veuillez sélectionner un fichier !");
            return;
        }

        // Validate file size (7MB max)
        if (file.size > 7 * 1024 * 1024) {
            alert("Le fichier est trop volumineux (max 7MB)");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("commande", file);
        formData.append("facture", facture);

        try {
            const response = await fetch(getApiUrl('boncommandes/add'), {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    // Let browser set Content-Type automatically
                },
            });

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Server error: ${text.substring(0, 100)}...`);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || "Erreur inconnue");
            }

            alert("✅ Fichier envoyé avec succès !");
            return data;
        } catch (error) {
            console.error("Erreur:", error);
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-3">
                <label>Numéro de Facture :</label>
                <InputText value={facture} className="w-100" readOnly />
            </div>

            <div className="mb-3">
                <label>Fichier Bon de Commande :</label>
                <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                    className="form-control"
                />
            </div>

            <div className="text-center">
                <button
                    className="w-50 btn btn-success"
                    onClick={form_add_facture}
                    disabled={isLoading}
                >
                    {isLoading ? "Envoi..." : "Ajouter"} <i className="fas fa-plus"/>
                </button>
            </div>
        </div>
    );
}