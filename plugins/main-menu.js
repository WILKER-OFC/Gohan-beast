import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

// Categorías con temática Dragon Ball
const tags = {
  serbot: '🐉 SUB-SAIYANS',
  eco: '⚡ ENERGÍA SAIYAN',
  downloader: '🌀 DESCARGAS Z',
  tools: '🔧 HERRAMIENTAS DOJO',
  owner: '👑 MAESTRO SAIYAN',
  info: 'ℹ️ INFO DRAGON BALL',
  game: '🎮 ENTRENAMIENTO',
  gacha: '🎲 ESFERAS DRAGÓN',
  reacciones: '💥 REACCIONES SAIYAN',
  group: '🚀 main',
  search: '🔎 BUSCADOR KAME',
  sticker: '📌 STICKERS DBZ',
  ia: '🤖 ANDROID 16',
  channel: '📺 CANAL KAME HOUSE',
  fun: '😂 DIVERSIÓN SAIYAN',
  beast: '🐉 COMANDOS BEAST',
}

// Menú con diseño Beast
const defaultMenu = {
  before: `
╔═══════════════════════════════╗
║       🐉 *GOHAN BEAST BOT* ⚡     ║
╠═══════════════════════════════╣
║ 👋 *¡Hola, %name!* %greeting
║ 🆔 *Usuario:* @%taguser
║ 🐉 *Bot:* %botname (%tipo)
║ ⚡ *Poder Saiyan:* Nvl %level
║ 💎 *Energía:* %limit unidades
║ 📅 *Fecha:* %date
║ ⏱️ *Actividad:* %uptime
╠═══════════════════════════════╣
║        🌀 *COMANDOS BEAST*        ║
%readmore
`.trimStart(),

  header: '\n╠═══════════════════════════════╣\n║    %category    ║',
  body: '║ 🌀 *%cmd* %islimit %isPremium',
  footer: '',
  after: `
╠═══════════════════════════════╣
║ 📢 *CANAL DRAGON BALL:*       
║ https://whatsapp.com/channel/0029Vb5pM031CYoMvQi2I02D
║ 
║ 🔱 *Creado por:* Wilker
║ 🐉 *Base:* Dragon Ball Z/Super
║ ⚡ *Versión:* Beast Mode v1.0
╚═══════════════════════════════╝

*¡QUE LA FUERZA SAIYAN TE ACOMPAÑE!* 🐉✨
`.trim(),
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Datos del usuario
    const { exp, limit, level } = global.db.data.users[m.sender]
    const { min, xp, max } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    // Fecha personalizada
    const d = new Date(Date.now() + 3600000)
    const date = d.toLocaleDateString('es', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    })

    // Obtener comandos
    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        limit: p.limit,
        premium: p.premium,
      }))

    // Configuración del bot
    let nombreBot = global.namebot || 'Gohan Beast'
    let bannerFinal = './storage/img/beast-banner.jpg'
    
    // Intentar cargar imagen Beast por defecto
    const beastBannerUrl = 'https://d.uguu.se/FLmbfoqM.jpeg'
    
    // Verificar si hay banner personalizado
    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = join('./JadiBots', botActual, 'config.json')
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath))
        if (config.name) nombreBot = config.name
        if (config.banner) bannerFinal = config.banner
      } catch {}
    }

    // Tipo de bot
    const tipo = conn.user.jid === global.conn.user.jid ? '🐉 BEAST PRINCIPAL' : '⚡ SUB-SAIYAN'
    const menuConfig = conn.menu || defaultMenu

    // Generar texto del menú
    const _text = [
      menuConfig.before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags?.includes(tag))
          .map(menu => menu.help.map(h => 
            menuConfig.body
              .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
              .replace(/%islimit/g, menu.limit ? '🔒' : '')
              .replace(/%isPremium/g, menu.premium ? '💎' : '')
          ).join('\n')).join('\n')
        return cmds ? [menuConfig.header.replace(/%category/g, tags[tag]), cmds, menuConfig.footer].join('\n') : ''
      }).filter(Boolean),
      menuConfig.after
    ].join('\n')

    // Reemplazos dinámicos
    const replace = {
      '%': '%',
      p: _p,
      botname: nombreBot,
      taguser: '@' + m.sender.split('@')[0],
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      level,
      limit,
      name,
      date,
      uptime: clockString(process.uptime() * 1000),
      tipo,
      readmore: readMore,
      greeting: getSaiyanGreeting(),
    }

    // Aplicar reemplazos
    const text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => String(replace[name])
    )

    // Preparar imagen
    let imageContent
    try {
      // Intentar usar la imagen Beast
      imageContent = { image: { url: beastBannerUrl } }
    } catch {
      // Fallback a imagen local
      const defaultBeastImage = join(__dirname, '../storage/img/beast-default.jpg')
      if (fs.existsSync(defaultBeastImage)) {
        imageContent = { image: fs.readFileSync(defaultBeastImage) }
      } else {
        // Sin imagen
        imageContent = {}
      }
    }

    // Botones interactivos
    const buttons = [
      { 
        buttonId: '.code', 
        buttonText: { displayText: '🐉 SER SAIYAN' }, 
        type: 1 
      },
      { 
        buttonId: '.owner', 
        buttonText: { displayText: '👑 MAESTRO' }, 
        type: 1 
      },
      { 
        buttonId: '.ping', 
        buttonText: { displayText: '⚡ PODER' }, 
        type: 1 
      }
    ]

    // Enviar mensaje con menú
    await conn.sendMessage(
      m.chat,
      { 
        ...imageContent, 
        caption: text.trim(), 
        footer: '🌀 Gohan Beast - ¡Domina el chat con poder Saiyan!', 
        buttons, 
        headerType: 4, 
        mentionedJid: conn.parseMention(text),
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: '🐉 GOHAN BEAST ACTIVADO ⚡',
            body: '¡Comandos Dragon Ball Z!',
            mediaType: 1,
            thumbnail: fs.readFileSync(join(__dirname, '../storage/img/beast-thumb.jpg')).toString('base64'),
            sourceUrl: 'https://whatsapp.com/channel/0029Vb5pM031CYoMvQi2I02D'
          }
        }
      },
      { quoted: m }
    )

  } catch (e) {
    console.error('🐉 [ERROR MENÚ BEAST]:', e)
    // Mensaje de error temático
    await conn.reply(m.chat, 
`💥 *ERROR EN EL MENÚ BEAST* ⚡

El menú Saiyan falló en cargarse.
🌀 *Causa posible:* Energía insuficiente
🔧 *Solución:* Intenta nuevamente

*Mientras tanto usa:* ${_p}help simple`, 
      m
    )
  }
}

