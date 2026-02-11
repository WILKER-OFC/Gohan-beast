const handler = async (m, { conn, isOwner, isGroup, participants }) => {
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

    await conn.reply(
      m.chat,
      "👋 Saliendo del Dojo grupal...\n🌀 Gohan beast 🐉",
      m
    )

    // 🚪 Salir del grupo - método alternativo
    try {
      await conn.groupLeave(m.chat)
    } catch (e) {
      // Si falla, intentar con método alternativo
      await conn.sendMessage(m.chat, { 
        text: "⚠️ No tengo permisos de admin, pero intentaré salir igual..." 
      })
      await conn.groupParticipantsUpdate(m.chat, [conn.user.id], 'remove')
    }

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