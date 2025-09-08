create database smartprint;
\c smartprint

-- TABLE
--cette commande ne fonctionne que quand laravel breeze a ete
-- installer et que les tables on migrer (laravel breeze cree lui meme la table user)

create sequence seq_produit increment by 1;
create table produit(
    id varchar(255) primary key ,
    designation varchar(255),
    prix_unitaire numeric(10,2)
);
alter table produit add column etat int;

create table service(
    id serial primary key,
    designation varchar(255),
    etat int
);
alter table service add column prix numeric(10,2);

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
alter table client add column code varchar(50) unique ;

create sequence seq_facture increment by 1;
create table facture(
    id varchar(50) primary key,
    client int references Client(id),
    date_emission date,
    date_echeance date,
    condition_paiement varchar(255),
    statut int  -- 0 si en attent, 1 si livrer, 2 si reffuser
);
alter table facture add column created_at date;

--Avant d'ajouter cette table assurer vous avez deja fait la migration dans le projet Back end
create table facture_user(
    id serial primary key,
    facture varchar(255) references facture(id),
    userid int references users(id)
);

create table sousfacture(
    id serial primary key,
    facture varchar(255) references facture(id),
    description varchar(50),
    quantite int,
    prix_unitaire numeric(10,2)
);

create table servicefacture(
    id serial primary key,
    facture varchar(255) references facture(id),
    description varchar(50),
    prix_unitaire numeric(10,2)
);

create sequence seq_boncommande increment by 1;
create table boncommande(
  id varchar(255) primary key ,
  date_creation date,
  facture varchar(255) references facture(id),
  commande varchar(255)
);
alter table boncommande add column etat int;

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

CREATE OR REPLACE VIEW facture_total_view AS
SELECT
    f.id,
    f.client,
    f.date_emission,
    f.date_echeance,
    f.condition_paiement,
    f.statut,
    (SELECT COALESCE(SUM(sf.quantite * sf.prix_unitaire), 0)
     FROM sousfacture sf WHERE sf.facture = f.id) as total_produits,
    (SELECT COALESCE(SUM(sf.prix_unitaire), 0)
     FROM servicefacture sf WHERE sf.facture = f.id) as total_services,
    ((SELECT COALESCE(SUM(sf.quantite * sf.prix_unitaire), 0)
      FROM sousfacture sf WHERE sf.facture = f.id) +
     (SELECT COALESCE(SUM(sf.prix_unitaire), 0)
      FROM servicefacture sf WHERE sf.facture = f.id)) as total_facture
FROM facture f;
