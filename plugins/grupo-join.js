import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    if (command === 'join') {
      const link = args[0];
      
      // Reacción de espera
      await m.react('🕒');
      
      if (!link) {
        await conn.reply(m.chat, 
          `🤖 *BOT DE WHATSAPP*\n\n` +
          `✨ Para añadir el bot a tu grupo, sigue estos pasos:\n\n` +
          `1. Añade al bot como administrador del grupo\n` +
          `2. Copia el enlace de invitación del grupo\n` +
          `3. Envía: *${usedPrefix}join <enlace>*\n\n` +
          `📌 *Ejemplo:*\n${usedPrefix}join https://chat.whatsapp.com/ABC123DEF456\n\n` +
          `⚠️ *Importante:* El bot necesita permisos de administrador para funcionar correctamente.`,
          m
        );
        await m.react('ℹ️');
        return;
      }
      
      if (!link.includes('chat.whatsapp.com')) {
        await conn.reply(m.chat, '❌ Enlace inválido. Debe ser un enlace de invitación de WhatsApp.', m);
        await m.react('❌');
        return;
      }

      await conn.reply(m.chat, '🔄 *Uniendo al grupo...*', m);
      
      const code = link.split('/').pop();
      
      try {
        await conn.groupAcceptInvite(code);
        await conn.reply(m.chat, 
          '✅ *¡Bot unido al grupo exitosamente!*\n\n' +
          '📋 *Comandos disponibles:*\n' +
          `• ${usedPrefix}menu - Ver todos los comandos\n` +
          `• ${usedPrefix}help - Ayuda del bot\n` +
          `• ${usedPrefix}info - Información del bot\n\n` +
          '⚙️ *Recomendación:* Dale permisos de administrador al bot para mejor funcionamiento.',
          m
        );
        await m.react('✅');
      } catch (err) {
        console.error(err);
        
        let errorMsg = '❌ Error al unirse al grupo. Posibles causas:\n\n';
        
        if (err.message.includes('invite')) {
          errorMsg += '• El enlace ha expirado\n';
          errorMsg += '• El enlace es inválido\n';
          errorMsg += '• El grupo está lleno\n';
        } else if (err.message.includes('limit')) {
          errorMsg += '• El bot ha alcanzado el límite de grupos\n';
        } else if (err.message.includes('already')) {
          errorMsg += '• El bot ya está en este grupo\n';
        } else {
          errorMsg += `• ${err.message || 'Error desconocido'}\n`;
        }
        
        errorMsg += '\n🔄 *Solución:*\n';
        errorMsg += '1. Verifica que el enlace sea válido\n';
        errorMsg += '2. Asegúrate de que el grupo no esté lleno\n';
        errorMsg += '3. Genera un nuevo enlace de invitación\n';
        errorMsg += '4. Verifica si el bot ya está en el grupo\n';
        
        await conn.reply(m.chat, errorMsg, m);
        await m.react('❌');
      }
    }
  } catch (error) {
    console.error('Error en comando join:', error);
    await conn.reply(m.chat, '❌ Ocurrió un error inesperado. Intenta nuevamente.', m);
    await m.react('⚠️');
  }
};

handler.command = ['join', 'unirse', 'entrar', 'add', 'añadir'];
handler.help = ['join <enlace> - Unir bot a tu grupo'];
handler.tags = ['grupo'];
handler.group = false;

export default handler;