# Résolution de l'erreur "ReadableStream is not defined"

## 🔴 Le problème

Vous voyez cette erreur sur Railway :
```
ReferenceError: ReadableStream is not defined
```

## ✅ Solutions (par ordre de préférence)

### Solution 1 : Forcer Node.js 18+ (RECOMMANDÉ)

J'ai créé un fichier `nixpacks.toml` qui force Railway à utiliser Node.js 18.

**Étapes :**

1. **Ajoutez le fichier `nixpacks.toml`** à votre dépôt GitHub (c'est déjà fait)

2. **Commitez et poussez sur GitHub :**
   ```bash
   git add nixpacks.toml
   git commit -m "Force Node.js 18"
   git push
   ```

3. **Railway va redéployer automatiquement** avec Node.js 18+

4. **Attendez 1-2 minutes** et vérifiez les logs

### Solution 2 : Via l'interface Railway

1. Allez sur votre projet Railway
2. Cliquez sur **Settings**
3. Section **Environment**
4. Ajoutez une variable :
   - **Name:** `NIXPACKS_NODE_VERSION`
   - **Value:** `18`
5. Cliquez sur **Redeploy**

### Solution 3 : Utiliser ytdl-core au lieu de @distube/ytdl-core

J'ai déjà modifié `package.json` pour utiliser `ytdl-core` à la place de `@distube/ytdl-core`.

**Vérifiez que votre `package.json` contient :**
```json
"dependencies": {
  "express": "^4.18.2",
  "ytdl-core": "^4.11.5",
  "uuid": "^9.0.1"
}
```

**Et NON :**
```json
"dependencies": {
  "express": "^4.18.2",
  "@distube/ytdl-core": "^4.14.4",
  "uuid": "^9.0.1"
}
```

## 🔄 Redéploiement sur Railway

Après avoir mis à jour les fichiers :

1. **Uploadez sur GitHub** (interface web ou git push)
2. **Railway redéploie automatiquement**
3. **Vérifiez les logs** dans Railway :
   - Cherchez "Node.js version"
   - Devrait afficher v18.x ou supérieur

## 📋 Vérification

Dans les logs Railway, vous devriez voir :
```
--> Using Node version: 18.x.x
--> Installing dependencies
--> Build completed successfully
```

## 🆘 Si ça ne fonctionne toujours pas

### Essayez cette version ultra-compatible de server.js :

Remplacez votre import ytdl par :

```javascript
const ytdl = require('ytdl-core');

// Polyfill pour ReadableStream si nécessaire
if (typeof ReadableStream === 'undefined') {
    global.ReadableStream = require('stream/web').ReadableStream;
}
```

### Ou utilisez une version LTS plus récente

Modifiez `nixpacks.toml` :
```toml
[phases.setup]
nixPkgs = ["nodejs-20_x"]

[start]
cmd = "node server.js"
```

## 🎯 Versions recommandées

- **Node.js :** 18.x ou 20.x (LTS)
- **ytdl-core :** 4.11.5 ou supérieur
- **express :** 4.18.2

## ⚡ Commande rapide pour tester localement

```bash
node --version  # Devrait afficher v18.x ou v20.x

# Si inférieur à v18
# Windows : Téléchargez depuis nodejs.org
# Linux/Mac : 
nvm install 18
nvm use 18
```

## 📝 Checklist de résolution

- [ ] Fichier `nixpacks.toml` ajouté au dépôt
- [ ] `package.json` utilise `ytdl-core` (pas `@distube/ytdl-core`)
- [ ] Engines spécifie `"node": ">=18.0.0"`
- [ ] Fichiers poussés sur GitHub
- [ ] Railway a redéployé
- [ ] Logs vérifiés (Node.js 18+)
- [ ] Application testée

## 🎉 Résultat attendu

Après ces modifications, votre application devrait démarrer sans erreur et vous devriez voir dans les logs :
```
========================================
🎥 YouTube Video Streamer
========================================
🚀 Serveur démarré sur http://localhost:XXXX
📁 Dossier de téléchargement: /app/downloads
========================================
```

Bon déploiement ! 🚀
