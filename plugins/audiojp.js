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
`

    const thumb = (await conn.getFile(thumbnail)).data
    await conn.sendMessage(
      m.chat,
      {
        image: thumb,
        caption,
        footer: "⚡ Gohan — Descargas rápidas ⚡",
        buttons: [
          { buttonId: `shadowaudio ${url}`, buttonText: { displayText: "🎵 𝘿𝙚𝙨𝙘𝙖𝙧𝙜𝙖𝙧 𝘼𝙪𝙙𝙞𝙤" }, type: 1 }
        ],
        headerType: 4
      },
      { quoted: fkontak }
    )

    await m.react("✅")
  } catch (e) {
    m.reply("❌ Error: " + e.message)
    m.react("⚠️")
  }
}

handler.before = async (m, { conn }) => {
  const selected = m?.message?.buttonsResponseMessage?.selectedButtonId
  if (!selected) return

  const parts = selected.split(" ")
  const cmd = parts.shift()
  const url = parts.join(" ")

  if (cmd === "shadowaudio") {
    return downloadAudio(conn, m, url)
  }
}

const fetchBuffer = async (url) => {
  const response = await fetch(url)
  return await response.buffer()
}

const downloadAudio = async (conn, m, url) => {
  try {
    const sent = await conn.sendMessage(m.chat, { text: "🎵 Descargando audio..." }, { quoted: m })

    const apiUrl = `https://api-adonix.ultraplus.click/download/ytaudio?url=${encodeURIComponent(url)}&apikey=SHADOWKEYBOTMD`

    const r = await fetch(apiUrl)
    const data = await r.json()

    if (!data?.status || !data?.data?.url) return m.reply("🚫 No se pudo descargar el audio.")

    const fileUrl = data.data.url
    const fileTitle = cleanName(data.data.title || "audio")

    const audioBuffer = await fetchBuffer(fileUrl)
    await conn.sendMessage(
      m.chat,
      { audio: audioBuffer, mimetype: "audio/mpeg", fileName: fileTitle + ".mp3" },
      { quoted: m }
    )

    await conn.sendMessage(
      m.chat,
      { text: `✅ Audio descargado\n\n🎼 Título: ${fileTitle}`, edit: sent.key }
    )

    await m.react("✅")
  } catch (e) {
    console.error(e)
    m.reply("❌ Error: " + e.message)
    m.react("💀")
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

handler.command = ["play1", "yt1", "ytsearch1"]
handler.tags = ["downloader"]
handler.register = false

export default handler