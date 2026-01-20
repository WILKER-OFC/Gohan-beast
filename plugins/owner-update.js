import { execSync } from 'child_process'
import { readdirSync, statSync } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, text }) => {
  // Reacción inicial
  await m.react('🌀')
  
  try {
    // Mensaje de inicio épico
    const loadingMsg = await conn.reply(m.chat, 
`╔═══════════════════════════════╗
║    🐉 *ACTUALIZACIÓN BEAST* ⚡   ║
╠═══════════════════════════════╣
║ 📦 *Estado:* Iniciando descarga
║ 🌀 *Proceso:* Sincronizando repositorio
║ ⚡ *Transformación:* En progreso...
╚═══════════════════════════════╝`, m)
    
    // Contar archivos antes
    const filesBefore = countFiles()
    await m.react('📥')
    
    // Fase 1: Descargando
    await conn.sendMessage(m.chat, { 
      text: '🌀 *FASE 1: DESCARGANDO NUEVAS TÉCNICAS...*\n⚡ Conectando al dojo principal...',
      edit: loadingMsg.key 
    }, { quoted: m })
    
    // Ejecutar git pull
    let stdout
    try {
      stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''), { 
        encoding: 'utf-8',
        stdio: 'pipe'
      })
    } catch (gitError) {
      await conn.sendMessage(m.chat, {
        text: `❌ *ERROR EN LA DESCARGA* ⚡\n\n` +
              `💥 El dojo está bloqueado:\n\`\`\`${gitError.stderr || gitError.message}\`\`\`\n` +
              `🌀 *Solución:* Verifica permisos o conexión`,
        edit: loadingMsg.key
      })
      await m.react('❌')
      return
    }
    
    await m.react('⚡')
    
    // Fase 2: Procesando
    await conn.sendMessage(m.chat, {
      text: '⚡ *FASE 2: PROCESANDO TÉCNICAS...*\n🐉 Descomprimiendo poder Saiyan...',
      edit: loadingMsg.key
    })
    
    // Contar archivos después
    const filesAfter = countFiles()
    const newFiles = filesAfter - filesBefore
    
    // Analizar output de git
    const output = stdout.toString()
    const isUpdated = output.includes('Already up to date') 
      ? '✅ *YA ESTÁ ACTUALIZADO*' 
      : '🔄 *ACTUALIZACIÓN COMPLETADA*'
    
    const changes = output.includes('files changed') 
      ? output.match(/(\d+) files? changed/)?.[1] || '0'
      : '0'
    
    await m.react('🔧')
    
    // Fase 3: Finalizando
    await conn.sendMessage(m.chat, {
      text: '💥 *FASE 3: ACTIVANDO BEAST MODE...*\n🌀 Aplicando transformaciones...',
      edit: loadingMsg.key
    })
    
    // Mensaje final épico
    const resultMessage = 
`╔═══════════════════════════════╗
║    🎉 *ACTUALIZACIÓN COMPLETA*  ║
╠═══════════════════════════════╣
║ ${isUpdated}
╠═══════════════════════════════╣
║ 📊 *ESTADÍSTICAS:*
║ • 📁 Archivos nuevos: ${newFiles}
║ • 🔄 Cambios: ${changes} archivos
║ • 🐉 Estado: Beast Mode activado
║ • ⚡ Energía: 100% cargada
╠═══════════════════════════════╣
║ 🌀 *TRANSFORMACIONES APLICADAS:*
║ ✅ Técnicas actualizadas
║ ✅ Poder Saiyan renovado
║ ✅ Dojo sincronizado
║ ✅ Beast Mode: ACTIVADO
╚═══════════════════════════════╝

🔱 *Gohan Beast listo para la batalla!* 🐉⚡`

    await conn.sendMessage(m.chat, {
      text: resultMessage,
      edit: loadingMsg.key
    })
    
    // Si hay cambios, mostrar detalles
    if (newFiles > 0 || changes > 0) {
      setTimeout(async () => {
        const detailMsg = 
`📋 *DETALLES DE LA ACTUALIZACIÓN:*

\`\`\`
${output.substring(0, 800)}${output.length > 800 ? '...' : ''}
\`\`\`

🌀 *Nuevas técnicas disponibles*
⚡ *Reinicia el bot para cargar cambios*
💪 *¡Gohan Beast más poderoso que nunca!`
        
        await conn.sendMessage(m.chat, { text: detailMsg })
      }, 1500)
    }
    
    await m.react('✅')
    
    // Mensaje extra si se necesitan más acciones
    if (output.includes('npm install') || output.includes('package.json')) {
      setTimeout(async () => {
        await conn.sendMessage(m.chat, {
          text: '⚠️ *ATENCIÓN SAIYAN:*\n' +
                'Se detectaron cambios en dependencias.\n' +
                'Ejecuta: `.npm install` para actualizar\n' +
                'o reinicia completamente el bot.'
        })
      }, 2000)
    }
    
  } catch (error) {
    // Manejo de errores épico
    await conn.sendMessage(m.chat, {
      text: `💥 *FALLA EN LA TRANSFORMACIÓN* ⚡\n\n` +
            `🐉 *Error crítico detectado:*\n` +
            `\`\`\`${error.message}\`\`\`\n\n` +
            `🌀 *Posibles causas:*\n` +
            `• Conexión al dojo perdida\n` +
            `• Conflicto de técnicas\n` +
            `• Permisos insuficientes\n\n` +
            `🔧 *Solución:*\n` +
            `Verifica manualmente el repositorio`
    })
    await m.react('❌')
  }
}

// Función para contar archivos
function countFiles() {
  let count = 0
  function countInDir(dir) {
    const items = readdirSync(dir)
    items.forEach(item => {
      const fullPath = join(dir, item)
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        countInDir(fullPath)
      } else {
        count++
      }
    })
  }
  
  try {
    countInDir('.')
  } catch (e) {
    console.error('Error contando archivos:', e)
  }
  return count
}

// Información del comando
handler.help = ['update', 'actualizar', 'upgrade', 'pull']
handler.tags = ['owner', 'beast', 'sistema']
handler.command = ['update', 'actualizar', 'upgrade', 'pull', 'fix', 'fixed', 'beastupdate']
handler.rowner = true  // Solo dueño puede usar
handler.limit = false
handler.premium = false

// Aliases temáticos
handler.alias = ['beastsync', 'gohanupdate', 'saipull']

export default handler