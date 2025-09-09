import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from "primereact/dialog";
import { Link } from 'react-router-dom';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
// import ModalsAjoutClient from "../Components/ModalsAjoutClient";
import ModalsCreationFacture from "../Components/ModalsCreationFacture";
import FactureForm from "../Components/FactureForm";
import {getApiUrl, getCookie} from "../Link/URL";
import ModalsCreateBonCommande from "../Components/ModalsCreateBonCommande";
import ServiceForm from "../Components/ServiceForm";
import Headers from "../Body/Headers";

export default function Facturation({user}){
    const [globalFilter, setGlobalFilter] = useState('');
    // const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);
    const [visible4, setVisible4] = useState(false);
    const [visible5, setVisible5] = useState(false);
    const [factures, setFactures] = useState([]);
    const [selectedFactureId, setSelectedFactureId] = useState(null);

    const getCsrfToken = async () => {
        try {
            await fetch(getCookie(), {
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

    const Liste_facture = async () => {
        try {
            const response = await fetch(getApiUrl('factures'));
            if (!response.ok){
                throw new Error("Erreur lors de la récupération des factures");
            }
            const data = await response.json();
            setFactures(data);
        } catch (e) {
            console.error(e.message);
            alert("Erreur lors du chargement des factures");
        }
    };

    useEffect(() => {
        Liste_facture();
    }, []);

    const DeleteFacture = async (idfacture) => {
        try {
            const csrfToken = await getCsrfToken();

            const response = await fetch(getApiUrl(`factures/delete/${idfacture}`), {
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la suppression");
            }

            const result = await response.json();
            console.log("Facture supprimée :", result);
            alert("Facture supprimée avec succès !");
            await Liste_facture(); // Refresh the list
        } catch (e) {
            console.error("Erreur:", e.message);
            alert(`Erreur lors de la suppression: ${e.message}`);
        }
    };

    const confirmDelete = (event, id) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Voulez-vous vraiment supprimer cette facture ?",
            acceptLabel: "Confirmer",
            rejectLabel: "Annuler",
            acceptClassName: 'p-button-danger',
            accept: () => DeleteFacture(id)
        });
    };

    const date_emission_echeance = (rowData) => {
        return `${rowData.date_emission} - ${rowData.date_echeance}`;
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
                <Link
                    to={`/info?id=${encodeURIComponent(rowData.id)}`}
                    className="btn btn-outline-info btn-sm"
                >
                    <i className="fas fa-info-circle"/>
                </Link>
                <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => {
                        setVisible3(true);
                        setSelectedFactureId(rowData.id);
                    }}
                >
                    <i className="fas fa-money-check"/>
                </button>
                <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={() => {
                        setVisible4(true);
                        setSelectedFactureId(rowData.id);
                    }}
                >
                    <i className="fas fa-file-alt"/>
                </button>
                <button className="btn btn-outline-success btn-sm" onClick={() => {
                    setVisible5(true);
                    setSelectedFactureId(rowData.id);
                }}>
                    <i className="fas fa-tools"/>
                </button>
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => confirmDelete(e, rowData.id)}
                >
                    <i className="fas fa-trash"/>
                </button>
                <ConfirmPopup />
            </div>
        );
    };

    return (
        <>
            {/*<Headers/>*/}
            {/* Modal dialogs */}

            <Dialog
                header="Creation facture"
                visible={visible2}
                style={{ width: '70vw' }}
                onHide={async () => {
                    setVisible2(false);
                    await Liste_facture();
                }}
            >
                <ModalsCreationFacture onClose={() => {setVisible2(false); Liste_facture();}} User={user} />
            </Dialog>

            <Dialog header="Creation facture" visible={visible3} style={{width: '110vw'}}
                    onHide={() => setVisible3(false)}>
                <FactureForm facture={selectedFactureId} />
            </Dialog>

            <Dialog header="Creation Bon de commande" visible={visible4} style={{width: '50vw'}}
                    onHide={() => setVisible4(false)}>
                <ModalsCreateBonCommande facture={selectedFactureId}/>
            </Dialog>
            <Dialog header="Formulaire ajout de service a une facture" visible={visible5} style={{width: '120W'}}
                    onHide={() => setVisible5(false)}>
                <ServiceForm facture={selectedFactureId}/>
            </Dialog>
            <div className="py-3"/>
            <div className="container-fluid">
                <div className="text-start bold h4">Smart Print Facturation :</div>
                <div className="py-1"/>
                <div className="row">
                    <div className="d-flex justify-content-center gap-3 mb-3">
                        {/*<button className="btn btn-outline-success" onClick={() => setVisible1(true)}>*/}
                        {/*    <i className="fas fa-plus-circle"/> Ajouter Client*/}
                        {/*</button>*/}
                        <button className="btn btn-outline-success" onClick={() => setVisible2(true)}>
                            <i className="fas fa-plus-circle"/> Creer une facture
                        </button>
                    </div>
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
                                    value={factures}
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
                </div>
            </div>
        </>
    );
}