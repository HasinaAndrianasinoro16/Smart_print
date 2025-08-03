import React, {useState} from "react";
import {getApiUrl} from "../Link/URL";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dropdown} from "primereact/dropdown";

export default function Modal_Create_Users({onClose}){
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);

    const RoleStatic = [
        { id: 1, nom: 'Facturier' },
        { id: 2, nom: 'Manager' },
        { id: 0, nom: 'Administrateur' },
    ];

    const save_users = async () => {
        if (nom.trim() === "" || email.trim() === "" || password.trim() === "" ||role === null){
            alert("Veuiller remplir tous les champs");
            return;
        }

        const userData = {
            name: nom.trim(),
            email: email.trim(),
            password: password.trim(),
            role: role,
        }

        try {
            const reponse = await fetch(getApiUrl('users/add'), {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(userData),
            });

            if (!reponse.ok) throw new Error("erreur lors de l'ajout du produits");

            alert("Utilisateur ajouter avec succes");
            setNom("");
            setEmail("");
            setPassword("");
            setRole(null);
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
                        <label htmlFor="nom" className="form-label">Nom utilisateur :</label>
                        <InputText id="nom" value={nom} onChange={(e) => setNom(e.target.value)}
                                   className="w-100"
                                   required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">Email :</label>
                        <InputText id="nom" value={email} onChange={(e) => setEmail(e.target.value)}
                                   className="w-100"
                                   required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nom" className="form-label">Mot de passe :</label>
                        <InputText id="nom" value={password} onChange={(e) => setPassword(e.target.value)}
                                   className="w-100"
                                   required/>
                    </div>


                    <div className="form-group mb-4">
                        <label htmlFor="Client" className="form-label">Role :</label>
                        <Dropdown
                            value={role}
                            onChange={(e) => setRole(e.value)}
                            options={RoleStatic}
                            optionLabel="nom"
                            optionValue="id"
                            placeholder="Sélectionner un client"
                            filter
                            style={{width: '100%'}}
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button className="w-50 btn btn-success" onClick={save_users}>
                    Ajouter <i className="fas fa-plus"/>
                </button>
            </div>
        </div>
    );
}