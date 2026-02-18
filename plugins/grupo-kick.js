let handler = async (m, { conn, participants, isOwner, isAdmin }) => {
  try {
    // Verificar si es grupo
    if (!m.isGroup) {
      return conn.reply(m.chat, '🌀 *MODO GOHAN BEAST*\n\nEste poder solo puede ser usado en grupos, ¡bro!', m)
    }

    // Verificar permisos de admin
    if (!isAdmin && !isOwner) {
      return conn.reply(m.chat, 
        '⚡ *PODER NEGADO* ⚡\n\n' +
        '❌ Solo los administradores pueden expulsar miembros.\n' +
        '¡Necesitas el poder de un Super Saiyan para esto!', m)
    }

    // Verificar si el bot es admin
    const bot = participants.find(v => v.id == conn.user.jid)
    if (!bot.admin) {
      return conn.reply(m.chat, 
        '🌀 *PODER INSUFICIENTE* 🌀\n\n' +
        '❌ Necesito ser administrador para expulsar miembros.\n' +
        '¡Dame poderes de admin primero!', m)
    }

    // Verificar si está respondiendo a un mensaje
    if (!m.quoted) {
      return conn.reply(m.chat, 
        '💫 *MODO GOHAN BEAST - EXPULSIÓN DIVINA* 💫\n\n' +
        '*Uso correcto:* Responde al mensaje de la persona que quieres expulsar con `.kick`\n\n' +
        '*Ejemplo:*\n' +
        '1. Busca un mensaje del usuario\n' +
        '2. Responde a su mensaje\n' +
        '3. Escribe `.kick`\n\n' +
        '🌀 *El poder de expulsión se activará*', m)
    }

    // Obtener ID del usuario a expulsar
    const usuarioExpulsar = m.quoted.sender
    
    // Verificar que no sea el bot
    if (usuarioExpulsar === conn.user.jid) {
      return conn.reply(m.chat, 
        '🌀 *ERROR CÓSMICO* 🌀\n\n' +
        '❌ No puedo expulsarme a mí mismo.\n' +
        '¡Eso sería un suicidio digital!', m)
    }

    // Verificar que no sea el owner
    if (usuarioExpulsar === m.sender) {
      return conn.reply(m.chat, 
        '🌀 *ERROR DIVINO* 🌀\n\n' +
        '❌ No puedes expulsarte a ti mismo.\n' +
        '¡Eso no tendría sentido!', m)
    }

    // Verificar que el usuario existe en el grupo
    const usuarioEnGrupo = participants.find(v => v.id === usuarioExpulsar)
    if (!usuarioEnGrupo) {
      return conn.reply(m.chat, 
        '🌀 *ERROR DE DIMENSIÓN* 🌀\n\n' +
        '❌ Este usuario ya no está en el grupo.\n' +
        '¡El poder no puede afectar a quien no está presente!', m)
    }

    // Verificar si el usuario es admin
    if (usuarioEnGrupo.admin) {
      return conn.reply(m.chat, 
        '⚡ *PODER SUPERIOR DETECTADO* ⚡\n\n' +
        '❌ No puedo expulsar a un administrador.\n' +
        '¡Su poder es demasiado grande!', m)
    }

    // INICIO DE LA EXPULSIÓN - EFECTOS ÉPICOS
    const inicio = Date.now()
    
    // Reacciones de poder
    await m.react('🌀')
    await m.react('⚡')
    await m.react('💥')

    // Obtener nombre del usuario
    let usuarioNombre = '@' + usuarioExpulsar.split('@')[0]
    
    // Mensaje de preparación (único)
    const tiempoEjecucion = (Date.now() - inicio) / 1000

    const mensajeExpulsion = 
      '╔════════════════════════╗\n' +
      '║    𝗘𝗫𝗣𝗨𝗟𝗦𝗜𝗢𝗡 𝗗𝗜𝗩𝗜𝗡𝗔    ║\n' +
      '╚════════════════════════╝\n\n' +
      
      '💥 *¡GOHAN BEAST HA HABLADO!* 💥\n\n' +
      
      '```\n' +
      '⚡ PODER: MÁXIMO\n' +
      '🌀 TÉCNICA: EXPULSIÓN DIVINA\n' +
      '🔥 ESTADO: EJECUTANDO\n' +
      '```\n\n' +
      
      '👤 *Ejecutor:* @' + m.sender.split('@')[0] + '\n' +
      '👥 *Objetivo:* ' + usuarioNombre + '\n' +
      '⏱️ *Tiempo:* ' + tiempoEjecucion.toFixed(2) + 's\n' +
      '📅 *Momento:* ' + new Date().toLocaleString() + '\n\n' +
      
      '🌀 *JUSTIFICACIÓN CÓSMICA:*\n' +
      '┏━━━━━━━━━━━━━━━━━━\n' +
      '┃ El poder divino ha decidido\n' +
      '┃ que este guerrero debe partir.\n' +
      '┃ Que su energía encuentre\n' +
      '┃ un nuevo universo.\n' +
      '┗━━━━━━━━━━━━━━━━━━\n\n' +
      
      '🔥 *EFECTO DE EXPULSIÓN:*\n' +
      '`💥💥💥💥💥 Onda expansiva`\n' +
      '`🌪️🌪️🌪️🌪️🌪️ Vórtice dimensional`\n' +
      '`✨✨✨✨✨ Desintegración`\n\n' +
      
      '✨ *¡QUE LA ENERGÍA TE ACOMPAÑE, GUERRERO!* ✨\n\n' +
      
      '`⚡ Ejecutando expulsión... 3... 2... 1... ⚡`'

    // Enviar mensaje épico mencionando al expulsado
    await conn.sendMessage(m.chat, {
      text: mensajeExpulsion,
      mentions: [m.sender, usuarioExpulsar],
      contextInfo: {
        mentionedJid: [m.sender, usuarioExpulsar],
        externalAdReply: {
          title: '⚡ GOHAN BEAST - EXPULSIÓN DIVINA ⚡',
          body: `Expulsando a ${usuarioNombre}`,
          thumbnailUrl: 'https://i.pinimg.com/originals/0b/8c/21/0b8c2155bd5a7d3d5b5b5f5b5b5b5b5b.jpg',
          sourceUrl: 'https://github.com',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    // Pequeña pausa para el drama
    await new Promise(resolve => setTimeout(resolve, 2000))

    // EJECUTAR LA EXPULSIÓN
    await conn.groupParticipantsUpdate(m.chat, [usuarioExpulsar], 'remove')
    
    // REACCIONES DE ÉXITO
    await m.react('✅')
    await m.react('💥')
    await m.react('✨')

    // Mensaje de confirmación final
    await conn.sendMessage(m.chat, {
      text: '✅ *EXPULSIÓN COMPLETADA* ✅\n\n' +
            `El guerrero ${usuarioNombre} ha sido ` +
            `expulsado del grupo.\n` +
            `🌀 *Que su poder encuentre un nuevo camino*`,
      mentions: [m.sender]
    })

    // LOG DE PODER
    console.log(`
🌀 EXPULSIÓN DIVINA COMPLETADA 🌀
┣━ Ejecutor: ${m.sender}
┣━ Expulsado: ${usuarioExpulsar}
┣━ Grupo: ${m.chat}
┣━ Tiempo: ${tiempoEjecucion}s
┗━ Poder: MÁXIMO
    `)

  } catch (error) {
    console.error('💥 ERROR EN EXPULSIÓN DIVINA:', error)

    await m.react('❌')
    await m.react('💥')

    return conn.reply(m.chat, 
      '💥 *¡EXPLOSIÓN DE ENERGÍA!* 💥\n\n' +
      'La expulsión divina ha fallado.\n' +
      '🔧 *Error:* ' + (error.message || 'Desconocido') + '\n\n' +
      'Verifica que el usuario aún esté en el grupo\n' +
      'y que tenga los permisos necesarios.',
      m
    )
  }
}

// CONFIGURACIÓN DEL COMANDO
handler.command = ['kick', 'expulsar', 'echar', 'kickbeast', 'expulsiondivina']
handler.tags = ['admin', 'beastmode']
handler.help = ['kick (respondiendo a un mensaje)']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.rowner = false

export default handler