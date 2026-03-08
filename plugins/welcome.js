
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

// 🐉 Imágenes personalizadas para bienvenidas - USANDO TUS FOTOS
const beastImages = {
  welcome: [
    'https://iili.io/f4aSu0G.jpg',  // Tu foto 1
    'https://iili.io/f4agftI.jpg',  // Tu foto 2
    'https://iili.io/f4aSu0G.jpg',  // Duplicado para más frecuencia
    'https://iili.io/f4agftI.jpg',  // Duplicado para más frecuencia
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71',
    'https://images.unsplash.com/photo-1579546929662-711aa81148cf'
  ],
  goodbye: [
    'https://iili.io/f4aSu0G.jpg',  // Tu foto 1
    'https://iili.io/f4agftI.jpg',  // Tu foto 2
    'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
    'https://images.unsplash.com/photo-1502691876148-a84978e59af8',
    'https://images.unsplash.com/photo-1492684223066-dd23140edf6d'
  ]
}

// 🐉 Función para obtener imagen aleatoria - CON PREFERENCIA POR TUS FOTOS
function getRandomBeastImage(type = 'welcome') {
  const images = beastImages[type]
  // Dar más probabilidad a tus fotos (primeras 4 posiciones en welcome, primeras 2 en goodbye)
  const random = Math.random()
  
  if (type === 'welcome') {
    // 70% de probabilidad para tus fotos (primeras 4 son tuyas)
    if (random < 0.7) {
      // Seleccionar de las primeras 4 (tus fotos duplicadas)
      return images[Math.floor(Math.random() * 4)]
    } else {
      // 30% para las otras fotos
      return images[4 + Math.floor(Math.random() * (images.length - 4))]
    }
  } else {
    // 60% de probabilidad para tus fotos en despedidas (primeras 2 son tuyas)
    if (random < 0.6) {
      return images[Math.floor(Math.random() * 2)]
    } else {
      return images[2 + Math.floor(Math.random() * (images.length - 2))]
    }
  }
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

// 🐉 Función para verificar si la imagen existe
async function verifyImageUrl(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

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
      beastLog('Usando imágenes personalizadas Gohan Beast', 'info')
      beastLog(`Foto 1: https://iili.io/f4aSu0G.jpg`, 'info')
      beastLog(`Foto 2: https://iili.io/f4agftI.jpg`, 'info')
      
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

${colors.yellow}✨ CONFIGURACIÓN ESPECIAL:${colors.reset}
• Bienvenidas personalizadas ${enable ? '✅' : '❌'}
• Imágenes Gohan Beast ${enable ? '✅' : '❌'}
• Mensajes épicos ${enable ? '✅' : '❌'}
• Efectos especiales ${enable ? '✅' : '❌'}

${colors.cyan}🎯 IMÁGENES ACTIVAS:${colors.reset}
1. https://iili.io/f4aSu0G.jpg
2. https://iili.io/f4agftI.jpg`)
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
    let imageType = 'beast'
    
    try {
      // Intentar obtener foto de perfil del usuario
      profilePic = await conn.profilePictureUrl(userId, 'image')
      imageType = 'profile'
    } catch {
      // Si no tiene foto de perfil, usar una imagen beast aleatoria
      profilePic = getRandomBeastImage(m.messageStubType === 27 ? 'welcome' : 'goodbye')
      imageType = 'beast'
      
      // Verificar si la imagen existe
      const imageExists = await verifyImageUrl(profilePic)
      if (!imageExists) {
        // Si no existe, usar la primera imagen por defecto
        profilePic = 'https://iili.io/f4aSu0G.jpg'
      }
    }

    // 🐉 BIENVENIDA (nuevo miembro)
    if (m.messageStubType === 27) {
      beastLog(`Nuevo miembro detectado: ${userTag}`, 'info')
      beastLog(`Usando imagen: ${imageType === 'beast' ? 'Gohan Beast' : 'Foto de perfil'}`, 'info')
      
      // Seleccionar mensaje aleatorio
      const welcomeMsg = beastWelcomeMessages[Math.floor(Math.random() * beastWelcomeMessages.length)]
        .replace(/{user}/g, userTag)
        .replace(/{group}/g, groupMetadata.subject)
        .replace(/{total}/g, groupSize)
      
      // Animación en consola
      if (BEAST_MODE) {
        console.log(beastLogo)
        beastLog(`Enviando bienvenida épica a ${userTag}...`, 'beast')
        
        // Mostrar qué imagen se está usando
        if (imageType === 'beast') {
          beastLog(`Imagen Gohan Beast seleccionada: ${profilePic.includes('f4aSu0G') ? 'Foto 1' : 'Foto 2'}`, 'success')
        }
      }
      
      try {
        // Enviar bienvenida con imagen
        await conn.sendMessage(m.chat, {
          image: { url: profilePic },
          caption: welcomeMsg,
          mentions: [userId],
          contextInfo: {
            externalAdReply: {
              title: `🐉 ¡BIENVENIDO ${userTag}!`,
              body: imageType === 'beast' ? 'Imagen Gohan Beast' : 'Foto de perfil',
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
        
        beastLog(`Bienvenida enviada exitosamente a ${userTag}`, 'success')
        
      } catch (error) {
        beastLog(`Error al enviar bienvenida: ${error.message}`, 'error')
        // Intentar con imagen por defecto
        try {
          await conn.sendMessage(m.chat, {
            image: { url: 'https://iili.io/f4aSu0G.jpg' },
            caption: welcomeMsg,
            mentions: [userId]
          })
        } catch {}
      }
    }

    // 🐉 DESPEDIDA (miembro sale o es eliminado)
    if (m.messageStubType === 28 || m.messageStubType === 32) {
      beastLog(`Miembro sale del grupo: ${userTag}`, 'warning')
      
      const remainingMembers = groupSize - 1
      const goodbyeMsg = beastGoodbyeMessages[Math.floor(Math.random() * beastGoodbyeMessages.length)]
        .replace(/{user}/g, userTag)
        .replace(/{group}/g, groupMetadata.subject)
        .replace(/{remaining}/g, remainingMembers)
      
      try {
        // Usar imagen beast para despedida
        const goodbyeImage = getRandomBeastImage('goodbye')
        
        if (BEAST_MODE) {
          beastLog(`Usando imagen de despedida: ${goodbyeImage.includes('f4aSu0G') ? 'Foto 1' : 'Foto 2'}`, 'info')
        }
        
        // Enviar despedida
        await conn.sendMessage(m.chat, {
          image: { url: goodbyeImage },
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
        
        beastLog(`Despedida enviada exitosamente para ${userTag}`, 'success')
        
      } catch (error) {
        beastLog(`Error al enviar despedida: ${error.message}`, 'error')
        // Intentar con imagen por defecto
        try {
          await conn.sendMessage(m.chat, {
            text: goodbyeMsg,
            mentions: [userId]
          })
        } catch {}
      }
    }
  }
}

// 🐉 Configuración del handler
handler.command = ['enable', 'disable']
handler.group = true
handler.register = false
handler.tags = ['group', 'welcome', 'beast']
handler.help = [
  'enable welcome', 'disable welcome']

export default handler