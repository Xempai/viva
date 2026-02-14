# Déploiement sur Render.com - Guide complet

## 📋 Ce dont vous avez besoin

1. Un compte GitHub (gratuit) : https://github.com
2. Un compte Render (gratuit) : https://render.com

## 🚀 Étape 1 : Créer un dépôt GitHub

### A. Créer le dépôt

1. Allez sur https://github.com
2. Cliquez sur le bouton vert **"New"** (ou "Nouveau")
3. Nommez votre dépôt : `youtube-video-streamer`
4. Sélectionnez **"Public"** ou **"Private"**
5. **Ne cochez RIEN** (pas de README, pas de .gitignore)
6. Cliquez sur **"Create repository"**

### B. Uploader vos fichiers sur GitHub

**Option 1 : Via l'interface web (FACILE)**

1. Sur la page de votre nouveau dépôt, cliquez sur **"uploading an existing file"**
2. Glissez-déposez TOUS ces fichiers :
   - `server.js`
   - `package.json`
   - Le dossier `public/` avec `index.html` dedans
3. Écrivez un message : "Initial commit"
4. Cliquez sur **"Commit changes"**

**Option 2 : Via Git (si vous connaissez)**

```bash
cd chemin/vers/votre/projet
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/youtube-video-streamer.git
git push -u origin main
```

## 🎯 Étape 2 : Déployer sur Render

### A. Créer un compte Render

1. Allez sur https://render.com
2. Cliquez sur **"Get Started"**
3. Inscrivez-vous avec GitHub (recommandé) ou email

### B. Créer un nouveau Web Service

1. Sur le dashboard Render, cliquez sur **"New +"**
2. Sélectionnez **"Web Service"**
3. Cliquez sur **"Connect GitHub"** si demandé
4. Autorisez Render à accéder à vos dépôts
5. Trouvez et sélectionnez **"youtube-video-streamer"**

### C. Configuration du service

Remplissez le formulaire :

**Name :** `youtube-streamer` (ou ce que vous voulez)

**Region :** Choisissez le plus proche de vous

**Branch :** `main`

**Root Directory :** Laissez vide

**Runtime :** `Node`

**Build Command :** 
```
npm install
```

**Start Command :**
```
node server.js
```

**Instance Type :** Sélectionnez **"Free"**

### D. Variables d'environnement (optionnel)

Vous pouvez laisser vide, Render définit automatiquement `PORT`

### E. Déployer !

1. Cliquez sur **"Create Web Service"**
2. Render va :
   - ✅ Cloner votre code
   - ✅ Installer les dépendances
   - ✅ Démarrer le serveur
3. Attendez 2-5 minutes

## 🎉 Étape 3 : Accéder à votre application

Une fois déployé, Render vous donne une URL comme :
```
https://youtube-streamer-xxxx.onrender.com
```

Cliquez dessus et votre application est en ligne ! 🚀

## ⚠️ Limitations importantes

### 1. Le serveur s'endort après 15 minutes d'inactivité
- Premier chargement après sommeil = 50 secondes d'attente
- **Solution :** Utilisez un service de ping comme https://uptimerobot.com

### 2. Les vidéos téléchargées sont PERDUES au redémarrage
- Le stockage n'est pas persistant
- À chaque redémarrage, le dossier `downloads/` est vidé
- **Solution :** Voir ci-dessous pour utiliser un stockage externe

### 3. Limites de bande passante
- Plan gratuit : limité
- Pour usage intensif, passer au plan payant ($7/mois)

## 💡 Amélioration : Stockage persistant (optionnel)

Pour garder les vidéos après redémarrage, utilisez un service de stockage cloud :

### Option A : Cloudinary (gratuit)
- 25 GB de stockage gratuit
- API pour uploader/streamer

### Option B : AWS S3 (gratuit 12 mois)
- 5 GB gratuit
- Puis ~$0.023/GB/mois

### Option C : Backblaze B2 (gratuit)
- 10 GB gratuit
- API compatible S3

## 🔄 Mises à jour

Pour mettre à jour votre application :

1. Modifiez vos fichiers localement
2. Uploadez sur GitHub (via web ou git push)
3. Render redéploie automatiquement !

## 🆘 Dépannage

### "Deploy failed"
- Vérifiez que tous les fichiers sont sur GitHub
- Vérifiez que `package.json` est correct
- Consultez les logs sur Render

### "Application error"
- Cliquez sur "Logs" dans Render
- Cherchez les erreurs en rouge
- Vérifiez que le port utilise `process.env.PORT`

### Page blanche / Ne charge pas
- Attendez 50 secondes (réveil du serveur)
- Vérifiez que le dossier `public/` est bien uploadé
- Vérifiez les logs

## 📊 Alternatives à Render

Si Render ne convient pas :

1. **Railway.app** - Plus rapide, 500h/mois gratuit
2. **Fly.io** - Très performant, 3 machines gratuites
3. **Cyclic.sh** - Spécialisé Node.js, déploiement instantané

## 🎓 Conseils

- Utilisez un nom de dépôt clair
- Documentez votre README.md
- Testez localement avant de déployer
- Surveillez les logs sur Render
- Le plan gratuit suffit pour débuter !

Bon déploiement ! 🚀
