import axios from 'axios'
import fs from 'fs'
import path from 'path'

// Forzar Node a usar ./tmp para archivos temporales
process.env.TMPDIR = path.join(process.cwd(), 'tmp')
if (!fs.existsSync(process.env.TMPDIR)) {
  fs.mkdirSync(process.env.TMPDIR, { recursive: true })
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `🐉 Ejemplo de uso: ${usedPrefix + command} 𝙶𝙾𝙷𝙰𝙽 𝙱𝙴𝙰𝚂𝚃`, m);
    }
    
    m.react('🕒');
    let old = new Date();
    
    // Llamar a la función que usa TU API
    let result = await ttks(text);
    let videos = result.data; // Ahora sí coincide con lo que devuelve ttks()
    
    if (!videos || !videos.length) {
      return conn.reply(m.chat, "❌ No se encontraron videos para esa búsqueda.", m);
    }

    // Crear caption para el primer video
    let cap = `◜ *TIKTOK SEARCH* ◞\n\n`
            + `≡ 🎋 *Título* : ${videos[0].title}\n`
            + `≡ ⚜️ *Búsqueda* : ${text}\n`
            + `≡ 📊 *Resultados* : ${videos.length} videos\n`
            + `≡ ⏱️ *Tiempo* : ${((new Date() - old))} ms`;

    // Preparar los videos para enviar
    let medias = videos.map((video, index) => ({
      type: "video",
      data: { url: video.no_wm }, // URL sin marca de agua
      caption: index === 0
        ? cap
        : `◜ *TIKTOK RESULTADO ${index + 1}* ◞\n\n` +
          `≡ 🎋 *Título* : ${video.title}\n` +
          `≡ ⏱️ *Tiempo* : ${((new Date() - old))} ms`
    }));

    // Enviar usando la función sendSylphy (asumo que existe en tu conn)
    await conn.sendSylphy(m.chat, medias, { quoted: m });
    m.react('✅');
    
  } catch (e) {
    console.error('Error en handler:', e);
    return conn.reply(m.chat, `❌ Ocurrió un problema al obtener los videos:\n\n${e.message || e}`, m);
  }
};

handler.command = ["ttsesearch", "tiktoks", "ttrndm", "tts", "tiktoksearch"];
handler.help = ["tiktoksearch"];
handler.tags = ["search"];
export default handler;

/**
 * Función que usa TU API de Gohan
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Object>} - Resultados formateados
 */
async function ttks(query) {
  try {
    // Hacer la petición a TU API
    const response = await axios({
      method: 'POST',
      url: 'https://api-gohan.onrender.com/busqueda/tiktok',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: new URLSearchParams({
        keywords: query,
        count: 20,
        cursor: 0,
        HD: 1
      }).toString() // Convertir a URLSearchParams para mejor compatibilidad
    });

    // Verificar que la respuesta tenga datos
    if (!response.data || !response.data.data || !response.data.data.videos) {
      throw new Error("La API no devolvió datos válidos");
    }

    const videos = response.data.data.videos;
    
    if (!videos || videos.length === 0) {
      throw new Error("⚠️ No se encontraron videos para esa búsqueda.");
    }

    // Mezclar y seleccionar hasta 5 videos aleatorios
    const shuffled = [...videos].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    // Formatear los datos para el handler
    return {
      status: true,
      creator: "GOHAN BEAST BOT",
      data: shuffled.map(video => ({
        title: video.title || 'Sin título',
        no_wm: video.play, // URL sin marca de agua
        watermark: video.wmplay, // URL con marca de agua
        music: video.music, // URL del audio
        duration: video.duration,
        author: video.author,
        views: video.play_count
      }))
    };
    
  } catch (error) {
    console.error('Error en ttks:', error);
    throw new Error(`Error en la API de búsqueda: ${error.message}`);
  }
}