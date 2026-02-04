import { participants } from '@whiskeysockets/baileys'

const handler = async (m, { conn, args, usedPrefix, command, sender, isAdmin, isBotAdmin }) => {
  // Números del owner (con formato internacional completo)
  const owners = [
    '584125877491@s.whatsapp.net',    // Venezuela
    '5492644893953@s.whatsapp.net',   // Argentina
    '5492644138998@s.whatsapp.net'    // Argentina
  ]
  
  // Verificar si es owner
  const isOwner = owners.includes(sender)
  
  if (!isOwner) {
    return m.reply('❌ Este comando solo está disponible para el dueño del bot.')
  }
  
  // Verificar que sea un grupo
  if (!m.isGroup) {
    return m.reply('❌ Este comando solo funciona en grupos.')
  }
  
  // Verificar que el bot sea admin
  if (!isBotAdmin) {
    return m.reply('❌ El bot necesita ser administrador para usar este comando.')
  }
  
  // Obtener información del grupo
  let groupMetadata
  try {
    groupMetadata = await conn.groupMetadata(m.chat)
  } catch (error) {
    return m.reply('❌ Error al obtener información del grupo.')
  }
  
  // Buscar al owner en los participantes
  const ownerParticipant = groupMetadata.participants.find(p => p.id === sender)
  
  if (!ownerParticipant) {
    return m.reply('❌ No estás en este grupo o hubo un error al localizarte.')
  }
  
  // Verificar si ya es admin
  const isAlreadyAdmin = ownerParticipant.admin === 'superadmin' || ownerParticipant.admin === 'admin'
  
  if (isAlreadyAdmin) {
    // Opcional: Mensaje de que ya es admin
    const response = await m.reply(`✅ *Ya eres administrador en este grupo*\n\n` +
      `👑 *Owner:* @${sender.split('@')[0]}\n` +
      `📌 *Grupo:* ${groupMetadata.subject}\n` +
      `🎭 *Rol:* ${ownerParticipant.admin === 'superadmin' ? 'Super Admin' : 'Admin'}\n\n` +
      `_No se requieren cambios._`, null, {
      mentions: [sender]
    })
    
    // Reacción
    await conn.sendMessage(m.chat, {
      react: { text: '👑', key: response.key }
    })
    return
  }
  
  try {
    // 1. Primero intentamos con el método estándar
    await conn.groupParticipantsUpdate(m.chat, [sender], 'promote')
    
    // Pequeña pausa para verificar
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 2. Verificar si funcionó
    const updatedMetadata = await conn.groupMetadata(m.chat)
    const updatedParticipant = updatedMetadata.participants.find(p => p.id === sender)
    const isNowAdmin = updatedParticipant && (updatedParticipant.admin === 'superadmin' || updatedParticipant.admin === 'admin')
    
    if (!isNowAdmin) {
      // 3. Intentar método alternativo si el primero falló
      try {
        // Forzar la promoción con diferentes métodos
        await conn.groupAdminUpdate(m.chat, [sender], 'add')
      } catch (innerError) {
        console.error('Error en método alternativo:', innerError)
      }
    }
    
    // Mensaje de éxito
    const response = await m.reply(`✅ *¡Administrador asignado con éxito!*\n\n` +
      `👑 *Owner:* @${sender.split('@')[0]}\n` +
      `📌 *Grupo:* ${groupMetadata.subject}\n` +
      `👥 *Miembros:* ${updatedMetadata?.participants?.length || groupMetadata.participants.length}\n` +
      `🤖 *Bot:* ${conn.user.name}\n\n` +
      `_El bot te ha otorgado permisos de administrador automáticamente._`, null, {
      mentions: [sender]
    })
    
    // Reacciones y efectos
    await conn.sendMessage(m.chat, {
      react: { text: '👑', key: response.key }
    })
    
    // Notificación en la consola
    console.log(`📢 [AUTOADMIN] Activado para ${sender} en grupo: "${groupMetadata.subject}"`)
    
    // Enviar mensaje al privado del owner (opcional)
    try {
      await conn.sendMessage(sender, {
        text: `👑 *AutoAdmin Activado*\n\n` +
          `✅ Se te ha dado admin en el grupo:\n` +
          `📌 *Nombre:* ${groupMetadata.subject}\n` +
          `👥 *Miembros:* ${groupMetadata.participants.length}\n` +
          `🕒 *Hora:* ${new Date().toLocaleString()}\n\n` +
          `_Comando ejecutado desde el mismo grupo._`
      })
    } catch (dmError) {
      console.log('No se pudo enviar DM al owner:', dmError.message)
    }
    
  } catch (error) {
    console.error('Error en autoadmin:', error)
    
    // Mensaje de error detallado
    let errorMessage = '❌ *Error al asignar administrador*\n\n'
    
    if (error.message.includes('not authorized')) {
      errorMessage += '_El bot no tiene permisos suficientes para hacerte admin._\n'
      errorMessage += '_Asegúrate de que el bot sea administrador con todos los permisos._'
    } else if (error.message.includes('401')) {
      errorMessage += '_Error de autenticación del bot._\n'
      errorMessage += '_Verifica la sesión del bot._'
    } else {
      errorMessage += `_Error técnico: ${error.message}_`
    }
    
    await m.reply(errorMessage)
    
    // Reacción de error
    await conn.sendMessage(m.chat, {
      react: { text: '❌', key: m.key }
    })
  }
}

// Comando adicional para quitar admin (opcional)
handler.autoadminremove = async (m, { conn, sender, isBotAdmin }) => {
  const owners = [
    '584125877491@s.whatsapp.net',
    '5492644893953@s.whatsapp.net',
    '5492644138998@s.whatsapp.net'
  ]
  
  if (!owners.includes(sender)) return
  
  if (!m.isGroup || !isBotAdmin) return
  
  try {
    await conn.groupParticipantsUpdate(m.chat, [sender], 'demote')
    
    const response = await m.reply(`🔻 *Permisos de admin removidos*\n\n` +
      `_El bot te ha quitado los permisos de administrador._`, null, {
      mentions: [sender]
    })
    
    await conn.sendMessage(m.chat, {
      react: { text: '🔻', key: response.key }
    })
    
  } catch (error) {
    console.error('Error al remover admin:', error)
    await m.reply('❌ Error al remover permisos de administrador.')
  }
}

// Configuración del handler
handler.help = ['autoadmin']
handler.tags = ['owner', 'group']
handler.command = /^(autoadmin|auto-admin|autoowner|selfadmin)$/i

// Comando para remover admin
handler.command2 = /^(removeadmin|autoadminremove|quitadmin)$/i

// Propiedades del handler
handler.group = true
handler.botAdmin = true
handler.admin = false
handler.owner = true
handler.private = false

export default handler