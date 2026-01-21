import axios from 'axios';

const handler = async (m, { text, conn, args }) => {
  // Verificar si hay URL
  if (!args[0]) {
    return conn.reply(m.chat, '🐉 *¡Necesito un enlace!*\n\nEnviame un link de Facebook:\n.fb <enlace>', m);
  }

  const fbUrl = args[0];
  
  // Verificar que sea un enlace de Facebook
  if (!fbUrl.includes('facebook.com') && !fbUrl.includes('fb.watch')) {
    return conn.reply(m.chat, '❌ *Enlace inválido*\n\nSolo enlaces de Facebook', m);
  }

  try {
    // Reacción de inicio
    await m.react('🌀');
    
    // Mensaje de carga
    let loadingMsg = await m.reply('⚡ *Descargando video...*\n🌀 Procesando con poder Saiyan...');
    
    // API de Adonix con tu apikey
    const apiUrl = `https://api-adonix.ultraplus.click/download/facebook?apikey=Mikeywilker1&url=${encodeURIComponent(fbUrl)}`;
    
    // Obtener datos de la API
    const response = await axios.get(apiUrl, { timeout: 30000 });
    const result = response.data;
    
    // Verificar si hay resultado
    if (!result || result.status !== true || !result.data) {
      await m.react('❌');
      return conn.reply(m.chat, '🐉 *Error al descargar*\n\nEl video no está disponible o es privado.', m);
    }
    
    const videoData = result.data;
    
    // Buscar la mejor calidad disponible
    let videoUrl = null;
    let quality = '';
    
    if (videoData.hd) {
      videoUrl = videoData.hd;
      quality = '🐉 CALIDAD HD';
    } else if (videoData.sd) {
      videoUrl = videoData.sd;
      quality = '⚡ CALIDAD SD';
    } else if (videoData.url) {
      videoUrl = videoData.url;
      quality = '🌀 CALIDAD NORMAL';
    }
    
    if (!videoUrl) {
      await m.react('❌');
      return conn.reply(m.chat, '❌ *No se encontró video descargable*', m);
    }
    
    // Enviar video con estilo Gohan Beast
    const caption = `🐉 *VIDEO DE FACEBOOK DESCARGADO*

${quality}
🎬 *Título:* ${videoData.title || 'Video de Facebook'}
📊 *Tamaño:* ${videoData.size || 'Desconocido'}
⏱️ *Duración:* ${videoData.duration || 'Desconocida'}

⚡ *Descargado por:* Gohan Beast Bot
🌀 *Powered by:* Adonix API`;

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: caption,
      fileName: `GohanBeast_${Date.now()}.mp4`,
      mimetype: 'video/mp4'
    }, { quoted: m });
    
    // Eliminar mensaje de carga
    await conn.sendMessage(m.chat, { delete: loadingMsg.key });
    
    // Reacciones de éxito
    await m.react('✅');
    await m.react('⚡');
    
    // Mensaje extra si es muy grande
    if (videoData.size && videoData.size.includes('MB')) {
      const sizeNum = parseInt(videoData.size);
      if (sizeNum > 50) {
        setTimeout(async () => {
          await conn.sendMessage(m.chat, {
            text: '💡 *Consejo Saiyan:*\nEl video es bastante grande, la descarga puede tardar.'
          });
        }, 1000);
      }
    }
    
  } catch (error) {
    console.error('Error en fb download:', error);
    
    // Manejo de errores específicos
    let errorMsg = '🐉 *Error en la descarga*';
    
    if (error.code === 'ECONNABORTED') {
      errorMsg += '\n\n⏱️ *Timeout:* La descarga tardó demasiado';
    } else if (error.response?.status === 404) {
      errorMsg += '\n\n❌ *Video no encontrado*';
    } else if (error.response?.status === 403) {
      errorMsg += '\n\n🔒 *Video privado o bloqueado*';
    } else if (error.message?.includes('apikey')) {
      errorMsg += '\n\n🔑 *Error con la API Key*';
    } else {
      errorMsg += `\n\n${error.message || 'Error desconocido'}`;
    }
    
    await m.react('❌');
    await conn.reply(m.chat, errorMsg, m);
  }
}

// Información del comando
handler.help = ['facebook', 'fb', 'face'];
handler.tags = ['descargas', 'beast', 'media'];
handler.command = ['facebook', 'fb', 'face', 'fbdl'];
handler.limit = true;
handler.premium = false;
handler.register = true;

// Cooldown para evitar spam
handler.cooldown = 1000;

// Aliases
handler.alias = ['fbdownload', 'facebookdl', 'fbd'];

export default handler;