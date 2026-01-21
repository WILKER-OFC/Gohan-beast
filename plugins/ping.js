import speed from 'performance-now'
import os from 'os'

let handler = async (m, { conn, usedPrefix }) => {
  let timestamp = speed()
  
  // Reacción inicial uwu
  await m.react('🌀')
  
  // Mensaje de carga kawaii
  let sentMsg = await m.reply(`🌸 *Calculando poder Saiyan...* ⚡\n🌀 Cargando latencia del dojo...`)
  
  let latency = speed() - timestamp
  
  // Obtener info del sistema uwu
  const cpu = os.cpus()[0]?.model || 'Desconocido'
  const ramTotal = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
  const ramFree = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
  const uptime = process.uptime()
  
  // Determinar estado según latencia >w<
  let estado = ''
  let emojiEstado = ''
  let poderSaiyan = ''
  
  if (latency < 50) {
    estado = '🐉 *ULTRA INSTINCT*'
    emojiEstado = '✨'
    poderSaiyan = 'Poder máximo alcanzado!'
  } else if (latency < 150) {
    estado = '⚡ *SUPER SAIYAN GOD*'
    emojiEstado = '💫'
    poderSaiyan = 'Poder divino activado'
  } else if (latency < 300) {
    estado = '🔥 *SUPER SAIYAN*'
    emojiEstado = '🌟'
    poderSaiyan = 'Transformación completa'
  } else if (latency < 500) {
    estado = '💪 *SAIYAN BASE*'
    emojiEstado = '🌸'
    poderSaiyan = 'Poder estable'
  } else {
    estado = '⚠️ *SAIYAN NOVATO*'
    emojiEstado = '🌱'
    poderSaiyan = 'Necesita entrenamiento'
  }
  
  // Formatear uptime kawaii
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor((uptime % 86400) / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  const seconds = Math.floor(uptime % 60)
  
  const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`
  
  // Crear respuesta uwu
  const result = `
╔═══════════════════════════╗
║     🐉 *PING GOHAN BEAST* ⚡    ║
╠═══════════════════════════╣
║ ${emojiEstado} ${estado}
║ 
║ 📊 *LATENCIA:* ${latency.toFixed(2)}ms
║ 🌀 *PODER SAIYAN:* ${poderSaiyan}
╠═══════════════════════════╣
║      ⚙️ *ESTADO DEL DOJO*      
╠═══════════════════════════╣
║ 🧠 *CPU:* ${cpu.split(' ')[0]}...
║ 💾 *RAM:* ${ramFree}GB / ${ramTotal}GB
║ ⏱️ *UPTIME:* ${uptimeStr}
║ 📱 *ACTIVO:* ${global.db.data.stats ? Object.keys(global.db.data.stats).length : 0} comandos
╠═══════════════════════════╣
║ 🐉 *TRANSFORMACIÓN:* Beast Mode
║ ⚡ *ENERGÍA:* ${global.moneda || 'Saiyan'} al 100%
║ 💫 *ESTADO:* Conectado y listo
╚═══════════════════════════╝

*¡El poder Saiyan fluye en mí!* 🌸✨
`
  
  // Enviar respuesta owo
  await conn.sendMessage(m.chat, {
    text: result,
    edit: sentMsg.key,
    mentions: [m.sender]
  }, { quoted: m })
  
  // Reacciones finales uwu
  await m.react('⚡')
  await m.react('✅')
  
  // Efecto de sonido kawaii
  setTimeout(async () => {
    await conn.sendMessage(m.chat, {
      text: '_*¡POW!*_ 💥 _*¡BAM!*_ 👊 _*¡KAMEHAMEHA!*_ 🌀'
    })
  }, 500)
}

// Info del comando >w<
handler.help = ['ping', 'latencia', 'beast', 'poder']
handler.tags = ['info', 'beast', 'diagnóstico']
handler.command = ['ping', 'p', 'latencia', 'beast', 'gohan', 'poder', 'speed']
handler.limit = false
handler.premium = false
handler.register = false

// Alias kawaii
handler.alias = ['p', 'beastping', 'gohanpower', 'saiyanping', 'latency']

export default handler