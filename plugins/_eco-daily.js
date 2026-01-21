let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user) {
    global.db.data.users[m.sender] = {
      coin: 0,
      lastdaily: 0,
      dailyStreak: 0
    }
    user = global.db.data.users[m.sender]
  }
  
  // Cooldown 24 horas
  let cooldown = 86400000
  let timers = cooldown - (Date.now() - user.lastdaily)
  
  if (timers > 0) {
    let hours = Math.floor(timers / 3600000)
    let minutes = Math.ceil((timers % 3600000) / 60000)
    return m.reply(`⏳ *Recompensa disponible en*\n${hours}h ${minutes}m`)
  }
  
  // Calcular recompensa
  let streak = user.dailyStreak || 0
  let baseReward = 500
  let bonus = Math.floor(streak / 7) * 100 // Bonus cada 7 días
  let total = baseReward + bonus
  
  // Recompensas Dragon Ball
  const recompensas = [
    '💰 Bolsa de Zeni',
    '🍜 Comida de Chi-Chi',
    '💊 Semillas Senzu',
    '🥋 Uniforme de entrenamiento',
    '📿 Amuleto Saiyan',
    '⚡ Energía Ki'
  ]
  
  let item = recompensas[Math.floor(Math.random() * recompensas.length)]
  
  // Actualizar streak
  let now = new Date()
  let lastDate = new Date(user.lastdaily)
  let diffDays = Math.floor((now - lastDate) / 86400000)
  
  if (diffDays === 1) {
    user.dailyStreak = (user.dailyStreak || 0) + 1
  } else if (diffDays > 1) {
    user.dailyStreak = 1
  } else {
    user.dailyStreak = user.dailyStreak || 1
  }
  
  // Guardar datos
  user.coin += total
  user.lastdaily = Date.now()
  
  await m.reply(
`🎁 *RECOMPENSA DIARIA SAIYAN*

¡Reclamaste tu recompensa!
🛍️ *Item:* ${item}
💰 *Monedas:* +${total}
📅 *Racha:* ${user.dailyStreak} días

💎 Bonus por racha: +${bonus} monedas
¡Sigue entrenando! 🐉`
  )
}

handler.help = ['daily', 'diario', 'recompensa']
handler.tags = ['economy', 'beast']
handler.command = ['daily', 'diario', 'recompensa']
handler.cooldown = 86400

export default handler