// Comandos y configuración
handler.command = ['menu', 'help', 'menú', 'ayuda', 'comandos', 'beastmenu', 'gohan']
handler.tags = ['beast', 'main', 'menu']
handler.help = ['menu', 'Muestra el menú principal de Gohan Beast']
handler.register = false
handler.limit = false

export default handler

// ============================================
// FUNCIONES AUXILIARES TEMÁTICAS
// ============================================

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function getSaiyanGreeting() {
  const hour = new Date().getHours()
  const greetings = {
    0: 'una noche llena de energía Ki 🌙',
    1: 'una noche de entrenamiento en gravedad 100x 💫',
    2: 'una noche bajo la luna llena 🐺',
    3: 'un amanecer en la Room of Spirit and Time ⏳',
    4: 'un amanecer de meditación Saiyan 🧘',
    5: 'un amanecer de entrenamiento con King Kai 👑',
    6: 'una mañana de Kamehameha en la playa 🌅',
    7: 'una mañana en Kame House 🏠',
    8: 'una mañana de vuelo en Nimbus ☁️',
    9: 'una mañana en el Tenkaichi Budokai 🥋',
    10: 'un día de batalla en el Cell Games 🎯',
    11: 'un día de torneo del Poder 💪',
    12: 'un día en el Planet Namek 🌍',
    13: 'una tarde de entrenamiento con Whis 🥛',
    14: 'una tarde en el Hyperbolic Time Chamber ⏱️',
    15: 'una tarde de fusiones en el dojo 🔄',
    16: 'una tarde de transformaciones 🌀',
    17: 'un atardecer después del Genkidama 🌇',
    18: 'una noche de recuperación en la cápsula 💊',
    19: 'una noche viendo las estrellas Saiyan 🌠',
    20: 'una noche de cuentos del Planeta Vegeta 🪐',
    21: 'una noche preparando Semillas Senzu 🌱',
    22: 'una noche protegiendo la Tierra 🌎',
    23: 'una noche de vigilia Saiyan 🛡️',
  }
  return 'Espero que tengas ' + (greetings[hour] || 'un gran día lleno de poder Saiyan! 🐉')
}

// Función para nivel de poder Saiyan
function getPowerLevel(level) {
  if (level < 10) return '👶 Saiyan Novato'
  if (level < 30) return '👊 Saiyan Guerrero'
  if (level < 50) return '💪 Super Saiyan'
  if (level < 80) return '🔥 Super Saiyan 2'
  if (level < 100) return '⚡ Super Saiyan 3'
  if (level < 150) return '🌀 Super Saiyan God'
  if (level < 200) return '💥 Super Saiyan Blue'
  if (level < 300) return '🐉 Ultra Instinct'
  return '👑 Gohan Beast'
}