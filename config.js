import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

// ============================================
// 🔥 GOHAN BEAST BOT - CONFIGURACIÓN
// ============================================
global.owner = [
  ['5492644893953', 'Wilker | Gohan Beast', true],
  ['584125877491'],
  ['156981591593126'],
  ['595972314588']
]

global.mods = []
global.prems = []

// ⚡ CONFIGURACIÓN VISUAL DEL BOT
global.namebot = '🐉 GO-HAN BEAST MD'
global.packname = '⚡ GOHAN BEAST | WHATSAPP BOT'
global.author = 'Wilker © 2025 | Dragon Ball Z'
global.moneda = '⚡ Energía Saiyan'

// 🌀 CONFIGURACIÓN TÉCNICA
global.libreria = 'Baileys Beast Edition'
global.baileys = '🔥 V 6.7.16 | Beast Mode'
global.vs = '2.2.0 | Ultra Instinct'
global.sessions = '🌀 Transformaciones'
global.jadi = '⚡ Sub-Saiyans'
global.yukiJadibts = true

// 📢 CANALES Y COMUNIDAD
global.namecanal = '🐉 Gohan Beast Community'
global.idcanal = '120363403739366547@newsletter'
global.idcanal2 = '120363403739366547@newsletter'
global.canal = 'https://whatsapp.com/channel/0029Vb5pM031CYoMvQi2I02D'
global.canalreg = '120363402895449162@newsletter'

global.ch = {
  ch1: '120363420941524030@newsletter',
  ch2: '🌀 Noticias Dragon Ball',
  ch3: '⚡ Actualizaciones Beast'
}

// ⚙️ CONFIGURACIÓN DEL SISTEMA
global.multiplier = 9000 // ¡Es más de 8000!
global.maxwarn = 3 // Máximas advertencias antes de Kamehameha

// ============================================
// 🎨 CONFIGURACIONES ADICIONALES TEMÁTICAS
// ============================================
global.beastMode = true
global.transformacion = 'Beast Form'
global.poderBase = 'MAXIMUM'
global.saiyanLevel = 'Legendary'

// 🔱 TEXTO DE BIENVENIDA PERSONALIZADO
global.welcomeMessage = `¡Bienvenido al dojo de Gohan Beast! 🐉

*Nombre:* {subject}
*Miembros:* {pp}

⚡ *Transformación Beast activada*
🌀 *Poder disponible: 100%*
💪 *¡Listo para la batalla!*

*Escribe .menu para ver mis técnicas*`

// 💬 MENSAJE DE DESPEDIDA
global.goodbyeMessage = `{subject} ha sido eliminado del dojo...

*Razón:* Potencial insuficiente
*Poder restante:* 0%

🌀 *Gohan Beast se despide* ⚡`

// 📊 ESTADÍSTICAS DEL BOT
global.botStats = {
  creado: '2025',
  version: 'Beast v1.0',
  transformaciones: ['Base', 'Super Saiyan', 'Ultimate', 'Beast'],
  ataques: ['Masenko', 'Kamehameha', 'Special Beam Cannon']
}

// ============================================
// 🔄 SISTEMA DE AUTO-ACTUALIZACIÓN
// ============================================
let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.hex('#FF3366')('🌀 [BEAST MODE] Configuración actualizada!'))
  console.log(chalk.hex('#FFCC00')('⚡ Reiniciando energía Saiyan...'))
  import(`file://${file}?update=${Date.now()}`)
})

// ============================================
// 🎯 LOGO Y PRESENTACIÓN AL CARGAR
// ============================================
console.log(chalk.hex('#00FFFF')('╔══════════════════════════════════════════╗'))
console.log(chalk.hex('#FF3366')('║      🐉 GOHAN BEAST CONFIGURADO 🐉      ║'))
console.log(chalk.hex('#00FFFF')('╠══════════════════════════════════════════╣'))
console.log(chalk.hex('#FFCC00')(`║ Bot: ${global.namebot}`))
console.log(chalk.hex('#00FFFF')(`║ Dueño: Wilker | Saiyan Level`))
console.log(chalk.hex('#FF3366')(`║ Poder: ${global.multiplier} (¡Es más de 8000!)`))
console.log(chalk.hex('#FFCC00')('╚══════════════════════════════════════════╝'))