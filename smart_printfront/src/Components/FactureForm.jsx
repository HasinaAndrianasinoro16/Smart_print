import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import {getApiUrl, getCookie} from "../Link/URL";

export default function FactureForm({ facture, onSuccess }) {
    const [lignes, setLignes] = useState([
        { produit: null, quantite: 1, prixUnitaire: 0, format: '' }
    ]);
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState({
        fetch: true,
        submit: false
    });
    const [error, setError] = useState('');

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

    const fetchProduits = async () => {
        try {
            const response = await fetch(getApiUrl('produits'), {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Erreur lors du chargement des produits");

            const data = await response.json();
            setProduits(data);
        } catch (error) {
            console.error("Erreur:", error);
            setError("Impossible de charger la liste des produits");
        } finally {
            setLoading(prev => ({ ...prev, fetch: false }));
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchProduits();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...lignes];
        updated[index][field] = value;

        if (field === 'produit' && value) {
            updated[index]['prixUnitaire'] = parseFloat(value.prix_unitaire) || 0;
        }

        setLignes(updated);
        setError('');
    };

    const addLigne = () => {
        setLignes([...lignes, { produit: null, quantite: 1, prixUnitaire: 0, format: '' }]);
    };

    const removeLigne = (index) => {
        if (lignes.length <= 1) return;
        const updated = lignes.filter((_, i) => i !== index);
        setLignes(updated);
    };

    const calculTotalHT = () =>
        lignes.reduce((total, ligne) => {
            const prix = typeof ligne.prixUnitaire === 'number'
                ? ligne.prixUnitaire
                : parseFloat(ligne.prixUnitaire) || 0;
            return total + (ligne.quantite * prix);
        }, 0);

    const validateForm = () => {
        const hasEmptyProduit = lignes.some(ligne => !ligne.produit);
        if (hasEmptyProduit) {
            setError("Veuillez sélectionner un produit pour chaque ligne");
            return false;
        }
        return true;
    };

    const submitForm = async () => {
        if (!validateForm()) return;

        setLoading(prev => ({ ...prev, submit: true }));
        setError('');

        try {
            const csrfToken = await getCsrfToken();
            const promises = lignes.map(ligne => {
                if (!ligne.produit) return Promise.resolve();

                let description = ligne.produit.designation;
                if (ligne.format?.trim()) {
                    description += ` (${ligne.format})`;
                }

                const payload = {
                    facture: facture,
                    description: description,
                    quantite: ligne.quantite,
                    prix_unitaire: ligne.prixUnitaire
                };

                return fetch(getApiUrl('sousfactures/add'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-XSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
            });

            const results = await Promise.all(promises);
            const allSuccess = results.every(res => !res || res.ok);

            if (!allSuccess) {
                throw new Error("Certaines lignes n'ont pas pu être ajoutées");
            }

            alert("Sous-factures ajoutées avec succès ✅");
            setLignes([{ produit: null, quantite: 1, prixUnitaire: 0, format: '' }]);
            if (onSuccess) onSuccess();

        } catch (error) {
            console.error("Erreur:", error);
            setError(error.message || "Une erreur est survenue");
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    };

    if (loading.fetch) {
        return (
            <div className="flex justify-center items-center p-8">
                <ProgressSpinner />
            </div>
        );
    }

    return (
        <div className="p-4">
            {error && (
                <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md flex items-center">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    {error}
                </div>
            )}

            <h3 className="mb-4 text-xl font-semibold">Facture : {facture || 'N/A'}</h3>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Produit</th>
                        <th className="p-3 text-left">Format (optionnel)</th>
                        <th className="p-3 text-left">Quantité</th>
                        <th className="p-3 text-left">Prix unitaire HT</th>
                        <th className="p-3 text-left">Prix total HT</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {lignes.map((ligne, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="p-3">
                                <Dropdown
                                    value={ligne.produit}
                                    options={produits}
                                    onChange={(e) => handleChange(index, 'produit', e.value)}
                                    optionLabel="designation"
                                    placeholder="Sélectionner un produit"
                                    className="w-full"
                                    disabled={loading.submit}
                                />
                            </td>
                            <td className="p-3">
                                <InputText
                                    value={ligne.format}
                                    onChange={(e) => handleChange(index, 'format', e.target.value)}
                                    placeholder="Ex: 500x500"
                                    className="w-full"
                                    disabled={loading.submit}
                                />
                            </td>
                            <td className="p-3">
                                <InputNumber
                                    value={ligne.quantite}
                                    onValueChange={(e) => handleChange(index, 'quantite', e.value || 0)}
                                    min={1}
                                    showButtons
                                    disabled={loading.submit}
                                />
                            </td>
                            <td className="p-3">
                                <InputNumber
                                    value={ligne.prixUnitaire}
                                    disabled
                                    mode="currency"
                                    currency="MGA"
                                    locale="fr-FR"
                                />
                            </td>
                            <td className="p-3">
                                {(ligne.quantite * ligne.prixUnitaire).toLocaleString('fr-FR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })} Ar
                            </td>
                            <td className="p-3">
                                <Button
                                    icon="fas fa-trash"
                                    className="p-button-danger p-button-sm"
                                    onClick={() => removeLigne(index)}
                                    disabled={lignes.length <= 1 || loading.submit}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3">
                <Button
                    icon="fas fa-plus"
                    label="Ajouter une ligne"
                    onClick={addLigne}
                    disabled={loading.submit}
                    className="p-button-secondary"
                />
            </div>

            <div className="mt-5 flex justify-end">
                <table className="w-auto">
                    <tbody>
                    <tr>
                        <td className="p-2"><strong>Total HT :</strong></td>
                        <td className="p-2 text-right">
                            {calculTotalHT().toLocaleString('fr-FR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} Ar
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-4">
                <Button
                    label={loading.submit ? "Enregistrement..." : "Créer la facture"}
                    icon={loading.submit ? "pi pi-spinner pi-spin" : "pi pi-check"}
                    onClick={submitForm}
                    disabled={loading.submit}
                    className="p-button-success"
                />
            </div>
        </div>
    );
}
// import React, { useState } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { InputNumber } from 'primereact/inputnumber';
// import { Button } from 'primereact/button';
// import { getApiUrl } from "../Link/URL";
//
// export default function FactureForm({ facture }) {
//     const [lignes, setLignes] = useState([
//         { description: '', quantite: 1, prixUnitaire: 0 }
//     ]);
//
//     const handleChange = (index, field, value) => {
//         const updated = [...lignes];
//         updated[index][field] = value;
//         setLignes(updated);
//     };
//
//     const addLigne = () => {
//         setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0 }]);
//     };
//
//     const removeLigne = (index) => {
//         const updated = lignes.filter((_, i) => i !== index);
//         setLignes(updated);
//     };
//
//     const calculTotalHT = () =>
//         lignes.reduce((total, ligne) => total + (ligne.quantite * ligne.prixUnitaire), 0);
//
//     const tauxTVA = 20;
//     const totalHT = calculTotalHT();
//     const totalTVA = totalHT * (tauxTVA / 100);
//     const totalTTC = totalHT + totalTVA;
//
//     const submitForm = async () => {
//         try {
//             for (let ligne of lignes) {
//                 const payload = {
//                     facture: facture,
//                     description: ligne.description,
//                     quantite: ligne.quantite,
//                     prix_unitaire: ligne.prixUnitaire
//                 };
//
//                 const reponse = await fetch(getApiUrl('sousfactures/add'), {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(payload)
//                 });
//
//                 if (!reponse.ok) {
//                     throw new Error("Erreur lors de l'ajout");
//                 }
//             }
//             alert("Sous-factures ajoutées avec succès !");
//             setLignes([{ description: '', quantite: 1, prixUnitaire: 0 }]);
//         } catch (error) {
//             console.error(error);
//             alert("Erreur lors de l'ajout des sous-factures");
//         }
//     };
//
//     return (
//         <div className="p-4">
//             <h3 className="mb-4">Facture : {facture ? `${facture}` : ''}</h3>
//             <table className="table w-full">
//                 <thead>
//                 <tr>
//                     <th>Description</th>
//                     <th>Quantité</th>
//                     <th>Prix unitaire HT</th>
//                     <th>Prix total HT</th>
//                     <th>Actions</th>
//                 </tr>
//                 </thead>
//                 <tbody>
//                 {lignes.map((ligne, index) => (
//                     <tr key={index}>
//                         <td>
//                             <InputText
//                                 value={ligne.description}
//                                 onChange={(e) => handleChange(index, 'description', e.target.value)}
//                                 placeholder="Titre du produit"
//                             />
//                         </td>
//                         <td>
//                             <InputNumber
//                                 value={ligne.quantite}
//                                 onValueChange={(e) => handleChange(index, 'quantite', e.value || 0)}
//                                 min={1}
//                                 showButtons
//                             />
//                         </td>
//                         <td>
//                             <InputNumber
//                                 value={ligne.prixUnitaire}
//                                 onValueChange={(e) => handleChange(index, 'prixUnitaire', e.value || 0)}
//                                 mode="currency"
//                                 currency="MGA"
//                                 locale="fr-FR"
//                             />
//                         </td>
//                         <td>
//                             {(ligne.quantite * ligne.prixUnitaire).toFixed(2)} Ar
//                         </td>
//                         <td>
//                             <Button
//                                 icon="fas fa-trash"
//                                 className="p-button-danger"
//                                 onClick={() => removeLigne(index)}
//                                 disabled={lignes.length === 1}
//                             />
//                         </td>
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//
//             <div className="mt-3">
//                 <Button icon="pi pi-plus" label="Ajouter une ligne" onClick={addLigne} />
//             </div>
//
//             <div className="mt-5">
//                 <div className="flex justify-content-end">
//                     <table>
//                         <tbody>
//                         <tr>
//                             <td><strong>Total TTC :</strong></td>
//                             <td>{totalHT.toFixed(2)} Ar</td>
//                         </tr>
//                         {/*<tr>*/}
//                         {/*    <td><strong>TVA ({tauxTVA}%) :</strong></td>*/}
//                         {/*    <td>{totalTVA.toFixed(2)} Ar</td>*/}
//                         {/*</tr>*/}
//                         {/*<tr>*/}
//                         {/*    <td><strong>Total TTC :</strong></td>*/}
//                         {/*    <td><strong>{totalTTC.toFixed(2)} Ar</strong></td>*/}
//                         {/*</tr>*/}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//
//             <div className="text-center mt-4">
//                 <Button className="p-button-success" label="Créer la facture" onClick={submitForm} />
//             </div>
//         </div>
//     );
// }
