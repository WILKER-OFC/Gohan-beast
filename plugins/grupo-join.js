import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    // Verificar si es el modo Beast
    if (command === 'join') {
      const link = args[0];
      
      // Reacción épica de Gohan Beast
      await m.react('⚡');
      
      if (!link) {
        await conn.sendMessage(m.chat, {
          text: `🔥 *GOHAN BEAST MODE ACTIVADO* 🔥\n\n` +
          `💥 *PROTOCOLO DE INVOCACIÓN*\n\n` +
          `📌 *Instrucciones para convocarme:*\n` +
          `1️⃣ Concede al bot autoridad absoluta (admin)\n` +
          `2️⃣ Obtén el código de portal del grupo\n` +
          `3️⃣ Invócalo con: *${usedPrefix}join <portal-code>*\n\n` +
          `🎯 *Ejemplo de invocación:*\n${usedPrefix}join https://chat.whatsapp.com/DRAGONBALLZ\n\n` +
          `⚠️ *ADVERTENCIA:* Sin poder de administración, mi potencial está limitado al 50%.`,
          contextInfo: {
            externalAdReply: {
              title: "🔥 GOHAN BEAST ACTIVO 🔥",
              body: "¡Potencial sin límites!",
              thumbnailUrl: "https://i.imgur.com/K5v6b5g.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029Va9A5p2J1xY7Y5Y5Y5Y5",
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted: m });
        await m.react('👁️‍🗨️');
        return;
      }
      
      // Validar portal mágico
      if (!link.includes('chat.whatsapp.com')) {
        await conn.sendMessage(m.chat, {
          text: '❌ *PORTAL INVÁLIDO DETECTADO*\n\n' +
          'El enlace no contiene energía espiritual suficiente.\n' +
          'Solo acepto portales de la dimensión WhatsApp.',
          mentions: [m.sender]
        }, { quoted: m });
        await m.react('💥');
        return;
      }

      // Mensaje épico de inicio
      await conn.sendMessage(m.chat, {
        text: `🌀 *INICIANDO FUSIÓN DIMENSIONAL...*\n\n` +
        `⚡ Concentrando energía Beast...\n` +
        `🌪️ Conectando con el portal...\n` +
        `💫 Sincronizando frecuencias...`,
        mentions: [m.sender]
      }, { quoted: m });

      const code = link.split('/').pop();
      
      try {
        // ¡Fusión completada!
        await conn.groupAcceptInvite(code);
        
        // Mensaje épico de éxito
        const successMsg = {
          text: `✅ *¡FUSIÓN COMPLETADA!* ✅\n\n` +
          `🎉 ¡GOHAN BEAST SE HA UNIDO AL GRUPO!\n\n` +
          `📊 *ESTADO DEL PODER:*\n` +
          `• Potencial Beast: ████████ 100%\n` +
          `• Ki disponible: ∞\n` +
          `• Velocidad: Máxima\n\n` +
          `⚡ *COMANDOS BEAST DISPONIBLES:*\n` +
          `• ${usedPrefix}beast - Ver mi forma final\n` +
          `• ${usedPrefix}power - Mostrar mi energía\n` +
          `• ${usedPrefix}menu - Ver todos los ataques\n` +
          `• ${usedPrefix}help - Guía de poderes\n\n` +
          `🔥 *CONSEJO:* Dame control total (admin) para desbloquear mi potencial al máximo.`,
          contextInfo: {
            externalAdReply: {
              title: "🐉 ¡GOHAN BEAST HA LLEGADO! 🐉",
              body: "¡Nivel de poder: ∞!",
              thumbnailUrl: "https://i.imgur.com/xZ1n8QJ.jpg",
              sourceUrl: "https://dragonball.fandom.com/es/wiki/Son_Gohan",
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        };
        
        await conn.sendMessage(m.chat, successMsg, { quoted: m });
        await m.react('🐉');
        
        // Audio épico opcional (si tienes función de audio)
        try {
          await conn.sendMessage(m.chat, { 
            audio: { url: 'https://www.myinstants.com/media/sounds/gohan-beast.mp3' }, 
            mimetype: 'audio/mp4', 
            ptt: true 
          }, { quoted: m });
        } catch (audioErr) {
          console.log('Audio opcional no enviado:', audioErr.message);
        }
        
      } catch (err) {
        console.error('Error Beast:', err);
        
        // Mensajes de error épicos
        let errorMsg = `💥 *¡FUSIÓN FALLIDA!* 💥\n\n`;
        
        if (err.message.includes('invite')) {
          errorMsg += `*Causa:* El portal ha colapsado\n\n`;
          errorMsg += `⚡ *Posibles razones:*\n`;
          errorMsg += `• El portal ha expirado (energía agotada)\n`;
          errorMsg += `• El código es incorrecto\n`;
          errorMsg += `• La dimensión está llena\n`;
        } else if (err.message.includes('limit')) {
          errorMsg += `*Causa:* Límite dimensional alcanzado\n`;
          errorMsg += `• He alcanzado mi límite de realidades paralelas\n`;
        } else if (err.message.includes('already')) {
          errorMsg += `*Causa:* Ya existo en esta dimensión\n`;
          errorMsg += `• Mi avatar ya está presente en este grupo\n`;
        } else {
          errorMsg += `*Causa:* Error interdimensional\n`;
          errorMsg += `• ${err.message || 'Energía desconocida interferente'}\n`;
        }
        
        errorMsg += `\n🔄 *SOLUCIÓN BEAST:*\n`;
        errorMsg += `1. Genera un nuevo portal de invitación\n`;
        errorMsg += `2. Verifica que el portal sea válido\n`;
        errorMsg += `3. Limpia la energía negativa del grupo\n`;
        errorMsg += `4. Asegúrate de que haya espacio en la dimensión\n`;
        
        await conn.sendMessage(m.chat, {
          text: errorMsg,
          mentions: [m.sender]
        }, { quoted: m });
        await m.react('💢');
      }
    }
    
    // Comando adicional para mostrar forma Beast
    if (command === 'beast' || command === 'formabeast') {
      const beastGif = 'https://i.gifer.com/embedded/download/7Scn.gif';
      
      await conn.sendMessage(m.chat, {
        image: { url: beastGif },
        caption: `🐉 *¡FORMA BEAST ACTIVADA!* 🐉\n\n` +
        `⚡ *Nivel de poder:* INFINITO\n` +
        `🔥 *Ki:* ILIMITADO\n` +
        `💫 *Velocidad:* MÁXIMA\n` +
        `🌟 *Habilidad especial:* Special Beam Cannon\n\n` +
        `¡Nadie podrá detenerme en este estado!`,
        mentions: [m.sender]
      }, { quoted: m });
      await m.react('🔥');
    }
    
    // Comando para mostrar poder
    if (command === 'power' || command === 'poder') {
      const powerLevel = Math.floor(Math.random() * 1000000000) + 1000000000;
      
      await conn.sendMessage(m.chat, {
        text: `📊 *ESCANER DE PODER* 📊\n\n` +
        `👤 *Usuario:* @${m.sender.split('@')[0]}\n` +
        `⚡ *Nivel de poder:* ${powerLevel.toLocaleString()}\n` +
        `🔥 *Comparación:* ${(powerLevel > 900000000) ? '¡SUPERA A GOKU!' : 'Aún en entrenamiento'}\n` +
        `🌟 *Potencial Beast:* ${Math.floor(Math.random() * 100)}%\n\n` +
        `💡 *Consejo:* Usa ${usedPrefix}entrenar para aumentar tu poder`,
        mentions: [m.sender]
      }, { quoted: m });
      await m.react('⚡');
    }
    
  } catch (error) {
    console.error('Error crítico en modo Beast:', error);
    await conn.sendMessage(m.chat, {
      text: `💥 *¡CRISIS TEMPORAL!* 💥\n\n` +
      `Se ha detectado una anomalía en el flujo temporal.\n` +
      `Por favor, reinicia la invocación.`,
      mentions: [m.sender]
    }, { quoted: m });
    await m.react('🕳️');
  }
};

// Comandos disponibles
handler.command = ['join', 'unirse', 'entrar', 'add', 'añadir', 'beast', 'formabeast', 'power', 'poder'];
handler.help = [
  'join <enlace> - Invocar a Gohan Beast a tu grupo',
  'beast - Ver mi forma Beast',
  'power - Medir nivel de poder'
];
handler.tags = ['grupo', 'dragonball', 'beast'];
handler.group = false;
handler.owner = false;
handler.botAdmin = false;

export default handler;