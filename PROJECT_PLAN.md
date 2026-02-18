TSIORY – Backend & Raspberry
Responsabilité : Serveur & Base de données
🔹 ÉTAPE 1 – Installer Raspberry

Installer Node.js

Créer dossier serveur

Installer Express

Installer Socket.io

🔹 ÉTAPE 2 – Créer API REST

Créer routes :

GET /devices

POST /devices/:id/toggle

GET /rooms

GET /stats

Tester avec Postman.

🔹 ÉTAPE 3 – Créer base cloud (Supabase)

Créer projet Supabase

Créer table devices

Créer table history

Connecter serveur à Supabase

🔹 ÉTAPE 4 – WebSocket

Installer socket.io

Envoyer événements "device-update"

Tester avec console

🔹 ÉTAPE 5 – Automatisations

Créer système simple de règles

Sauvegarder en base

Tester déclenchement

ELIE – Intégration Desktop
Responsabilité : Connecter Electron au serveur
🔹 ÉTAPE 1 – Créer apiService.js

Fonction getDevices()

Fonction toggleDevice()

Gestion erreurs

🔹 ÉTAPE 2 – Connecter ViewModel à l’API

Remplacer données locales

Test affichage depuis serveur

🔹 ÉTAPE 3 – WebSocket côté client

Installer socket.io-client

Écouter "device-update"

Rafraîchir UI automatiquement

🔹 ÉTAPE 4 – Gestion serveur offline

Try/catch

Message erreur

Reconnexion automatique

🔹 ÉTAPE 5 – Fonctionnalités Desktop

Notifications natives

System Tray

Minimisation intelligente

Sauvegarde IP serveur

YAEL – UI & Dashboard
Responsabilité : Interface utilisateur
🔹 ÉTAPE 1 – Design dashboard

Cartes appareils

Couleur ON (vert)

OFF (rouge)

Offline (gris)

🔹 ÉTAPE 2 – Organisation par pièce

Menu pièces

Filtrage dynamique

🔹 ÉTAPE 3 – Graphiques

Installer Chart.js

Graphique consommation totale

Graphique par pièce

🔹 ÉTAPE 4 – Animations & UX

Animation toggle

Feedback visuel

Loading spinner

PLAN PAR PHASES
🟢 PHASE 1 – Base fonctionnelle

Objectif : Faire fonctionner REST

API Raspberry OK

Electron connecté

Affichage devices

Toggle fonctionne

🟡 PHASE 2 – Temps réel

WebSocket actif

Mise à jour automatique

Notifications OK

🟠 PHASE 3 – UI avancée

Dashboard moderne

Graphiques

Filtrage pièces

🔵 PHASE 4 – Desktop avancé

System Tray

Reconnexion auto

Gestion erreurs réseau

🔴 PHASE 5 – Bonus

Automatisations

Scénarios

Historique complet
