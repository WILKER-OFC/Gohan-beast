import db from '../lib/database.js'

let handler = async (m, { args, conn }) => {
  let user = global.db.data.users[m.sender]
  let moneda = global.moneda || '💸'

  if (!args[0]) {
    return conn.reply(m.chat, 
      `⚡ *GOHAN BESTIA - GUARDANDO KI* ⚡\n\n🦾 Guerrero: @${m.sender.split('@')[0]}\n\n⚠️ Ingresa la cantidad de *${moneda}* (ki) que deseas proteger en tu banco.\n\n💫 Ejemplo: *deposit 5000* o *dep all*`, 
      m, 
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  if (args[0] === 'all') {
    let count = parseInt(user.coin)
    if (!count || count < 1) {
      return conn.reply(m.chat, 
        `⚡ *GOHAN BESTIA - SIN KI* ⚡\n\n🦾 Bestia: @${m.sender.split('@')[0]}\n\n❌ No tienes nada de ki para proteger en el banco.\n\n🌀 ¡Consigue más poder!`, 
        m, 
        { mentions: [m.sender], ...global.rcanal }
      )
    }

    user.coin -= count
    user.bank += count

    return conn.reply(m.chat, 
      `🦾 *GOHAN BESTIA - KI PROTEGIDO* 🦾\n\n⚡ Bestia: @${m.sender.split('@')[0]}\n\n✅ Protegiste *${count} ${moneda}* de ki en tu banco.\n💢 ¡Ahora ningún enemigo te lo robará!\n\n🌀 *PODER BESTIA ASEGURADO* 🌀`, 
      m, 
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  if (isNaN(args[0])) {
    return conn.reply(m.chat, 
      `⚡ *GOHAN BESTIA - ERROR DE KI* ⚡\n\n🦾 Guerrero: @${m.sender.split('@')[0]}\n\n⚠️ Ingresa una cantidad válida de ki.\n💫 Ejemplo: *#deposit 5000*`, 
      m, 
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  let count = parseInt(args[0])
  if (!user.coin || user.coin < 1) {
    return conn.reply(m.chat, 
      `⚡ *GOHAN BESTIA - SIN KI* ⚡\n\n🦾 Bestia: @${m.sender.split('@')[0]}\n\n❌ No tienes ki en tu cartera Saiyan para proteger.`, 
      m, 
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  if (user.coin < count) {
    return conn.reply(m.chat, 
      `⚡ *GOHAN BESTIA - KI INSUFICIENTE* ⚡\n\n🦾 Bestia: @${m.sender.split('@')[0]}\n\n⚠️ Solo tienes *${user.coin} ${moneda}* de ki en tu cartera Saiyan.\n✨ Necesitas más poder Bestia para proteger esa cantidad.`, 
      m, 
      { mentions: [m.sender], ...global.rcanal }
    )
  }

  user.coin -= count
  user.bank += count

  await conn.reply(m.chat, 
    `🦾 *GOHAN BESTIA - KI PROTEGIDO* 🦾\n\n⚡ Bestia: @${m.sender.split('@')[0]}\n\n✅ Protegiste *${count} ${moneda}* de ki en tu banco.\n💥 ¡Ahora tu poder está a salvo de Freezer y sus secuaces!\n\n🌀 *GOHAN BESTIA TE CUBRE LAS ESPALDAS* 🌀`, 
    m, 
    { mentions: [m.sender], ...global.rcanal }
  )
}

handler.help = ['depositar']
handler.tags = ['eco']
handler.command = ['deposit', 'depositar', 'dep', 'aguardar', 'protegerki', 'guardarki']
handler.group = false
handler.register = false

export default handler