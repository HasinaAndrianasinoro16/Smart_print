import React, { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { getApiUrl } from "../Link/URL";

export default function FactureForm({ facture }) {
    const [lignes, setLignes] = useState([
        { produit: null, quantite: 1, prixUnitaire: 0 }
    ]);
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await fetch(getApiUrl('produits'));
                if (!response.ok) throw new Error("Erreur lors du chargement des produits");
                const data = await response.json();
                setProduits(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduits();
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...lignes];
        updated[index][field] = value;

        if (field === 'produit' && value) {
            updated[index]['prixUnitaire'] = value.prix_unitaire;
        }

        setLignes(updated);
    };

    const addLigne = () => {
        setLignes([...lignes, { produit: null, quantite: 1, prixUnitaire: 0 }]);
    };

    const removeLigne = (index) => {
        const updated = lignes.filter((_, i) => i !== index);
        setLignes(updated);
    };

    const calculTotalHT = () =>
        lignes.reduce((total, ligne) => total + (ligne.quantite * ligne.prixUnitaire), 0);

    const submitForm = async () => {
        try {
            for (let ligne of lignes) {
                if (!ligne.produit) continue;

                const payload = {
                    facture: facture,
                    description: ligne.produit.designation,
                    quantite: ligne.quantite,
                    prix_unitaire: ligne.prixUnitaire
                };

                const response = await fetch(getApiUrl('sousfactures/add'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de l'ajout");
                }
            }
            alert("Sous-factures ajoutées avec succès !");
            setLignes([{ produit: null, quantite: 1, prixUnitaire: 0 }]);
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'ajout des sous-factures");
        }
    };

    return (
        <div className="p-4">
            <h3 className="mb-4">Facture : {facture ? `${facture}` : ''}</h3>
            <table className="table w-full">
                <thead>
                <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire HT</th>
                    <th>Prix total HT</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {lignes.map((ligne, index) => (
                    <tr key={index}>
                        <td>
                            <Dropdown
                                value={ligne.produit}
                                options={produits}
                                onChange={(e) => handleChange(index, 'produit', e.value)}
                                optionLabel="designation"
                                placeholder="Sélectionner un produit"
                                className="w-full"
                            />
                        </td>
                        <td>
                            <InputNumber
                                value={ligne.quantite}
                                onValueChange={(e) => handleChange(index, 'quantite', e.value || 0)}
                                min={1}
                                showButtons
                            />
                        </td>
                        <td>
                            <InputNumber
                                value={ligne.prixUnitaire}
                                disabled
                                mode="currency"
                                currency="MGA"
                                locale="fr-FR"
                            />
                        </td>
                        <td>
                            {(ligne.quantite * ligne.prixUnitaire).toFixed(2)} Ar
                        </td>
                        <td>
                            <Button
                                icon="fas fa-trash"
                                className="p-button-danger"
                                onClick={() => removeLigne(index)}
                                disabled={lignes.length === 1}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-3">
                <Button icon="pi pi-plus" label="Ajouter une ligne" onClick={addLigne} />
            </div>

            <div className="mt-5 flex justify-content-end">
                <table>
                    <tbody>
                    <tr>
                        <td><strong>Total HT :</strong></td>
                        <td>{calculTotalHT().toFixed(2)} Ar</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className="text-center mt-4">
                <Button className="p-button-success" label="Créer la facture" onClick={submitForm} />
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
