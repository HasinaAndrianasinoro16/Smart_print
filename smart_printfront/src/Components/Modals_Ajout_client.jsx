import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { getApiUrl } from "../Link/URL";

export default function Modals_Ajout_client() {
    const [nom, setNom] = useState('');
    const [adresse, setAdresse] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const [nif, setNif] = useState(null);
    const [stat, setStat] = useState(null);
    const [rcs, setRcs] = useState('');

    const saveCLients = async () => {
        if (
            nom.trim() === "" || adresse.trim() === "" || email.trim() === "" ||
            telephone.trim() === "" || nif === null || stat === null || rcs.trim() === ""
        ) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const clientData = {
            nom: nom.trim(),
            adresse: adresse.trim(),
            email: email.trim(),
            telephone: telephone.trim(),
            nif,
            stat,
            rcs: rcs.trim()
        };

        try {
            const response = await fetch(getApiUrl('clients/add'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData),
            });

            if (!response.ok) throw new Error("Erreur lors de l'ajout du client");

            alert("Client ajouté avec succès !");
            setNom("");
            setAdresse("");
            setEmail("");
            setTelephone("");
            setNif(null);
            setStat(null);
            setRcs("");

        } catch (error) {
            console.error("Erreur :", error.message);
        }
    };

    return (
        <div>
            <div className="form-group mb-4">
                <label htmlFor="nom" className="form-label">Nom du client / Entreprise / Société :</label>
                <InputText id="nom" value={nom} onChange={(e) => setNom(e.target.value)} className="w-100" required />
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="adresse">Adresse :</label>
                        <InputText id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} className="w-100" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="font-bold">Adresse Email :</label>
                        <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-100" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telephone" className="font-bold">Numéro de téléphone :</label>
                        <InputText id="telephone" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="w-100" required />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-3">
                        <label htmlFor="nif" className="font-bold">NIF :</label>
                        <InputNumber inputId="nif" value={nif} onValueChange={(e) => setNif(e.value)} useGrouping={false} className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="stat" className="font-bold">STAT :</label>
                        <InputNumber inputId="stat" value={stat} onValueChange={(e) => setStat(e.value)} useGrouping={false} className="w-100" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="rcs" className="font-bold">RCS :</label>
                        <InputText id="rcs" value={rcs} onChange={(e) => setRcs(e.target.value)} className="w-100" required />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button className="w-50 btn btn-success" onClick={saveCLients}>
                    Ajouter <i className="fas fa-plus" />
                </button>
            </div>
        </div>
    );
}
