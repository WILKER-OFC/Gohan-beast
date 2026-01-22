import fs from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

// Categorías con temática Gohan Beast uwu
const tags = {
  Subbots: '🐉 SUBBOTS',
  eco: '⚡ ENERGÍA SAIYAN',
  descargas: '🌀 DESCARGAS',
  tools: '🔧 HERRAMIENTAS',
  owner: '👑 MAESTRO SAIYAN',
  info: 'ℹ️ INFORMACIÓN',
  game: '🎮 ENTRENAMIENTO',
  gacha: '🎲 ECO DEL REY',
  reacciones: '💥 REACCIONES',
  group: '👥 DOJO SAIYAN',
  search: '🔎 BUSCADOR KAME',
  sticker: '📌 STICKERS',
  ia: '🤖 ANDROID 16',
  channel: '📺 KAME HOUSE',
  fun: '😂 DIVERSIÓN SAIYAN',
  beast: '🐉 COMANDOS BEAST'
}

// Menú uwu con diseño Gohan Beast >w<
const defaultMenu = {
  before: `
╔══════════════════╗
║🐉 𝙶𝙾𝙷𝙰𝙽 𝙱𝙴𝙰𝚂𝚃 𝙱𝙾𝚃 🌀  ║
╠══════════════════╣
║ Hola~ soy %botname (◕ᴗ◕✿)
║ *%name*, %greeting jeje
║ 
║ 🐉 *Tipo:* %tipo
║ ⚡ *Nivel Saiyan:* *100%*
║ 📅 *Fecha:* %date
║ ⏱️ *Activo:* %uptime
╠════════════════════╣
║      🌀 𝙲𝙾𝙼𝙰𝙽𝙳𝙾𝚂 𝙶𝙾𝙷𝙰𝙽       
%readmore
`.trimStart(),

  header: '\n╠═ %category ═╣\n',
  body: '║ 🌀 *%cmd* %islimit %isPremium',
  footer: '',
  after: `
╠════════════════╣
║🐉 *Gohan Beast Bot* 
║⚡ Creado por Wilker~ (◕‿◕✿)
║🌀 Base: Dragon Ball Z/Super
║💫 Domina el chat con poder Saiyan!
╚════════════════╝

*¡Que la fuerza Saiyan te acompañe!* 🌀✨
`.trim(),
}

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Datos del usuario uwu
    const { exp, limit, level } = global.db.data.users[m.sender]
    const { min, xp, max } = xpRange(level, global.multiplier)
    const name = await conn.getName(m.sender)

    // Fecha kawaii >w<
    const d = new Date(Date.now() + 3600000)
    const date = d.toLocaleDateString('es', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    })

    // Obtener comandos disponibles
    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : [p.help],
        tags: Array.isArray(p.tags) ? p.tags : [p.tags],
        prefix: 'customPrefix' in p,
        limit: p.limit,
        premium: p.premium,
      }))

    // Nombre del bot siempre "Gohan Beast Bot" uwu
    let nombreBot = 'Gohan Beast Bot'
    // Imagen uwu de Gohan Beast
    let bannerFinal = 'https://iili.io/fgy4Anj.jpg'

    // Intentar leer configuración personalizada
    const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
    const configPath = join('./JadiBots', botActual, 'config.json')
    
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath))
        if (config.name) nombreBot = config.name
        if (config.banner) bannerFinal = config.banner
      } catch (e) {
        console.error('🌀 Error leyendo config:', e)
      }
    }

    const tipo = conn.user.jid === global.conn.user.jid ? '🐉 PRINCIPAL' : '⚡ SUB-SAIYAN'
    const menuConfig = conn.menu || defaultMenu

    // Generar texto del menú uwu
    const _text = [
      menuConfig.before,
      ...Object.keys(tags).map(tag => {
        const cmds = help
          .filter(menu => menu.tags?.includes(tag))
          .map(menu => menu.help.map(h => 
            menuConfig.body
              .replace(/%cmd/g, menu.prefix ? h : `${_p}${h}`)
              .replace(/%islimit/g, menu.limit ? '🔒' : '')
              .replace(/%isPremium/g, menu.premium ? '💎' : '🌀')
          ).join('\n')).join('\n')
        return cmds ? [menuConfig.header.replace(/%category/g, tags[tag]), cmds, menuConfig.footer].join('\n') : ''
      }).filter(Boolean),
      menuConfig.after
    ].join('\n')

    // Reemplazos dinámicos owo
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
      greeting: getUwUGreeting(),
    }

    // Aplicar reemplazos >w<
    const text = _text.replace(
      new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join('|')})`, 'g'),
      (_, name) => String(replace[name])
    )

    // Preparar imagen uwu
    let imageContent
    try {
      imageContent = { image: { url: bannerFinal } }
    } catch {
      // Fallback si la imagen falla
      imageContent = {}
    }

    // Botones kawaii (◕ᴗ◕✿)
    const buttons = [
      { 
        buttonId: '.owner', 
        buttonText: { displayText: '👑 MAESTRO' }, 
        type: 1 
      },
      { 
        buttonId: '.ping', 
        buttonText: { displayText: '⚡ PODER' }, 
        type: 1 
      },
      { 
        buttonId: '.code', 
        buttonText: { displayText: '🐉 SAIYAN' }, 
        type: 1 
      }
    ]

    // Enviar mensaje con menú uwu
    await conn.sendMessage(
      m.chat,
      { 
        ...imageContent, 
        caption: text.trim(), 
        footer: '🌀 *Gohan Beast Bot* - ¡Comandos Dragon Ball!', 
        buttons, 
        headerType: 4, 
        mentionedJid: conn.parseMention(text),
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: '🐉 GOHAŃ BEAST ACTIVADO ⚡',
            body: '¡Menú de comandos Dragon Ball!',
            mediaType: 1,
            thumbnailUrl: bannerFinal,
            sourceUrl: 'https://whatsapp.com/channel/0029Vb724SDHltY4qGU9QS3S'
          }
        }
      },
      { quoted: m }
    )

    // Reacciones uwu
    await m.react('🌀')
    setTimeout(() => m.react('⚡'), 500)
    setTimeout(() => m.react('🐉'), 1000)

  } catch (e) {
    console.error('💥 Error en el menú uwu:', e)
    await conn.reply(m.chat, 
`🌀 *¡Ups! Algo salió mal~* (´•̥̥̥ω•̥̥̥\`)

El menú Saiyan no pudo cargarse...
⚡ *Causa:* Energía insuficiente
🌀 *Solución:* Intenta de nuevo~

*Mientras usa:* ${_p}help simple`, 
      m
    )
  }
}

