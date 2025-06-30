import React, {useEffect, useState, useCallback} from "react";
import {Link} from "react-router-dom";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Card} from 'primereact/card';
import {getApiUrl} from "../Link/URL";

export default function HistoriqueFacture() {
    const [globalFilter, setGlobalFilter] = useState('');
    const [facturePayer, setFacturePayer] = useState([]);
    const [factureSupprimer, setFactureSupprimer] = useState([]);
    const [bonCommandeSupprimer, setBonCommandeSupprimer] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        supprimees: 0,
        // boncommande: 0,
        payees: 0
    });

    const date_emission_echeance = (rowData) => {
        return `${rowData.date_emission} - ${rowData.date_echeance}`;
    };

    // Charger toutes les données
    const loadData = useCallback(async () => {
        try {
            // Chargement en parallèle
            const [payerData, supprimerData, totalCount, supprimerCount, payerCount, bonCommandeData] = await Promise.all([
                fetch(getApiUrl('factures/get_facture_statut/2')).then(res => res.json()),
                fetch(getApiUrl('factures/get_facture_statut/1')).then(res => res.json()),
                fetch(getApiUrl('factures/count_facture_statut/0')).then(res => res.json()),
                fetch(getApiUrl('factures/count_facture_statut/1')).then(res => res.json()),
                fetch(getApiUrl('factures/count_facture_statut/2')).then(res => res.json()),
                fetch(getApiUrl('boncommandes/get_by_etat/1')).then(res => res.json()),
            ]);

            setFacturePayer(payerData || []);
            setFactureSupprimer(supprimerData || []);
            setBonCommandeSupprimer(bonCommandeData || []);

            setStats({
                total: totalCount || 0,
                supprimees: supprimerCount || 0,
                payees: payerCount || 0
                // boncommande: bonCommandeCount || 0
            });
        } catch (e) {
            console.error("Erreur de chargement:", e.message);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Calcul des pourcentages
    const pourcentPayer = stats.total > 0 ? Math.round((stats.payees / stats.total) * 100) : 0;
    const pourcentSupprimer = stats.total > 0 ? Math.round((stats.supprimees / stats.total) * 100) : 0;

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
                <Link to={`/info?id=${encodeURIComponent(rowData.id)}`}
                      className="btn btn-info btn-sm">
                    <i className="fas fa-info-circle"/> Info
                </Link>
            </div>
        );
    };

    const actionBodyTemplateDelete = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
                <Link to={`/info?id=${encodeURIComponent(rowData.id)}`}
                      className="btn btn-info btn-sm">
                    <i className="fas fa-info-circle"/> Info
                </Link>
                <button className="btn btn-warning btn-sm"
                        onClick={() => undo_facture(rowData.id)}>
                    <i className="fas fa-undo-alt"/> Restituer
                </button>
            </div>
        );
    };

    const actionBodyTemplateBonCommande = (rowData) => {
        return (
            <div className="d-flex gap-3 mb-3 text-center">
                <a
                    href={`http://localhost:8000/${rowData.commande}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-info btn-sm"
                >
                    Voir le fichier
                </a>
                <button
                    className="btn btn-warning btn-sm"
                    onClick={() => undo_bon_commande(rowData.id)}
                >
                    <i className="fas fa-undo-alt"/> Restaurer
                </button>
            </div>
        );
    };

    const undo_bon_commande = async (idBonCommande) => {
        try {
            const url = 'boncommandes/restore/'+idBonCommande;
            const response = await fetch(getApiUrl(url),{
                method:'PUT',
                headers: {'Content-Type': 'application/json'}
                });

            if (!response.ok){
                throw new Error("Erreur lors de la modification de la facture");
            }

            const result = await response.json();
            alert("Bon de commande restituée avec succès");
            await loadData();

        }catch (e) {
            console.error(e.message);
            alert("Erreur lors de la restitution du bon de commande");
        }
    }

    const undo_facture = async (idFacture) => {
        try {
            const response = await fetch(getApiUrl(`factures/undo/${idFacture}`), {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'}
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la modification de la facture");
            }

            const result = await response.json();
            alert("Facture restituée avec succès");
            await loadData(); // Recharger les données après modification

        } catch (e) {
            console.error(e.message);
            alert("Erreur lors de la restitution de la facture");
        }
    };

    return (
        <div className="container-lg">
            {/* Tableau de bord */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <Card className="shadow-sm border-0" style={{borderRadius: '12px'}}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title text-muted mb-0">Factures payées</h5>
                            <span className="badge bg-success text-white">
                                <i className="fas fa-check-circle me-2"></i>
                                {stats.payees}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <small className="text-muted">{pourcentPayer}% du total</small>
                            <small className="text-muted">{stats.payees}/{stats.total}</small>
                        </div>
                    </Card>
                </div>
                <div className="col-md-6 mb-4">
                    <Card className="shadow-sm border-0" style={{borderRadius: '12px'}}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="card-title text-muted mb-0">Factures supprimées</h5>
                            <span className="badge bg-danger text-white">
                                <i className="fas fa-trash me-2"></i>
                                {stats.supprimees}
                            </span>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                            <small className="text-muted">{pourcentSupprimer}% du total</small>
                            <small className="text-muted">{stats.supprimees}/{stats.total}</small>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Tableau des factures payées */}
                    <div className="text-start bold h4">Smart Print Historique Factures payées:</div>
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
                                header="Liste des Factures payées"
                                emptyMessage="Aucune facture payée trouvée"
                            >
                                <Column field="id" header="Code" sortable filter/>
                                <Column field="client_relation.nom" header="Client" sortable filter/>
                                <Column header="Date d'emission - date d'echeance"
                                        body={date_emission_echeance}
                                        sortable filter/>
                                <Column header="Action" body={actionBodyTemplate}/>
                            </DataTable>
                        </div>
                    </div>

            {/* Tableau des factures supprimées */}
                    <div className="text-start bold h4 mt-4">Smart Print Historique supprimées:</div>
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
                                value={factureSupprimer}
                                removableSort
                                paginator
                                rows={5}
                                rowsPerPageOptions={[5, 10, 20]}
                                globalFilter={globalFilter}
                                tableStyle={{minWidth: '50rem'}}
                                header="Liste des Factures supprimées"
                                emptyMessage="Aucune facture supprimée trouvée"
                            >
                                <Column field="id" header="Code" sortable filter/>
                                <Column field="client_relation.nom" header="Client" sortable filter/>
                                <Column header="Date d'emission - date d'echeance"
                                        body={date_emission_echeance}
                                        sortable filter/>
                                <Column header="Action" body={actionBodyTemplateDelete}/>
                            </DataTable>
                        </div>
                    </div>


            {/* Tableau des Bon de commande supprimées */}
            <div className="text-start bold h4 mt-4">Smart Print Historique Bon de commande supprimées:</div>
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
                        value={bonCommandeSupprimer}
                        removableSort
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10, 20]}
                        globalFilter={globalFilter}
                        tableStyle={{minWidth: '50rem'}}
                        header="Liste des Factures supprimées"
                        emptyMessage="Aucune facture supprimée trouvée"
                    >
                        <Column field="id" header="Code" sortable filter/>
                        <Column field="date_creation" header="date de creation" sortable filter/>
                        <Column field="commande" header="chemin/fichier" sortable filter/>
                        <Column field="facture_relation.id" header="Facture" sortable filter/>
                        <Column header="Action" body={actionBodyTemplateBonCommande}/>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}