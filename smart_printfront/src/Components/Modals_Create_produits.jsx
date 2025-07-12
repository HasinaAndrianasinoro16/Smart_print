import React, {useState} from "react";
import {getApiUrl} from "../Link/URL";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";

export default function Modals_Create_produits({onClose}){
    const [designation, setDesignation] = useState('');
    const [prixUnitaire, setPrixUnitaire] = useState(null);

    const save_produits = async () => {
        if (designation.trim() === "" || prixUnitaire === null){
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const produitsData = {
            designation: designation.trim(),
            prix_unitaire: prixUnitaire,
        }

        try {
            const reponse = await fetch(getApiUrl('produits/add'),{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(produitsData),
            });

            if (!reponse.ok) throw new Error("erreur lors de l'ajout du produits");

            alert("Produits ajouter avec succes");
            setDesignation("");
            setPrixUnitaire(null);
            onClose();

        }catch (e) {
            console.error(e.message);
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">Designation :</label>
                        <InputText id="nom" value={designation} onChange={(e) => setDesignation(e.target.value)}
                                   className="w-100"
                                   required/>
                    </div>


                    <div className="mb-3">
                        <label htmlFor="nif" className="font-bold">Prix unitaire :</label>
                        <InputNumber inputId="nif" value={prixUnitaire} onValueChange={(e) => setPrixUnitaire(e.value)}
                                     useGrouping={true} locale='fr-FR' className="w-100"/>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button className="w-50 btn btn-success" onClick={save_produits}>
                    Ajouter <i className="fas fa-plus"/>
                </button>
            </div>
        </div>
    );
}