
import speed from 'performance-now'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  
  await m.react('⚡')
  
  let sentMsg = await m.reply(`🐉 *Activando Kamehameha...*`)
  
  let latency = speed() - timestamp
  
  // Velocidades Dragon Ball Z
  let velocidadDBZ = ''
  let ataqueDBZ = ''
  let emojiDBZ = ''
  
  if (latency < 50) {
    velocidadDBZ = '🌀 *VELOCIDAD INSTANTÁNEA*'
    ataqueDBZ = 'Instant Transmission de Goku'
    emojiDBZ = '✨'
  } else if (latency < 150) {
    velocidadDBZ = '⚡ *VELOCIDAD RELÁMPAGO*'
    ataqueDBZ = 'Afterimage Technique'
    emojiDBZ = '💫'
  } else if (latency < 300) {
    velocidadDBZ = '🔥 *VELOCIDAD SÓNICA*'
    ataqueDBZ = 'Super Saiyan Speed'
    emojiDBZ = '🌟'
  } else if (latency < 500) {
    velocidadDBZ = '💨 *VELOCIDAD NIMBUS*'
    ataqueDBZ = 'Flying Nimbus Cloud'
    emojiDBZ = '☁️'
  } else {
    velocidadDBZ = '🐌 *VELOCIDAD TORTUGA*'
    ataqueDBZ = 'Master Roshi Walking'
    emojiDBZ = '🐢'
  }
  
  const result = `
${emojiDBZ} *「 PING BEAST 」* ${emojiDBZ}

${velocidadDBZ}
📊 *Tiempo:* ${latency.toFixed(0)}ms
🎯 *Ataque:* ${ataqueDBZ}

⚡ *Gohan Beast* - ¡Conectado!
🐉 *By Wilker*
`
  
  await conn.sendMessage(m.chat, {
    text: result,
    edit: sentMsg.key
  })
  
  await m.react('✅')
}

handler.help = ['ping', 'velocidad', 'speed']
handler.tags = ['beast', 'info']
handler.command = ['ping', 'p', 'velocidad', 'speed', 'beast']
export default handler