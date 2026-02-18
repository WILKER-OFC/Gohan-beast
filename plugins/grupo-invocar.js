import { randomBytes } from 'crypto'

let handler = async (m, { conn, participants, isOwner, isAdmin }) => {
  try {
    // Verificar permisos
    if (!m.isGroup) {
      return conn.reply(m.chat, '🌀 *MODO GOHAN BEAST*\n\nEste poder solo puede ser invocado en grupos, ¡bro!', m)
    }
    
    // Verificar si el usuario es admin/owner
    if (!isAdmin && !isOwner) {
      return conn.reply(m.chat, 
        '⚡ *PODER NEGADO* ⚡\n\n' +
        '❌ Solo los administradores pueden invocar este poder divino.\n' +
        '¡Necesitas el poder de un Super Saiyan para esto!', m)
    }

    // INICIO DE LA INVOCACIÓN - EFECTOS ÉPICOS
    const inicio = Date.now()
    
    // Mensaje inicial de poder (SIN SPAM - SOLO REACCIONES)
    await m.react('🌀')
    await m.react('⚡')
    await m.react('🔥')
    
    // Obtener todos los participantes
    const mentions = participants.map(a => a.id)
    
    // Crear mensaje épico (ÚNICO MENSAJE)
    const tiempoInvocacion = (Date.now() - inicio) / 1000
    
    const mensajeDivino = 
      '╔════════════════════════╗\n' +
      '║    𝗜𝗡𝗩𝗢𝗖𝗔𝗖𝗜𝗢𝗡𝗘𝗦 𝗗𝗜𝗩𝗜𝗡𝗔𝗦    ║\n' +
      '╚════════════════════════╝\n\n' +
      
      '✨ *¡EL PODER DE GOHAN BEAST HA SIDO INVOCADO!* ✨\n\n' +
      
      '```\n' +
      '⚡ NIVEL DE PODER: SOBRE 9000\n' +
      '🌀 ENERGÍA DIVINA: ACTIVADA\n' +
      '🔥 MODO BESTIA: DESBLOQUEADO\n' +
      '```\n\n' +
      
      '👤 *Invocador:* @' + m.sender.split('@')[0] + '\n' +
      '👥 *Almas invocadas:* ' + mentions.length + ' guerreros\n' +
      '⏱️ *Tiempo de invocación:* ' + tiempoInvocacion.toFixed(2) + 's\n' +
      '📅 *Fecha:* ' + new Date().toLocaleDateString() + '\n' +
      '🌊 *Onda expansiva:* Incluida en este mensaje\n\n' +
      
      '🌀 *LISTA DE GUERREROS INVOCADOS:*\n' +
      mentions.map((jid, i) => {
        if (i < 10) return `┣━ ${i + 1}. @${jid.split('@')[0]}`
        else if (i === 10) return `┣━ ... y ${mentions.length - 10} más`
        else return null
      }).filter(Boolean).join('\n') + '\n\n' +
      
      '🔥 *EFECTO DE ONDA EXPANSIVA:*\n' +
      '`⚡⚡⚡⚡⚡ Energía máxima`\n' +
      '`🌀🌀🌀🌀🌀 Propagación divina`\n' +
      '`✨✨✨✨✨ Poder infinito`\n\n' +
      
      '✨ *Que la energía divina los acompañe a todos!* ✨\n\n' +
      
      '`⚡ Poder fluyendo... Energía al máximo... Gohan Beast activado ⚡`'

    // ENVIAR UN SOLO MENSAJE CON MENCIONES MASIVAS
    await conn.sendMessage(m.chat, {
      text: mensajeDivino,
      mentions: mentions,
      contextInfo: {
        mentionedJid: mentions,
        externalAdReply: {
          title: '⚡ GOHAN BEAST - INVOCACIÓN DIVINA ⚡',
          body: `Invocando a ${mentions.length} guerreros`,
          thumbnailUrl: 'https://i.pinimg.com/originals/0b/8c/21/0b8c2155bd5a7d3d5b5b5f5b5b5b5b5b.jpg',
          sourceUrl: 'https://github.com',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    // REACCIONES FINALES (SOLO REACCIONES, NO MENSAJES)
    await m.react('✅')
    await m.react('🌊')
    await m.react('✨')

    // LOG DE PODER
    console.log(`
🌀 INVOCACIÓN BEAST COMPLETADA 🌀
┣━ Usuario: ${m.sender}
┣━ Grupo: ${m.chat}
┣━ Invocados: ${mentions.length}
┣━ Tiempo: ${tiempoInvocacion}s
┗━ Poder: MÁXIMO (SIN SPAM)
    `)

  } catch (error) {
    console.error('💥 ERROR EN INVOCACIÓN BEAST:', error)
    
    await m.react('❌')
    await m.react('💥')
    
    return conn.reply(m.chat, 
      '💥 *¡EXPLOSIÓN DE ENERGÍA!* 💥\n\n' +
      'El poder de Gohan Beast ha colapsado temporalmente.\n' +
      '🔧 *Error:* ' + (error.message || 'Desconocido') + '\n\n' +
      'Intenta invocar de nuevo cuando la energía se estabilice.',
      m
    )
  }
}

// CONFIGURACIÓN DEL COMANDO
handler.command = ['invocar', 'invocacion', 'invocarbeast', 'llamartodos', 'mencionartodos']
handler.tags = ['grupo', 'owner']
handler.help = ['invocar']
handler.group = true
handler.admin = true
handler.botAdmin = false
handler.rowner = false

export default handler