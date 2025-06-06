import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';

export default function FactureForm() {
    const [lignes, setLignes] = useState([
        { description: '', quantite: 1, prixUnitaire: 0 }
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...lignes];
        updated[index][field] = value;
        setLignes(updated);
    };

    const addLigne = () => {
        setLignes([...lignes, { description: '', quantite: 1, prixUnitaire: 0 }]);
    };

    const removeLigne = (index) => {
        const updated = lignes.filter((_, i) => i !== index);
        setLignes(updated);
    };

    const calculTotalHT = () =>
        lignes.reduce((total, ligne) => total + (ligne.quantite * ligne.prixUnitaire), 0);

    const tauxTVA = 20; // TVA en pourcentage
    const totalHT = calculTotalHT();
    const totalTVA = totalHT * (tauxTVA / 100);
    const totalTTC = totalHT + totalTVA;

    return (
        <div className="p-4">
            <h3 className="mb-4">Facture : FACT000123</h3>
            <table className="table w-full">
                <thead>
                <tr>
                    <th>Description</th>
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
                            <InputText
                                value={ligne.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                placeholder="Titre du produit"
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
                                onValueChange={(e) => handleChange(index, 'prixUnitaire', e.value || 0)}
                                mode="currency"
                                currency="EUR"
                                locale="fr-FR"
                            />
                        </td>
                        <td>
                            {(ligne.quantite * ligne.prixUnitaire).toFixed(2)} €
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

            <div className="mt-5">
                <div className="flex justify-content-end">
                    <table>
                        <tbody>
                        <tr>
                            <td><strong>Total HT :</strong></td>
                            <td>{totalHT.toFixed(2)} €</td>
                        </tr>
                        <tr>
                            <td><strong>TVA ({tauxTVA}%) :</strong></td>
                            <td>{totalTVA.toFixed(2)} €</td>
                        </tr>
                        <tr>
                            <td><strong>Total TTC :</strong></td>
                            <td><strong>{totalTTC.toFixed(2)} €</strong></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-center">
                <button className="w-50 btn btn-success">
                    Creer la facture <i className="fas fa-plus"/>
                </button>
            </div>
        </div>
    );
}
