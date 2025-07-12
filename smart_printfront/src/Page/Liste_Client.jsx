 import React, { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getApiUrl } from "../Link/URL";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from "primereact/dialog";
import Modals_update_clients from "../Components/Modals_update_clients";

export default function Liste_Client() {
    const [globalFilter, setGlobalFilter] = useState('');
    const [Clients, setClients] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState(null);

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

    useEffect(() => {
        Liste_clients();
    }, []);

    const DeleteCLient = async (idClient) => {
        try {
            const url = 'clients/delete/' + idClient;
            const response = await fetch(getApiUrl(url), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
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
            <button className="btn btn-danger" onClick={(e) => { e.preventDefault(); confirm(e, rowData.id) }}>
                <i className="fas fa-trash" />
            </button>
            <button className="btn btn-warning" onClick={() => {
                setSelectedClientId(rowData.id);
                setVisible(true);
            }}>
                <i className="fas fa-pencil-alt" />
            </button>
        </div>
    );

    return (
        <>
            <ConfirmPopup />
            <Dialog
                header="Modifier un Client"
                visible={visible}
                style={{width: '70vw'}}
                onHide={() => setVisible(false)}
            >
                {selectedClientId && (
                    <Modals_update_clients
                        idClients={selectedClientId}
                        onClose={() => { setVisible(false); Liste_clients(); }}
                    />
                )}
            </Dialog>

            <div className="container-lg">
                <div className="text-start bold h4">Smart Print Liste des clients:</div>
                <div className="py-1" />
                <div className="row">
                    <div className="card">
                        <div className="flex justify-content-end mb-3">
                            <span className="p-input-icon-left">
                                <i className="pi pi-search" />
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
                            tableStyle={{ minWidth: '50rem' }}
                            header="Liste des Clients"
                        >
                            <Column field="nom" header="Client" sortable filter />
                            <Column field="adresse" header="Adresse" sortable filter />
                            <Column field="email" header="Email" sortable filter />
                            <Column field="telephone" header="Contact" sortable filter />
                            <Column header="Action" body={actionBodyTemplate} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}
