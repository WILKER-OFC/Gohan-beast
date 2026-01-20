let handler = async (m, { conn }) => {
  m.reply(`
╔══════════════════╗
     👑 *PROPIETARIO* 👑
╚══════════════════╝

⚡ *GOHAN BEAST BOT*

🏷️ *Nombre:* WILKER OFC
📞 *WhatsApp:* +5492644893953
📧 *Email:* developer.wilker.ofc@gmail.com

🔗 *Enlace directo:*
https://wa.me/5492644893953

🛠️ *Desarrollador especializado en:*
• Bots de WhatsApp
• Bots de Telegram
• Bost de discord

📌 *Contacta para:*
• Bots personalizados
• Subbots
• Soporte técnico
• Colaboraciones

⚡ _Desarrollando con pasión desde 2024_
`)
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner', 'propietario']
export default handler