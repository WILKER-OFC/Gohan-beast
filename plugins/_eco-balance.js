let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender]
  
  if (!user) {
    global.db.data.users[m.sender] = {
      coin: 100,
      diamond: 0,
      exp: 0,
      level: 1
    }
    user = global.db.data.users[m.sender]
  }
  
  let rank = ''
  let powerLevel = user.coin || 0
  
  if (powerLevel < 1000) rank = '👶 Saiyan Novato'
  else if (powerLevel < 5000) rank = '👊 Guerrero Saiyan'
  else if (powerLevel < 20000) rank = '💪 Super Saiyan'
  else if (powerLevel < 50000) rank = '🔥 Super Saiyan 2'
  else if (powerLevel < 100000) rank = '⚡ Super Saiyan 3'
  else if (powerLevel < 500000) rank = '🌀 Super Saiyan God'
  else rank = '🐉 Gohan Beast'
  
  await m.reply(
`💰 *ECONOMÍA SAIYAN*

💎 *${global.moneda || 'Monedas'}:* ${user.coin || 0}
💠 *Diamantes:* ${user.diamond || 0}
⭐ *Experiencia:* ${user.exp || 0}
📊 *Nivel:* ${user.level || 1}
🏆 *Rango:* ${rank}

⚡ *Poder de combate:* ${powerLevel}
🌀 *Estado:* ${user.coin > 10000 ? 'Rico' : 'Normal'}

💡 Usa .work para ganar más!`
  )
}

handler.help = ['balance', 'dinero', 'coins', 'economy']
handler.tags = ['economy', 'beast']
handler.command = ['balance', 'dinero', 'coins', 'economia']
handler.limit = false

export default handler