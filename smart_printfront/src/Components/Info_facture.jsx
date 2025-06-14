import React, { useState, useEffect } from "react";
import MyLogo from "../assets/img/Smart Print-logo/vector/default-monochrome-black.svg";
import { useLocation } from "react-router-dom";
import { getApiUrl } from "../Link/URL";

export default function Info_facture() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const factureId = queryParams.get("id");

    const [facture, setFacture] = useState({});
    const [sousFactures, setSousFactures] = useState([]);

    useEffect(() => {
        if (factureId) {
            fetchFactureDetail(factureId);
            fetchSousFactures(factureId);
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

    const totalHT = sousFactures.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);
    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;

    return (
        <div className="container-lg my-4">
            <div className="mb-4">
                <h4 className="text-start">Détail de la facture : <strong>{facture?.id || ''}</strong></h4>
            </div>

            <div className="card p-4">
                <div className="row">
                    <div className="col-md-6 d-flex align-items-start">
                        <img src={MyLogo} alt="Smart Print Logo" height="60" />
                    </div>

                    <div className="col-md-6 text-end">
                        <h5 className="mb-1">
                            <i className="fas fa-user text-primary"/> Client :
                            <strong>{facture?.client_relation?.nom || '-'}</strong>
                        </h5>
                        <p className="mb-0"><i className="fas fa-map-pin text-danger"/> Adresse : {facture?.client_relation?.adresse || '-'}</p>
                        <p className="mb-0"><i className="fas fa-phone-alt text-dark"/> Téléphone : {facture?.client_relation?.telephone || '-'}</p>
                        <p className="mb-0"><i className="fas fa-envelope text-success"/> Email : {facture?.client_relation?.email || '-'}</p>
                    </div>
                </div>

                <hr />

                <div className="row mb-4">
                    <div className="col-md-6">
                        <p><strong><i className="fas fa-calendar text-success"/> Date d’émission :</strong> {facture?.date_emission || '-'}</p>
                        <p><strong><i className="fas fa-calendar text-success"/> Date d’échéance :</strong> {facture?.date_echeance || '-'}</p>
                        <p><strong><i className="fas fa-money-check"/> Conditions de paiement :</strong> Paiement à 10 jours</p>
                    </div>
                    <div className="col-md-6 text-end">
                        <p><strong>N° Facture :</strong> {facture?.id || ''}</p>
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
                    <tr>
                        <th colSpan="4" className="text-end">Total HT</th>
                        <th>{totalHT.toLocaleString("fr-FR")} Ar</th>
                    </tr>
                    <tr>
                        <th colSpan="4" className="text-end">TVA (20%)</th>
                        <th>{tva.toLocaleString("fr-FR")} Ar</th>
                    </tr>
                    <tr>
                        <th colSpan="4" className="text-end">Total TTC</th>
                        <th><strong>{totalTTC.toLocaleString("fr-FR")} Ar</strong></th>
                    </tr>
                    </tfoot>
                </table>

                <div className="mt-4">
                    <p className="small text-muted">
                        <i className="fas fa-pin"/> <strong>Mentions légales :</strong> Cette facture est émise par Smart Print SARL – NIF : 123456789 – STAT : 987654321. Tout retard de paiement peut entraîner des pénalités selon l’article L441-6 du Code du commerce.
                    </p>
                </div>
            </div>
        </div>
    );
}
