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
          fileName: global.botname || "Shadow Bot",
          jpegThumbnail: thumb3
        }
      }
    }

    const caption = `
✧━『 𝙸𝚗𝚏𝚘 𝚍𝚎𝚕 𝚅𝚒𝚍𝚎𝚘 』━✧

🎼 𝑻𝒊́𝒕𝒖𝒍𝒐: ${title}
📺 𝑪𝒂𝒏𝒂𝒍: ${authorName}
👁️ 𝑽𝒊𝒔𝒕𝒂𝒔: ${vistas}
⏳ 𝑫𝒖𝒓𝒂𝒄𝒊𝒐́𝒏: ${durationTimestamp}
🌐 𝑬𝒏𝒍𝒂𝒄𝒆: ${url}

✧━『 *GOHAN BEAS BOT* 』━✧
⚡ 𝑷𝒐𝒘𝒆𝒓𝒆𝒅 𝒃𝒚 WILKER OFC ⚡

📥 Descargando video...
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

    // Descargar y enviar el video automáticamente
    await downloadVideo(conn, m, url)

  } catch (e) {
    m.reply("❌ Error: " + e.message)
    m.react("⚠️")
  }
}

const downloadVideo = async (conn, m, url) => {
  try {
    const sent = await conn.sendMessage(m.chat, { text: "🎬 Descargando video, por favor espera..." }, { quoted: m })

    const apiUrl = `https://api-adonix.ultraplus.click/download/ytvideo?url=${encodeURIComponent(url)}&apikey=SHADOWKEYBOTMD`

    const r = await fetch(apiUrl)
    const data = await r.json()

    if (!data?.status || !data?.data?.url) {
      await conn.sendMessage(
        m.chat,
        { text: "🚫 No se pudo descargar el video.", edit: sent.key }
      )
      return
    }

    const fileUrl = data.data.url
    const fileTitle = cleanName(data.data.title || "video")

    // Enviar el video
    await conn.sendMessage(
      m.chat,
      { 
        video: { url: fileUrl }, 
        mimetype: "video/mp4", 
        fileName: fileTitle + ".mp4",
        caption: `✅ Video descargado\n\n🎬 Título: ${fileTitle}` 
      },
      { quoted: m }
    )

    // Actualizar mensaje de estado
    await conn.sendMessage(
      m.chat,
      { text: `✅ Video descargado con éxito`, edit: sent.key }
    )

    await m.react("✅")
  } catch (e) {
    console.error(e)
    await conn.sendMessage(
      m.chat,
      { text: "❌ Error al descargar el video: " + e.message }
    )
    await m.react("💀")
  }
}

const cleanName = (name) => name.replace(/[^\w\s-_.]/gi, "").substring(0, 50)

const formatViews = (views) => {
  if (views === undefined || views === null) return "No disponible"
  if (views >= 1000000000) return `${(views / 1000000000).toFixed(1)}B`
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return views.toString()
}

handler.command = ["ytmp4", "ytsearch"]
handler.tags = ["descargas"]
handler.help = ["ytmp4", "ytsearch"]
handler.register = false

export default handler