import React, { useEffect, useState } from "react";
import image from "../assets/img/illustration/5142475.jpg";
import { getApiUrl } from "../Link/URL";

export default function Home({ user }) {
    const [stats, setStats] = useState({
        attente: 0,
        annule: 0,
        paye: 0,
        total: 0,
    });

    const [dates, setDates] = useState({
        debut: "",
        fin: "",
    });

    const fetchStats = async () => {
        try {
            const query = `?debut=${dates.debut}&fin=${dates.fin}`;
            const response = await fetch(getApiUrl(`factures/facture_stat${query}`));
            const data = await response.json();
            setStats({
                attente: data.attente,
                annule: data.annule,
                total: data.total,
                paye: data.paye,
            });
        } catch (error) {
            console.error("Erreur chargement stats :", error);
        }
    };

    useEffect(() => {
        if (user?.role === 2) {
            fetchStats();
        }
    }, [dates, user]);

    const getRoleName = (role) => {
        switch (role) {
            case 0:
                return "Administrateur";
            case 1:
                return "Facturier";
            case 2:
                return "Manager";
            default:
                return "Rôle inconnu";
        }
    };

    const getBlabla = (role) => {
        switch (role) {
            case 0:
                return "Bienvenue dans le panneau d'administration. Vous avez un contrôle total sur l'application.";
            case 1:
                return "Bienvenue dans votre espace de facturation. Vous pouvez gérer les factures et les paiements.";
            case 2:
                return "Bienvenue dans votre tableau de bord manager. Vous pouvez superviser les opérations et générer des rapports.";
            default:
                return "Bienvenue sur notre application.";
        }
    };

    return (
        <>
            <div className="container mt-4">
                {user?.role === 2 && (
                    <>
                        {/* Filtres */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dates.debut}
                                    onChange={(e) => setDates({...dates, debut: e.target.value})}
                                />
                            </div>
                            <div className="col-md-4">
                                <input
                                    type="date"
                                    className="form-control"
                                    value={dates.fin}
                                    onChange={(e) => setDates({...dates, fin: e.target.value})}
                                />
                            </div>
                            <div className="col-md-4">
                                <button className="btn btn-primary w-100" onClick={fetchStats}>
                                    Appliquer filtre
                                </button>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="row text-center mb-5">
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="text-warning">Factures en attente</h5>
                                    <h2>{stats.attente ?? 0}</h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="text-success">Factures payer</h5>
                                    <h2>{stats.paye ?? 0}</h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="text-danger">Factures annulées</h5>
                                    <h2>{stats.annule ?? 0}</h2>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card shadow-sm p-3">
                                    <h5 className="text-primary">Montant total (Ar)</h5>
                                    <h2>{(stats.total || 0).toLocaleString('fr-FR')} Ar</h2>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 ">
                    <div className="col-lg-5 p-3 p-lg-5 pt-lg-3">
                        <h1 className="display-5 fw-bold lh-1">Bonjour {user?.name ?? "Utilisateur"}</h1>
                        <h5 className="text-primary mb-4">
                            Rôle : {getRoleName(user?.role)}
                        </h5>
                        <p className="lead">{getBlabla(user?.role)}</p>

                    </div>
                    <div className="col-lg-5 offset-lg-1 p-0 overflow-hidden ">
                        <img
                            src={image}
                            className="img-fluid rounded"
                            alt="Illustration"
                            width="600"
                            height="400"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}