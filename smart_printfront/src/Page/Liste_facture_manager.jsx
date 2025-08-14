import React, {useEffect, useState} from "react";
import {getApiUrl} from "../Link/URL";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Link} from "react-router-dom";

export default function Liste_facture_manager(){
    const [globalFilter, setGlobalFilter] = useState('');
    const [facture, setFacture] = useState([]);
    // const [selectedFacture, setSelectedFacture] = useState(null);

    const getCsrfToken = async () => {
        try {
            await fetch("http://localhost:8000/sanctum/csrf-cookie", {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            return decodeURIComponent(cookieValue || '');
        } catch (error) {
            console.error("Erreur CSRF token:", error);
            throw error;
        }
    };

    const Liste_facture_a_approuver = async () => {
        try {
            const response = await fetch(getApiUrl('factures'));
            if (!response.ok){
                throw new Error("Erreur lors de la récupération des factures");
            }
            const data = await response.json();
            setFacture(data);
        } catch (e) {
            console.error(e.message);
            alert("Erreur lors du chargement des factures");
        }
    }

    useEffect(() => {
        Liste_facture_a_approuver();
    }, []);

    const Approuver_factures = async (idFacture) => {
        try {
            const csrfToken = await getCsrfToken();
            const url = 'factures/payer/'+idFacture;
            const reponse = await fetch(getApiUrl(url), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            if (!reponse.ok){
                throw new Error("erreur lors du payement");
            }

            const result = await reponse.json();
            console.log("Facture Aprouver:", result);
            alert("Facture aprouver avec succes");
            await Liste_facture_a_approuver();

        }catch (e) {
            console.error(e.message);
            alert("Erreur lors du payements");
        }
    }

    const actionBodyTemplate = (rowData) => (
        <div className="d-flex gap-3 mb-3 text-center">
            <Link
                to={`/info?id=${encodeURIComponent(rowData.id)}`}
                className="btn btn-info"
            >
                <i className="fas fa-info-circle"/>
            </Link>
            <button className="btn btn-success" onClick={() => Approuver_factures(rowData.id)}>
                <i className="fas fa-check"/>
            </button>
        </div>
    );


    const date_emission_echeance = (rowData) => {
        return `${rowData.date_emission} - ${rowData.date_echeance}`;
    }

    return(
        <>
            <div className="py-3"/>
            <div className="container-fluid">
                <div className="text-start bold h4">Smart Print liste Facture :</div>
                <div className="py-1"/>
                <div className="row">
                    <div className="py-1">
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
                                    value={facture}
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
                                    <Column header="Date d'emission - date d'echeance" body={date_emission_echeance}
                                            sortable filter></Column>
                                    <Column header="Action" body={actionBodyTemplate}/>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}