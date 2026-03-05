import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const emoji = "⚡";

    if (!args[0]) {
        return conn.reply(m.chat, 
            `*GOHAN BEAST BOT - TIKTOK AUDIO*\n\n` +
            `*Uso:* ${usedPrefix + command} <enlace_tiktok>\n` +
            `*Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/ZM6UHJYtE/\n\n` +
            `*🎵 Descarga el audio del video de TikTok*`,
        m);
    }

    try {
        await m.react('⏳');

        let tiktokData;
        let audioUrl = null;

        // Intentar con la primera API
        try {
            tiktokData = await tiktokdl(args[0]);
            console.log('API 1 respuesta:', JSON.stringify(tiktokData, null, 2));
            
            // Intentar diferentes formas de obtener el audio de la API 1
            if (tiktokData.code === 0 && tiktokData.data) {
                const data = tiktokData.data;
                audioUrl = data.music || data.sound || data.audio || data.soundUrl;
                
                // Si no hay audio, intentar construir la URL del audio desde el video ID
                if (!audioUrl && data.video_id) {
                    audioUrl = `https://tikwm.com/api/music/download?video_id=${data.video_id}`;
                }
            }
        } catch (error) {
            console.log('API 1 falló:', error);
        }

        // Si no se encontró audio con API 1, intentar API 2
        if (!audioUrl) {
            try {
                tiktokData = await tiktokdl2(args[0]);
                console.log('API 2 respuesta:', JSON.stringify(tiktokData, null, 2));
                
                if (tiktokData.status === 200 && tiktokData.result) {
                    const data = tiktokData.result;
                    audioUrl = data.audioUrl || data.url_audio || data.music || data.sound;
                }
            } catch (error) {
                console.log('API 2 falló:', error);
            }
        }

        // Si aún no hay audio, intentar una tercera API
        if (!audioUrl) {
            try {
                tiktokData = await tiktokdl3(args[0]);
                console.log('API 3 respuesta:', JSON.stringify(tiktokData, null, 2));
                
                if (tiktokData.status && tiktokData.data) {
                    const data = tiktokData.data;
                    audioUrl = data.audio || data.audio_url || data.music_url;
                }
            } catch (error) {
                console.log('API 3 falló:', error);
            }
        }

        // Verificar si tenemos URL de audio
        if (!audioUrl) {
            await m.react('❌');
            
            // Intentar enviar información de depuración
            let debugInfo = '❌ No se pudo obtener el audio.\n\n';
            debugInfo += 'Posibles soluciones:\n';
            debugInfo += '• El video puede no tener audio disponible\n';
            debugInfo += '• Intenta con otro video\n';
            debugInfo += '• Usa .tt (video) en lugar de audio\n';
            
            return conn.reply(m.chat, debugInfo, m);
        }

        // Obtener metadatos para el caption
        let title = 'Sin título';
        let author = 'Desconocido';
        let duration = 0;
        let views = 0;
        let likes = 0;
        let comments = 0;

        if (tiktokData) {
            if (tiktokData.code === 0 && tiktokData.data) {
                const d = tiktokData.data;
                title = d.title || d.desc || 'Sin título';
                author = d.author?.nickname || d.nickname || 'Desconocido';
                duration = d.duration || 0;
                views = d.play_count || d.playCount || 0;
                likes = d.digg_count || d.likeCount || 0;
                comments = d.comment_count || d.commentCount || 0;
            } else if (tiktokData.status === 200 && tiktokData.result) {
                const d = tiktokData.result;
                title = d.title || d.desc || 'Sin título';
                author = d.author || d.nickname || 'Desconocido';
                duration = d.duration || 0;
                views = d.playCount || d.viewCount || 0;
                likes = d.likeCount || 0;
                comments = d.commentCount || 0;
            }
        }

        // Crear caption
        const caption = 
            `*🎵 GOHAN BEAST BOT - TIKTOK AUDIO 🎵*\n\n` +
            `*Título:* ${title}\n` +
            `*Autor:* ${author}\n` +
            `*Duración:* ${duration}s\n` +
            `*Vistas:* ${views.toLocaleString()}\n` +
            `*Me gusta:* ${likes.toLocaleString()}\n` +
            `*Comentarios:* ${comments.toLocaleString()}\n\n` +
            `*🎵 Audio descargado con éxito*`;

        // Enviar el audio
        await conn.sendFile(m.chat, audioUrl, 'tiktok_audio.mp3', caption, m, null, {
            mimetype: 'audio/mpeg',
            fileName: 'tiktok_audio.mp3'
        });
        
        await m.react('✅');

    } catch (e) {
        console.error('Error general:', e);
        await m.react('❌');
        
        let errorMsg = '❌ Error al descargar el audio.\n\n';
        errorMsg += 'Detalles: ' + e.message + '\n\n';
        errorMsg += 'Intenta con .tt para descargar el video';
        
        return conn.reply(m.chat, errorMsg, m);
    }
};

handler.help = ['tiktokaudio'].map(v => v + ' <enlace>');
handler.tags = ['descargas'];
handler.command = ['tiktokaudio', 'tta', 'tiktokmp3', 'ttaudio'];
handler.group = true;
handler.register = false;

export default handler;

// Primera API (TikWM)
async function tiktokdl(url) {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;
    const res = await fetch(api);
    if (!res.ok) throw new Error(`API 1 error: ${res.status}`);
    return await res.json();
}

// Segunda API (Adonix) con tu clave
async function tiktokdl2(url) {
    const apiKey = 'KEYGOHANBOT'; // Tu clave aquí
    const api = `https://api-adonix.ultraplus.click/download/tiktok?apikey=${apiKey}&url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    if (!res.ok) throw new Error(`API 2 error: ${res.status}`);
    return await res.json();
}

// Tercera API de respaldo
async function tiktokdl3(url) {
    const api = `https://api.tikmate.cc/api?url=${encodeURIComponent(url)}`;
    const res = await fetch(api);
    if (!res.ok) throw new Error(`API 3 error: ${res.status}`);
    return await res.json();
}