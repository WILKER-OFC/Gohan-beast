import yts from "yt-search"
import fetch from "node-fetch"

const handler = async (m, { conn, text }) => {
  if (!text) return m.reply("🎶 Ingresa el nombre del video de YouTube.")

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
      if (!res?.videos?.length) return m.reply("🌀𝙽𝙾 𝙴𝙽𝙲𝙾𝙽𝚃𝚁𝙴 𝙽𝙰𝙳𝙰.")
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
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        locationMessage: {
          name: `『 ${title} 』`,
          jpegThumbnail: thumb3
        }
      }
    }

    const caption = `
    ✧━『 🌀 𝙸𝙽𝙵𝙾 𝙳𝙴𝙻 𝙰𝚄𝙳𝙸𝙾 🌀 』━✧

🎼 𝚃𝙸𝚃𝚄𝙻𝙾: ${title}
📺 𝙲𝙰𝙽𝙰𝙻: ${authorName}
👁️ 𝚅𝙸𝚂𝚃𝙰𝚂: ${vistas}
⏳ 𝙳𝚄𝚁𝙰𝙲𝙸𝙾𝙽: ${durationTimestamp}
🌐 𝙴𝙽𝙻𝙰𝙲𝙴: ${url}

   ✧━『 🐉 𝙶𝙾𝙷𝙰𝙽 𝙱𝙴𝙰𝚂𝚃 𝙱𝙾𝚃 🐉 』─━✧
     🌀 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚆𝙸𝙻𝙺𝙴𝚁 𝙾𝙵𝙲 🌀
`

    const thumb = (await conn.getFile(thumbnail)).data

    await conn.sendMessage(
      m.chat,
      {
        image: thumb,
        caption,
        footer: "🌀 𝙶𝙾𝙷𝙰𝙽 𝙱𝙴𝙰𝚂𝚃 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰𝚂 𝙱𝙴𝚂𝚃𝙸𝙰𝙻𝙴𝚂 🐉",
        headerType: 4
      },
      { quoted: fkontak }
    )

    await downloadMedia(conn, m, url, fkontak)

    await m.react("🐉")
  } catch (e) {
    m.reply("❌ Error: " + e.message)
    m.react("⚠️")
  }
}

const downloadMedia = async (conn, m, url, quotedMsg) => {
  try {
    const sent = await conn.sendMessage(
      m.chat,
      { text: "🎵 Descargando audio..." },
      { quoted: m }
    )

    const apiUrl = `https://apiaxi.i11.eu/down/ytaudio?url=${encodeURIComponent(url)}`
    const r = await fetch(apiUrl)
    const data = await r.json()

    if (!data?.status || !data?.resultado?.url_dl)
      return m.reply("🌀 𝙽𝙾 𝚂𝙴 𝙿𝚄𝙳𝙾 𝙾𝙱𝚃𝙴𝙽𝙴𝚁 𝙴𝙻 𝙰𝚄𝙳𝙸𝙾 𝙵𝚁𝙴𝙴𝚉𝙴𝚁 𝙴𝚂 𝙼𝚄𝚈 𝙿𝙾𝙳𝙴𝚁𝙾𝚂𝙾 .")

    const fileUrl = data.resultado.url_dl
    const fileTitle = cleanName(data.resultado.titulo || "audio")

    await conn.sendMessage(
      m.chat,
      {
        audio: { url: fileUrl },
        mimetype: "audio/mpeg",
        fileName: fileTitle + ".mp3",
        ptt: false
      },
      { quoted: quotedMsg }
    )

    await conn.sendMessage(
      m.chat,
      { text: `✅ 𝙰𝚀𝚄𝙸 𝙴𝚂𝚃𝙰 𝚃𝚄 𝙼𝚄𝚂𝙸𝙲 𝙿𝚄𝙳𝙴 𝙳𝙴𝚁𝚁𝙾𝚃𝙰𝚁 𝙰 𝙵𝚁𝙴𝙴𝚉𝙴𝚁\n\n🎼 𝚃𝙸𝚃𝚄𝙻𝙾: ${fileTitle}`, edit: sent.key }
    )

  } catch (e) {
    console.error(e)
    m.reply("❌ Error: " + e.message)
    m.react("💀")
  }
}

const cleanName = (name) =>
  name.replace(/[^\w\s-_.]/gi, "").substring(0, 50)

const formatViews = (views) => {
  if (!views) return "No disponible"
  if (views >= 1e9) return `${(views / 1e9).toFixed(1)}B`
  if (views >= 1e6) return `${(views / 1e6).toFixed(1)}M`
  if (views >= 1e3) return `${(views / 1e3).toFixed(1)}K`
  return views.toString()
}

handler.command = ["play", "yt", "ytsearch"]
handler.tags = ["descargas"]
handler.register = false

export default handler