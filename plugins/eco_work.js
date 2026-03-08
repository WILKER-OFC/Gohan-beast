let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
  let user = global.db.data.users[m.sender]
  let tiempo = 5 * 60 // 5 minutos en segundos

  if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
    const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
    return conn.reply(
      m.chat,
      `⚡ *GOHAN BESTIA RECARGANDO KI* ⚡\n\n🦾 Guerrero: @${m.sender.split("@")[0]}\n⏳ Espera *${tiempo2}* para trabajar con poder bestial`,
      m,
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  // GOHAN BESTIA - Ganancias ÉPICAS 🔥
  let rsl = Math.floor(Math.random() * 5000) + 1000
  cooldowns[m.sender] = Date.now()
  user.coin += rsl

  const frase = pickRandom(trabajo)

  await conn.reply(
    m.chat,
    `🦾 *GOHAN BESTIA TRABAJA* 🦾\n\n✦ ${frase} *${toNum(rsl)}* ( *${rsl}* ) ${moneda} 💫\n\n🌀 ¡EL PODER BESTIA GENERA RIQUEZA! 🌀`,
    m,
    { ...global.rcanal }
  )
}

handler.help = ['work']
handler.tags = ['eco']
handler.command = ['w', 'work', 'chambear', 'chamba', 'trabajar', 'bestiawork', 'gohanwork']
handler.group = false
handler.register = false

export default handler

function toNum(number) {
  if (number >= 1000 && number < 1000000) return (number / 1000).toFixed(1) + 'k'
  else if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M'
  else if (number <= -1000 && number > -1000000) return (number / 1000).toFixed(1) + 'k'
  else if (number <= -1000000) return (number / 1000000).toFixed(1) + 'M'
  else return number.toString()
}

function segundosAHMS(segundos) {
  let minutos = Math.floor((segundos % 3600) / 60)
  let segundosRestantes = segundos % 60
  return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

const trabajo = [
  "Entrenaste como Gohan Bestia y te pagaron",
  "Destruiste planetas con tu poder y conseguiste",
  "Enseñaste a Piccolo a ser más fuerte y te dio",
  "Le ganaste a Goku en sparring y te pagó",
  "Salvaste la Tierra de un enemigo y te dieron",
  "Usaste la Bestial Wave y te llovió dinero",
  "Volaste tan rápido que encontraste un tesoro de",
  "Transformaste tu ki en monedas y obtuviste",
  "Derrotaste a Cell Max y te recompensaron con",
  "Hiciste un Kamehameha bestial y te cayeron",
  "Protegiste a Bulma de peligros y te pagó",
  "Entrenaste con Vegeta y te dio por tu esfuerzo",
  "Usaste tu forma bestia en un torneo y ganaste",
  "Le enseñaste a Trunks a ser fuerte y te dieron",
  "Salvaste a Dende y las esferas te dieron",
  "Volaste tan alto que encontraste nubes de",
  "Tu poder bestia asustó a Beerus y te dio",
  "Le ganaste a Whis en velocidad y te pagó",
  "Protegiste el planeta de Freezer y te dieron",
  "Hiciste un ritual bestial y llovieron",
  "Tu ki despertó a Shenlong y te regaló",
  "Destruiste montañas entrenando y hallaste",
  "Le ganaste a Broly en fuerza y te dio",
  "Tu forma bestia inspiró a todos y te donaron"
]

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)]
}