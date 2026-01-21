import fs from 'fs'

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  
  // Inicializar si no existe
  if (!user) {
    global.db.data.users[m.sender] = {
      coin: 100,
      lastwork: 0,
      energy: 100
    }
    user = global.db.data.users[m.sender]
  }
  
  // Cooldown de 5 minutos
  let cooldown = 300000
  let timers = cooldown - (Date.now() - user.lastwork)
  
  if (timers > 0) {
    let time = Math.ceil(timers / 60000)
    return m.reply(`⏳ *Espera ${time} minutos*\nPara volver a entrenar en el dojo`)
  }
  
  // Ganancias aleatorias
  let earnings = Math.floor(Math.random() * 150) + 50
  
  // Entrenamientos Dragon Ball
  const entrenamientos = [
    { nombre: '🏋️‍♂️ Gravity Room x100', desc: 'Entrenaste en gravedad extrema' },
    { nombre: '🌀 Kamehameha', desc: 'Practicaste con el Maestro Roshi' },
    { nombre: '🥋 Tenkaichi Budokai', desc: 'Ganaste un torneo de artes marciales' },
    { nombre: '🍜 Comer con Goku', desc: 'Aumentaste tu energía comiendo' },
    { nombre: '🧘 Meditación Saiyan', desc: 'Conectaste con tu poder interior' },
    { nombre: '⚡ Entrenar con Whis', desc: 'Mejoraste tu velocidad y poder' }
  ]
  
  let entrenamiento = entrenamientos[Math.floor(Math.random() * entrenamientos.length)]
  
  // Actualizar datos
  user.coin += earnings
  user.lastwork = Date.now()
  user.energy = Math.max(0, user.energy - 20)
  
  await m.reply(
`🐉 *${entrenamiento.nombre}*

${entrenamiento.desc}
💰 +${earnings} ${global.moneda || 'Monedas'}
⚡ Energía: ${user.energy}/100

¡Buen entrenamiento Saiyan! 🏆`
  )
}

handler.help = ['work', 'trabajar', 'entrenar']
handler.tags = ['economy', 'beast']
handler.command = ['work', 'trabajar', 'entrenar']
handler.cooldown = 300
handler.limit = false

export default handler