import React, {useState} from "react";
import {Dropdown} from "primereact/dropdown";
// import {InputNumber} from "primereact/inputnumber";
import { Calendar } from 'primereact/calendar';
// import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";


export default function Modals_Creation_Facture(){
    const [selectedCities, setSelectedCities] = useState(null);
    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];

    const [prix, setPrix] = useState();
    const [creation, setCreation] = useState(null);
    const [echeance, setEcheance] = useState(null);
    const [condition, setCondition] = useState('');

    const [clients, setClients] = useState([]);
    const [client, setClient] = useState();
    return (
        <div>
            <div className="form-group mb-4">
                <label htmlFor="Client" className="form-label">Client :</label>
                <Dropdown
                    value={client}
                    onChange={(e) => setClient(e.value)}
                    options={clients}
                    optionLabel="libelle"
                    placeholder="Sélectionner un client"
                    filter
                    style={{width: '100%'}}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="designation">Date d'emission :</label>
                <Calendar value={creation} onChange={(e) => setCreation(e.value)} showButtonBar className="w-100"/>

            </div>
            <div className="mb-3">
                <label htmlFor="designation">Date d'echeance :</label>
                <Calendar value={echeance} onChange={(e) => setEcheance(e.value)} showButtonBar className="w-100"/>

            </div>
            <label htmlFor="nom" className="form-label">condition de paiement:</label>
            <InputTextarea id="nom" value={condition}
                       onChange={(e) => setCondition(e.target.value)}
                       rows={2} cols={30}
                           className="w-100"
                       required
            />
            <div className="py-2"/>
            <div className="text-center">
                <button className="w-50 btn btn-success">Ajouter <i
                    className="fas fa-plus"/></button>
            </div>
        </div>
    );
}