# 🚲 Bici Bogotá — Itinerari## 📱 Interface générale

- **PWA mobile-first** — fonctionne dans le navigateur, aucune installation requise
- **Carte principale** affichant le réseau de ciclorutas de Bogotáguro en Bici

> **PWA** (Progressive Web App) de navigation à vélo à Bogotá — fonctionne directement dans le navigateur du téléphone, sans installation.

---

## 🎯 Objectif

Proposer des itinéraires sécurisés à vélo dans Bogotá, en s'appuyant sur le réseau de ciclorutas, avec une expérience utilisateur fluide et intuitive (inspirée d'applications comme Google Maps, Uber ou Cabify).

---

## �️ Stack technique

> Projet solo · 100% frontend · gratuit

| Rôle | Outil | Raison |
|------|-------|--------|
| **Framework UI** | [Vue.js](https://vuejs.org/) | Accessible pour débuter, excellent écosystème |
| **PWA** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Fonctionne dans le navigateur sans installation |
| **Carte** | [Leaflet.js](https://leafletjs.com/) + [OpenStreetMap](https://www.openstreetmap.org/) | 100% gratuit, open source |
| **Calcul d'itinéraire** | [OSRM API publique](http://router.project-osrm.org/) | Gratuit, sans clé API, profil vélo disponible |
| **Données ciclorutas** | [OpenStreetMap](https://www.openstreetmap.org/) via [Overpass API](https://overpass-api.de/) | Données libres, Bogotá bien couvert |
| **Géocodage** | [Nominatim](https://nominatim.org/) (OSM) | Gratuit, recherche d'adresses |
| **Hébergement** | [Cloudflare Pages](https://pages.cloudflare.com/) | Gratuit, rapide, déploiement Git automatique |

---

## �📱 Interface générale

- Application **mobile-first** (responsive web app)
- **Carte principale** affichant le réseau de ciclorutas de Bogotá
- **Panneau latéral gauche** dédié à la saisie et l'affichage de l'itinéraire

---

## 🗺️ Onglet « Itinéraire »

### Saisie du trajet

| Champ | Options disponibles |
|-------|---------------------|
| **Départ** | Ma position actuelle · Saisie d'adresse (autocomplétion optimisée) · Sélection sur la carte via un pin draggable |
| **Arrivée** | Saisie d'adresse (autocomplétion optimisée) · Sélection sur la carte via un pin draggable |
| **Arrêts** | Ajout d'un ou plusieurs arrêts intermédiaires, réordonnables par glisser-déposer |

### Modes d'itinéraire

- 🟢 **Le plus sécurisé** — maximise l'utilisation des ciclorutas
- 🔵 **Le plus court** — distance minimale
- ⚖️ **Équilibré** — compromis entre sécurité et distance

### Personnalisation du tracé

- Possibilité de **tirer l'itinéraire** sur la carte pour le faire passer par un point précis (comme sur Google Maps)

### Résumé du trajet

- 📏 **Distance totale** estimée
- ⏱️ **Durée estimée** (basée sur une vitesse moyenne à vélo ~15 km/h)
- 🛣️ **Pourcentage de cicloruta** dans le trajet

---

## ⚠️ Fonctionnalités bonus

### Bonus 1 — Alertes coupures urbaines
- Signalement sur la carte (en **rouge**) des coupures urbaines (autoroutes, voies rapides)
- Message contextuel d'alerte, par exemple :
  > *« Attention : ici tu devras pousser ton vélo et traverser un pont piétonnier (~3 min) »*

### Bonus 2 — Stations Tembici
- Affichage des stations de vélos en libre-service **Tembici** sur la carte
- Utile pour les trajets mixtes (vélo perso + vélo partagé)

---

## 👤 Utilisateurs cibles

### 🏙️ Cycliste quotidien
- Résident de Bogotá, se déplace régulièrement à vélo (domicile ↔ travail, courses…)
- Connaît la ville mais cherche les trajets les **plus sûrs et les plus efficaces**
- Sensible aux coupures urbaines et aux zones dangereuses

### 🌍 Touriste à vélo
- Arrive dans la ville sans connaître le réseau de ciclorutas
- Cherche des itinéraires **sécurisés et faciles à suivre**
- Peut utiliser un vélo Tembici (libre-service)
- A besoin d'une interface **intuitive**, idéalement sans inscription
