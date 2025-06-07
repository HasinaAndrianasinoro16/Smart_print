import React from "react";
import MyLogo from "../assets/img/Smart Print-logo/vector/default-monochrome-black.svg";

export default function Info_facture() {
    return (
        <div className="container-lg my-4">
            <div className="mb-4">
                <h4 className="text-start">Détail de la facture : <strong>FACT00123</strong></h4>
            </div>

            <div className="card p-4">
                <div className="row">
                    {/* Logo */}
                    <div className="col-md-6 d-flex align-items-start">
                        <img src={MyLogo} alt="Smart Print Logo" height="60" />
                    </div>

                    {/* Infos Client */}
                    <div className="col-md-6 text-end">
                        <h5 className="mb-1"><i className="fas fa-user text-primary"/> Client : <strong>Jean Rakoto</strong></h5>
                        <p className="mb-0"><i className="fas fa-map-pin text-danger "/> Adresse : Lot 123 - Antananarivo</p>
                        <p className="mb-0"><i className="fas fa-phone-alt text-dark"/> Téléphone : 032 00 123 45</p>
                        <p className="mb-0"><i className="fas fa-envelope text-success"/> Email : jean.rakoto@email.com</p>
                    </div>
                </div>

                <hr />

                {/* Infos Facture */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <p><strong><i className="fas fa-calendar text-success"/> Date d’émission :</strong> 04/06/2025</p>
                        <p><strong><i className="fas fa-calendar text-success"/> Date d’échéance :</strong> 14/06/2025</p>
                        <p><strong><i className="fas fa-money-check"/> Conditions de paiement :</strong> Paiement à 10 jours</p>
                    </div>
                    <div className="col-md-6 text-end">
                        <p><strong>N° Facture :</strong> FACT00123</p>
                        <p><strong>Statut :</strong> En attente</p>
                    </div>
                </div>

                {/* Tableau Produits */}
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
                    <tr>
                        <td>1</td>
                        <td>Imprimante HP LaserJet</td>
                        <td>1</td>
                        <td>500 000</td>
                        <td>500 000</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Rame papier A4</td>
                        <td>5</td>
                        <td>15 000</td>
                        <td>75 000</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <th colSpan="4" className="text-end">Total HT</th>
                        <th>575 000 Ar</th>
                    </tr>
                    <tr>
                        <th colSpan="4" className="text-end">TVA (20%)</th>
                        <th>115 000 Ar</th>
                    </tr>
                    <tr>
                        <th colSpan="4" className="text-end">Total TTC</th>
                        <th><strong>690 000 Ar</strong></th>
                    </tr>
                    </tfoot>
                </table>

                {/* Mentions légales */}
                <div className="mt-4">
                    <p className="small text-muted">
                        <i className="fas fa-pin"/> <strong>Mentions légales :</strong> Cette facture est émise par Smart Print SARL – NIF : 123456789 – STAT : 987654321. Tout retard de paiement peut entraîner des pénalités selon l’article L441-6 du Code du commerce.
                    </p>
                </div>
            </div>
        </div>
    );
}
