import { delay } from "@whiskeysockets/baileys"

let handler = async (m, { conn, text, args, isAdmin, isBotAdmin }) => {
  // 🐉 Verificar que es grupo
  if (!m.isGroup) {
    await conn.sendMessage(m.chat, { 
      text: '🐉 *Solo en grupos*\nEste poder solo funciona en dojos (grupos).'
    })
    return
  }

  // 🐉 Verificar que es admin
  if (!isAdmin) {
    await conn.sendMessage(m.chat, { 
      text: '❌ *Poder insuficiente*\nSolo los maestros (admins) pueden cerrar el dojo.'
    })
    return
  }

  // 🐉 Verificar que el bot es admin
  if (!isBotAdmin) {
    await conn.sendMessage(m.chat, { 
      text: '⚠️ *Sin poder*\nNecesito ser maestro (admin) para cerrar.'
    })
    return
  }

  // 🐉 Verificar tiempo
  if (!args[0]) {
    await conn.sendMessage(m.chat, { 
      text: '🐉 *Uso:*\n.cerrar 10 segundos\n.cerrar 5 minutos\n.cerrar 1 hora'
    })
    return
  }

  let tiempoTexto = text.toLowerCase()
  let tiempoMs
  let unidad = ''

  // 🐉 Parsear tiempo
  if (tiempoTexto.includes("segundo")) {
    let segundos = parseInt(args[0])
    if (isNaN(segundos) || segundos <= 0) {
      await conn.sendMessage(m.chat, { text: '❌ *Segundos inválidos*' })
      return
    }
    tiempoMs = segundos * 1000
    unidad = segundos === 1 ? 'segundo' : 'segundos'
  } 
  else if (tiempoTexto.includes("minuto")) {
    let minutos = parseInt(args[0])
    if (isNaN(minutos) || minutos <= 0) {
      await conn.sendMessage(m.chat, { text: '❌ *Minutos inválidos*' })
      return
    }
    tiempoMs = minutos * 60 * 1000
    unidad = minutos === 1 ? 'minuto' : 'minutos'
  } 
  else if (tiempoTexto.includes("hora")) {
    let horas = parseInt(args[0])
    if (isNaN(horas) || horas <= 0) {
      await conn.sendMessage(m.chat, { text: '❌ *Horas inválidas*' })
      return
    }
    tiempoMs = horas * 60 * 60 * 1000
    unidad = horas === 1 ? 'hora' : 'horas'
  } 
  else {
    await conn.sendMessage(m.chat, { 
      text: '❓ *Especifica tiempo*\nsegundos / minutos / horas'
    })
    return
  }

  try {
    // 🐉 Reacciones iniciales
    await m.react('🔒')
    await m.react('🐉')

    // 🐉 Cerrar grupo
    await conn.groupSettingUpdate(m.chat, 'announcement')
    
    // 🐉 Mensaje de cierre
    await conn.sendMessage(m.chat, {
      text: `🐉 *DOJO CERRADO*\n\nCerrado por ${args[0]} ${unidad}\n\n⚡ Se abrirá automáticamente...`
    })

    // 🐉 Esperar tiempo
    await conn.sendMessage(m.chat, {
      text: `⏳ *Esperando ${args[0]} ${unidad}...*`
    })

    await delay(tiempoMs)

    // 🐉 Abrir grupo
    await conn.groupSettingUpdate(m.chat, 'not_announcement')
    
    // 🐉 Mensaje de apertura
    await m.react('✅')
    await conn.sendMessage(m.chat, { 
      text: `✅ *DOJO ABIERTO*\n\nEl dojo está disponible nuevamente.`
    })

  } catch (error) {
    console.error('Error en cerrar grupo:', error)
    await m.react('❌')
    await conn.sendMessage(m.chat, { 
      text: '❌ *Error*\nNo pude cerrar/abrir el grupo.'
    })
  }
}


handler.help = ['cerrar <tiempo> segundos/minutos/horas']
handler.tags = ['grupo']
handler.command = /^cerrar$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler