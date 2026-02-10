// KICK MODO GO-HAN BEAST (VERSIÓN BALANCEADA)
const handler = async (m, { conn, args }) => {
    if (!m.isGroup) return m.reply('🔒 *Solo se puede usar en el dojo grupal*');

    const groupMetadata = await conn.groupMetadata(m.chat);
    const userParticipant = groupMetadata.participants.find(p => p.id === m.sender);
    
    // Números permitidos manualmente (sin +)
    const adminPermitidos = [
        '584125877491',  // Tu número
        '5492644893953'  // Número del bot
    ];
    
    // Verificación mejorada de admin
    const userNumber = m.sender.split('@')[0];
    const isOwner = m.sender === groupMetadata.owner;
    const isAdmin = userParticipant?.admin === 'admin' || 
                    userParticipant?.admin === 'superadmin' || 
                    userParticipant?.admin === true;
    
    // Permitir si: es dueño, es admin del grupo, o está en lista permitida
    const tienePermiso = isOwner || isAdmin || adminPermitidos.includes(userNumber);

    if (!tienePermiso) {
        await m.react('❌');
        return m.reply('🐉 *Solo dueños Saiyans pueden expulsar del dojo*');
    }

    // Obtener usuario
    let user;
    if (m.quoted) {
        user = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        user = m.mentionedJid[0];
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('⚠️ *Número inválido*');
        user = `${number}@s.whatsapp.net`;
    } else {
        return m.reply('🐉 *Usa para expulsar del dojo:*\n.kick @usuario\n.kick 584123456789\nResponde .kick a un mensaje');
    }

    const ownerGroup = groupMetadata.owner || `${m.chat.split('-')[0]}@s.whatsapp.net`;
    const ownerBot = global.owner?.[0]?.[0] ? `${global.owner[0][0]}@s.whatsapp.net` : null;

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

    // Proteger números permitidos también
    const userTargetNumber = user.split('@')[0];
    if (adminPermitidos.includes(userTargetNumber) && user !== m.sender) {
        await m.react('🛡️');
        return m.reply('🐉 *No puedo expulsar a otro Saiyan superior*');
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

        // Mensajes Gohan Beast
        const beastMessages = [
            `🐉 *¡EXPULSADO!*\n${user.split('@')[0]} fue purificado`,
            `⚡ *KAMEHAMEHA!*\nAdiós ${user.split('@')[0]}`,
            `🔥 *FUERA!*\n${user.split('@')[0]} eliminado`,
            `💥 *MASENKO!*\n${user.split('@')[0]} voló lejos`,
            `🌪️ *EXPULSIÓN DIVINA!*\n${user.split('@')[0]} ya no está aquí`
        ];

        const msg = beastMessages[Math.floor(Math.random() * beastMessages.length)];
        await m.react('✅');
        await m.reply(msg);

    } catch (e) {
        console.error('Error en kick:', e);
        await m.react('❌');
        
        if (e.message?.includes('not authorized')) {
            return m.reply('🐉 *Error* - Dame permisos de administrador');
        } else if (e.message?.includes('401')) {
            return m.reply('🐉 *Error* - El bot no es admin del grupo');
        } else {
            return m.reply('🐉 *Error* - No se pudo expulsar');
        }
    }
};

handler.help = ['kick @usuario', 'kick (responde a mensaje)', 'kick 584123456789'];
handler.tags = ['group', 'admin'];
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban', 'expulsar'];
handler.register = false;
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;