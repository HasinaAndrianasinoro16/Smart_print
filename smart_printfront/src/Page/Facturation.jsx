import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from "primereact/dialog";
import { Link } from 'react-router-dom';


import Modals_Ajout_client from "../Components/Modals_Ajout_client";
import Modals_Creation_Facture from "../Components/Modals_Creation_Facture";
import FactureForm from "../Components/FactureForm";
import {getApiUrl} from "../Link/URL";


export default function Facturation(){
    // const [products, setProducts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [visible3, setVisible3] = useState(false);

    const [factures, setFactures] = useState([]);
    const [selectedFactureId, setSelectedFactureId] = useState(null);

    const Liste_facture = async () =>{
      try {
          const reponse = await fetch(getApiUrl('factures'));
          if (!reponse.ok){
              throw new Error("Erreur lors de la recuperation des factures");
          }
          const data = await reponse.json();
          setFactures(data);

      }  catch (e) {
          console.error(e.message);
      }
    };

    useEffect(() => {
       Liste_facture();
    },[]);



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
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
                <Link to={`/info?id=${encodeURIComponent(rowData.id)}`}
                    className="btn btn-info btn-sm"
                    // onClick={() => handleInfo(rowData)}
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
                    <i className="fas fas fas fa-money-check"/>
                </button>
            </div>
        );
    };

    const handleInfo = (rowData) => {
        console.log("Détails du client sélectionné :", rowData);
        alert(`Code: ${rowData.code}\nNom: ${rowData.name}\nCatégorie: ${rowData.category}`);
    };

    return (
        <>
         {/*modal pour afficher le formualire d_ajout des clients*/}
            <Dialog header="Ajout de Client" visible={visible1} style={{width: '70vw'}}
                    onHide={() => setVisible1(false)}>
                <Modals_Ajout_client/>
            </Dialog>

            {/*modals pour le formulaire d'ajout de facture*/}
            <Dialog header="Creation facture" visible={visible2} style={{width: '70vw'}}
                    onHide={() => setVisible2(false)}>
                <Modals_Creation_Facture/>
            </Dialog>

            <Dialog header="Creation facture" visible={visible3} style={{width: '90vw'}}
                    onHide={() => setVisible3(false)}>
                <FactureForm facture={selectedFactureId}  />
            </Dialog>

            <div className="container-lg">
                <div className="text-start bold h4">Smart Print Facturation :</div>
                <div className="py-1"/>
                <div className="row">
                    <div className="d-flex justify-content-center gap-3 mb-3">
                        <button className="btn btn-outline-success" onClick={() => setVisible1(true)}>
                            <i className="fas fa-plus-circle"/> Ajouter Client
                        </button>
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