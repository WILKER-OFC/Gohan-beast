import speed from 'performance-now'
import { spawn, exec, execSync } from 'child_process'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  
  // Mensaje inicial con estilo Beast
  let sentMsg = await conn.reply(m.chat, '🌀 *Cargando poder Saiyan...* ⚡\n🐉 Calculando latencia Beast...', m)
  
  let latency = speed() - timestamp
  
  exec(`neofetch --stdout`, (error, stdout, stderr) => {
    let child = stdout.toString("utf-8")
    let ssd = child.replace(/Memory:/, "💾 *RAM:*").replace(/CPU:/, "⚡ *CPU:*").replace(/Disk:/, "💿 *Disco:*")
    
    // Determinar estado del ping
    let estadoPing = ''
    let emojiPing = ''
    
    if (latency < 100) {
      estadoPing = '⚡ *VELOCIDAD BEAST*'
      emojiPing = '🐉'
    } else if (latency < 500) {
      estadoPing = '🌀 *VELOCIDAD SAIYAN*'
      emojiPing = '💪'
    } else {
      estadoPing = '⚠️ *VELOCIDAD NORMAL*'
      emojiPing = '📶'
    }
    
    let result
`╔═══════════════════════════╗
║   🐉 *GOHAN BEAST PING* ⚡       ║
╠═══════════════════════════╣
║ ${emojiPing} *${estadoPing}*
║ ⏱️ *Tiempo:* ${latency.toFixed(2)}ms
║ 📍 *Latencia:* ${latency.toFixed(4).split(".")[0]}ms
╠═════════════════════════╣
║     ⚙️ *ESTADO DEL DOJO*        ║
╠═════════════════════════╣
${ssd.split('\n').map(line => `║ ${line}`).join('\n').substring(0, 300)}
╠═════════════════════════╣
║ 🌀 *Transformación:* Beast Mode
║ ⚡ *Poder Saiyan:* 100%
║ 💪 *Estado:* Conectado y listo
╚═════════════════════════╝

🔱 *By Wilker | Dragon Ball Z*`
    
    // Enviar resultado con estilo
    conn.sendMessage(m.chat, { 
      text: result, 
      edit: sentMsg.key,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m })
    
    // Reacción de emoji
    conn.sendMessage(m.chat, {
      react: {
        text: '⚡',
        key: m.key
      }
    })
  })
}

// Info del comando con temática Beast
handler.help = ['ping']
handler.tags = ['info', 'beast']
handler.command = ['ping', 'p', 'latencia', 'beastping']
handler.limit = false
handler.premium = false
handler.register = false

export default handler