# Déploiement sur Railway.app - Guide complet

Railway est **plus simple** et **plus rapide** que Render !

## ✨ Avantages de Railway

- ✅ Déploiement en 2 clics
- ✅ Pas de temps d'attente au réveil
- ✅ 500 heures gratuites/mois
- ✅ 100 GB de sortie
- ✅ Interface très intuitive

## 🚀 Déploiement en 5 minutes

### Étape 1 : Préparer GitHub

1. Créez un compte sur https://github.com
2. Créez un nouveau dépôt : `youtube-streamer`
3. Uploadez ces fichiers :
   - `server.js`
   - `package.json`
   - Dossier `public/` avec `index.html`

### Étape 2 : Déployer sur Railway

1. **Allez sur https://railway.app**

2. **Cliquez sur "Start a New Project"**

3. **Sélectionnez "Deploy from GitHub repo"**

4. **Connectez votre compte GitHub**
   - Cliquez sur "Configure GitHub App"
   - Autorisez Railway
   - Sélectionnez votre dépôt `youtube-streamer`

5. **Railway détecte automatiquement Node.js !**
   - Pas besoin de configuration
   - Railway lance automatiquement `npm install` et `npm start`

6. **Attendez 1-2 minutes**
   - Railway build et déploie
   - Vous voyez les logs en temps réel

7. **Obtenez votre URL**
   - Cliquez sur votre projet
   - Onglet "Settings"
   - Section "Domains"
   - Cliquez sur "Generate Domain"
   - Vous obtenez : `https://youtube-streamer-production.up.railway.app`

## 🎉 C'est fait !

Votre application est en ligne en 2 minutes ! 🚀

## ⚙️ Configuration avancée (optionnel)

### Ajouter un nom de domaine personnalisé

1. Dans Settings > Domains
2. Cliquez sur "Custom Domain"
3. Entrez votre domaine
4. Configurez les DNS selon les instructions

### Variables d'environnement

Railway définit automatiquement `PORT`, mais vous pouvez ajouter :

1. Onglet "Variables"
2. Cliquez sur "New Variable"
3. Exemple :
   - `NODE_ENV` = `production`
   - `MAX_FILE_SIZE` = `500`

### Voir les logs

1. Cliquez sur votre service
2. Onglet "Deployments"
3. Cliquez sur le déploiement actif
4. Vous voyez les logs en temps réel

## 📊 Limites du plan gratuit

- ✅ 500 heures d'exécution/mois
- ✅ 100 GB de bande passante sortante
- ✅ Pas de limite de requêtes
- ⚠️ Stockage non persistant (vidéos perdues au redémarrage)

**Calcul :** 500 heures = ~16 heures/jour = largement suffisant pour un usage personnel

## 🔄 Mises à jour

Railway redéploie **automatiquement** à chaque push sur GitHub !

```bash
# Modifiez vos fichiers
git add .
git commit -m "Mise à jour"
git push

# Railway redéploie automatiquement en 1 minute !
```

## 💰 Surveiller votre usage

1. Dashboard Railway
2. Section "Usage"
3. Vous voyez :
   - Heures utilisées
   - Bande passante
   - Crédits restants

## ⚠️ Important : Stockage des vidéos

Comme sur tous les hébergements gratuits, les vidéos sont **perdues au redémarrage**.

**Solutions :**

### Option 1 : Ne pas stocker (recommandé pour gratuit)
Modifiez l'app pour streamer directement sans télécharger :
- L'utilisateur attend pendant le téléchargement
- Pas de stockage nécessaire
- Économise de l'espace

### Option 2 : Utiliser un stockage externe
- **Cloudinary** (25 GB gratuit)
- **Backblaze B2** (10 GB gratuit)
- **AWS S3** (5 GB gratuit la 1ère année)

## 🆘 Dépannage

### Le déploiement échoue
1. Vérifiez les logs dans Railway
2. Assurez-vous que `package.json` est correct
3. Vérifiez que tous les fichiers sont sur GitHub

### Application ne démarre pas
1. Logs > Cherchez l'erreur
2. Vérifiez que `server.js` utilise `process.env.PORT`
3. Vérifiez que le dossier `public/` existe

### Page 404
1. Vérifiez que `public/index.html` existe
2. Vérifiez les routes dans `server.js`
3. Consultez les logs

## 🎯 Comparaison Render vs Railway

| Critère | Railway | Render |
|---------|---------|--------|
| **Facilité** | ⭐⭐⭐⭐⭐ Très facile | ⭐⭐⭐⭐ Facile |
| **Vitesse déploiement** | ⭐⭐⭐⭐⭐ 1-2 min | ⭐⭐⭐ 3-5 min |
| **Temps de réveil** | ⭐⭐⭐⭐⭐ Instantané | ⭐⭐ 50 secondes |
| **Heures gratuites** | 500h/mois | 750h/mois |
| **Interface** | ⭐⭐⭐⭐⭐ Moderne | ⭐⭐⭐⭐ Bien |
| **Logs** | ⭐⭐⭐⭐⭐ Temps réel | ⭐⭐⭐⭐ Bien |

**Recommandation :** Railway pour la simplicité et la vitesse ! 🚀

## 📝 Checklist de déploiement

- [ ] Compte GitHub créé
- [ ] Dépôt créé avec les fichiers
- [ ] Compte Railway créé
- [ ] GitHub connecté à Railway
- [ ] Projet déployé
- [ ] URL générée
- [ ] Application testée
- [ ] Logs vérifiés

Bon déploiement ! 🎉
