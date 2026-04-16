# 📋 Progress — Bici Bogotá

> Avancement pas à pas du projet, du dépôt GitHub au déploiement.
> Chaque étape est commitée séparément pour pouvoir revenir en arrière sans risque.

---

## Étape 1 — Mise en place du dépôt et de l'environnement

- [x] 1.1 Créer un compte GitHub si ce n'est pas déjà fait
- [x] 1.2 Créer un nouveau dépôt public `bici-bogota` sur GitHub
- [x] 1.3 Cloner le dépôt en local
- [x] 1.4 Installer Node.js (LTS) et npm
- [x] 1.5 Créer le projet Vue.js avec Vite : `npm create vue@latest`
- [x] 1.6 Installer le plugin PWA : `npm install vite-plugin-pwa`
- [ ] 1.7 Configurer le plugin PWA (nom de l'app, icône, couleurs)
- [ ] 1.8 Lancer le projet en local (`npm run dev`) et vérifier que la page d'accueil s'affiche
- [ ] 1.9 Supprimer le contenu par défaut de Vue (composants d'exemple)
- [ ] 1.10 Premier commit : `init: scaffolding Vue.js PWA project`

### ✅ Validation étape 1
- Le projet tourne en local sur `http://localhost:5173`
- La page est vide mais sans erreur dans la console
- Sur Chrome mobile (DevTools → mode responsive) : le bandeau PWA "Ajouter à l'écran d'accueil" apparaît
- Le dépôt GitHub contient le premier commit

---

## Étape 2 — Intégration de la carte

- [ ] 2.1 Installer Leaflet.js : `npm install leaflet`
- [ ] 2.2 Créer un composant `MapView.vue`
- [ ] 2.3 Afficher une carte OpenStreetMap centrée sur Bogotá
- [ ] 2.4 S'assurer que la carte prend toute la hauteur de l'écran
- [ ] 2.5 Commit : `feat: add Leaflet map centered on Bogotá`

### ✅ Validation étape 2
- La carte OSM s'affiche correctement sur desktop et mobile (DevTools)
- Pas d'erreur de style (carte qui ne s'affiche pas à moitié)
- Le zoom et le déplacement fonctionnent

---

## Étape 3 — Structure de l'interface

- [ ] 3.1 Créer le panneau latéral gauche (composant `SidePanel.vue`)
- [ ] 3.2 Mettre en place le layout : panneau gauche + carte à droite
- [ ] 3.3 Rendre le layout responsive : panneau en bas sur mobile, à gauche sur desktop
- [ ] 3.4 Commit : `feat: add responsive layout with side panel`

### ✅ Validation étape 3
- Sur mobile (375px) : le panneau est en bas, la carte en haut
- Sur desktop : le panneau est à gauche, la carte occupe le reste
- Aucun élément ne déborde ou n'est masqué

---

## Étape 4 — Saisie du trajet (Départ / Arrivée)

- [ ] 4.1 Ajouter deux champs de saisie texte (Départ, Arrivée) dans le panneau
- [ ] 4.2 Brancher l'autocomplétion sur **Nominatim** (OSM Geocoding API)
- [ ] 4.3 Afficher les suggestions dans une liste déroulante
- [ ] 4.4 Placer un marqueur sur la carte lors de la sélection d'une adresse
- [ ] 4.5 Commit : `feat: address search with Nominatim autocomplete`

### ✅ Validation étape 4
- Taper "Usaquén" propose des suggestions correctes
- Sélectionner une adresse place bien un pin sur la carte
- Le pin est visible et à la bonne position
- Fonctionne sur mobile (clavier virtuel ne masque pas les résultats)

---

## Étape 5 — Calcul et affichage de l'itinéraire

- [ ] 5.1 Appeler l'**API OSRM** avec les coordonnées départ/arrivée (profil vélo)
- [ ] 5.2 Décoder et afficher le tracé de l'itinéraire sur la carte (polyligne)
- [ ] 5.3 Centrer/zoomer la carte sur l'itinéraire calculé
- [ ] 5.4 Afficher dans le panneau : distance totale et durée estimée
- [ ] 5.5 Commit : `feat: route calculation with OSRM and display on map`

### ✅ Validation étape 5
- Un itinéraire s'affiche entre deux adresses de Bogotá
- La distance et la durée sont cohérentes (~15 km/h vélo)
- La carte se recentre automatiquement sur le tracé
- Tester au moins 3 trajets différents dans la ville

---

## Étape 6 — Affichage des ciclorutas

- [ ] 6.1 Récupérer les données ciclorutas via l'**Overpass API** (OSM)
- [ ] 6.2 Afficher les ciclorutas sur la carte (couleur distincte, ex: vert)
- [ ] 6.3 Mettre en cache les données pour éviter des requêtes répétées
- [ ] 6.4 Commit : `feat: display ciclorutas layer from OpenStreetMap`

### ✅ Validation étape 6
- Les ciclorutas apparaissent clairement sur la carte
- La couche peut être activée/désactivée
- Le chargement ne bloque pas l'interface

---

## Étape 7 — Modes d'itinéraire (sécurisé / court / équilibré)

- [ ] 7.1 Ajouter un sélecteur de mode dans le panneau (3 boutons)
- [ ] 7.2 Implémenter la logique de pondération des routes selon le mode :
  - **Court** : paramètres OSRM standards
  - **Sécurisé** : favoriser les segments sur cicloruta
  - **Équilibré** : compromis des deux
- [ ] 7.3 Recalculer et réafficher l'itinéraire au changement de mode
- [ ] 7.4 Commit : `feat: route modes (safe / short / balanced)`

### ✅ Validation étape 7
- Les 3 modes proposent des tracés différents sur un même trajet test
- Le mode "sécurisé" passe davantage par les ciclorutas visibles sur la carte
- Le changement de mode est instantané (ou avec un loader)

---

## Étape 8 — Géolocalisation et pin draggable

- [ ] 8.1 Ajouter un bouton "Ma position" (API Geolocation du navigateur)
- [ ] 8.2 Rendre les marqueurs Départ/Arrivée **draggables** sur la carte
- [ ] 8.3 Mettre à jour l'itinéraire automatiquement après déplacement d'un pin
- [ ] 8.4 Commit : `feat: geolocation and draggable pins`

### ✅ Validation étape 8
- Le bouton "Ma position" place bien le départ à la position actuelle (tester sur mobile)
- Déplacer un pin recalcule l'itinéraire
- L'adresse dans le champ texte se met à jour après le drag

---

## Étape 9 — Résumé du trajet et finitions UX

- [ ] 9.1 Afficher le résumé complet : distance, durée, % cicloruta
- [ ] 9.2 Ajouter la possibilité de tirer l'itinéraire (waypoint intermédiaire)
- [ ] 9.3 Ajouter la gestion des arrêts intermédiaires (avec réordonnancement)
- [ ] 9.4 Soigner l'UI mobile : typographie, couleurs, espacement
- [ ] 9.5 Commit : `feat: trip summary and UX polish`

### ✅ Validation étape 9
- Le résumé est lisible sur un écran de 375px
- Ajouter un arrêt intermédiaire fonctionne et recalcule le trajet
- Le % de cicloruta est cohérent avec le tracé affiché

---

## Étape 10 — Bonus 1 : Alertes coupures urbaines

- [ ] 10.1 Identifier et recenser les principales coupures urbaines de Bogotá (NQS, Autopista Norte…)
- [ ] 10.2 Créer un fichier GeoJSON des coupures avec métadonnées (durée, description)
- [ ] 10.3 Afficher les coupures en rouge sur la carte
- [ ] 10.4 Afficher un message d'alerte si l'itinéraire passe près d'une coupure
- [ ] 10.5 Commit : `feat: urban break alerts on map`

### ✅ Validation étape 10
- Les coupures apparaissent en rouge sur la carte
- Un trajet passant par la NQS déclenche bien une alerte
- Le message est lisible sur mobile

---

## Étape 11 — Bonus 2 : Stations Tembici

- [ ] 11.1 Trouver la source de données des stations Tembici (API ou fichier statique)
- [ ] 11.2 Afficher les stations sur la carte avec une icône dédiée
- [ ] 11.3 Afficher une info-bulle au clic (nom de la station, disponibilité si possible)
- [ ] 11.4 Commit : `feat: Tembici stations layer`

### ✅ Validation étape 11
- Les stations s'affichent sur la carte
- L'icône est distincte des autres marqueurs
- La couche peut être masquée si l'utilisateur ne l'utilise pas

---

## Étape 12 — Déploiement sur Cloudflare Pages

- [ ] 12.1 Créer un compte Cloudflare et connecter le dépôt GitHub
- [ ] 12.2 Configurer le build : `npm run build`, dossier de sortie `dist`
- [ ] 12.3 Déclencher un premier déploiement et vérifier l'URL publique
- [ ] 12.4 Tester l'application sur l'URL Cloudflare depuis un vrai smartphone
- [ ] 12.5 Configurer un domaine personnalisé (optionnel)
- [ ] 12.6 Commit : `chore: configure Cloudflare Pages deployment`

### ✅ Validation étape 12
- L'URL publique Cloudflare charge l'application sans erreur
- La carte s'affiche sur un vrai smartphone (iOS et/ou Android)
- La géolocalisation fonctionne (nécessite HTTPS — fourni par Cloudflare ✅)
- Les performances sont acceptables (carte chargée en < 3s sur réseau mobile)

---

## 🗂️ Résumé des commits clés

| Étape | Message de commit |
|-------|-------------------|
| 1 | `init: scaffolding Vue.js project` |
| 2 | `feat: add Leaflet map centered on Bogotá` |
| 3 | `feat: add responsive layout with side panel` |
| 4 | `feat: address search with Nominatim autocomplete` |
| 5 | `feat: route calculation with OSRM and display on map` |
| 6 | `feat: display ciclorutas layer from OpenStreetMap` |
| 7 | `feat: route modes (safe / short / balanced)` |
| 8 | `feat: geolocation and draggable pins` |
| 9 | `feat: trip summary and UX polish` |
| 10 | `feat: urban break alerts on map` |
| 11 | `feat: Tembici stations layer` |
| 12 | `chore: configure Cloudflare Pages deployment` |
