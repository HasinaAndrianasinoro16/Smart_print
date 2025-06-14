create database smartprint;
\c smartprint

-- TABLE
create table Client(
    id serial primary key,
    nom varchar(50),
    adresse varchar(50),
    nif varchar(50),
    email varchar(50),
    stat varchar(50),
    telephone varchar(50),
    rcs varchar(50)
);
alter table client add column etat int; --0 si creer 1 si supprimer

create sequence seq_facture increment by 1;
create table facture(
    id varchar(50) primary key,
    client int references Client(id),
    date_emission date,
    date_echeance date,
    condition_paiement varchar(255),
    statut int  -- 0 si en attent, 1 si livrer, 2 si reffuser
);

create table sousfacture(
    id serial primary key,
    facture varchar(255) references facture(id),
    description varchar(50),
    quantite int,
    prix_unitaire numeric(10,2)
);

--creation de la table details facture denormaliser
create table factureD(
    facture_id varchar(255) references facture(id),
    client_id int references Client(id),
    date_emission date,
    date_echeance date,
    condition_paiement varchar(55),
    statut int,
    sousfacture_id int references sousfacture(id),
    description varchar(255),
    quantite int,
    prix_unitaire numeric(10,2),
    tva numeric(10,2),
    prix_total_ht numeric(10,2),
    prix_total_tva numeric(10,2),
    prix_total_ttc numeric(10,2)
);

-- VIEW et FUNCTION
CREATE OR REPLACE VIEW vue_detail_facture AS
SELECT
    f.id AS facture_id,
    f.client,
    f.date_emission,
    f.date_echeance,
    f.condition_paiement,
    f.statut,
    sf.id AS sousfacture_id,
    sf.description,
    sf.quantite,
    sf.prix_unitaire,
    ROUND(sf.quantite * sf.prix_unitaire, 2) AS prix_total_ht,
    ROUND(sf.quantite * sf.prix_unitaire * 0.2, 2) AS tva,
    ROUND(sf.quantite * sf.prix_unitaire * 1.2, 2) AS prix_total_ttc
FROM
    facture f
        JOIN
    sousfacture sf ON f.id = sf.facture;
