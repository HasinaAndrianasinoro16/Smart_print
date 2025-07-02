import React, { useState, useEffect } from "react";
import MyLogo from "../assets/img/Smart Print-logo/vector/default-monochrome-black.svg";
import { useLocation } from "react-router-dom";
import { getApiUrl } from "../Link/URL";
import html2pdf from "html2pdf.js";
import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";

export default function Info_facture() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const factureId = queryParams.get("id");

    const [facture, setFacture] = useState({});
    const [sousFactures, setSousFactures] = useState([]);
    const [bonsCommande, setBonsCommande] = useState([]);


    useEffect(() => {
        if (factureId) {
            fetchFactureDetail(factureId);
            fetchSousFactures(factureId);
            fetchBonsCommande(factureId);
        }
    }, [factureId]);

    const fetchFactureDetail = async (id) => {
        try {
            const response = await fetch(getApiUrl(`factures/self/${id}`));
            const data = await response.json();
            setFacture(data || {});  // On protège même si data est vide
        } catch (error) {
            console.error(error);
            setFacture({});  // Si erreur on évite de planter l'affichage
        }
    };

    const fetchBonsCommande = async (id) => {
        try {
            const response = await fetch(getApiUrl(`boncommandes/${id}`));
            const data = await response.json();
            setBonsCommande(data || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des bons de commande :", error);
            setBonsCommande([]);
        }
    };


    const fetchSousFactures = async (id) => {
        try {
            const response = await fetch(getApiUrl(`sousfactures/details/${id}`));
            const data = await response.json();
            setSousFactures(data || []);
        } catch (error) {
            console.error(error);
            setSousFactures([]); // Pareil, on protège
        }
    };

    const delete_bon_commande = async (idBonCommande) => {
        try {
            const url = 'boncommandes/Delete/'+idBonCommande;
            const reponse = await fetch(getApiUrl(url), {
                method:'PUT',
                headers: {'Content-Type': 'application/json'}
            });

            if (!reponse.ok){
                throw new Error("Erreur lors de la suppression du bon de commande");
            }

            const result = await reponse.json();
            console.log("Bon de commande supprimé:", result);
            alert("Bon de commande supprimé avec succès !");
            await fetchBonsCommande(factureId);

        }catch (e) {
            console.error(e);
            alert("Erreur lors de la suppression !");
        }
    }

    const confirm = (event, id) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Voulez-vous vraiment supprimer ce Bon de commande ?",
            acceptLabel: "Confirmer",
            rejectLabel: "Annuler",
            accept: () => delete_bon_commande(id)
        });
    };

    const envoyerParEmail = async () => {
        const element = document.getElementById("facture-pdf");

        const opt = {
            margin: 0.5,
            filename: `facture_${factureId}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(element).outputPdf("blob").then(async (pdfBlob) => {
            const pdfFile = new File([pdfBlob], `facture_${factureId}.pdf`, { type: 'application/pdf' });

            const formData = new FormData();
            formData.append("facture", factureId);
            formData.append("pdf", pdfFile);

            try {
                const response = await fetch(getApiUrl("email/send-facture-mail"), {
                    method: "POST",
                    body: formData
                });

                const contentType = response.headers.get("content-type");

                if (!response.ok) {
                    const text = await response.text();
                    console.error("Erreur serveur :", text);
                    alert("Erreur lors de l'envoi : " + text);
                    return;
                }

                const data = await response.json();
                alert("Email envoyé avec succès !");
                console.log(data);

            } catch (error) {
                console.error("Erreur :", error);
                alert("Erreur lors de l'envoi de l'email !");
            }
        });
    };


    const totalHT = sousFactures.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);
    const totalTTC = totalHT;
    // const tva = totalHT * 0.20;
    // const totalTTC = totalHT + tva;

    const date = new Date(facture?.created_at);
    const jour = String(date.getDate()).padStart(2, '0');
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const annee = String(date.getFullYear()).slice(2);
    const codeClient = facture?.client_relation?.code?.toLowerCase().replace(/\s+/g, '-'); // vitagaz → vitagaz (ou "Smart Print" → smart-print)

    const factureCode = `${factureId}/${jour}/${mois}-${annee}/${codeClient}`;

    const generatePDF = () => {
        const element = document.getElementById("facture-pdf");

        const opt = {
            margin:       0.5,
            filename:     `facture_${factureId}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <>
    <ConfirmPopup />
        <div className="container-lg my-4">
            <div className="mb-4">
                <h4 className="text-start">Détail de la facture : <strong>{facture?.id || ''}</strong></h4>
            </div>
            <div className="d-flex justify-content-end my-3 gap-3">
                <button className="btn btn-warning" onClick={generatePDF}>
                    Télécharger en PDF <i className="fas fa-file-pdf"/>
                </button>
                <button className="btn btn-success" onClick={envoyerParEmail}>
                    Envoyer par email <i className="fas fa-paper-plane"/>
                </button>

            </div>

            <div className="card p-4" id="facture-pdf">
                <div className="row">
                    <div className="col-md-6 d-flex align-items-start">
                        <img src={MyLogo} alt="Smart Print Logo" height="60"/>
                    </div>

                    <div className="col-md-6 text-end">
                        <h5 className="mb-1">
                            <i className="fas fa-user text-primary"/> Client :
                            <strong>{facture?.client_relation?.nom || '-'}</strong>
                        </h5>
                        <p className="mb-0"><i className="fas fa-map-pin text-danger"/> Adresse
                            : {facture?.client_relation?.adresse || '-'}</p>
                        <p className="mb-0"><i className="fas fa-phone-alt text-dark"/> Téléphone
                            : {facture?.client_relation?.telephone || '-'}</p>
                        <p className="mb-0"><i className="fas fa-envelope text-success"/> Email
                            : {facture?.client_relation?.email || '-'}</p>
                        <p className="mb-0"> NIF
                            : {facture?.client_relation?.nif || '-'}</p>
                        <p className="mb-0"> STAT
                            : {facture?.client_relation?.stat || '-'}</p>
                    </div>
                </div>

                <hr/>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <p><strong><i className="fas fa-calendar text-success"/> Date d’émission
                            :</strong> {facture?.date_emission || '-'}</p>
                        <p><strong><i className="fas fa-calendar text-success"/> Date d’échéance
                            :</strong> {facture?.date_echeance || '-'}</p>
                        <p><strong><i className="fas fa-money-check"/> Conditions de paiement :</strong> Paiement à 10
                            jours</p>
                    </div>
                    <div className="col-md-6 text-end">
                        <p><strong>N° Facture :</strong> {factureCode || ''}</p>
                        <p><strong>Statut :</strong>
                            {facture.statut === 0
                                ? 'En Attente'
                                : facture.statut === 1
                                    ? 'envoyer'
                                    : facture.statut === 2
                                        ? 'payer'
                                        : facture.statut === 3
                                            ? 'Annuler'
                                            : 'Inconnu'}
                        </p>
                    </div>
                </div>

                <table className="table table-bordered">
                    <thead className="table-light">
                    <tr>
                        <th>#</th>
                        <th>Désignation</th>
                        <th>Quantité</th>
                        <th>Prix unitaire (Ar)</th>
                        <th>Total (Ar)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sousFactures.length > 0 ? (
                        sousFactures.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.description}</td>
                                <td>{item.quantite}</td>
                                <td>{item.prix_unitaire.toLocaleString("fr-FR")}</td>
                                <td>{(item.quantite * item.prix_unitaire).toLocaleString("fr-FR")}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Aucune ligne de sous-facture</td>
                        </tr>
                    )}
                    </tbody>
                    <tfoot>
                    {/*<tr>*/}
                    {/*    <th colSpan="4" className="text-end">Total HT</th>*/}
                    {/*    <th>{totalHT.toLocaleString("fr-FR")} Ar</th>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                    {/*    <th colSpan="4" className="text-end">TVA (20%)</th>*/}
                    {/*    <th>{tva.toLocaleString("fr-FR")} Ar</th>*/}
                    {/*</tr>*/}
                    <tr>
                        <th colSpan="4" className="text-end">Total TTC</th>
                        <th><strong>{totalTTC.toLocaleString("fr-FR")} Ar</strong></th>
                    </tr>
                    </tfoot>
                </table>

                <div className="mt-4">
                    <p className="small text-muted">
                        <i className="fas fa-pin"/> <strong>Mentions légales :</strong> Cette facture est émise par
                        Smart Print SARL – NIF : 123456789 – STAT : 987654321. Tout retard de paiement peut entraîner
                        des pénalités selon l’article L441-6 du Code du commerce.
                    </p>
                </div>
            </div>
            {bonsCommande.length > 0 && (
                <div className="mt-4">
                    <h5 className="text-primary">Bon(s) de commande associé(s)</h5>
                    <ul className="list-group">
                        {bonsCommande.map((bc, idx) => (
                            <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
                                <span>Bon du {new Date(bc.date_creation).toLocaleDateString("fr-FR")}</span>
                                <span> {bc.commande} </span>
                                <span> {bc.id} </span>
                                <a
                                    href={`http://localhost:8000/${bc.commande}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-info btn-sm"
                                >
                                    <i className="fas fa-eye"/> voir le fichier
                                </a>
                                <span>
                                    <button className="btn btn-danger btn-sm"
                                        onClick={(e) => {e.preventDefault(); confirm(e, bc.id)}}
                                    >
                                        <i className="fas fa-trash-alt"/> supprimer
                                    </button>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
        </>
    );
}
