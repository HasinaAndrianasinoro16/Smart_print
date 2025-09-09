@echo off
echo ========================================
echo   DÉPLOIEMENT LARAVEL AVEC DOCKER
echo ========================================

echo [1/6] Arrêt des conteneurs existants...
docker-compose down

echo [2/6] Construction des images Docker...
docker-compose build

echo [3/6] Démarrage des conteneurs en arrière-plan...
docker-compose up -d

echo [4/6] Attente du démarrage des services...
timeout /t 20 /nobreak

echo [5/6] Configuration de l'application Laravel...
IF NOT EXIST .env (
    echo Création du fichier .env...
    copy .env.example .env
)

echo Génération de la clé d'application...
docker-compose exec app php artisan key:generate

echo [6/6] Exécution des migrations et optimisation...
docker-compose exec app php artisan migrate --force
docker-compose exec app php artisan optimize
docker-compose exec app php artisan config:cache

echo ========================================
echo   DÉPLOIEMENT TERMINÉ !
echo ========================================
echo Application: http://localhost
echo Base de données: localhost:5432
echo ========================================
pause
