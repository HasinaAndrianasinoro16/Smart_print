import React, {useState} from "react";
import {getApiUrl} from "../Link/URL";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";

export default function Modals_Create_Service({onClose}){
    const [designation, setDesignation] = useState('');

    const save_services = async () => {
        if (designation.trim() === ""){
            alert("Veuillez remplir tous les champs");
            return;
        }

        const serviceData = {
            designation: designation.trim(),
        }

        try {
            const reponse = await fetch(getApiUrl('services/add'),{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(serviceData),
            });

            if (!reponse.ok){
                throw new Error("erreur lors de l'ajout du service");
            }

            alert("Service ajouter avec succes");
            setDesignation("");
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

                </div>
            </div>

            <div className="text-center">
                <button className="w-50 btn btn-success" onClick={save_services}>
                    Ajouter <i className="fas fa-plus"/>
                </button>
            </div>
        </div>
    );

}