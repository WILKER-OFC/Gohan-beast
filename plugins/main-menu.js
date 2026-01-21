import fs from 'fs'
import { join } from 'path'

const handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // Obtener nombre del usuario
    const name = await conn.getName(m.sender)
    
    // Fecha actual
    const d = new Date(Date.now() + 3600000)
    const date = d.toLocaleDateString('es', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })

    // Configuración del banner
    let bannerFinal = 'https://d.uguu.se/FLmbfoqM.jpeg'

    // Intentar leer configuración personalizada
    try {
      const botActual = conn.user?.jid?.split('@')[0].replace(/\D/g, '')
      const configPath = join('./JadiBots', botActual, 'config.json')
      
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        if (config.banner) bannerFinal = config.banner
      }
    } catch (e) {
      console.log('⚠️ No se pudo leer config.json, usando valores por defecto')
    }

    // Texto del menú simplificado
    const menuText = `⚡️ *GOHAŃ BEAST BOT* ⚡️
Hola, soy *Gohan Beast Bot*
*${name}*, Espero que tengas un buen día

📢 *CANAL:* https://whatsapp.com/channel/0029Vb724SDHltY4qGU9QS3S

> 📅 Fecha = *${date}*
> ⏱ Actividad = *${clockString(process.uptime() * 1000)}*

*Escribe* ${_p}*allmenu* *para ver todos los comandos disponibles*

⚡️ *Gohan Beast Bot* - Creado por WILKER OFC.`

    // Preparar imagen
    const imageContent = { image: { url: bannerFinal } }

    // Botones
    const buttons = [
      { buttonId: `${_p}owner`, buttonText: { displayText: '👑 Propietario' }, type: 1 },
      { buttonId: `${_p}allmenu`, buttonText: { displayText: '📋 Lista de Comandos' }, type: 1 },
      { buttonId: `${_p}code`, buttonText: { displayText: '🐦‍🔥 Ser SubBot' }, type: 1 }
    ]

    // Enviar mensaje
    await conn.sendMessage(
      m.chat,
      { 
        ...imageContent, 
        caption: menuText.trim(), 
        footer: '⚡️ Gohan Beast Bot - Menú principal',
        buttons, 
        headerType: 1
      },
      { quoted: m }
    )

  } catch (error) {
    console.error('❌ Error en el menú:', error)
    
    // Mensaje de error simple
    let errorMessage = '❎ Lo sentimos, el menú tiene un error.\n'
    errorMessage += `Error: ${error.message || 'Desconocido'}`
    
    await conn.reply(m.chat, errorMessage, m)
  }
}

handler.command = ['menu', 'help', 'menú', 'ayuda']
handler.register = false

// Función para formato de tiempo
function clockString(ms) {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor(ms / 60000) % 60
  const s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}

export default handler