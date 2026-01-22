//--> Hecho por Ado-rgb (github.com/Ado-rgb) MODIFICADO MODO GO-HAN BEAST
// •|• No quites créditos..
import fetch from 'node-fetch'

// 🐉 Configuración Modo Gohan Beast
const BEAST_MODE = true
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
}

// 🐉 Logo Gohan Beast
const beastLogo = `
${colors.magenta}╔════════════════════════════════════╗
${colors.magenta}║    🐉 ${colors.cyan}GO-HAN BEAST MODE${colors.magenta} 🐉     ║
${colors.magenta}║    Welcome System ${colors.yellow}v2.0${colors.magenta}       ║
${colors.magenta}╚════════════════════════════════════╝${colors.reset}
`

// 🐉 Log con estilo
function beastLog(message, type = 'info') {
  if (!BEAST_MODE) return
  
  const icons = {
    info: `${colors.blue}🔵${colors.reset}`,
    success: `${colors.green}🟢${colors.reset}`,
    warning: `${colors.yellow}🟡${colors.reset}`,
    error: `${colors.red}🔴${colors.reset}`,
    beast: `${colors.magenta}🐉${colors.reset}`
  }
  
  console.log(`${icons[type]} ${colors.cyan}[BEAST-WELCOME]${colors.reset} ${message}`)
}

// 🐉 Imágenes personalizadas para bienvenidas
const beastImages = {
  welcome: [
    'https://iili.io/f4aSu0G.jpg',
    'https://tmpfiles.org/dl/20856079/1769111024458.jpg',
    'https://tmpfiles.org/dl/20856133/1769111069651.jpg',
  ]
}

// 🐉 Función para obtener imagen aleatoria
function getRandomBeastImage(type = 'welcome') {
  const images = beastImages[type]
  return images[Math.floor(Math.random() * images.length)]
}

// 🐉 Animación de bienvenida beast
const beastWelcomeAnim = [
  "🐉 Cargando energía espiritual...",
  "⚡ Activando modo bestia...",
  "🔥 Preparando bienvenida épica...",
  "✨ ¡BIENVENIDO AL GRUPO!"
]

// 🐉 Mensajes de bienvenida estilo Gohan Beast
const beastWelcomeMessages = [
  `🐉 *¡UN NUEVO GUERRERO SE UNE A LA BATALLA!* 🐉

*¡BIENVENIDO {user}!* ⚡

🏮 *Has entrado en el dojo de:*
📛 *{group}*

👥 *Actualmente somos {total} guerreros*
🌠 *Tu poder se ha sumado al nuestro*

📜 *Reglas del Dojo:*
1️⃣ Respeta a todos los guerreros
2️⃣ Comparte tu energía positiva
3️⃣ No ataques sin razón
4️⃣ Sé leal al grupo

💫 *"El verdadero poder no está en la fuerza, sino en el corazón"*

🎉 *¡Disfruta tu estadía en el dojo!*`,

  `⚡ *¡NUEVA ENERGÍA DETECTADA!* ⚡

*¡HOLA {user}!* 🌟

🏯 *Te damos la bienvenida a:*
📜 *{group}*

👥 *Somos {total} almas en este viaje*
🌌 *Tu presencia fortalece nuestra energía*

🗺️ *Guía del Guerrero:*
✨ Sé respetuoso siempre
✨ Comparte conocimiento
✨ Ayuda a los demás
✨ Disfruta del camino

💥 *"Un guerrero se mide por su corazón, no por su fuerza"*

🎯 *¡Que tu estadía sea épica!*`,

  `🔥 *¡LLEGADA ÉPICA DETECTADA!* 🔥

*¡SALUDOS {user}!* 💫

🎪 *Bienvenido al clan:*
🏷️ *{group}*

👥 *{total} miembros unidos en espíritu*
🌄 *Tu llegada marca un nuevo amanecer*

⚔️ *Código del Clan:*
• Honra a tus compañeros
• Comparte tu sabiduría
• Protege la armonía
• Crece con nosotros

🌠 *"El viaje de mil millas comienza con un paso"*

🏹 *¡Que tu aventura sea legendaria!*`
]

// 🐉 Mensajes de despedida estilo Gohan Beast
const beastGoodbyeMessages = [
  `🌅 *¡PARTIDA DE UN GUERRERO!* 🌅

*Adiós {user}...* 🐉

🏮 *Has abandonado el dojo:*
📛 *{group}*

👥 *Quedamos {remaining} guerreros*
🍂 *Tu energía se ha ido, pero tu recuerdo queda*

💭 *"Hasta que nuestros caminos se vuelvan a cruzar"*

🌌 *Que los vientos te sean favorables en tu nuevo viaje*`,

  `🌙 *¡ADIÓS, VIAJERO!* 🌙

*Hasta luego {user}* ⭐

🏯 *Has dejado el clan:*
📜 *{group}*

👥 *Ahora somos {remaining} almas*
🌊 *Tu ausencia deja un vacío*

🕊️ *"Los buenos amigos nunca se despiden, solo hacen pausas en el camino"*

🌠 *Que encuentres lo que buscas en tu nueva aventura*`,

  `🍃 *¡VIAJE CONTINUO!* 🍃

*Nos vemos {user}* 💨

🎪 *Has partido del grupo:*
🏷️ *{group}*

👥 *Quedamos {remaining} compañeros*
🌅 *El sol se pone, pero mañana amanecerá*

🌉 *"No es adiós, es hasta luego"*

🎐 *Que tu camino esté lleno de nuevas experiencias*`
]

