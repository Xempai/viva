# Nouvelle fonctionnalité : Recherche YouTube 🔍

## 🎉 Qu'est-ce qui a été ajouté ?

Vous pouvez maintenant **rechercher des vidéos directement dans YouTube** sans avoir besoin de copier-coller des URLs !

## ✨ Fonctionnalités

### 1. **Recherche de vidéos**
- Tapez n'importe quel terme (musique, tutoriel, film, etc.)
- Obtenez jusqu'à 12 résultats pertinents
- Miniatures, titres, durées, et auteurs affichés

### 2. **Sélection facile**
- Cliquez sur une vidéo dans les résultats
- L'URL est automatiquement remplie
- Lancez le téléchargement en un clic !

### 3. **Deux façons de télécharger**
- **Recherche** : Trouvez et téléchargez
- **URL directe** : Collez une URL YouTube

## 🚀 Comment utiliser

### Méthode 1 : Recherche (NOUVEAU)

1. **Dans le champ "Rechercher des vidéos"**, tapez votre recherche :
   ```
   Exemple : "clip bts dynamite"
   Exemple : "tutorial python"
   Exemple : "film trailer 2024"
   ```

2. **Cliquez sur "🔍 Rechercher"** ou appuyez sur Enter

3. **Attendez** les résultats (2-5 secondes)

4. **Cliquez sur une vidéo** pour la sélectionner

5. **Cliquez sur "Télécharger et Streamer"**

### Méthode 2 : URL directe (comme avant)

1. Copiez une URL YouTube
2. Collez dans le champ "Collez le lien YouTube ici"
3. Cliquez sur "Télécharger et Streamer"

## 📋 Exemples de recherche

| Ce que vous cherchez | Tapez |
|---------------------|-------|
| Clip musical | "nom artiste nom chanson" |
| Tutoriel | "tutorial comment faire X" |
| Film/série | "nom film trailer" |
| Gaming | "gameplay nom jeu" |
| Cuisine | "recette nom plat" |
| Sport | "highlights match team" |

## 🎨 Interface

### Section recherche (en haut)
```
🔍 Rechercher des vidéos
[Champ de recherche] [Bouton Rechercher]

[Résultats en grille avec miniatures]
```

### Section URL directe (en dessous)
```
🔗 Télécharger depuis une URL
[Champ URL] [Bouton Télécharger]
```

## 🔧 Mise à jour

### Fichiers modifiés :

1. **`package.json`**
   - Ajout de la dépendance `ytsr` pour la recherche

2. **`server.js`**
   - Nouveau endpoint : `GET /api/search?q=RECHERCHE`
   - Retourne jusqu'à 12 résultats

3. **`public/index.html`**
   - Nouvelle section de recherche
   - Grille de résultats responsive
   - Styles pour les miniatures

### Pour déployer la mise à jour :

**Sur Railway :**
1. Uploadez les nouveaux fichiers sur GitHub :
   - `package.json`
   - `server.js`
   - `public/index.html`
2. Railway redéploie automatiquement (2-3 min)
3. Testez la recherche !

**Sur AlwaysData :**
1. Uploadez les fichiers via FTP
2. Connectez-vous en SSH :
   ```bash
   ssh VOTRE_COMPTE@ssh-VOTRE_COMPTE.alwaysdata.net
   cd ~/www/youtube-streamer
   npm install  # Installe ytsr
   ```
3. Redémarrez le site dans l'admin
4. Testez !

## 🎯 API Endpoint

### GET `/api/search`

**Paramètres :**
- `q` (string) : Terme de recherche

**Exemple :**
```javascript
GET /api/search?q=python+tutorial
```

**Réponse :**
```json
{
  "results": [
    {
      "id": "VIDEO_ID",
      "title": "Titre de la vidéo",
      "url": "https://www.youtube.com/watch?v=...",
      "thumbnail": "https://...",
      "duration": "10:25",
      "views": 1234567,
      "author": "Nom de la chaîne",
      "uploadedAt": "il y a 2 jours",
      "description": "Description..."
    }
  ]
}
```

## 💡 Astuces

1. **Recherches précises** : Plus votre recherche est précise, meilleurs sont les résultats
2. **Langue** : Vous pouvez rechercher en français ou en anglais
3. **Miniatures** : Si une miniature ne charge pas, une image par défaut s'affiche
4. **Sélection** : Cliquez sur la vidéo pour l'ajouter au champ URL
5. **Scroll automatique** : L'interface scroll automatiquement vers le champ URL après sélection

## ⚠️ Limitations

- Maximum **12 résultats** par recherche (pour des performances optimales)
- Les **lives en cours** peuvent apparaître dans les résultats
- Certaines vidéos peuvent avoir des **restrictions géographiques**
- La recherche peut prendre **2-5 secondes**

## 🐛 Dépannage

### La recherche ne fonctionne pas

**Vérifiez :**
1. Que `ytsr` est installé : `npm list ytsr`
2. Les logs du serveur pour voir les erreurs
3. Votre connexion Internet

**Solution :**
```bash
npm install ytsr --save
# Redémarrez le serveur
```

### "Aucun résultat trouvé"

**Causes possibles :**
- Terme de recherche trop spécifique
- Faute d'orthographe
- Contenu restreint/supprimé

**Solutions :**
- Essayez une recherche plus générale
- Vérifiez l'orthographe
- Essayez en anglais

### Les miniatures ne s'affichent pas

**Normal !** Certaines vidéos n'ont pas de miniatures disponibles. Une image "No Image" s'affiche à la place.

### Erreur 500 lors de la recherche

**Vérifiez les logs :**
```bash
# Railway : Onglet Logs dans le dashboard
# AlwaysData : tail -f ~/admin/logs/sites/*.log
```

YouTube peut temporairement bloquer les recherches. Attendez quelques minutes et réessayez.

## 📊 Performances

- **Temps de recherche** : 2-5 secondes
- **Résultats** : Jusqu'à 12 vidéos
- **Cache** : Pas de cache (recherches en temps réel)
- **Rate limit** : Pas de limite stricte, mais évitez les abus

## 🎨 Personnalisation

### Changer le nombre de résultats

Dans `server.js`, ligne avec `limit: 12` :
```javascript
const searchResults = await ytsr(q, { limit: 20 }); // 20 résultats au lieu de 12
```

### Changer la disposition

Dans `public/index.html`, trouvez :
```css
.search-results-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    /* Changez 280px pour des cartes plus petites/grandes */
}
```

### Ajouter le téléchargement automatique

Dans la fonction `selectVideoFromSearch`, décommentez :
```javascript
function selectVideoFromSearch(url, title) {
    document.getElementById('youtubeUrl').value = url;
    showStatus(`Vidéo sélectionnée: ${title}`, 'success');
    
    startDownload(); // ← Décommentez cette ligne !
}
```

## 🎉 Profitez de la recherche !

Vous pouvez maintenant trouver et télécharger des vidéos YouTube directement depuis l'interface, sans avoir à chercher sur YouTube.com !

**Workflow simplifié :**
```
Recherche → Clic sur vidéo → Téléchargement → Visionnage
```

Bon streaming ! 🚀
