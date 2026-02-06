import { areJidsSameUser } from '@whiskeysockets/baileys'

const mentionHandler = async (m, { conn }) => {
  try {
    // Solo procesar mensajes de texto
    if (!m.text || typeof m.text !== 'string' || m.text.length === 0) return
    
    const botNumber = conn.user.jid
    const botId = botNumber.split('@')[0]
    const sender = m.sender
    
    // Evitar auto-respuesta
    if (areJidsSameUser(sender, botNumber)) return
    
    // Verificar menciones
    const mentionedJid = m.mentionedJid || []
    const isMentioned = mentionedJid.some(jid => areJidsSameUser(jid, botNumber))
    
    // Verificar si el texto hace referencia al bot
    const text = m.text.toLowerCase()
    const mentionsBot = text.includes(`@${botId}`) || 
                       text.includes('bot') || 
                       text.includes('🤖') ||
                       text.includes('robot') ||
                       text.includes('asistente') ||
                       text.includes('⚡') ||
                       (text.includes('hola') && (text.includes('bot') || text.includes('🤖')))
    
    if (!isMentioned && !mentionsBot) return
    
    // Respuestas aleatorias
    const responses = [
      "¡Wao! 😎 ¿Me llamaban?",
      "¡Ta chido bro! ⚡ ¿Qué pasa?",
      "¡Aquí estoy! 🚀 ¿En qué te ayudo?",
      "🤖 *Beep boop* Sistema activado",
      "¡Presente! ✨ ¿Necesitas algo?",
      "¡Hola! 👋 ¿Me mencionaste?",
      "¡Sí, soy yo! 😊 ¿Qué necesitas?",
      "¡Wao, ta chido! ⭐ ¿Algún comando?",
      "¡Ey! 👀 ¿Me necesitabas?",
      "¡Aquí ando! 💫 ¿Buscabas ayuda?"
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    // Reacción
    await conn.sendMessage(m.chat, {
      react: { text: '⚡', key: m.key }
    })
    
    // Pequeña pausa para parecer natural
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Enviar respuesta
    await conn.sendMessage(m.chat, {
      text: randomResponse,
      mentions: [sender]
    }, { quoted: m })
    
    // Log en consola
    console.log(`[AUTO-MENTION] Respondido a @${sender.split('@')[0]}: "${m.text.substring(0, 30)}..."`)
    
  } catch (error) {
    console.error('Error en mención automática:', error)
  }
}

// Configuración para activación automática
mentionHandler.event = 'message.create'
mentionHandler.before = (m, { conn }) => {
  try {
    // Solo mensajes de texto
    if (!m.text || typeof m.text !== 'string') return false
    
    // Evitar comandos que empiecen con punto
    if (m.text.trim().startsWith('.')) return false
    
    const botNumber = conn.user.jid
    const botId = botNumber.split('@')[0]
    const text = m.text.toLowerCase()
    
    // Verificar menciones directas
    const mentionedJid = m.mentionedJid || []
    const isDirectMention = mentionedJid.some(jid => areJidsSameUser(jid, botNumber))
    
    // Verificar referencias al bot
    const hasBotReference = text.includes(`@${botId}`) || 
                           text.includes('bot') || 
                           text.includes('🤖') ||
                           text.includes('robot')
    
    return isDirectMention || hasBotReference
  } catch (e) {
    console.error('Error en before hook:', e)
    return false
  }
}

// Metadata del handler
mentionHandler.command = false
mentionHandler.tags = ['auto-response']
mentionHandler.group = true
mentionHandler.private = true
mentionHandler.botAdmin = false
mentionHandler.admin = false
mentionHandler.owner = false

export default mentionHandler