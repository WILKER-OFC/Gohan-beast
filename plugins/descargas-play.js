import yts from "yt-search"
import fetch from "node-fetch"

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(" `Ingresa el nombre del video de YouTube`.")

  await m.react("🕘")

  try {
    let url = text
    let title = "Desconocido"
    let authorName = "Desconocido"
    let durationTimestamp = "Desconocida"
    let views = "Desconocidas"
    let thumbnail = ""

    if (!text.startsWith("https://")) {
      const res = await yts(text)
      if (!res?.videos?.length) return m.reply("🚫 No encontré nada.")
      const video = res.videos[0]
      title = video.title
      authorName = video.author?.name
      durationTimestamp = video.timestamp
      views = video.views
      url = video.url
      thumbnail = video.thumbnail
    }

    const vistas = formatViews(views)

    const res3 = await fetch("https://files.catbox.moe/wfd0ze.jpg")
    const thumb3 = Buffer.from(await res3.arrayBuffer())

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        documentMessage: {
          title: `『 ${title} 』`,
          fileName: global.botname || "Gohan beast bot",
          jpegThumbnail: thumb3
        }
      }
    }

    const caption = `
✧━『 𝙸𝚗𝚏𝚘 𝚍𝚎𝚕 𝚊𝚞𝚍𝚒𝚘 』━✧

🎼 𝚃𝚒𝚝𝚞𝚕𝚘: ${title}
📺 𝙲𝚊𝚗𝚊𝚕: ${authorName}
👁️ 𝚅𝚒𝚜𝚝𝚊𝚜: ${vistas}
⏳ 𝙳𝚞𝚛𝚊𝚌𝚒ó𝚗: ${durationTimestamp}
🌐 𝙴𝚗𝚕𝚊𝚌𝚎: ${url}

✧━『 𝙶𝙾𝙷𝙰𝙽 𝙱𝙴𝙰𝚂𝚃 𝙱𝙾𝚃 』━✧
   ⚡ 𝙱𝚢 𝚆𝙸𝙻𝙺𝙴𝚁 𝙾𝙵𝙲 ⚡

🎵 𝙳𝚎𝚜𝚌𝚊𝚛𝚐𝚊𝚗𝚍𝚘 𝙰𝚞𝚍𝚒𝚘...
`

    const thumb = (await conn.getFile(thumbnail)).data

    // Enviar primero la info del video
    await conn.sendMessage(
      m.chat,
      {
        image: thumb,
        caption,
        footer: "⚡ Gohan — Descargas rápidas ⚡",
        headerType: 4
      },
      { quoted: fkontak }
    )

    // Descargar y enviar el audio automáticamente usando múltiples APIs
    await downloadAudio(conn, m, url)

  } catch (e) {
    m.reply("❌ Error: " + e.message)
    m.react("⚠️")
  }
}

const fetchBuffer = async (url) => {
  const response = await fetch(url)
  return await response.buffer()
}

// Lista de APIs para probar en orden
const APIS = [
  {
    name: "Stellar API",
    url: (url) => `https://api.stellarwa.xyz/dl/youtubeplay?url=${encodeURIComponent(url)}`,
    headers: {
      "Authorization": "stellar-BQ1oVqLQ"
    },
    getAudioUrl: (data) => data?.result?.audio || data?.audio
  },
  {
    name: "Adonix API",
    url: (url) => `https://api-adonix.ultraplus.click/download/ytaudio?url=${encodeURIComponent(url)}&apikey=KEYGOHANBOT`,
    headers: {},
    getAudioUrl: (data) => data?.data?.url
  }
]

const downloadAudio = async (conn, m, url) => {
  try {
    const sent = await conn.sendMessage(m.chat, { text: "🎵 Descargando audio, por favor espera..." }, { quoted: m })

    let audioUrl = null
    let apiName = ""
    let title = "audio"

    // Probar cada API en orden
    for (const api of APIS) {
      try {
        await conn.sendMessage(
          m.chat,
          { text: `🔍 Probando con ${api.name}...`, edit: sent.key }
        )

        const apiUrl = api.url(url)
        const r = await fetch(apiUrl, { headers: api.headers })
        const data = await r.json()

        if (data && api.getAudioUrl(data)) {
          audioUrl = api.getAudioUrl(data)
          apiName = api.name
          title = cleanName(data.result?.title || data.data?.title || "audio")
          
          await conn.sendMessage(
            m.chat,
            { text: `✅ Conectado a ${api.name}`, edit: sent.key }
          )
          break
        }
      } catch (e) {
        console.error(`Error con ${api.name}:`, e.message)
        // Continuar con la siguiente API
      }
    }

    if (!audioUrl) {
      await conn.sendMessage(
        m.chat,
        { text: "🚫 No se pudo descargar el audio con ninguna API disponible.", edit: sent.key }
      )
      await m.react("💀")
      return
    }

    // Descargar el buffer del audio
    await conn.sendMessage(
      m.chat,
      { text: `⬇️ Descargando desde ${apiName}...`, edit: sent.key }
    )

    const audioBuffer = await fetchBuffer(audioUrl)

    // Enviar el audio
    await conn.sendMessage(
      m.chat,
      { 
        audio: audioBuffer, 
        mimetype: "audio/mpeg", 
        fileName: title + ".mp3",
        caption: `✅ Audio descargado\n\n🎼 Título: ${title}\n🔧 API: ${apiName}` 
      },
      { quoted: m }
    )

    // Actualizar mensaje de estado
    await conn.sendMessage(
      m.chat,
      { text: `✅ Audio descargado con éxito usando ${apiName}`, edit: sent.key }
    )

    await m.react("✅")
  } catch (e) {
    console.error(e)
    await conn.sendMessage(
      m.chat,
      { text: "❌ Error al descargar el audio: " + e.message }
    )
    await m.react("💀")
  }
}

const cleanName = (name) => {
  if (!name) return "audio"
  return name.replace(/[^\w\s-_.]/gi, "").substring(0, 50)
}

const formatViews = (views) => {
  if (views === undefined || views === null) return "No disponible"
  if (views >= 1000000000) return `${(views / 1000000000).toFixed(1)}B`
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

handler.command = ["play",]
handler.tags = ["descargas"]
handler.help = ["play"]
handler.register = false

export default handler