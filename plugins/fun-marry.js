let marriages = {}

function tag(jid) {
  return '@' + jid.split('@')[0]
}

const handler = async (m, { conn, command }) => {
  const userId = m.sender

  // 🐉 SISTEMA DE DIVORCIO
  if (['divorce', 'divorciarse', 'romper'].includes(command)) {
    if (!marriages[userId]) {
      return conn.reply(m.chat, 
        `💔 *NO ESTÁS CASADO/A*\n\nNo tienes un pacto Saiyan activo.\n💡 Usa .casarse para encontrar a tu compañero.`, 
        m
      )
    }
    
    const exPartner = marriages[userId]
    delete marriages[userId]
    delete marriages[exPartner]
    
    await conn.reply(m.chat,
      `⚡ *DIVORCIO SAIYAN*\n\n` +
      `💔 El pacto Saiyan se ha roto.\n` +
      `🐉 ${tag(userId)} y ${tag(exPartner)}\n` +
      `🌀 Ya no están unidos por el poder Saiyan.\n\n` +
      `*¡Cada uno sigue su propio camino!* 🌟`,
      m,
      { mentions: [userId, exPartner] }
    )
    
    await m.react('💔')
    return
  }

  // 🐉 SISTEMA DE MATRIMONIO
  if (['marry', 'casarse', 'matrimonio', 'pacto'].includes(command)) {
    let partnerId = null
    
    // Buscar pareja mencionada o citada
    if (m.mentionedJid && m.mentionedJid.length > 0) {
      partnerId = m.mentionedJid[0]
    } else if (m.quoted) {
      partnerId = m.quoted.sender
    }

    // Validar que haya una pareja
    if (!partnerId) {
      return conn.reply(m.chat,
        `💍 *SISTEMA DE MATRIMONIO SAIYAN*\n\n` +
        `⚡ *Cómo usar:* .casarse @usuario\n` +
        `🌀 *O responde* al mensaje de tu compañero\n` +
        `💫 *Ejemplo:* .casarse @amigo\n\n` +
        `*¡Encuentra a tu compañero Saiyan!* 🐉`,
        m
      )
    }
    
    // Validaciones
    if (partnerId === userId) {
      await m.react('❌')
      return conn.reply(m.chat,
        `🌀 *NO PUEDES CASARTE CONTIGO MISMO*\n\n` +
        `Los Saiyans necesitan un compañero, no un espejo.\n` +
        `💡 Busca a otro guerrero Saiyan.`,
        m
      )
    }

    // Verificar si ya está casado
    if (marriages[userId]) {
      const currentPartner = marriages[userId]
      await m.react('⚠️')
      return conn.reply(m.chat,
        `💫 *YA TIENES UN COMPAÑERO SAIYAN*\n\n` +
        `Ya estás unido a ${tag(currentPartner)}\n` +
        `⚡ Usa .divorciarse si quieres romper el pacto.\n\n` +
        `*La lealtad Saiyan es importante* 🛡️`,
        m,
        { mentions: [userId, currentPartner] }
      )
    }
    
    if (marriages[partnerId]) {
      const theirPartner = marriages[partnerId]
      await m.react('🚫')
      return conn.reply(m.chat,
        `🐉 *YA ESTÁ CASADO/A*\n\n` +
        `${tag(partnerId)} ya tiene un compañero Saiyan.\n` +
        `Está unido a ${tag(theirPartner)}\n\n` +
        `*Respeta los pactos Saiyan* ✨`,
        m,
        { mentions: [partnerId, theirPartner] }
      )
    }

    // Crear matrimonio
    marriages[userId] = partnerId
    marriages[partnerId] = userId

    // Reacciones épicas
    await m.react('💍')
    await m.react('⚡')
    await m.react('🐉')

    // Mensaje de matrimonio épico
    await conn.sendMessage(m.chat, {
      text: `╔═══════════════════════════╗\n` +
            `║    💒 *PACTO SAIYAN CREADO* ⚡   ║\n` +
            `╠═══════════════════════════╣\n` +
            `║ 🐉 *COMPAÑERO 1:* ${tag(userId)}\n` +
            `║ 🌟 *COMPAÑERO 2:* ${tag(partnerId)}\n` +
            `╠═══════════════════════════╣\n` +
            `║ 💫 *EL PODER SAIYAN LOS UNE*\n` +
            `║ ⚡ *ENERGÍA COMPARTIDA*\n` +
            `║ 🌀 *DESTINO ENTRELAZADO*\n` +
            `╠═══════════════════════════╣\n` +
            `║ *¡QUE SU UNIÓN SEA ETERNA!* ✨\n` +
            `╚═══════════════════════════╝`,
      mentions: [userId, partnerId],
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "🐉 PACTO SAIYAN",
          body: "¡Matrimonio Dragon Ball!",
          mediaType: 1,
          thumbnailUrl: "https://iili.io/fgy4Anj.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029Vb724SDHltY4qGU9QS3S"
        }
      }
    }, { quoted: m })

    // Mensaje extra después de 2 segundos
    setTimeout(async () => {
      await conn.sendMessage(m.chat, {
        text: `🌸 *CONSEJOS PARA LA UNIÓN SAIYAN:*\n\n` +
              `1️⃣ Entrenen juntos para aumentar su poder\n` +
              `2️⃣ Compartan energía Ki cuando lo necesiten\n` +
              `3️⃣ Protejan la Tierra como un equipo\n` +
              `4️⃣ ¡Que su amor sea más fuerte que un Genkidama!\n\n` +
              `*¡Felicidades guerreros!* 🎉🐉`
      })
    }, 2000)
    
    return
  }

  // 🐉 COMANDO PARA VER MATRIMONIO
  if (['mymarry', 'mipareja', 'esposo', 'esposa'].includes(command)) {
    if (!marriages[userId]) {
      return conn.reply(m.chat,
        `🌸 *NO TIENES COMPAÑERO SAIYAN*\n\n` +
        `Actualmente no estás unido a nadie.\n` +
        `⚡ Usa .casarse para encontrar a tu alma gemela Saiyan.\n\n` +
        `*¡El poder del amor Saiyan te espera!* 💫`,
        m
      )
    }
    
    const partner = marriages[userId]
    const daysTogether = Math.floor((Date.now() - (marriages._timestamps?.[userId] || Date.now())) / 86400000)
    
    await conn.reply(m.chat,
      `💒 *TU COMPAÑERO SAIYAN*\n\n` +
      `🐉 *Pareja:* ${tag(partner)}\n` +
      `⏱️ *Tiempo juntos:* ${daysTogether} días\n` +
      `⚡ *Estado:* Pacto Saiyan activo\n` +
      `💖 *Nivel de unión:* ${Math.min(daysTogether, 100)}/100\n\n` +
      `*¡Sigan entrenando juntos!* 🏋️‍♂️💪`,
      m,
      { mentions: [userId, partner] }
    )
    
    await m.react('💖')
  }
}

// Almacenar timestamp del matrimonio
handler.before = async (m, { conn }) => {
  if (!marriages._timestamps) marriages._timestamps = {}
  const userId = m.sender
  if (marriages[userId] && !marriages._timestamps[userId]) {
    marriages._timestamps[userId] = Date.now()
  }
}

// Comandos y configuración
handler.help = ['casarse @usuario', 'divorciarse', 'mipareja']
handler.tags = ['fun', 'roleplay', 'beast']
handler.command = [
  'marry', 'casarse', 'matrimonio', 'pacto',
  'divorce', 'divorciarse', 'romper',
  'mymarry', 'mipareja', 'esposo', 'esposa'
]
handler.group = true
handler.limit = false
handler.premium = false

export default handler