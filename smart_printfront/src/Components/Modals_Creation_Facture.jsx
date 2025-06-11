import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from "primereact/inputtextarea";
import { getApiUrl } from "../Link/URL";

export default function Modals_Creation_Facture() {
    const [creation, setCreation] = useState(null);
    const [echeance, setEcheance] = useState(null);
    const [condition, setCondition] = useState('');
    const [clients, setClients] = useState([]);
    const [client, setClient] = useState(null);

    const List_client = async () => {
        try {
            const reponse = await fetch(getApiUrl('clients'));
            if (!reponse.ok) {
                throw new Error("Erreur lors de la recuperation des clients");
            }
            const data = await reponse.json();
            setClients(data);
        } catch (e) {
            console.error(e.message);
        }
    }

    useEffect(() => {
        List_client();
    }, []);

    const form_add_facture = async () => {
        if (!client || !creation || !echeance) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const factureData = {
            client: client.id,
            creation: creation.toISOString().split('T')[0],
            echeance: echeance.toISOString().split('T')[0],
            condition
        }

        try {
            const reponse = await fetch(getApiUrl('factures/add'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(factureData),
            });

            if (!reponse.ok) throw new Error("Erreur lors de l'ajout de facture");

            alert("La facture a été créée avec succès !");
            setClient(null);
            setCreation(null);
            setEcheance(null);
            setCondition('');
        } catch (e) {
            console.error(e.message);
        }
    }

    return (
        <div>
            <div className="form-group mb-4">
                <label htmlFor="Client" className="form-label">Client :</label>
                <Dropdown
                    value={client}
                    onChange={(e) => setClient(e.value)}
                    options={clients}
                    optionLabel="nom"
                    placeholder="Sélectionner un client"
                    filter
                    style={{ width: '100%' }}
                />
            </div>

            <div className="mb-3">
                <label>Date d'émission :</label>
                <Calendar value={creation} onChange={(e) => setCreation(e.value)} showButtonBar className="w-100" />
            </div>
            <div className="mb-3">
                <label>Date d'échéance :</label>
                <Calendar value={echeance} onChange={(e) => setEcheance(e.value)} showButtonBar className="w-100" />
            </div>
            <div className="mb-3">
                <label>Condition de paiement :</label>
                <InputTextarea value={condition}
                               onChange={(e) => setCondition(e.target.value)}
                               rows={2} cols={30}
                               className="w-100"
                               required
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