// Comandos y configuración owo
handler.command = ['menu', 'help', 'menú', 'ayuda', 'comandos', 'beastmenu', 'gohan']
handler.tags = ['beast', 'main', 'menu']
handler.help = ['menu', 'Muestra el menú principal de Gohan Beast Bot']
handler.register = false
handler.limit = false

export default handler

// ============================================
// FUNCIONES AUXILIARES UWU (◕‿◕✿)
// ============================================

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

function getUwUGreeting() {
  const hour = new Date().getHours()
  const greetings = {
    0: 'una noche mágica bajo las estrellas 🌙✨',
    1: 'una noche de sueños Saiyan 💤 🌀',
    2: 'una noche llena de energía Ki 🌌⚡',
    3: 'un amanecer en la Room of Spirit and Time 🌅⏳',
    4: 'un amanecer de meditación Kame 🧘🌀',
    5: 'un amanecer de entrenamiento con King Kai 👑🌅',
    6: 'una mañana de Kamehameha en la playa 🏖️🌀',
    7: 'una mañana en Kame House con tortugas 🏠🐢',
    8: 'una mañana volando en Nimbus ☁️ 🌀',
    9: 'una mañana en el Tenkaichi Budokai 🥋🎯',
    10: 'un día de batalla en el Cell Games ⚔️💥',
    11: 'un día de torneo del Poder 💪🌟',
    12: 'un día soleado en el Planet Namek 🌍☀️',
    13: 'una tarde de entrenamiento con Whis 🥛🌀',
    14: 'una tarde en el Hyperbolic Time Chamber ⏱️✨',
    15: 'una tarde de fusiones en el dojo 🔄🌸',
    16: 'una tarde de transformaciones Saiyan 🌀💫',
    17: 'un atardecer después del Genkidama 🌇⚡',
    18: 'una noche de recuperación en la cápsula 💊🏥',
    19: 'una noche viendo las estrellas Saiyan 🌠🐉',
    20: 'una noche de cuentos del Planeta Vegeta 🪐📖',
    21: 'una noche preparando Semillas Senzu 🌱🍡',
    22: 'una noche protegiendo la Tierra 🌎🛡️',
    23: 'una noche de vigilia Saiyan 🌃🌸',
  }
  return 'Espero que tengas ' + (greetings[hour] || 'un día increíble lleno de poder Saiyan~ 🌸✨')
}

// Función para nivel de poder Saiyan owo
function getSaiyanLevel(level) {
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

// Alias kawaii para el handler
handler.alias = ['menuu', 'ayudame', 'comanditos', 'beasthelp']