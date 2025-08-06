import React, {useEffect, useState} from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getApiUrl } from "../Link/URL";
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Dialog } from "primereact/dialog";
import Modals_update_produits from "../Components/Modals_update_produits";
import Modals_Create_produits from "../Components/Modals_Create_produits";
import Headers from "../Body/Headers";
export default function Liste_produit(){
    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [produits, setProduits] = useState([]);
    const [selectedIdProduits, setSelectedIdProduits] = useState('');

    const Liste_produits = async () => {
        try {
            const reponse = await fetch(getApiUrl("produits"));
            if (!reponse.ok){
                throw new Error("Erreur lors de la recuperation des produits");
                // alert("Erreur lors de la recuperation des produits");
            }
            const data = await reponse.json();
            setProduits(data);
        }catch (e) {
            console.error("erreur:", e.message || e.toString());
        }
    }
    useEffect(() => {
        Liste_produits();
    },[]);

    const DeleteProduits = async (idProduits) => {
        try {
            const url = 'produits/delete/'+ idProduits;
            const reponse = await fetch(getApiUrl(url), {
                method:'PUT',
                headers: { 'Content-Type': 'application/json' }
            });

            if(!reponse.ok){
                throw new Error("Erreur lors de la suppression");
            }

            const result = await reponse.json();
            console.log("Produits supprimé :", result);
            alert("produit supprimé avec succès !");
            await Liste_produits();

        }catch (e) {
            console.error("Erreur:", e.message);
            alert("Erreur lors de la suppression !");
        }
    }

    const confirm = (event, id) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Voulez-vous vraiment supprimer ce produits ?",
            acceptLabel: "Confirmer",
            rejectLabel: "Annuler",
            accept: () => DeleteProduits(id)
        })
    }

    const actionBodyTemplate = (rowData) => (
        <div className="d-flex gap-3 mb-3 text-center">
            <button className="btn btn-danger" onClick={(e) => { e.preventDefault(); confirm(e, rowData.id) }}>
                <i className="fas fa-trash" />
            </button>
            <button className="btn btn-warning" onClick={() => {
                setSelectedIdProduits(rowData.id);
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
                header="Modifier un Produit"
                visible={visible}
                style={{width: '50vw'}}
                onHide={() => setVisible(false)}
            >
                {selectedIdProduits && (
                    <Modals_update_produits
                        idProduits={selectedIdProduits}
                        onClose={() => {setVisible(false); Liste_produits();}}
                        />
                )}
            </Dialog>

            <Dialog
                header="Ajouter un Produit"
                visible={visible2}
                style={{width: '50vw'}}
                onHide={() => setVisible2(false)}
            >
                <Modals_Create_produits onClose={() => {setVisible2(false); Liste_produits();}} />
            </Dialog>

        <div className="container-lg">
            <div className="text-start bold h4">Smart Print Liste des produits:</div>
            <div className="py-1"/>
            <div className="row">
                <div className="d-flex justify-content-center gap-3 mb-3">
                    <button className="btn btn-outline-success" onClick={() => setVisible2(true)}>
                        <i className="fas fa-plus-circle"/> Ajouter un produits
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
                        value={produits}
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
                        <Column field="prix_unitaire" header="prix unitaire (Ar)" sortable filter/>
                        <Column header="Action" body={actionBodyTemplate}/>
                    </DataTable>
                </div>
            </div>
        </div>
        </>
    );
}