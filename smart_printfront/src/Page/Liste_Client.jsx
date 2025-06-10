import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {getApiUrl} from "../Link/URL";

export default function Liste_Client(){
    const [globalFilter, setGlobalFilter] = useState('');
    const [Clients, setClients] = useState()

    const Liste_clients = async () => {
        try {
            const reponse = await fetch(getApiUrl("clients"));
            if (!reponse.ok){
                throw new Error("Erreur lors de la recuperation des categories");
            }
            const data = await  reponse.json();
            setClients(data);

        }catch (error){
            console.error("erreur", error.message || error.toString());
        }
    }

    useEffect(() => {
        Liste_clients();
    }, []);


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
               <button className="btn btn-danger">
                   <i className="fas fa-trash"/>
               </button>
                <button className="btn btn-warning">
                    <i className="fas fa-pencil-alt"/>
                </button>
            </div>
        );
    };

    return(
        <>
            <div className="container-lg">
                <div className="text-start bold h4">Smart Print Liste des clients:</div>
                <div className="py-1"/>
                <div className="row">
                    <div className="card">
                        <div className="flex justify-content-end mb-3">
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Rechercher..."
                    />
                </span>
                        </div>

                        <DataTable
                            value={Clients}
                            removableSort
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            globalFilter={globalFilter}
                            tableStyle={{minWidth: '50rem'}}
                            header="Liste des Clients   "
                        >
                            <Column field="nom" header="Client" sortable filter></Column>
                            <Column field="adresse" header="Adresse" sortable filter></Column>
                            <Column field="email" header="Email" sortable filter></Column>
                            <Column field="telephone" header="contact" sortable filter></Column>
                            <Column header="Action" body={actionBodyTemplate} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}