// 🐉 Handler principal
const handler = async (m, { conn, command, args, isAdmin, isOwner }) => {
  if (!m.isGroup) return m.reply('🔒 *Esta función solo funciona en grupos.*')

  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]
  const type = (args[0] || '').toLowerCase()
  const enable = command === 'on'

  if (!['welcome'].includes(type)) {
    return m.reply(`🐉 *MODO GO-HAN BEAST - BIENVENIDAS* 🐉

${colors.green}Comandos disponibles:${colors.reset}
${colors.cyan}.on welcome${colors.reset} - Activa bienvenidas épicas
${colors.cyan}.off welcome${colors.reset} - Desactiva bienvenidas

${colors.yellow}Ejemplo:${colors.reset}
${colors.white}.on welcome${colors.reset}`)
  }

  if (!isAdmin && !isOwner) {
    return m.reply(`❌ *SOLO ADMINISTRADORES* ❌

${colors.red}Necesitas ser admin para modificar esta función.${colors.reset}`)
  }

  if (type === 'welcome') {
    chat.welcome = enable
    
    // Mostrar animación de activación
    if (BEAST_MODE && enable) {
      beastLog('Activando sistema de bienvenidas...', 'beast')
      for (let i = 0; i < beastWelcomeAnim.length; i++) {
        process.stdout.write(`\r${colors.magenta}${beastWelcomeAnim[i]}${colors.reset}`)
        await new Promise(resolve => setTimeout(resolve, 300))
      }
      console.log('\n')
    }
    
    const status = enable ? 'activado' : 'desactivado'
    const emoji = enable ? '🐉' : '💤'
    
    return m.reply(`${emoji} *SISTEMA DE BIENVENIDAS ${status.toUpperCase()}* ${emoji}

${colors.green}El sistema de bienvenidas/despedidas ha sido ${status}.${colors.reset}

${colors.yellow}Configuración:${colors.reset}
• Bienvenidas personalizadas ${enable ? '✅' : '❌'}
• Imágenes aleatorias ${enable ? '✅' : '❌'}
• Mensajes épicos ${enable ? '✅' : '❌'}
• Efectos especiales ${enable ? '✅' : '❌'}`)
  }
}

// 🐉 Eventos antes de los mensajes (bienvenidas/despedidas)
handler.before = async (m, { conn }) => {
  if (!m.isGroup) return
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
  const chat = global.db.data.chats[m.chat]

  // 🐉 Sistema de bienvenidas
  if (chat.welcome && [27, 28, 32].includes(m.messageStubType)) {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupSize = groupMetadata.participants.length
    const userId = m.messageStubParameters?.[0] || m.sender
    const userTag = `@${userId.split('@')[0]}`
    
    let profilePic
    try {
      profilePic = await conn.profilePictureUrl(userId, 'image')
    } catch {
      profilePic = getRandomBeastImage('welcome')
    }

    // 🐉 BIENVENIDA (nuevo miembro)
    if (m.messageStubType === 27) {
      beastLog(`Nuevo miembro detectado: ${userTag}`, 'info')
      
      // Seleccionar mensaje aleatorio
      const welcomeMsg = beastWelcomeMessages[Math.floor(Math.random() * beastWelcomeMessages.length)]
        .replace(/{user}/g, userTag)
        .replace(/{group}/g, groupMetadata.subject)
        .replace(/{total}/g, groupSize)
      
      // Animación en consola
      if (BEAST_MODE) {
        console.log(beastLogo)
        beastLog(`Enviando bienvenida épica a ${userTag}...`, 'beast')
      }
      
      // Enviar bienvenida con imagen
      await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: welcomeMsg,
        mentions: [userId],
        contextInfo: {
          externalAdReply: {
            title: `🐉 ¡BIENVENIDO ${userTag}!`,
            body: 'Sistema de bienvenidas Gohan Beast',
            thumbnail: await conn.getFile(profilePic).catch(() => null),
            mediaType: 1,
            sourceUrl: 'https://github.com/Ado-rgb'
          }
        }
      })
      
      // 🎉 Reacción especial
      try {
        await conn.sendMessage(m.chat, {
          react: {
            text: '🐉',
            key: m.key
          }
        })
      } catch {}
    }

    // 🐉 DESPEDIDA (miembro sale o es eliminado)
    if (m.messageStubType === 28 || m.messageStubType === 32) {
      beastLog(`Miembro sale del grupo: ${userTag}`, 'warning')
      
      const remainingMembers = groupSize - 1
      const goodbyeMsg = beastGoodbyeMessages[Math.floor(Math.random() * beastGoodbyeMessages.length)]
        .replace(/{user}/g, userTag)
        .replace(/{group}/g, groupMetadata.subject)
        .replace(/{remaining}/g, remainingMembers)
      
      // Enviar despedida
      await conn.sendMessage(m.chat, {
        image: { url: getRandomBeastImage('goodbye') },
        caption: goodbyeMsg,
        mentions: [userId]
      })
      
      // 🌙 Reacción de despedida
      try {
        await conn.sendMessage(m.chat, {
          react: {
            text: '🌙',
            key: m.key
          }
        })
      } catch {}
    }
  }
}

// 🐉 Configuración del handler
handler.command = ['on', 'off']
handler.group = true
handler.register = false
handler.tags = ['group', 'welcome', 'beast']
handler.help = [' no welcome', 'off welcome'

export default handler