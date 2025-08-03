import React, {useEffect, useState} from "react";
import {getApiUrl} from "../Link/URL";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import { Dialog } from "primereact/dialog";
import Modals_Create_Service from "../Components/Modals_Create_Service";
import Modal_update_service from "../Components/Modlal_update_service";
import Headers from "../Body/Headers";

export default function Liste_service(){
    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [services, setServices] = useState([]);
    const [selectedIdService, setSelectedIdService] = useState(null);


    const Liste_service = async () => {
        try {
            const reponse = await fetch(getApiUrl('services'));
            if (!reponse.ok){
                throw new Error("erreur lors de la recuperation des services");
            }
            const data = await reponse.json();
            setServices(data);
        }catch (e) {
            console.error(e.message);
        }
    }

    useEffect(() => {
        Liste_service();
    }, []);

    const DeleteServices = async (idServices) => {
        try {
            const url = 'services/delete' + idServices;
            const reponse = await fetch(getApiUrl(url), {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            });

            if (!reponse.ok){
                throw new Error("erreur lors de la suppression");
            }

            const result = await reponse.json();
            console.log("Produits supprimer:", result);
            alert("produits supprimer avec succes");
            await Liste_service();

        }catch (e) {
            console.error(e.message);
            alert("Erreur lors de la suppression");
        }
    }

    const confirm = (event, id) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Voulez-vous vraiment supprimer ce service ?",
            acceptLabel: "Confirmer",
            rejectLabel: "Annuler",
            accept: () => DeleteServices(id)
        })
    }

    const actionBodyTemplate = (rowData) => (
        <div className="d-flex gap-3 mb-3 text-center">
            <button className="btn btn-danger" onClick={(e) => { e.preventDefault(); confirm(e, rowData.id) }}>
                <i className="fas fa-trash" />
            </button>
            <button className="btn btn-warning" onClick={() => {
                setSelectedIdService(rowData.id);
                setVisible(true);
            }}>
                <i className="fas fa-pencil-alt" />
            </button>
        </div>
    );

    return (
        <>
            <Headers/>
            <ConfirmPopup/>
            <Dialog
                header="Creer un Produit"
                visible={visible2}
                style={{width: '50vw'}}
                onHide={() => setVisible2(false)}
            >
                <Modals_Create_Service onClose={() => {setVisible(false); Liste_service();}} />
            </Dialog>
            <Dialog
                header="Modifier un Produit"
                visible={visible}
                style={{ width: '50vw' }}
                onHide={() => setVisible(false)}
            >
                {selectedIdService && (
                    <Modal_update_service
                        idService={selectedIdService}
                        onClose={() => { setVisible(false); Liste_service(); }}
                    />
                )}
            </Dialog>

            <div className="container-lg">
                <div className="text-start bold h4">Smart Print Liste des Services:</div>
                <div className="py-1"/>
                <div className="row">
                    <div className="d-flex justify-content-center gap-3 mb-3">
                        <button className="btn btn-outline-success" onClick={() => setVisible2(true)}>
                            <i className="fas fa-plus-circle"/> Ajouter un service
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
                            value={services}
                            removableSort
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            globalFilter={globalFilter}
                            tableStyle={{minWidth: '50rem'}}
                            header="Liste des Clients"
                        >
                            <Column field="id" header="code" sortable filter/>
                            <Column field="designation" header="designation" sortable filter/>
                            <Column field="prix" header="prix unitaire (Ar)" sortable filter/>
                            <Column header="Action" body={actionBodyTemplate}/>
                        </DataTable>
                    </div>
                </div>
            </div>

        </>
    );

}