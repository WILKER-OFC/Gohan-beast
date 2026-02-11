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
      "❌ Error al salir del grupo.",
      m
    )
  }
}

handler.command = ["salirgrupo"]
handler.tags = ["owner"]
handler.help = ["salirgrupo"]
handler.owner = true
handler.group = false

export default handler