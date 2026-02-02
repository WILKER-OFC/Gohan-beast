import axios from 'axios'
import fs from 'fs'
import path from 'path'

// FORZAR TEMP DIRECTORIO - PODER MÁXIMO ACTIVADO
process.env.TMPDIR = path.join(process.cwd(), 'tmp')
if (!fs.existsSync(process.env.TMPDIR)) {
  fs.mkdirSync(process.env.TMPDIR, { recursive: true })
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) {
      return conn.reply(m.chat, `⚡ *MODO GOHA BEAST ACTIVADO* ⚡\n\n💜 *Ejemplo de uso:* ${usedPrefix + command} Mini Dog\n\n¡El poder fluye con la búsqueda!`, m)
    }
    
    // REACCIÓN DE PODER ULTRA INSTINTO
    await m.react('⚡')
    await m.react('🌀')
    
    let inicio = Date.now()
    
    // INICIANDO BÚSQUEDA CON ENERGÍA DIVINA
    conn.sendMessage(m.chat, { 
      text: `🌀 *PODER ULTRA DIVINO DESPLEGADO*\n` +
            `🔎 Buscando: *${text}*\n` +
            `⚠️ *ADVERTENCIA:* La energía está aumentando...`
    }, { quoted: m })
    
    let resultados = await busquedaDivina(text)
    let videos = resultados.data
    
    if (!videos.length) {
      return conn.reply(m.chat, 
        `❌ *PODER ANULADO*\n\n` +
        `No se encontraron resultados para *${text}*\n` +
        `¡Prueba con otra búsqueda!`, m)
    }

    // FORMATO BEAST MODE
    let caption = `╔═══ *𝗧𝗜𝗞𝗧𝗢𝗞 𝗕𝗘𝗔𝗦𝗧 𝗠𝗢𝗗𝗘* ═══\n`
                + `║\n`
                + `╠═ *🎋 𝖳𝗂́𝗍𝗎𝗅𝗈:* ${videos[0].title}\n`
                + `╠═ *⚡ 𝖡𝗎́𝗌𝗊𝗎𝖾𝖽𝖺:* ${text}\n`
                + `╠═ *🌀 𝖤𝗇𝖾𝗋𝗀𝗂́𝖺:* ${((Date.now() - inicio) * 1)} ms\n`
                + `║\n`
                + `╚═══ *𝗣𝗢𝗗𝗘𝗥 𝗗𝗜𝗩𝗜𝗡𝗢 𝗔𝗖𝗧𝗜𝗩𝗔𝗗𝗢* ═══`

    // CREANDO MEDIAS CON PODER
    let medias = videos.map((video, index) => ({
      type: "video",
      data: { 
        url: video.no_wm,
        stream: true
      },
      caption: index === 0
        ? caption
        : `⚡ *VIDEO ${index + 1}*\n` +
          `🎋 *Título:* ${video.title}\n` +
          `🌀 *Procesado en:* ${((Date.now() - inicio) * 1)} ms\n` +
          `✨ *Energía al máximo*`
    }))

    // ENVÍO CON PODER MÁXIMO
    await conn.sendSylphy(m.chat, medias, { 
      quoted: m,
      ephemeralExpiration: 86400
    })
    
    // REACCIONES DE ÉXITO
    await m.react('✅')
    await m.react('✨')
    await m.react('🌀')
    
    // MENSAJE DE CONFIRMACIÓN
    conn.sendMessage(m.chat, {
      text: `✅ *BÚSQUEDA COMPLETADA*\n\n` +
            `📊 *Resultados:* ${videos.length} videos\n` +
            `⚡ *Tiempo:* ${((Date.now() - inicio) * 1)} ms\n\n` +
            `✨ *El poder de Gohan Beast está bajo control*`
    })
    
  } catch (error) {
    // MODO DE ERROR CON ESTILO DRAGON BALL
    console.error('🌀 ERROR BEAST MODE:', error)
    
    await m.react('❌')
    await m.react('💥')
    
    return conn.reply(m.chat,
      `💥 *EXPLOSIÓN DE ENERGÍA DETECTADA*\n\n` +
      `🔧 *Error:* ${error.message || 'Desconocido'}\n\n` +
      `⚠️ *Gohan Beast está estabilizando el poder...*\n` +
      `Intenta de nuevo en unos momentos.`,
      m
    )
  }
}

// COMANDOS CON PODER
handler.command = ["ttsbeast", "tiktokbeast", "ttdivino", "ttksbeast", "gohansearch"]
handler.help = ["tiktokbeast"]
handler.tags = ["search", "beastmode"]
handler.premium = false
handler.limit = 5

export default handler

// FUNCIÓN DE BÚSQUEDA CON PODER DIVINO
async function busquedaDivina(consulta) {
  try {
    const respuesta = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
        'X-Power-Level': 'OVER-9000'
      },
      data: {
        keywords: consulta,
        count: 15, // AUMENTADO PARA MÁS PODER
        cursor: 0,
        HD: 1,
        mode: 'beast'
      },
      timeout: 30000
    })

    const videos = respuesta.data.data.videos
    
    if (!videos || videos.length === 0) {
      throw new Error("🌀 No se encontraron videos - El poder es demasiado grande")
    }

    // MEZCLA ALEATORIA CON ENERGÍA DIVINA
    const seleccionados = videos
      .sort(() => 0.5 - Math.random())
      .slice(0, 7) // MÁS VIDEOS PARA MÁS PODER

    return {
      status: true,
      creator: "🌀 Gohan Beast Mode - Poder Divino",
      power: "OVER 9000",
      data: seleccionados.map(video => ({
        title: video.title || "Sin título",
        no_wm: video.play || video.wmplay,
        watermark: video.wmplay || video.play,
        music: video.music || "Audio divino",
        duration: video.duration || 0,
        power: "🔥"
      }))
    }
    
  } catch (error) {
    // ERROR CON ESTILO DRAGON BALL
    console.error('💥 ERROR EN BÚSQUEDA DIVINA:', error)
    throw new Error(
      error.response?.data?.msg || 
      error.message || 
      "🌀 El poder de la búsqueda ha fallado - ¡Kamehameha necesario!"
    )
  }
}

// MÉTODOS ADICIONALES DE PODER
handler.extra = {
  category: 'Búsqueda',
  powerLevel: 'Beast',
  cooldown: 10,
  description: 'Búsqueda de TikTok con el poder máximo de Gohan Beast'
}