 import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import {getApiUrl, getCookie} from "../Link/URL";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from "primereact/dialog";
import ModalsUpdateClients from "../Components/ModalsUpdateClients";
 import ModalsAjoutClient from "../Components/ModalsAjoutClient";

export default function ListeClient() {
    const [globalFilter, setGlobalFilter] = useState('');
    const [Clients, setClients] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);


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

    const Liste_clients = async () => {
        try {
            const reponse = await fetch(getApiUrl("clients"));
            if (!reponse.ok) {
                throw new Error("Erreur lors de la récupération des clients");
            }
            const data = await reponse.json();
            setClients(data);
        } catch (error) {
            console.error("Erreur:", error.message || error.toString());
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        Liste_clients();
    }, []);

    const DeleteCLient = async (idClient) => {
        try {
            const csrfToken = await getCsrfToken();
            const url = 'clients/delete/' + idClient;
            const response = await fetch(getApiUrl(url), {
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
                throw new Error("Erreur lors de la suppression du client");
            }

            const result = await response.json();
            console.log("Client supprimé :", result);
            alert("Client supprimé avec succès !");
            await Liste_clients();
        } catch (e) {
            console.error("Erreur:", e.message);
            alert("Erreur lors de la suppression !");
        }
    };

    const confirm = (event, id) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Voulez-vous vraiment supprimer ce client ?",
            acceptLabel: "Confirmer",
            rejectLabel: "Annuler",
            accept: () => DeleteCLient(id)
        });
    };

    const actionBodyTemplate = (rowData) => (
        <div className="d-flex gap-3 mb-3 text-center">
            <button className="btn btn-outline-danger" onClick={(e) => { e.preventDefault(); confirm(e, rowData.id) }}>
                <i className="fas fa-trash" />
            </button>
            <button className="btn btn-outline-warning" onClick={() => {
                setSelectedClientId(rowData.id);
                setVisible(true);
            }}>
                <i className="fas fa-pencil-alt" />
            </button>
        </div>
    );

    return (
        <>
            {/*<Headers/>*/}
            <ConfirmPopup />
            <Dialog
                header="Modifier un Client"
                visible={visible}
                style={{width: '70vw'}}
                onHide={() => setVisible(false)}
            >
                {selectedClientId && (
                    <ModalsUpdateClients
                        idClients={selectedClientId}
                        onClose={() => { setVisible(false); Liste_clients(); }}
                    />
                )}
            </Dialog>
            <Dialog header="Ajout de Client" visible={visible1} style={{width: '70vw'}}
                    onHide={() => setVisible1(false)}>
                <ModalsAjoutClient onCLose={() => {setVisible1(false); Liste_clients();}} />
            </Dialog>

            <div className="py-3"/>
            <div className="container-fluid">
                <div className="text-start bold h4">Smart Print Liste des clients:</div>
                <div className="py-1" />
                <div className="row">
                    <div className="d-flex justify-content-center gap-3 mb-3">
                        <button className="btn btn-outline-success" onClick={() => setVisible1(true)}>
                            <i className="fas fa-plus-circle"/> Ajouter Client
                        </button>
                    </div>
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
                            header="Liste des Clients"
                        >
                            <Column field="nom" header="Client" sortable filter/>
                            <Column field="adresse" header="Adresse" sortable filter/>
                            <Column field="email" header="Email" sortable filter/>
                            <Column field="telephone" header="Contact" sortable filter/>
                            <Column header="Action" body={actionBodyTemplate}/>
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}
