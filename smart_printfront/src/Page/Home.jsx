import React from "react";
import image from '../assets/img/illustration/5142475.jpg';

export default function Home({ user }) {
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
                return "Bienvenue dans le panneau d’administration. Vous avez un contrôle total sur l’application.";
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
            </div>
        </>
    );
}
