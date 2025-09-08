import React, { useState, useEffect } from "react";
import image from '../assets/img/illustration/5142475.jpg';

export default function Home({ user }) {
    const [stats, setStats] = useState({
        facturesNouvelles: 0,
        facturesAnnulees: 0,
        totalMontant: 0
    });
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.role === 2) {
            fetchStats();
        }
    }, [user, dateDebut, dateFin]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            let url = '/api/factures/stats';
            const params = new URLSearchParams();

            if (dateDebut) params.append('debut', dateDebut);
            if (dateFin) params.append('fin', dateFin);

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const formatNumber = (number) => {
        return new Intl.NumberFormat('fr-FR').format(number);
    };

    return (
        <>
            <div className="py-5"/>
            <div className="container col-xxl-8 px-4">
                <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                    <div className="col-10 col-sm-8 col-lg-6">
                        <img
                            src={image}
                            className="d-block mx-lg-auto img-fluid"
                            alt="Illustration"
                            width="700"
                            height="500"
                            loading="lazy"
                        />
                    </div>
                    <div className="col-lg-6">
                        <h1 className="display-5 fw-bold lh-1 mb-3">
                            Bonjour {user?.name ?? "Utilisateur"} 👋
                        </h1>
                        <h4 className="text-primary mb-3">
                            Rôle : {getRoleName(user?.role)}
                        </h4>
                        <p className="lead">
                            {getBlabla(user?.role)}
                        </p>
                    </div>
                </div>

                {user?.role === 2 && (
                    <div className="row mt-5">
                        <div className="col-12">
                            <h3 className="mb-4">Tableau de bord des factures</h3>

                            {/* Filtres par période */}
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <label htmlFor="dateDebut" className="form-label">Date de début</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateDebut"
                                        value={dateDebut}
                                        onChange={(e) => setDateDebut(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="dateFin" className="form-label">Date de fin</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateFin"
                                        value={dateFin}
                                        onChange={(e) => setDateFin(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-4 d-flex align-items-end">
                                    <button
                                        className="btn btn-primary"
                                        onClick={fetchStats}
                                        disabled={loading}
                                    >
                                        {loading ? 'Chargement...' : 'Appliquer filtre'}
                                    </button>
                                </div>
                            </div>

                            {/* Cartes de statistiques */}
                            <div className="row">
                                <div className="col-md-4 mb-4">
                                    <div className="card bg-primary text-white h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Factures en attente</h5>
                                            <h2 className="card-text">{stats.facturesNouvelles}</h2>
                                            <p className="card-text">Nouvelles factures nécessitant validation</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-4">
                                    <div className="card bg-danger text-white h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Factures annulées</h5>
                                            <h2 className="card-text">{stats.facturesAnnulees}</h2>
                                            <p className="card-text">Factures refusées ou annulées</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-4">
                                    <div className="card bg-success text-white h-100">
                                        <div className="card-body">
                                            <h5 className="card-title">Total des montants</h5>
                                            <h2 className="card-text">{formatNumber(stats.totalMontant)} Ar</h2>
                                            <p className="card-text">Montant total des factures sur la période</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}