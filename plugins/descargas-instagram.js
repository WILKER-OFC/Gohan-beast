import axios from "axios"

const BOT_NAME = "SonGokuBot"
const API_URL = "https://api.nekolabs.web.id/downloader/instagram"

const handler = async (m, { conn, text, args }) => {
  try {
    if (!text)
      return conn.reply(
        m.chat,
        "❌ Debes colocar un enlace de Instagram.",
        m
      )

    const url = args[0]

    await conn.reply(
      m.chat,
      `📥 Descargando video de Instagram...\n⏳ ${BOT_NAME} está trabajando`,
      m
    )

    const res = await axios.get(API_URL, {
      params: { url },
      timeout: 120000
    })

    const result = res.data?.result
    if (!res.data?.success || !result?.downloadUrl?.length)
      throw new Error("No se obtuvo video")

    const videoUrl = result.downloadUrl[0]

    const caption = `
📸 *INSTAGRAM DOWNLOADER*

👤 Usuario: ${result.metadata?.username || "Desconocido"}
💬 Comentarios: ${result.metadata?.comment ?? "?"}

📝 Descripción:
${result.metadata?.caption || "Sin descripción"}

🤖 ${BOT_NAME}
    `.trim()

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoUrl },
        caption
      },
      { quoted: m }
    )

  } catch (error) {
    console.error(error)
    await conn.reply(
      m.chat,
      "❌ Ocurrió un error al descargar el video de Instagram.",
      m
    )
  }
}

handler.command = handler.help = ["ig", "instagram"]
handler.tags = ["descargas"]


export default handler