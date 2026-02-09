import { fetchDownloadLinks, getDownloadLink } from "lurcloud";

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (!args[0]) {
      return conn.reply(m.chat, 
        `❌ *Ingresa un enlace de Facebook*\n\n` +
        `📌 *Ejemplo:*\n` +
        `${usedPrefix}${command} https://www.facebook.com/share/r/15kXJEJXPA/\n\n` +
        `🤖 *Gohan Beast*`,
        m
      );
    }

    const url = args[0].trim();
    
    if (!/facebook\.com|fb\.watch|video\.fb\.com/i.test(url)) {
      return conn.reply(m.chat,
        "❌ *El enlace no es válido*\n" +
        "Asegúrate de que sea un enlace de Facebook válido\n\n" +
        "🔗 *Formatos aceptados:*\n" +
        "• https://facebook.com/...\n" +
        "• https://fb.watch/...\n" +
        "• https://video.fb.com/...",
        m
      );
    }

    // Mensaje de procesamiento
    const processingMsg = await conn.reply(m.chat,
      "⏳ *Procesando video de Facebook...*\n" +
      "📥 *Descargando, espera un momento*\n" +
      "🤖 *Gohan Beast Bot*",
      m
    );

    // Obtener enlaces de descarga
    const links = await fetchDownloadLinks(url, "facebook");

    if (!links || !Array.isArray(links) || links.length === 0) {
      await conn.sendMessage(m.chat, {
        delete: processingMsg.key
      });
      return conn.reply(m.chat,
        "❌ *No se pudo obtener el video*\n" +
        "Posibles razones:\n" +
        "• El video es privado\n" +
        "• El enlace ha expirado\n" +
        "• El video fue eliminado\n" +
        "• Error en el servicio",
        m
      );
    }

    // Obtener enlace de descarga
    const videoUrl = getDownloadLink("facebook", links);

    if (!videoUrl) {
      await conn.sendMessage(m.chat, {
        delete: processingMsg.key
      });
      return conn.reply(m.chat,
        "❌ *No se encontró un enlace de descarga válido*\n" +
        "El video podría estar restringido o tener protección",
        m
      );
    }

    // Crear caption
    const caption = `
📘 *FACEBOOK DOWNLOADER*

🔗 *Enlace original:* ${url}

📊 *Calidad:* HD Disponible
🤖 *Bot:* Gohan Beast Bot
⚡ *Powered by:* lurcloud API

_✨ Si no se envía el video, intenta nuevamente más tarde._
`.trim();

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: caption,
      fileName: `facebook_${Date.now()}.mp4`,
      mimetype: 'video/mp4',
      gifPlayback: false
    }, { quoted: m });

    // Eliminar mensaje de procesamiento
    await conn.sendMessage(m.chat, {
      delete: processingMsg.key
    });

    // Reacción de éxito
    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

  } catch (error) {
    console.error('[FACEBOOK ERROR]:', error);
    
    let errorMessage = "❌ *Error al procesar el video*\n\n";
    
    if (error.message.includes('timeout')) {
      errorMessage += "_El servidor tardó demasiado en responder_\n";
      errorMessage += "_Intenta con un video más corto_";
    } else if (error.message.includes('invalid')) {
      errorMessage += "_El enlace parece no ser válido_\n";
      errorMessage += "_Verifica que sea un video público de Facebook_";
    } else if (error.message.includes('private')) {
      errorMessage += "_El video es privado o requiere inicio de sesión_\n";
      errorMessage += "_Solo se pueden descargar videos públicos_";
    } else {
      errorMessage += `_Error técnico: ${error.message}_`;
    }
    
    errorMessage += "\n\n🤖 *Gohan Beast Bot*";
    
    await conn.reply(m.chat, errorMessage, m);
    
    // Reacción de error
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    });
  }
};

// Configuración del handler
handler.help = ['fb', 'facebook']
handler.tags = ['descargas', 'social']
handler.command = /^(fb|facebook|face|fbdl)$/i

handler.limit = true
handler.premium = false
handler.register = false
handler.group = true
handler.private = false
handler.botAdmin = false
handler.admin = false

export default handler;