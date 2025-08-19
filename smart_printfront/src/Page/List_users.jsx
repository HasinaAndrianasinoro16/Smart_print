import React, {useEffect, useState} from "react";
import Headers from "../Body/Headers";
import {getApiUrl} from "../Link/URL";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import Modal_Create_Users from "../Components/Modal_Create_Users";
import Modals_update_users from "../Components/Modals_update_users";

export default function List_users(){
    const [users, setUsers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [visible, setVisible] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState();

    const Liste_users = async () => {
        try {
            const reponse = await fetch(getApiUrl("users"));
            if (!reponse.ok){
                throw new Error("Erreur lors de la recuperation des utilisateurs");
            }

            const data = await reponse.json();
            setUsers(data);
        }catch (e) {
            console.error(e.message);
        }
    };

    useEffect(() => {
        Liste_users();
    }, []);

    const buttonTemplaye = (rowData) => (
        <div className="d-flex gap-3 mb-3 text-center">
            <button className="btn btn-outline-warning" onClick={() => {
                setSelectedUserId(rowData.id);
                setVisible1(true);
            }}>
                <i className="fas fa-pencil-alt" />
            </button>
        </div>
    );

    const actionBodyTemplate = (rowData) => {
        if (rowData.role === 0) {
            return <div className="badge rounded-pill bg-danger">Administrateur</div>;
        } else if (rowData.role === 1) {
            return <div className="badge rounded-pill bg-success">Facturier</div>;
        } else if (rowData.role === 2) {
            return <div className="badge rounded-pill bg-primary">Manager</div>;
        } else {
            return <div className="badge rounded-pill bg-secondary">Inconnu</div>;
        }
    };



    return(
        <>
            {/*<Headers/>*/}
            <Dialog
                header="Creer un utilisateur"
                visible={visible}
                style={{width:'50w'}}
                onHide={() => setVisible(false)}
                >
                <Modal_Create_Users onClose={() => {setVisible(false); Liste_users();}}/>
            </Dialog>
            <Dialog
                header="Creer un utilisateur"
                visible={visible1}
                style={{width:'70w'}}
                onHide={() => setVisible1(false)}
            >
                <Modals_update_users onClose={() => {setVisible1(false); Liste_users();}} idUser={selectedUserId}/>
                {/*<Modal_Create_Users onClose={() => {setVisible(false); Liste_users();}}/>*/}
            </Dialog>
            <div className="py-3"/>
            <div className="container-fluid">
                <div className="text-start bold h4">Smart Print Liste des Utilisateurs:</div>
                <div className="py-1"/>
                <div className="row">
                    <div className="d-flex justify-content-center gap-3 mb-3">
                        <button className="btn btn-outline-success" onClick={() => setVisible(true)}>
                            <i className="fas fa-plus-circle"/> Ajouter un Utilisateur
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
                            value={users}
                            removableSort
                            paginator
                            rows={5}
                            rowsPerPageOptions={[5, 10, 20]}
                            globalFilter={globalFilter}
                            tableStyle={{minWidth: '50rem'}}
                            header="Liste des Clients"
                        >
                            <Column field="id" header="code" sortable filter/>
                            <Column field="name" header="Nom" sortable filter/>
                            <Column field="email" header="Email" sortable filter/>
                            <Column header="Role" body={actionBodyTemplate} sortable filter/>
                            <Column header="Action" body={buttonTemplaye}/>
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}