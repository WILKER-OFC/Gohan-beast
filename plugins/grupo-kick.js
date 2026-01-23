// KICK MODO GO-HAN BEAST (VERSIÓN BALANCEADA)
var handler = async (m, { conn, args }) => {
    if (!m.isGroup) return m.reply('🔒 *Solo se puede usar en el dojo grupal*');

    const groupMetadata = await conn.groupMetadata(m.chat);
    const userParticipant = groupMetadata.participants.find(p => p.id === m.sender);
    const isUserAdmin = userParticipant?.admin || m.sender === groupMetadata.owner;

    if (!isUserAdmin) {
        await m.react('❌');
        return m.reply('🐉 *Solo dueños Saiyans pueden expulsar del dojo*');
    }

    // Obtener usuario
    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('⚠️ *Número inválido*');
        user = number + '@s.whatsapp.net';
    } else {
        return m.reply('🐉 *Usa para expulsar del dojo:* .kick @user');
    }

    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner?.[0]?.[0] ? global.owner[0][0] + '@s.whatsapp.net' : null;

    // Protecciones
    if (user === conn.user.jid) {
        await m.react('😂');
        return m.reply('🐉 *Yo no me voy no me puedo expulsar del dojo yo mismo*');
    }
    
    if (user === ownerGroup) {
        await m.react('👑');
        return m.reply('🐉 *No toco al dueño*');
    }
    
    if (ownerBot && user === ownerBot) {
        await m.react('🤖');
        return m.reply('🐉 *Mi creador es sagrado es Gohan beast*');
    }

    const targetInGroup = groupMetadata.participants.find(p => p.id === user);
    if (!targetInGroup) {
        await m.react('👻');
        return m.reply('🐉 *Ya no está aquí :c*');
    }

    try {
        await m.react('⚡');
        await m.reply(`🐉 *Preparando expulsión...*`);

        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        
        // Mensajes Gohan Beast cortos
        const beastMessages = [
            `🐉 *¡EXPULSADO!*\n${user.split('@')[0]} fue purificado`,
            `⚡ *KAMEHAMEHA!*\nAdiós ${user.split('@')[0]}`,
            `🔥 *FUERA!*\n${user.split('@')[0]} eliminado`
        ];
        
        const msg = beastMessages[Math.floor(Math.random() * beastMessages.length)];
        await m.react('✅');
        await m.reply(msg);
        
    } catch (e) {
        await m.react('❌');
        await m.reply('🐉 *Error* - Dame admin');
    }
};

handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.register = false

export default handler;