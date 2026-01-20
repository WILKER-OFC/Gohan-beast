console.clear()
console.log('🌀 Iniciando Gohan Beast Bot...')

import { join, dirname } from 'path'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

// Título principal con estilo Beast
cfonts.say('✧ GOHAN BEAST ✧', {
  font: 'block',
  align: 'center',
  gradient: ['#f06', '#ffcc00', '#ff3366'],
  background: 'transparent',
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: '0',
  env: 'node'
})

// Sub título
cfonts.say('🔥 By Wilker | Beast Mode Activated 🔥', {
  font: 'console',
  align: 'center',
  gradient: ['white', '#ffcc00'],
  background: 'transparent',
  letterSpacing: 0,
  lineHeight: 1,
  space: true,
  env: 'node'
})

console.log('\n')
console.log('⚡ Transformación Beast completada al 100%')
console.log('💥 Sistema de poder: MAXIMUM')
console.log('🌀 Modo: Gohan Beast Ultrainstinct')
console.log('📱 Conectando a WhatsApp...')
console.log('\n')

let isWorking = false

async function launch(scripts) {
  if (isWorking) return
  isWorking = true

  for (const script of scripts) {
    const args = [join(__dirname, script), ...process.argv.slice(2)]

    setupMaster({
      exec: args[0],
      args: args.slice(1),
    })

    let child = fork()

    child.on('exit', (code) => {
      if (code !== 0) {
        console.log(`⚠️ Transformación interrumpida! Código de error: ${code}`)
        console.log('🔄 Reactivando células Saiyan...')
      } else {
        console.log('✅ Proceso terminado limpiamente')
      }
      
      isWorking = false
      
      // Intentar relanzar
      setTimeout(() => {
        launch(scripts)
      }, 2000)

      if (code === 0) return
      
      watchFile(args[0], () => {
        unwatchFile(args[0])
        console.log('🌀 Potencial oculto liberado! Reiniciando...')
        launch(scripts)
      })
    })
    
    child.on('message', (data) => {
      if (data && data === 'ready') {
        console.log('✅ Gohan Beast Bot conectado y listo!')
        console.log('💪 Poder: Máximo | Estado: Beast Mode')
        console.log('📊 Esperando comandos...')
        console.log('\n')
      }
    })
  }
}

// Animación de carga estilo Dragon Ball
console.log('🌀 Activando Beast Mode:')
const beastPhases = [
  '▰ Cargando energía Saiyan...',
  '▰▰ Potencial oculto liberándose...',
  '▰▰▰ Transformación Beast iniciada...',
  '▰▰▰▰ Poder al máximo!',
  '▰▰▰▰▰ ¡GOHAN BEAST ACTIVADO!'
]

beastPhases.forEach((phase, i) => {
  setTimeout(() => {
    console.log(phase)
    if (i === beastPhases.length - 1) {
      console.log('\n' + '='.repeat(50))
      launch(['main.js'])
    }
  }, i * 800)
})