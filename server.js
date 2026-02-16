const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ytsr = require('ytsr');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Agent pour éviter les blocages YouTube
const agent = ytdl.createAgent();

// Dossier pour les téléchargements
const DOWNLOAD_FOLDER = path.join(__dirname, 'downloads');
if (!fs.existsSync(DOWNLOAD_FOLDER)) {
    fs.mkdirSync(DOWNLOAD_FOLDER, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Stockage des statuts de téléchargement
const downloadStatus = new Map();

// Page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Recherche de vidéos YouTube
app.get('/api/search', async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === '') {
        return res.status(400).json({ error: 'Terme de recherche manquant' });
    }

    try {
        console.log(`[SEARCH] Recherche: "${q}"`);
        
        const searchResults = await ytsr(q, { limit: 12 });
        
        // Filtrer pour ne garder que les vidéos
        const videos = searchResults.items
            .filter(item => item.type === 'video')
            .map(video => ({
                id: video.id,
                title: video.title,
                url: video.url,
                thumbnail: video.thumbnails && video.thumbnails.length > 0 
                    ? video.thumbnails[0].url 
                    : video.bestThumbnail?.url || '',
                duration: video.duration || 'N/A',
                views: video.views || 0,
                author: video.author?.name || 'Unknown',
                uploadedAt: video.uploadedAt || '',
                description: video.description || ''
            }))
            .slice(0, 12); // Limite à 12 résultats

        console.log(`[SEARCH] ${videos.length} résultats trouvés`);
        res.json({ results: videos });

    } catch (error) {
        console.error('[SEARCH] Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la recherche: ' + error.message });
    }
});

// Démarre le téléchargement
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL manquante' });
    }

    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'URL YouTube invalide' });
    }

    const downloadId = uuidv4();
    
    try {
        // Récupère les infos de la vidéo
        const info = await ytdl.getInfo(url, { agent });
        const videoId = info.videoDetails.videoId;
        const title = info.videoDetails.title;
        const duration = parseInt(info.videoDetails.lengthSeconds);
        const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
        const filename = `${videoId}.mp4`;
        const filepath = path.join(DOWNLOAD_FOLDER, filename);

        // Vérifie si la vidéo existe déjà
        if (fs.existsSync(filepath)) {
            downloadStatus.set(downloadId, {
                status: 'completed',
                progress: 100,
                title: title,
                filename: filename,
                duration: duration,
                thumbnail: thumbnail
            });

            return res.json({
                download_id: downloadId,
                message: 'Vidéo déjà téléchargée',
                already_exists: true
            });
        }

        // Initialise le statut
        downloadStatus.set(downloadId, {
            status: 'downloading',
            progress: 0,
            title: title,
            filename: filename,
            duration: duration,
            thumbnail: thumbnail
        });

        // Commence le téléchargement
        const video = ytdl(url, { 
            quality: 'highest',
            filter: 'audioandvideo',
            agent: agent
        });

        const writeStream = fs.createWriteStream(filepath);
        let downloadedBytes = 0;
        let totalBytes = 0;

        video.on('info', (info, format) => {
            totalBytes = parseInt(format.contentLength || 0);
            console.log(`[${downloadId}] Début du téléchargement: ${title}`);
            console.log(`[${downloadId}] Taille: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
        });

        video.on('data', (chunk) => {
            downloadedBytes += chunk.length;
            if (totalBytes > 0) {
                const progress = (downloadedBytes / totalBytes) * 100;
                downloadStatus.set(downloadId, {
                    ...downloadStatus.get(downloadId),
                    progress: Math.round(progress * 100) / 100
                });
            }
        });

        video.on('end', () => {
            console.log(`[${downloadId}] Téléchargement terminé: ${title}`);
        });

        video.pipe(writeStream);

        writeStream.on('finish', () => {
            downloadStatus.set(downloadId, {
                status: 'completed',
                progress: 100,
                title: title,
                filename: filename,
                duration: duration,
                thumbnail: thumbnail
            });
            console.log(`[${downloadId}] Fichier sauvegardé: ${filename}`);
        });

        writeStream.on('error', (err) => {
            console.error(`[${downloadId}] Erreur d'écriture:`, err);
            downloadStatus.set(downloadId, {
                status: 'error',
                error: err.message
            });
            // Nettoie le fichier partiel
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        });

        video.on('error', (err) => {
            console.error(`[${downloadId}] Erreur de téléchargement:`, err);
            downloadStatus.set(downloadId, {
                status: 'error',
                error: err.message
            });
            // Nettoie le fichier partiel
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        });

        res.json({
            download_id: downloadId,
            message: 'Téléchargement démarré',
            title: title
        });

    } catch (error) {
        console.error(`[${downloadId}] Erreur:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Vérifie le statut d'un téléchargement
app.get('/api/status/:downloadId', (req, res) => {
    const { downloadId } = req.params;
    const status = downloadStatus.get(downloadId);

    if (!status) {
        return res.status(404).json({ status: 'not_found' });
    }

    res.json(status);
});

// Streaming de la vidéo
app.get('/api/stream/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(DOWNLOAD_FOLDER, filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Fichier non trouvé' });
    }

    const stat = fs.statSync(filepath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(filepath, { start, end });
        
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(filepath).pipe(res);
    }
});

// Liste des vidéos disponibles
app.get('/api/videos', (req, res) => {
    try {
        const videos = fs.readdirSync(DOWNLOAD_FOLDER)
            .filter(file => file.endsWith('.mp4'))
            .map(file => {
                const filepath = path.join(DOWNLOAD_FOLDER, file);
                const stats = fs.statSync(filepath);
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    sizeFormatted: formatBytes(stats.size)
                };
            })
            .sort((a, b) => b.created - a.created);

        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprime une vidéo
app.delete('/api/delete/:filename', (req, res) => {
    const { filename } = req.params;
    const filepath = path.join(DOWNLOAD_FOLDER, filename);

    try {
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            console.log(`[DELETE] Vidéo supprimée: ${filename}`);
            res.json({ message: 'Vidéo supprimée avec succès' });
        } else {
            res.status(404).json({ error: 'Fichier non trouvé' });
        }
    } catch (error) {
        console.error('[DELETE] Erreur:', error);
        res.status(500).json({ error: error.message });
    }
});

// Fonction utilitaire pour formater les octets
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log('========================================');
    console.log('🎥 YouTube Video Streamer');
    console.log('========================================');
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Dossier de téléchargement: ${DOWNLOAD_FOLDER}`);
    console.log('');
    console.log('Appuyez sur Ctrl+C pour arrêter le serveur');
    console.log('========================================');
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n\n🛑 Arrêt du serveur...');
    process.exit(0);
});
