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
    
    // Mensaje inicial de poder
    await conn.reply(m.chat, 
      '🌀 *INVOCANDO PODER DIVINO* 🌀\n\n' +
      '╔═══════════════════\n' +
      '║ ✨ *GOHAN BEAST MODE* ✨\n' +
      '╠═══════════════════\n' +
      '║ ⚡ *Energía: ∞*\n' +
      '║ 🌟 *Poder: Máximo*\n' +
      '║ 🔥 *Estado: Invocando...*\n' +
      '╚═══════════════════\n\n' +
      '`Liberando energía espiritual...`', m)

    // Reacciones de poder
    await m.react('🌀')
    await m.react('⚡')
    await m.react('🔥')
    
    // Obtener todos los participantes
    const mentions = participants.map(a => a.id)
    
    // Crear mensaje épico
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
      '📅 *Fecha:* ' + new Date().toLocaleDateString() + '\n\n' +
      
      '🌀 *LISTA DE GUERREROS INVOCADOS:*\n' +
      mentions.map((jid, i) => `┣━ ${i + 1}. @${jid.split('@')[0]}`).join('\n') + '\n\n' +
      
      '✨ *Que la energía divina los acompañe a todos!* ✨\n\n' +
      
      '`⚡ Poder fluyendo... Energía al máximo... Gohan Beast activado ⚡`'

    // ENVIAR MENSAJE CON MENCIONES MASIVAS
    await conn.sendMessage(m.chat, {
      text: mensajeDivino,
      mentions: mentions,
      contextInfo: {
        mentionedJid: mentions,
        externalAdReply: {
          title: '⚡ GOHAN BEAST - INVOCACIÓN DIVINA ⚡',
          body: 'El poder máximo ha sido liberado',
          thumbnailUrl: 'https://i.pinimg.com/originals/0b/8c/21/0b8c2155bd5a7d3d5b5b5f5b5b5b5b5b.jpg',
          sourceUrl: 'https://github.com',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    // EFECTO DE ONDA EXPANSIVA (varios mensajes)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await conn.sendMessage(m.chat, {
      text: '🌀 *ONDA EXPANSIVA DETECTADA* 🌀\n\n' +
            '¡La energía se está dispersando por todo el grupo!\n' +
            '`Nivel de poder detectado:` ⚡⚡⚡⚡⚡',
      mentions: mentions.slice(0, 5)
    })

    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await conn.sendMessage(m.chat, {
      text: '🔥 *TODOS HAN SIDO MARCADOS POR EL PODER* 🔥',
      mentions: mentions.slice(0, 3)
    })

    // REACCIONES FINALES
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
┗━ Poder: MÁXIMO
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
handler.tags = ['admin', 'beastmode']
handler.help = ['invocar']
handler.group = true
handler.admin = true
handler.botAdmin = false
handler.rowner = false

export default handler

// FUNCIÓN DE PODER ADICIONAL - PARA EFECTOS ESPECIALES
async function efectoOndaExpansiva(conn, chatId, intensity = 'max') {
  const efectos = {
    min: ['⚡', '✨'],
    med: ['⚡', '🌀', '✨', '🔥'],
    max: ['⚡', '🌀', '✨', '🔥', '🌊', '💫', '⭐', '🌟']
  }
  
  const efecto = efectos[intensity] || efectos.max
  
  for (let i = 0; i < 3; i++) {
    await conn.sendMessage(chatId, {
      text: efecto.map(e => e.repeat(i + 1)).join(' ') + '\n' +
            '`Energía divina fluyendo...`'
    })
    await new Promise(resolve => setTimeout(resolve, 500))
  }
}