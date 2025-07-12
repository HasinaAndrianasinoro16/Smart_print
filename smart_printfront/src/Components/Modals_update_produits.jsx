import React, { useEffect, useState } from "react";
import { getApiUrl } from "../Link/URL";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export default function Modals_update_produits({ idProduits, onClose }) {
    const [designation, setDesignation] = useState('');
    const [prixUnitaire, setPrixUnitaire] = useState(null);

    // Charger les infos du produit
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(getApiUrl("produits/" + idProduits));
                if (!response.ok) throw new Error("Erreur de récupération du produit");
                const data = await response.json();

                // Attention ici : si `data` est un tableau, prends le premier élément
                const produit = Array.isArray(data) ? data[0] : data;

                setDesignation(produit.designation);
                setPrixUnitaire(produit.prix_unitaire);
            } catch (e) {
                console.error("Erreur :", e.message);
            }
        };

        fetchData();
    }, [idProduits]);

    // Mise à jour du produit
    const update_produits = async () => {
        if (designation.trim() === "" || prixUnitaire === null) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        const produitData = {
            designation: designation.trim(),
            prix_unitaire: prixUnitaire,
        };

        try {
            const response = await fetch(getApiUrl("produits/update/" + idProduits), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produitData),
            });

            if (!response.ok) throw new Error("Erreur lors de la modification");

            alert("Produit modifié avec succès !");
            onClose(); // Fermeture de la modale
        } catch (e) {
            console.error("Erreur :", e.message);
            alert("Erreur lors de la modification !");
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
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="prix" className="font-bold">Prix unitaire :</label>
                        <InputNumber
                            inputId="prix"
                            value={prixUnitaire}
                            onValueChange={(e) => setPrixUnitaire(e.value)}
                            useGrouping={true}
                            locale="fr-FR"
                            className="w-100"
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button className="w-50 btn btn-warning" onClick={update_produits}>
                    Modifier <i className="fas fa-pen" />
                </button>
            </div>
        </div>
    );
}
