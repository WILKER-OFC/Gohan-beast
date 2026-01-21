import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

const tags = {
  serbot: '🫟 SUBBOTS',
  eco: '💸 ECONOMÍA',
  downloader: '⬇️ DESCARGAS',
  tools: '🛠️ HERRAMIENTAS',
  owner: '👑 PROPIETARIO',
  info: 'ℹ️ INFORMACIÓN',
  game: '🎮 JUEGOS',
  gacha: '🎲 GACHA ANIME',
  reacciones: '💕 ANIME REACCIONES',
  group: '👥 GRUPOS',
  search: '🔎 BUSCADORES',
  sticker: '📌 STICKERS',
  ia: '🤖 IA',
  channel: '📺 CANALES',
  fun: '😂 DIVERSIÓN',
}

const defaultMenu = {
  before: `
⚡ *GOHAN BEAST BOT* ⚡
*( %tipo )*

👋 *Hola, %name!*
${'%greeting'}

🪪 *INFORMACIÓN:*
📅 Fecha: *%date*
⏱️ Actividad: *%uptime*
📊 Nivel: *%level*
🎯 Exp: *%exp/%maxexp*
💎 Limite: *%limit*

%readmore
`.trimStart(),

  header: '\n╭───「 *%category* 」',
  body: '│ ✦ %cmd %islimit %isPremium',
  footer: '╰─────────────',
  after: '\n\n*⚡ Creado por WILKER OFC. ⚡*',
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const { exp, limit, level } = global.db.data.users[m.sender]
    const { min, xp, max } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    const d = new Date(Date.now() + 3600000)
    const date = d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })

    // Obtener comandos disponibles
    let help = []
    for (let plugin of Object.values(global.plugins)) {
      if (!plugin || plugin.disabled) continue
      
      if (typeof plugin.help === 'string') {
        plugin.help = [plugin.help]
      }
      
      if (typeof plugin.tags === 'string') {
        plugin.tags = [plugin.tags]
      }
      
      help.push({
        help: plugin.help || [],
        tags: plugin.tags || [],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
      })
    }

    // Configuración fija para Gohan Beast Bot
    let nombreBot = 'Gohan Beast Bot'
    let bannerFinal = 'https://d.uguu.se/FLmbfoqM.jpeg'

    const tipo = conn.user.jid === global.conn.user.jid ? '🆅 Principal' : '🅱 SubBot'
    const menuConfig = conn.menu || defaultMenu

    // Construir el texto del menú
    let text = menuConfig.before
    
    // Agregar categorías con comandos
    for (let tag of Object.keys(tags)) {
      let categoryCommands = []
      
      for (let menu of help) {
        if (menu.tags && menu.tags.includes(tag) && menu.help && menu.help.length > 0) {
          for (let helpText of menu.help) {
            let cmd = menu.prefix ? helpText : _p + helpText
            let limitText = menu.limit ? ' 🔸' : ''
            let premiumText = menu.premium ? ' 💎' : ''
            
            categoryCommands.push(
              menuConfig.body
                .replace('%cmd', cmd)
                .replace('%islimit', limitText)
                .replace('%isPremium', premiumText)
            )
          }
        }
      }
      
      if (categoryCommands.length > 0) {
        text += '\n' + menuConfig.header.replace('%category', tags[tag])
        text += '\n' + categoryCommands.join('\n')
        text += '\n' + menuConfig.footer
      }
    }
    
    text += menuConfig.after

    // Reemplazar variables
    const replacements = {
      '%': '%',
      p: _p,
      botname: nombreBot,
      taguser: '@' + m.sender.split('@')[0],
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      level: level,
      limit: limit,
      name: name,
      date: date,
      uptime: clockString(process.uptime() * 1000),
      tipo: tipo,
      readmore: readMore,
      greeting: greeting,
    }

    // Aplicar reemplazos
    for (let [key, value] of Object.entries(replacements)) {
      text = text.split(`%${key}`).join(value)
    }

    // Enviar menú con imagen
    await conn.sendMessage(
      m.chat,
      { 
        image: { url: bannerFinal }, 
        caption: text.trim(), 
        footer: '⚡ Gohan Beast Bot - Menu de Comandos ⚡', 
        headerType: 4 
      },
      { quoted: m }
    )
    
  } catch (e) {
    console.error('❌ Error en el menú:', e)
    // Mensaje de error más informativo
    await conn.reply(m.chat, `❌ Error en el menú:\n${e.message}\n\nIntenta reiniciar el bot o contacta al owner.`, m)
  }
}

handler.command = ['menu', 'help', 'hélp', 'menú', 'ayuda']
handler.register = false
export default handler

// Utilidades
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

const hour = new Date().getHours()
const greetingMap = {
  0: 'una linda noche 🌙', 1: 'una linda noche 💤', 2: 'una linda noche 🦉',
  3: 'una linda mañana ✨', 4: 'una linda mañana 💫', 5: 'una linda mañana 🌅',
  6: 'una linda mañana 🌄', 7: 'una linda mañana 🌅', 8: 'una linda mañana 💫',
  9: 'una linda mañana ✨', 10: 'un lindo día 🌞', 11: 'un lindo día 🌨',
  12: 'un lindo día ❄', 13: 'un lindo día 🌤', 14: 'una linda tarde 🌇',
  15: 'una linda tarde 🥀', 16: 'una linda tarde 🌹', 17: 'una linda tarde 🌆',
  18: 'una linda noche 🌙', 19: 'una linda noche 🌃', 20: 'una linda noche 🌌',
  21: 'una linda noche 🌃', 22: 'una linda noche 🌙', 23: 'una linda noche 🌃',
}
const greeting = 'Espero que tengas ' + (greetingMap[hour] || 'un buen día')