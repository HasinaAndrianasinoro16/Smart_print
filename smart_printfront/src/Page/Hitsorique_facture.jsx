import React, {useState} from "react";
import {Link} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

export default function Hitsorique_facture(){
    const [globalFilter, setGlobalFilter] = useState('');
    const testProducts = [
        { code: 'P001', name: 'Imprimante HP LaserJet', category: 'Informatique', quantity: 12 },
        { code: 'P002', name: 'Papier A4 80g', category: 'Papeterie', quantity: 200 },
        { code: 'P003', name: 'Toner Samsung', category: 'Informatique', quantity: 8 },
        { code: 'P004', name: 'Agrafeuse', category: 'Fournitures', quantity: 35 },
        { code: 'P005', name: 'Clé USB 32GB', category: 'Informatique', quantity: 50 },
        { code: 'P006', name: 'Bloc-notes', category: 'Papeterie', quantity: 120 },
        { code: 'P007', name: 'Souris Logitech', category: 'Informatique', quantity: 15 },
        { code: 'P008', name: 'Enveloppe kraft', category: 'Papeterie', quantity: 75 },
        { code: 'P009', name: 'Câble HDMI', category: 'Informatique', quantity: 22 },
        { code: 'P010', name: 'Stylo bille bleu', category: 'Papeterie', quantity: 300 },
    ];

    const date_emission_echeance = (rowData) => {
        const echeance = rowData.name;
        const emission = rowData.code;
        const date =emission +' - '+ echeance;
        return(
            <>
                {date}
            </>
        );
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
                <Link to='/info?id=1'
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
                        value={testProducts}
                        removableSort
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        globalFilter={globalFilter}
                        tableStyle={{minWidth: '50rem'}}
                        header="Liste des Factures en cours"
                    >
                        <Column field="code" header="Code" sortable filter></Column>
                        <Column field="name" header="Client" sortable filter></Column>
                        <Column header="Date d'emission - date d'echeance" body={date_emission_echeance} sortable filter></Column>
                        <Column header="Action" body={actionBodyTemplate} />
                    </DataTable>
                </div>
            </div>
    </div>
</>
    );
}