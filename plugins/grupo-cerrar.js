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
  let tiempoSegundos = 0

  // 🐉 Parsear tiempo
  if (tiempoTexto.includes("segundo")) {
    let segundos = parseInt(args[0])
    if (isNaN(segundos) || segundos <= 0) {
      await conn.sendMessage(m.chat, { text: '❌ *Segundos inválidos*' })
      return
    }
    tiempoMs = segundos * 1000
    tiempoSegundos = segundos
    unidad = segundos === 1 ? 'segundo' : 'segundos'
  } 
  else if (tiempoTexto.includes("minuto")) {
    let minutos = parseInt(args[0])
    if (isNaN(minutos) || minutos <= 0) {
      await conn.sendMessage(m.chat, { text: '❌ *Minutos inválidos*' })
      return
    }
    tiempoMs = minutos * 60 * 1000
    tiempoSegundos = minutos * 60
    unidad = minutos === 1 ? 'minuto' : 'minutos'
  } 
  else if (tiempoTexto.includes("hora")) {
    let horas = parseInt(args[0])
    if (isNaN(horas) || horas <= 0) {
      await conn.sendMessage(m.chat, { text: '❌ *Horas inválidas*' })
      return
    }
    tiempoMs = horas * 60 * 60 * 1000
    tiempoSegundos = horas * 60 * 60
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
    const cierreMsg = await conn.sendMessage(m.chat, {
      text: `🐉 *DOJO CERRADO*\n\n⏰ Tiempo: ${args[0]} ${unidad}\n\n⏳ *Cuenta regresiva iniciada...*`
    })

    // 🐉 Función para mostrar tiempo restante
    const formatTiempo = (segundos) => {
      if (segundos < 60) {
        return `${segundos} segundos`;
      } else if (segundos < 3600) {
        const min = Math.floor(segundos / 60);
        const sec = segundos % 60;
        return `${min} minuto${min !== 1 ? 's' : ''} ${sec > 0 ? sec + ' segundo' + (sec !== 1 ? 's' : '') : ''}`;
      } else {
        const horas = Math.floor(segundos / 3600);
        const min = Math.floor((segundos % 3600) / 60);
        return `${horas} hora${horas !== 1 ? 's' : ''} ${min > 0 ? min + ' minuto' + (min !== 1 ? 's' : '') : ''}`;
      }
    };

    // 🐉 Función para barra de progreso
    const crearBarra = (porcentaje) => {
      const barras = 20;
      const lleno = Math.round((porcentaje / 100) * barras);
      const vacio = barras - lleno;
      return '█'.repeat(lleno) + '░'.repeat(vacio);
    };

    // 🐉 Cuenta regresiva - ACTUALIZACIÓN CADA 20 SEGUNDOS
    let segundosRestantes = tiempoSegundos;
    
    const cuentaRegresiva = async () => {
      while (segundosRestantes > 0) {
        await delay(20000); // ESPERA 20 SEGUNDOS
        
        segundosRestantes -= 20;
        
        if (segundosRestantes <= 0) break;
        
        // Calcular porcentaje
        const porcentaje = ((tiempoSegundos - segundosRestantes) / tiempoSegundos) * 100;
        
        // Actualizar mensaje cada 20 segundos
        try {
          const tiempoFormateado = formatTiempo(segundosRestantes);
          const barra = crearBarra(porcentaje);
          
          await conn.sendMessage(m.chat, {
            text: `⏳ *TIEMPO RESTANTE*\n\n${barra} ${Math.round(porcentaje)}%\n\n🕐 ${tiempoFormateado}\n🐉 Abriendo en breve...`,
            edit: cierreMsg.key
          });
          
          console.log(`[CUENTA REGRESIVA] Actualizado: ${segundosRestantes}s restantes (${Math.round(porcentaje)}%)`);
          
        } catch (error) {
          console.log('[CUENTA REGRESIVA] Error al actualizar:', error.message);
        }
      }
    };

    // 🐉 Iniciar cuenta regresiva (no esperar, se ejecuta en segundo plano)
    cuentaRegresiva();

    // 🐉 Esperar tiempo completo
    await delay(tiempoMs);

    // 🐉 Mensaje final de cuenta regresiva
    try {
      await conn.sendMessage(m.chat, {
        text: `✅ *CUENTA REGRESIVA COMPLETADA*\n\n████████████████████ 100%\n\n⏰ Tiempo cumplido\n🐉 Abriendo dojo...`,
        edit: cierreMsg.key
      });
    } catch (error) {
      console.log('[CUENTA REGRESIVA] Error mensaje final:', error.message);
    }

    // 🐉 Pequeña pausa dramática
    await delay(1000);

    // 🐉 Abrir grupo
    await conn.groupSettingUpdate(m.chat, 'not_announcement');
    
    // 🐉 Mensaje de apertura
    await m.react('✅');
    await m.react('🎉');
    
    // 🐉 Enviar mensaje final con efectos
    await conn.sendMessage(m.chat, { 
      text: `🎊 *DOJO ABIERTO*\n\n✅ Cerrado por: ${args[0]} ${unidad}\n⏱️ Tiempo exacto cumplido\n🐉 ¡Todos pueden hablar nuevamente!`
    });

    // 🐉 Animación de celebración
    const celebraciones = ['✨', '🎉', '⚡', '🔥', '🌟'];
    for (let emoji of celebraciones) {
      await delay(500);
      await m.react(emoji);
    }

  } catch (error) {
    console.error('Error en cerrar grupo:', error);
    await m.react('❌');
    
    // Intentar abrir el grupo por si acaso
    try {
      await conn.groupSettingUpdate(m.chat, 'not_announcement');
    } catch {}
    
    await conn.sendMessage(m.chat, { 
      text: '❌ *Error en la cuenta regresiva*\nEl dojo ha sido reabierto.'
    });
  }
}

// 🐉 Comandos
handler.help = ['cerrar <tiempo> segundos/minutos/horas'];
handler.tags = ['grupo'];
handler.command = /^cerrar$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;