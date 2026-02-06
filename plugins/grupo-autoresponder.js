import handler = async (m, { conn, text, mentionedJid, sender }) => {
  const botNumber = conn.user.jid
  const botNumberShort = botNumber.split('@')[0]
  
  // Verificar si mencionan al bot
  const isMentioned = mentionedJid && mentionedJid.includes(botNumber)
  const hasBotName = m.text && (
    m.text.includes(`@${botNumberShort}`) ||
    m.text.toLowerCase().includes(conn.user.name.toLowerCase()) ||
    /bot|robot|🤖|⚡/i.test(m.text)
  )
  
  if (!isMentioned && !hasBotName) return
  
  // Opciones de respuesta
  const options = [
    {
      type: 'text',
      content: "¡Wao! 😎 ¿Me mencionaron? Aquí ando, ¿qué necesitan?",
      mentions: [sender]
    },
    {
      type: 'text', 
      content: "¡Ta chido bro! ⚡ ¿Me estabas buscando?",
      mentions: [sender]
    },
    {
      type: 'sticker',
      packname: "Bot mencionado",
      author: "Sistema",
      url: "https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/assets/logo.png"
    },
    {
      type: 'image',
      url: "https://media.tenor.com/images/1f0cde2ef5b64d4afcc4f43a011f2bb3/tenor.gif",
      caption: "¡Aquí estoy! 🚀 ¿Algo que necesites?"
    },
    {
      type: 'text',
      content: "🤖 *Beep boop* 🤖\nUsuario detectado: @" + sender.split('@')[0] + "\nSistema: Activado\nRespuesta: ¿En qué te ayudo?",
      mentions: [sender]
    }
  ]
  
  const selected = options[Math.floor(Math.random() * options.length)]
  
  try {
    switch (selected.type) {
      case 'text':
        await conn.sendMessage(m.chat, {
          text: selected.content,
          mentions: selected.mentions || []
        }, { quoted: m })
        break
        
      case 'sticker':
        await conn.sendMessage(m.chat, {
          sticker: { url: selected.url },
          mentions: [sender]
        }, { quoted: m })
        break
        
      case 'image':
        await conn.sendMessage(m.chat, {
          image: { url: selected.url },
          caption: selected.caption || "",
          mentions: [sender]
        }, { quoted: m })
        break
    }
    
    // Reacción automática
    await conn.sendMessage(m.chat, {
      react: { text: '🤖', key: m.key }
    })
    
  } catch (error) {
    console.error('Error al responder mención:', error)
    // Respuesta de fallback
    await conn.sendMessage(m.chat, {
      text: "¡Hola! 👋 Veo que me mencionaste. ¿En qué puedo ayudarte?",
      mentions: [sender]
    }, { quoted: m })
  }
}

export default handler