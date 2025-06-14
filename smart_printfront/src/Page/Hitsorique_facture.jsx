import React, {useState} from "react";
import {Link} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {getApiUrl} from "../Link/URL";

export default function Hitsorique_facture(){
    const [globalFilter, setGlobalFilter] = useState('');
    const [facturePayer, setFacturePayer] = useState([])

    const date_emission_echeance = (rowData) => {
        const echeance = rowData.date_echeance;
        const emission = rowData.date_emission;
        const date =emission +' - '+ echeance;
        return(
            <>
                {date}
            </>
        );
    }

    const Liste_facture_payer = async () => {
        try {
            const reponse = await fetch(getApiUrl('factures/payer'));
            if(!reponse.ok){
                throw new Error("Erreur lors de la recuperation des factures payer");
            }
            const data = await reponse.json();
            setFacturePayer(data)
        }catch (e) {
            console.error(e.message);
        }
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
                <Link to={`/info?id=${encodeURIComponent(rowData.id)}`}
                      className="btn btn-info btn-sm"
                    // onClick={() => handleInfo(rowData)}
                >
                    <i className="fas fa-info-circle"/> Info
                </Link>
            </div>
        );
    };

    return(
        <>
        <div className="container-lg">
            <div className="text-start bold h4">Smart Print Historique Facturation:</div>
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
                        value={facturePayer}
                        removableSort
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        globalFilter={globalFilter}
                        tableStyle={{minWidth: '50rem'}}
                        header="Liste des Factures en cours"
                    >
                        <Column field="id" header="Code" sortable filter></Column>
                        <Column field="client_relation.nom" header="Client" sortable filter></Column>
                        <Column header="Date d'emission - date d'echeance" body={date_emission_echeance} sortable filter></Column>
                        <Column header="Action" body={actionBodyTemplate} />
                    </DataTable>
                </div>
            </div>
    </div>
</>
    );
}