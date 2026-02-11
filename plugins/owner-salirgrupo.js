const handler = async (m, { conn, isOwner, isGroup }) => {
  try {
    // 🔐 Solo owner
    if (!isOwner) {
      return conn.reply(
        m.chat,
        "❌ Solo el owner puede usar este comando.",
        m
      )
    }

    // ❌ Solo en grupos
    if (!isGroup) {
      return conn.reply(
        m.chat,
        "❌ Este comando solo funciona en grupos.",
        m
      )
    }

    // Verificar si el bot es admin
    const groupMetadata = await conn.groupMetadata(m.chat)
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net'
    const isBotAdmin = groupMetadata.participants.some(p => p.id === botId && p.admin)
    
    if (!isBotAdmin) {
      return conn.reply(
        m.chat,
        "❌ El bot necesita ser administrador para poder salir del grupo automáticamente.\n\n" +
        "👉 Hazme admin o elimíname manualmente.",
        m
      )
    }

    await conn.reply(
      m.chat,
      "👋 Saliendo del Dojo grupal...\n🌀 Gohan beast 🐉",
      m
    )

    // 🚪 Salir del grupo
    await conn.groupLeave(m.chat)

  } catch (err) {
    console.error("LEAVE ERROR:", err)
    conn.reply(
      m.chat,
      "❌ Error al salir del grupo. Asegúrate de que el bot sea admin.",
      m
    )
  }
}

handler.command = ["salirgrupo", "leave", "salir"]
handler.tags = ["owner"]
handler.help = ["salirgrupo"]
handler.owner = true
handler.group = true

export default handler