import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {getApiUrl, getCookie} from "../Link/URL";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import html2pdf from "html2pdf.js";
import MyLogo from "../assets/img/upscalemedia-transformed.jpeg";

export default function Info_facture() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const factureId = queryParams.get("id");
    const toastRef = React.useRef();

    const [facture, setFacture] = useState(null);
    const [sousFactures, setSousFactures] = useState([]);
    const [bonsCommande, setBonsCommande] = useState([]);
    const [services, setServices] = useState([]);
    const [facture_user, setFacture_user] = useState([]);
    const [loading, setLoading] = useState({
        facture: true,
        sousFactures: true,
        bonsCommande: true,
        services: true,
        email: false,
        pdf: false
    });

    // Configuration commune pour les requêtes fetch
    const fetchConfig = {
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };

    // Récupération du token CSRF
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

    const fetchData = async () => {
        try {
            const csrfToken = await getCsrfToken();
            const config = {
                ...fetchConfig,
                headers: {
                    ...fetchConfig.headers,
                    'X-XSRF-TOKEN': csrfToken
                }
            };

            const [factureRes, sousFacturesRes, bonsCommandeRes, servicesRes, factureuserRes] = await Promise.all([
                fetch(getApiUrl(`factures/self/${factureId}`), config),
                fetch(getApiUrl(`sousfactures/details/${factureId}`), config),
                fetch(getApiUrl(`boncommandes/${factureId}`), config),
                fetch(getApiUrl(`services/service-facture/${factureId}`), config),
                fetch(getApiUrl(`factures/facture-user/${factureId}`), config)
            ]);

            if (!factureRes.ok) throw new Error("Erreur lors du chargement de la facture");
            if (!sousFacturesRes.ok) throw new Error("Erreur lors du chargement des sous-factures");
            if (!bonsCommandeRes.ok) throw new Error("Erreur lors du chargement des bons de commande");
            if (!servicesRes.ok) throw new Error("Erreur lors du chargement des services");
            if (!factureuserRes.ok) throw new Error("Erreur lors du chargement des factures & user");

            setFacture(await factureRes.json());
            setSousFactures(await sousFacturesRes.json() || []);
            setBonsCommande(await bonsCommandeRes.json() || []);
            setServices(await servicesRes.json() || []);
            setFacture_user(await factureuserRes.json() || []);

        } catch (error) {
            console.error("Erreur:", error);
            showError(error.message || "Une erreur est survenue lors du chargement");
        } finally {
            setLoading({
                facture: false,
                sousFactures: false,
                bonsCommande: false,
                services: false,
                factureuser: false,
                email: false,
                pdf: false
            });
        }
    };

    // Chargement des données
    useEffect(() => {
        if (!factureId) return;
        fetchData();
    }, [factureId]);

    // Suppression d'un bon de commande
    const deleteBonCommande = async (idBonCommande) => {
        try {
            const csrfToken = await getCsrfToken();
            const response = await fetch(getApiUrl(`boncommandes/Delete/${idBonCommande}`), {
                method: 'PUT',
                ...fetchConfig,
                headers: {
                    ...fetchConfig.headers,
                    'X-XSRF-TOKEN': csrfToken
                }
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression");

            const result = await response.json();
            showSuccess("Bon de commande supprimé avec succès !");
            await fetchData();
        } catch (error) {
            console.error("Erreur:", error);
            showError(error.message || "Erreur lors de la suppression");
        }
    };

    const confirmDelete = (event, id) => {
        confirmPopup({
            target: event.currentTarget,
            message: "Voulez-vous vraiment supprimer ce Bon de commande ?",
            acceptLabel: "Confirmer",
            rejectLabel: "Annuler",
            accept: () => deleteBonCommande(id),
        });
    };

    // Envoi par email
    const envoyerParEmail = async () => {
        setLoading(prev => ({ ...prev, email: true }));

        try {
            const element = document.getElementById("facture-pdf");
            const opt = {
                margin: 0.5,
                filename: `facture_${factureId}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
            };

            const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
            const pdfFile = new File([pdfBlob], `facture_${factureId}.pdf`, { type: 'application/pdf' });

            const formData = new FormData();
            formData.append("facture", factureId);
            formData.append("pdf", pdfFile);

            const csrfToken = await getCsrfToken();

            const response = await fetch(getApiUrl("email/send-facture-mail"), {
                method: "POST",
                headers: {
                    'X-XSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const data = await response.json();
            showSuccess("Email envoyé avec succès !");
        } catch (error) {
            console.error("Erreur:", error);
            showError(`Erreur lors de l'envoi: ${error.message}`);
        } finally {
            setLoading(prev => ({ ...prev, email: false }));
        }
    };

    // Génération PDF
    const generatePDF = async () => {
        setLoading(prev => ({ ...prev, pdf: true }));
        try {
            const element = document.getElementById("facture-pdf");
            const opt = {
                margin: 0.5,
                filename: `facture_${factureId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            await html2pdf().set(opt).from(element).save();
            showSuccess("PDF généré avec succès !");
        } catch (error) {
            console.error("Erreur:", error);
            showError("Erreur lors de la génération du PDF");
        } finally {
            setLoading(prev => ({ ...prev, pdf: false }));
        }
    };

    // Affichage des notifications
    const showError = (message) => {
        toastRef.current.show({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 5000
        });
    };

    const showSuccess = (message) => {
        toastRef.current.show({
            severity: 'success',
            summary: 'Succès',
            detail: message,
            life: 3000
        });
    };

    // Calculs des totaux
    const totalHT = sousFactures.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);
    const totalTTC = totalHT;
    const totalTTCServices = services.reduce((sum, item) => {
        const prix = parseFloat(item.prix_unitaire) || 0;
        return sum + prix;
    }, 0);
    const prixTotalTTC = totalTTC + totalTTCServices;

    // Formatage du code facture
    const factureCode = (() => {
        if (!facture?.created_at || !facture?.client_relation?.code) return '';
        const date = new Date(facture.created_at);
        const jour = String(date.getDate()).padStart(2, '0');
        const mois = String(date.getMonth() + 1).padStart(2, '0');
        const annee = String(date.getFullYear()).slice(2);
        const codeClient = facture.client_relation.code.toLowerCase().replace(/\s+/g, '-');
        return `${factureId}/${jour}/${mois}-${annee}/${codeClient}`;
    })();

    if (!factureId) {
        return (
            <div className="p-5 text-center">
                <div className="text-red-500 font-bold">Aucun ID de facture fourni</div>
            </div>
        );
    }

    if (loading.facture) {
        return (
            <div className="flex justify-center items-center p-8">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            <ConfirmPopup />

            <div className="container-lg my-4">
                {/* En-tête avec actions */}
                <div className="row flex flex-wrap justify-between items-center mb-4">
                    <div className="col-md-6 d-flex justify-content-start my-3 gap-3">
                        <h4 className="text-xl font-semibold">Détail de la facture: <strong>{facture?.id || ''}</strong></h4>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end my-3 gap-3">
                        <Button
                            label="PDF"
                            icon="fas fa-file-pdf"
                            className="p-button-warning"
                            onClick={generatePDF}
                            loading={loading.pdf}
                            disabled={loading.pdf}
                        />
                        <Button
                            label="Email"
                            icon="fas fa-paper-plane"
                            className="p-button-success"
                            onClick={envoyerParEmail}
                            loading={loading.email}
                            disabled={loading.email}
                        />
                    </div>
                </div>

                {/* Contenu de la facture (PDF) */}
                <div className="card p-4" id="facture-pdf">
                    {/* Logo et informations client */}
                    <div className="row">
                        <div className="col-md-6 d-flex align-items-start">
                            <img src={MyLogo} alt="Smart Print Logo" height="160"/>
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

                    <hr className="my-1"/>

                    <div className="row mb-1">
                        <div className="col-md-6">
                            <p><strong><i className="fas fa-calendar text-success"/> Date d’émission
                                :</strong> {facture?.date_emission || '-'}</p>
                            <p><strong><i className="fas fa-calendar text-success"/> Date d’échéance
                                :</strong> {facture?.date_echeance || '-'}</p>
                            <p><strong><i className="fas fa-money-check"/> Conditions de paiement :</strong>
                                {facture?.condition_paiement}</p>
                        </div>
                        <div className="col-md-6 text-end ">
                            <p><strong>N° Facture :</strong> {factureCode || ''}</p>
                            <p><strong>Statut :</strong>
                                {facture.statut === 0
                                    ? 'En Attente'
                                    : facture.statut === 1
                                        ? 'Annuler'
                                        : facture.statut === 2
                                            ? 'payer'
                                            : facture.statut === 3
                                                ? 'Envoyer'
                                                : 'Inconnu'}
                            </p>
                            <p><strong>Cassier:</strong>
                                {facture_user?.[0]?.user_relation?.name || '-'}
                            </p>

                        </div>
                    </div>

                    <hr />

                    {/* Tableau des produits */}
                    <div className="mb-4">
                        <h5 className="text-lg font-semibold mb-2">Produits:</h5>
                        <div className="overflow-x-auto">
                            <table className="table table-bordered table-responsive">
                                <thead className="table-light">
                                <tr>
                                    <th className="p-3 text-left">#</th>
                                    <th className="p-3 text-left">Désignation</th>
                                    <th className="p-3 text-left">Quantité</th>
                                    <th className="p-3 text-left">Prix unitaire (Ar)</th>
                                    <th className="p-3 text-left">Total (Ar)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sousFactures.length > 0 ? (
                                    sousFactures.map((item, index) => (
                                        <tr key={`product-${index}`}
                                            className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">{item.description}</td>
                                            <td className="p-3">{item.quantite}</td>
                                            <td className="p-3">{item.prix_unitaire.toLocaleString("fr-FR")}</td>
                                            <td className="p-3">{(item.quantite * item.prix_unitaire).toLocaleString("fr-FR")}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="p-3 text-center">Aucune ligne de produit</td>
                                    </tr>
                                )}
                                </tbody>
                                <tfoot>
                                <tr className="bg-gray-50">
                                    <th colSpan="4" className="p-3 text-right">Total TTC</th>
                                    <th className="p-3 font-bold">{totalTTC.toLocaleString("fr-FR")} Ar</th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Tableau des services */}
                    <div className="mb-4">
                        <h5 className="text-lg font-semibold mb-2">Services:</h5>
                        <div className="overflow-x-auto">
                            <table className="table table-bordered table-responsive">
                                <thead className="table-light">
                                <tr>
                                    <th className="p-3 text-left">#</th>
                                    <th className="p-3 text-left">Désignation</th>
                                    <th className="p-3 text-left">Total (Ar)</th>
                                </tr>
                                </thead>
                                <tbody>
                                {services.length > 0 ? (
                                    services.map((item, index) => (
                                        <tr key={`service-${index}`}
                                            className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">{item.description}</td>
                                            <td className="p-3">{item.prix_unitaire.toLocaleString("fr-FR")}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-3 text-center">Aucun service</td>
                                    </tr>
                                )}
                                </tbody>
                                <tfoot>
                                <tr className="bg-gray-50">
                                    <th colSpan="2" className="p-3 text-right">Total TTC</th>
                                    <th className="p-3 font-bold">{totalTTCServices.toLocaleString("fr-FR")} Ar</th>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Total général */}
                    <div className="overflow-x-auto">
                        <table className="table table-striped table-responsive">
                            <thead className="table-light">
                            <tr className="bg-gray-100">
                                <th colSpan="4" className="p-3 h3 text-left">Coût Total TTC</th>
                                <th className="p-3 font-bold h3">{prixTotalTTC.toLocaleString("fr-FR")} Ar</th>
                            </tr>
                            </thead>
                        </table>
                    </div>

                    {/* Mentions légales */}
                    <div className="mt-1 p-3 bg-gray-50 rounded">
                        <p className="text-sm-start text-secondary">
                            <i className="fas fa-info-circle mr-2"/>
                            <strong>Mentions légales :</strong> Cette facture est émise par
                            Smart Print SARL – NIF : 123456789 – STAT : 987654321. Tout retard de paiement peut
                            entraîner
                            des pénalités selon l'article L441-6 du Code du commerce.
                        </p>
                    </div>
                </div>

                {/* Liste des bons de commande */}
                {bonsCommande.length > 0 && (
                    <div className="mt-4">
                        <h5 className="text-primary mb-3">Bon(s) de commande associé(s)</h5>
                        <div className="table-responsive">
                            <ul className="list-group">
                                {bonsCommande.map((bc, idx) => (
                                    <li key={`bc-${idx}`} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-column flex-md-row align-items-md-center">
                                            <span className="fw-bold me-2">Bon du {new Date(bc.date_creation).toLocaleDateString("fr-FR")}</span>
                                            <small className="text-muted">(Réf: {bc.id})</small>
                                        </div>
                                        <div>
                                            <a
                                                href={`http://localhost:8000/${bc.commande}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-outline-info btn-sm me-2"
                                            >
                                                <i className="fas fa-eye me-1"></i> Voir
                                            </a>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    confirmDelete(e, bc.id);
                                                }}
                                            >
                                                <i className="fas fa-trash me-1"></i> Supprimer
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
// import React, { useState, useEffect } from "react";
// import MyLogo from "../assets/img/upscalemedia-transformed.jpeg";
// import { useLocation } from "react-router-dom";
// import { getApiUrl } from "../Link/URL";
// import html2pdf from "html2pdf.js";
// import {ConfirmPopup, confirmPopup} from "primereact/confirmpopup";
//
// export default function Info_facture() {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const factureId = queryParams.get("id");
//
//     const [facture, setFacture] = useState({});
//     const [sousFactures, setSousFactures] = useState([]);
//     const [bonsCommande, setBonsCommande] = useState([]);
//     const [services, setServices] = useState([])
//
//     const [loading, setLoading] = useState(false);
//
//
//     useEffect(() => {
//         if (factureId) {
//             fetchFactureDetail(factureId);
//             fetchSousFactures(factureId);
//             fetchBonsCommande(factureId);
//             fetchServiceFacture(factureId);
//         }
//     }, [factureId]);
//
//     const fetchServiceFacture = async (id) => {
//         try {
//             const url = 'services/service-facture/' + id;
//             const reponse = await fetch(getApiUrl(url));
//             const data = await reponse.json();
//             setServices(data || {});
//         }catch (e) {
//             console.error(e);
//             setServices({});
//         }
//     }
//
//     const fetchFactureDetail = async (id) => {
//         try {
//             const response = await fetch(getApiUrl(`factures/self/${id}`));
//             const data = await response.json();
//             setFacture(data || {});
//         } catch (error) {
//             console.error(error);
//             setFacture({});
//         }
//     };
//
//     const fetchBonsCommande = async (id) => {
//         try {
//             const response = await fetch(getApiUrl(`boncommandes/${id}`));
//             const data = await response.json();
//             setBonsCommande(data || []);
//         } catch (error) {
//             console.error("Erreur lors de la récupération des bons de commande :", error);
//             setBonsCommande([]);
//         }
//     };
//
//
//     const fetchSousFactures = async (id) => {
//         try {
//             const response = await fetch(getApiUrl(`sousfactures/details/${id}`));
//             const data = await response.json();
//             setSousFactures(data || []);
//         } catch (error) {
//             console.error(error);
//             setSousFactures([]); // Pareil, on protège
//         }
//     };
//
//     const delete_bon_commande = async (idBonCommande) => {
//         try {
//             const url = 'boncommandes/Delete/'+idBonCommande;
//             const reponse = await fetch(getApiUrl(url), {
//                 method:'PUT',
//                 headers: {'Content-Type': 'application/json'}
//             });
//
//             if (!reponse.ok){
//                 throw new Error("Erreur lors de la suppression du bon de commande");
//             }
//
//             const result = await reponse.json();
//             console.log("Bon de commande supprimé:", result);
//             alert("Bon de commande supprimé avec succès !");
//             await fetchBonsCommande(factureId);
//
//         }catch (e) {
//             console.error(e);
//             alert("Erreur lors de la suppression !");
//         }
//     }
//
//     const confirm = (event, id) => {
//         confirmPopup({
//             target: event.currentTarget,
//             message: "Voulez-vous vraiment supprimer ce Bon de commande ?",
//             acceptLabel: "Confirmer",
//             rejectLabel: "Annuler",
//             accept: () => delete_bon_commande(id)
//         });
//     };
//
//     const envoyerParEmail = async () => {
//         setLoading(true);
//
//         const element = document.getElementById("facture-pdf");
//
//         const opt = {
//             margin: 0.5,
//             filename: `facture_${factureId}.pdf`,
//             image: { type: "jpeg", quality: 0.98 },
//             html2canvas: { scale: 2 },
//             jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
//         };
//
//         html2pdf().set(opt).from(element).outputPdf("blob").then(async (pdfBlob) => {
//             const pdfFile = new File([pdfBlob], `facture_${factureId}.pdf`, { type: 'application/pdf' });
//
//             const formData = new FormData();
//             formData.append("facture", factureId);
//             formData.append("pdf", pdfFile);
//
//             try {
//                 const response = await fetch(getApiUrl("email/send-facture-mail"), {
//                     method: "POST",
//                     body: formData
//                 });
//
//                 const contentType = response.headers.get("content-type");
//
//                 if (!response.ok) {
//                     const text = await response.text();
//                     console.error("Erreur serveur :", text);
//                     alert("Erreur lors de l'envoi : " + text);
//                     return;
//                 }
//
//                 const data = await response.json();
//                 alert("Email envoyé avec succès !");
//                 console.log(data);
//
//             } catch (error) {
//                 console.error("Erreur :", error);
//                 alert("Erreur lors de l'envoi de l'email !");
//             }finally {
//                 setLoading(false);
//             }
//         });
//     };
//
//
//     const totalHT = sousFactures.reduce((sum, item) => sum + (item.quantite * item.prix_unitaire), 0);
//     const totalTTC = totalHT;
//
//     const totalTTCServices = services.reduce((sum, item) => {
//         const prix = parseFloat(item.prix_unitaire) || 0;
//         return sum + prix;
//     }, 0);
//
//     const PrixTotalTTC = totalTTC + totalTTCServices;
//     // const tva = totalHT * 0.20;
//     // const totalTTC = totalHT + tva;
//
//     const date = new Date(facture?.created_at);
//     const jour = String(date.getDate()).padStart(2, '0');
//     const mois = String(date.getMonth() + 1).padStart(2, '0');
//     const annee = String(date.getFullYear()).slice(2);
//     const codeClient = facture?.client_relation?.code?.toLowerCase().replace(/\s+/g, '-'); // vitagaz → vitagaz (ou "Smart Print" → smart-print)
//
//     const factureCode = `${factureId}/${jour}/${mois}-${annee}/${codeClient}`;
//
//     const generatePDF = () => {
//         const element = document.getElementById("facture-pdf");
//
//         const opt = {
//             margin:       0.5,
//             filename:     `facture_${factureId}.pdf`,
//             image:        { type: 'jpeg', quality: 0.98 },
//             html2canvas:  { scale: 2 },
//             jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
//         };
//
//         html2pdf().set(opt).from(element).save();
//     };
//
//     return (
//         <>
//     <ConfirmPopup />
//         <div className="container-lg my-4">
//             <div className="row">
//                 <div className="col-md-6 d-flex justify-content-start my-3 gap-3">
//                     <h4 className="text-start">Détail de la facture : <strong>{facture?.id || ''}</strong></h4>
//                 </div>
//                 <div className="col-md-6 d-flex justify-content-end my-3 gap-3">
//                     <button className="btn btn-warning" onClick={generatePDF}>
//                         Télécharger en PDF <i className="fas fa-file-pdf"/>
//                     </button>
//                     <button className="btn btn-success" onClick={envoyerParEmail} disabled={loading}>
//                         {loading ? (
//                             <>
//                             <span className="spinner-border spinner-border-sm me-2" role="status"
//                                   aria-hidden="true"></span>
//                                 Envoi en cours...
//                             </>
//                         ) : (
//                             <>
//                                 Envoyer par email <i className="fas fa-paper-plane"/>
//                             </>
//                         )}
//                     </button>
//                 </div>
//             </div>
//
//             <div className="card p-4" id="facture-pdf">
//                 <div className="row">
//                     <div className="col-md-6 d-flex align-items-start">
//                         <img src={MyLogo} alt="Smart Print Logo" height="160"/>
//                     </div>
//
//                     <div className="col-md-6 text-end">
//                         <h5 className="mb-1">
//                             <i className="fas fa-user text-primary"/> Client :
//                             <strong>{facture?.client_relation?.nom || '-'}</strong>
//                         </h5>
//                         <p className="mb-0"><i className="fas fa-map-pin text-danger"/> Adresse
//                             : {facture?.client_relation?.adresse || '-'}</p>
//                         <p className="mb-0"><i className="fas fa-phone-alt text-dark"/> Téléphone
//                             : {facture?.client_relation?.telephone || '-'}</p>
//                         <p className="mb-0"><i className="fas fa-envelope text-success"/> Email
//                             : {facture?.client_relation?.email || '-'}</p>
//                         <p className="mb-0"> NIF
//                             : {facture?.client_relation?.nif || '-'}</p>
//                         <p className="mb-0"> STAT
//                             : {facture?.client_relation?.stat || '-'}</p>
//                     </div>
//                 </div>
//
//                 <hr/>
//
//                 <div className="row mb-4">
//                     <div className="col-md-6">
//                         <p><strong><i className="fas fa-calendar text-success"/> Date d’émission
//                             :</strong> {facture?.date_emission || '-'}</p>
//                         <p><strong><i className="fas fa-calendar text-success"/> Date d’échéance
//                             :</strong> {facture?.date_echeance || '-'}</p>
//                         <p><strong><i className="fas fa-money-check"/> Conditions de paiement :</strong>
//                             {facture?.condition_paiement}</p>
//                     </div>
//                     <div className="col-md-6 text-end ">
//                         <p><strong>N° Facture :</strong> {factureCode || ''}</p>
//                         <p><strong>Statut :</strong>
//                             {facture.statut === 0
//                                 ? 'En Attente'
//                                 : facture.statut === 1
//                                     ? 'envoyer'
//                                     : facture.statut === 2
//                                         ? 'payer'
//                                         : facture.statut === 3
//                                             ? 'Annuler'
//                                             : 'Inconnu'}
//                         </p>
//                     </div>
//                 </div>
//
//                 <div className="text-start h4">Produits:</div>
//                 <div className="py-1"/>
//
//                 <table className="table table-bordered">
//                     <thead className="table-light">
//                     <tr>
//                         <th>#</th>
//                         <th>Désignation</th>
//                         <th>Quantité</th>
//                         <th>Prix unitaire (Ar)</th>
//                         <th>Total (Ar)</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {sousFactures.length > 0 ? (
//                         sousFactures.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.description}</td>
//                                 <td>{item.quantite}</td>
//                                 <td>{item.prix_unitaire.toLocaleString("fr-FR")}</td>
//                                 <td>{(item.quantite * item.prix_unitaire).toLocaleString("fr-FR")}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="5" className="text-center">Aucune ligne de sous-facture</td>
//                         </tr>
//                     )}
//                     </tbody>
//                     <tfoot>
//                     {/*<tr>*/}
//                     {/*    <th colSpan="4" className="text-end">Total HT</th>*/}
//                     {/*    <th>{totalHT.toLocaleString("fr-FR")} Ar</th>*/}
//                     {/*</tr>*/}
//                     {/*<tr>*/}
//                     {/*    <th colSpan="4" className="text-end">TVA (20%)</th>*/}
//                     {/*    <th>{tva.toLocaleString("fr-FR")} Ar</th>*/}
//                     {/*</tr>*/}
//                     <tr>
//                         <th colSpan="4" className="text-end">Total TTC</th>
//                         <th><strong>{totalTTC.toLocaleString("fr-FR")} Ar</strong></th>
//                     </tr>
//                     </tfoot>
//                 </table>
//
//                 <div className="py-1"/>
//                 <div className="text-start h4">Services:</div>
//                 <div className="py-1"/>
//
//                 <table className="table table-bordered">
//                     <thead className="table-light">
//                     <tr>
//                         <th>#</th>
//                         <th>Désignation</th>
//                         <th>Total (Ar)</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {services.length > 0 ? (
//                         services.map((item, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.description}</td>
//                                 <td>{item.prix_unitaire.toLocaleString("fr-FR")}</td>
//                             </tr>
//                         ))
//                     ) : (
//                         <tr>
//                             <td colSpan="5" className="text-center">Aucune ligne de sous-facture</td>
//                         </tr>
//                     )}
//                     </tbody>
//                     <tfoot>
//                     <tr>
//                         <th colSpan="4" className="text-end">Total TTC</th>
//                         <th><strong>{totalTTCServices.toLocaleString("fr-FR")} Ar</strong></th>
//                     </tr>
//                     </tfoot>
//                 </table>
//
//                 <div className="py-2"/>
//
//                 <table className="table table-bordered">
//                     <tfoot>
//                     <tr>
//                         <th colSpan="4" className="text-start">Cout Total TTC</th>
//                         <th><strong>{PrixTotalTTC.toLocaleString("fr-FR")} Ar</strong></th>
//                     </tr>
//                     </tfoot>
//                 </table>
//
//                 <div className="mt-4">
//                     <p className="small text-muted">
//                         <i className="fas fa-pin"/> <strong>Mentions légales :</strong> Cette facture est émise par
//                         Smart Print SARL – NIF : 123456789 – STAT : 987654321. Tout retard de paiement peut entraîner
//                         des pénalités selon l’article L441-6 du Code du commerce.
//                     </p>
//                 </div>
//             </div>
//             {bonsCommande.length > 0 && (
//                 <div className="mt-4">
//                     <h5 className="text-primary">Bon(s) de commande associé(s)</h5>
//                     <ul className="list-group">
//                         {bonsCommande.map((bc, idx) => (
//                             <li className="list-group-item d-flex justify-content-between align-items-center" key={idx}>
//                                 <span>Bon du {new Date(bc.date_creation).toLocaleDateString("fr-FR")}</span>
//                                 <span> {bc.commande} </span>
//                                 <span> {bc.id} </span>
//                                 <a
//                                     href={`http://localhost:8000/${bc.commande}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="btn btn-info btn-sm"
//                                 >
//                                     <i className="fas fa-eye"/> voir le fichier
//                                 </a>
//                                 <span>
//                                     <button className="btn btn-danger btn-sm"
//                                             onClick={(e) => {
//                                                 e.preventDefault();
//                                                 confirm(e, bc.id)
//                                             }}
//                                     >
//                                         <i className="fas fa-trash-alt"/> supprimer
//                                     </button>
//                                 </span>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//
//         </div>
//         </>
//     );
// }
