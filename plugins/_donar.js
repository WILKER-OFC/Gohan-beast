let handler = async (m, { conn, usedPrefix }) => {
  try {
    // Información de contacto directa
    const infoDonacion = `
╭───「 💰 *DONACIONES* 💰 」─
│
│ ⚡ *GOHAN BEAST BOT* ⚡
│
│ 📞 *PARA DONAR CONTACTA A:*
│ 👑 *OWNER:* +5492644893953
│
│ 📲 *Enlace directo:*
│ https://wa.me/5492644893953
│
│ 📝 *Información que recibirás:*
│ • Métodos de pago disponibles
│ • Precios y planes
│ • Beneficios por donar
│ • Instrucciones paso a paso
│
│ 💫 *El owner te atenderá personalmente*
│   *y resolverá todas tus dudas*
│
╰───────────────────

🎁 *¿Por qué donar?*
• ✅ Mantenimiento 24/7 del bot
• ✅ Nuevas funciones constantes
• ✅ Soporte técnico inmediato
• ✅ Comandos premium exclusivos

⚡ *Contacta ahora mismo para más información*
`

    // Botones interactivos
    const buttons = [
      { 
        buttonId: `${usedPrefix}owner`, 
        buttonText: { displayText: '👑 Contactar Owner' }, 
        type: 1 
      },
      { 
        buttonId: `${usedPrefix}menu`, 
        buttonText: { displayText: '📋 Volver al Menú' }, 
        type: 1 
      },
      { 
        buttonId: `https://wa.me/5492644893953`, 
        buttonText: { displayText: '📞 WhatsApp Directo' }, 
        type: 2  // Tipo 2 para enlace externo
      }
    ]
    
    // Enviar mensaje con imagen
    await conn.sendMessage(m.chat, {
      image: { url: 'https://d.uguu.se/FLmbfoqM.jpeg' },
      caption: infoDonacion,
      footer: '⚡ Gohan Beast Bot - Donaciones',
      buttons: buttons,
      headerType: 4,
      mentions: [m.sender]
    }, { quoted: m })
    
  } catch (error) {
    console.error(error)
    m.reply('❌ Error al mostrar información de donación')
  }
}

handler.help = ['donar', 'donate', 'apoyar', 'premium']
handler.tags = ['info', 'main']
handler.command = ['donar', 'donate', 'apoyar', 'pagos', 'pay', 'pagar', 'donate', 'premium']

export default handler