let handler = async (m, { conn }) => {
  try {
    // Obtener información del usuario que se unió
    const user = m.sender
    const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : null
    const groupName = m.isGroup ? groupMetadata.subject : 'Este grupo'
    
    // Obtener el nombre del usuario
    let userName
    try {
      const contact = await conn.getContact(user)
      userName = contact.pushname || contact.notify || contact.vname || contact.name || 'Usuario'
    } catch {
      userName = 'Usuario'
    }
    
    // Mensaje de bienvenida
    const welcomeMessage = `
╭━━━━━━━━━━━━━━━━━━╮
        🎊 *BIENVENIDO/A* 🎊
╰━━━━━━━━━━━━━━━━━━╯

👋 ¡Hola @${user.split('@')[0]}!
¡Bienvenido/a a *${groupName}*!

🎯 *Reglas importantes:*
1️⃣ Respetar a todos los miembros
2️⃣ No spam ni flood
3️⃣ Mantener el grupo activo
4️⃣ Usar el bot correctamente
5️⃣ Divertirse y aprender

🤖 *SOBRE EL BOT:*
⚡ *Nombre:* Gohan Beast Bot
👑 *Creador:* @5492644893953
📞 *Contacto:* +5492644893953

💡 *Para más información del bot:*
📌 Pregunta a: @5492644893953
📌 O usa: .menu para ver comandos
📌 O escribe: .owner para detalles

🎁 *Comandos útiles:*
• .menu - Ver todos los comandos
• .donar - Información de donaciones
• .code - Sistema de subbots
• .owner - Contactar al creador

🏷️ *¡Disfruta tu estadía en el grupo!*
⚡ *Powered by Gohan Beast Bot*
`

    // Enviar mensaje con mención al usuario y al owner
    await conn.sendMessage(m.chat, {
      text: welcomeMessage,
      mentions: [user, '5492644893953@s.whatsapp.net'],
      contextInfo: {
        mentionedJid: [user, '5492644893953@s.whatsapp.net']
      }
    }, { quoted: m })
    
    // Enviar imagen de bienvenida después de 1 segundo
    setTimeout(async () => {
      try {
        await conn.sendMessage(m.chat, {
          image: { url: 'https://d.uguu.se/FLmbfoqM.jpeg' },
          caption: `🎉 ${userName}, te damos la más cordial bienvenida al grupo!\n\n👑 Owner: @5492644893953\n⚡ Bot: Gohan Beast Bot`,
          mentions: [user, '5492644893953@s.whatsapp.net']
        }, { quoted: m })
      } catch (e) {
        console.log('No se pudo enviar la imagen de bienvenida')
      }
    }, 1000)
    
  } catch (error) {
    console.error('Error en welcome:', error)
  }
}

// El handler se activa cuando alguien se une al grupo
handler.event = 'group-participants-update'
handler.before = async function(m) {
  // Verificar si es un evento de unirse al grupo
  if (!m.isGroup) return
  
  // Obtener la acción (add, remove, etc)
  const action = m.action
  
  // Si alguien se unió
  if (action === 'add') {
    // Ejecutar la bienvenida para cada nuevo participante
    for (let participant of m.participants) {
      // Crear un objeto m simulado para el handler
      const fakeM = {
        ...m,
        sender: participant,
        isGroup: true,
        chat: m.chat
      }
      
      // Llamar al handler con el participante
      await this.handler(fakeM)
    }
  }
}

handler.help = ['welcome']
handler.tags = ['group']
handler.command = ['welcome', 'bienvenida']
handler.group = true
handler.admin = false
handler.botAdmin = false

export default handler