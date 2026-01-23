// 🐉 KICK MODO GO-HAN BEAST
var handler = async (m, { conn, args }) => {
    if (!m.isGroup) return m.reply('🔒 *Este comando solo se usa en grupos.*');

    // 🐉 Mostrar logo beast al inicio
    console.log(`\x1b[35m╔════════════════════════════════════╗\x1b[0m`);
    console.log(`\x1b[35m║    🐉 \x1b[36mGO-HAN BEAST MODE\x1b[35m 🐉     ║\x1b[0m`);
    console.log(`\x1b[35m║    KICK System v1.0\x1b[33m       ║\x1b[0m`);
    console.log(`\x1b[35m╚════════════════════════════════════╝\x1b[0m`);

    const groupMetadata = await conn.groupMetadata(m.chat);

    // 🐉 Debug: mostrar participantes y sus roles en consola con estilo
    console.log('\x1b[36m🔎 [BEAST-SCAN] Participantes del grupo:\x1b[0m');
    groupMetadata.participants.forEach(p => {
        const role = p.admin ? '\x1b[31madmin\x1b[0m' : '\x1b[32mmiembro\x1b[0m';
        const name = p.id.split('@')[0];
        console.log(`\x1b[33m- ${name}\x1b[0m rol: ${role}`);
    });

    // 🐉 Buscar info del usuario que manda el comando
    const userParticipant = groupMetadata.participants.find(p => p.id === m.sender);
    console.log('\x1b[36m🔎 [BEAST-SCAN] Usuario que ejecuta:\x1b[0m', userParticipant?.id.split('@')[0]);

    // 🐉 Check si es admin o dueño del grupo
    const isUserAdmin = userParticipant?.admin === 'admin' || 
                       userParticipant?.admin === 'superadmin' || 
                       m.sender === groupMetadata.owner;

    if (!isUserAdmin) {
        await m.react('❌');
        return m.reply(`\x1b[31m❌ *PODER INSUFICIENTE*\x1b[0m

\x1b[33m🐉 Solo los guerreros con rango de administrador pueden usar este poder.\x1b[0m

\x1b[36m💢 Intensifica tu ki y pide el rango necesario.\x1b[0m`);
    }

    // 🐉 Obtener usuario a expulsar
    let user;
    if (m.mentionedJid && m.mentionedJid[0]) {
        user = m.mentionedJid[0];
    } else if (m.quoted) {
        user = m.quoted.sender;
    } else if (args[0]) {
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number) return m.reply('⚠️ *NÚMERO INVÁLIDO* ⚠️');
        user = number + '@s.whatsapp.net';
    } else {
        await m.react('❓');
        return m.reply(`\x1b[33m🐉 *MODO KICK BEAST ACTIVADO*\x1b[0m

\x1b[36m⚡ Formas de usar el poder:\x1b[0m
1. \x1b[32mMenciona al guerrero\x1b[0m
   \x1b[90mEj: .kick @usuario\x1b[0m

2. \x1b[32mResponde a su mensaje\x1b[0m
   \x1b[90mEj: Responde .kick\x1b[0m

3. \x1b[32mEscribe su número\x1b[0m
   \x1b[90mEj: .kick 1234567890\x1b[0m

\x1b[31m🔥 Elige un objetivo, guerrero!\x1b[0m`);
    }

    const ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner?.[0]?.[0] ? global.owner[0][0] + '@s.whatsapp.net' : null;

    // 🐉 Verificaciones especiales
    if (user === conn.user.jid) {
        await m.react('😂');
        return m.reply(`\x1b[35m😂 *CALMA GUERRERO*\x1b[0m

\x1b[36mNo puedo expulsarme a mí mismo, soy el guardián de este dojo.\x1b[0m

\x1b[33m🐉 Mi energía protege este lugar.\x1b[0m`);
    }
    
    if (user === ownerGroup) {
        await m.react('👑');
        return m.reply(`\x1b[33m👑 *RESPETO AL MAESTRO*\x1b[0m

\x1b[36mEse es el dueño del dojo, el creador de este grupo.\x1b[0m

\x1b[33m🐉 No puedo expulsar al maestro supremo.\x1b[0m`);
    }
    
    if (ownerBot && user === ownerBot) {
        await m.react('🤖');
        return m.reply(`\x1b[35m🤖 *PENSAMIENTO ERRÓNEO*\x1b[0m

\x1b[36m¿Qué piensas, guerrero? ¿Expulsar al creador de mi poder?\x1b[0m

\x1b[33m🐉 Mi lealtad es con mi maestro.\x1b[0m`);
    }

    // 🐉 Verificar si el usuario está en el grupo
    const targetInGroup = groupMetadata.participants.find(p => p.id === user);
    if (!targetInGroup) {
        await m.react('👻');
        return m.reply(`\x1b[35m👻 *FANTASMA DETECTADO*\x1b[0m

\x1b[36mEste guerrero ya no se encuentra en el dojo.\x1b[0m

\x1b[33m🐉 Su energía se ha desvanecido...\x1b[0m`);
    }

    try {
        // 🐉 Animación de expulsión
        await m.react('⚡');
        await m.reply(`\x1b[35m🐉 *INICIANDO EXPULSIÓN BEAST*\x1b[0m

\x1b[36m🔍 Objetivo: ${user.split('@')[0]}
⚡ Cargando energía espiritual...
🔥 Preparando ataque final...\x1b[0m`);

        // 🐉 Pequeña animación en consola
        const beastAnimation = [
            "⚡▰▱▱▱▱",
            "⚡▰▰▱▱▱", 
            "⚡▰▰▰▱▱",
            "⚡▰▰▰▰▱",
            "⚡▰▰▰▰▰"
        ];
        
        for (let frame of beastAnimation) {
            process.stdout.write(`\r\x1b[35m${frame}\x1b[0m`);
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        console.log('');

        // 🐉 Ejecutar expulsión
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        
        // 🐉 Mensajes de expulsión aleatorios
        const kickMessages = [
            `\x1b[31m💥 *KAMEHAMEHA CONECTADO!* 💥\x1b[0m

\x1b[36mEl guerrero ${user.split('@')[0]} ha sido expulsado del dojo.\x1b[0m

\x1b[33m🐉 Su energía ha sido purificada.\x1b[0m
\x1b[35m⚡ ¡Que encuentre paz en otro lugar!\x1b[0m`,

            `\x1b[33m🌪️ *TORMENTA ESPIRITUAL!* 🌪️\x1b[0m

\x1b[36mEl usuario ${user.split('@')[0]} fue lanzado fuera del grupo.\x1b[0m

\x1b[31m🔥 Su ki era demasiado débil para este dojo.\x1b[0m
\x1b[35m⚡ ¡Hasta nunca, guerrero caído!\x1b[0m`,

            `\x1b[35m🐉 *EXPULSIÓN BEAST COMPLETADA* 🐉\x1b[0m

\x1b[36mSe nos fue el User ${user.split('@')[0]} :c JJAJAJAJ\x1b[0m

\x1b[33m💫 "A veces, alejar a alguien es proteger a todos"\x1b[0m
\x1b[31m🔥 ¡Que el viento lo lleve lejos!\x1b[0m`
        ];

        const randomMsg = kickMessages[Math.floor(Math.random() * kickMessages.length)];
        
        await m.react('✅');
        await m.react('🐉');
        await m.reply(randomMsg);
        
        console.log('\x1b[32m✅ [BEAST-KICK] Expulsión exitosa\x1b[0m');
        
    } catch (e) {
        console.error('\x1b[31m❌ [BEAST-KICK] Error:', e.message, '\x1b[0m');
        await m.react('❌');
        
        const errorMessages = [
            `\x1b[31m❌ *PODER BLOQUEADO!* ❌\x1b[0m

\x1b[36mNo pude expulsar al guerrero.\x1b[0m

\x1b[33m🐉 Posibles razones:\x1b[0m
• \x1b[35mNo tengo suficiente poder (admin)\x1b[0m
• \x1b[35mEl objetivo es más fuerte que yo\x1b[0m
• \x1b[35mMi energía está baja\x1b[0m

\x1b[31m🔥 Dame más poder (admin) y lo intentaré de nuevo.\x1b[0m`,

            `\x1b[33m⚠️ *BARRERA DETECTADA* ⚠️\x1b[0m

\x1b[36mNo pude expulsar al usuario.\x1b[0m

\x1b[35mPuede que:\x1b[0m
• \x1b[31mNo sea admin nmms da admin\x1b[0m
• \x1b[31mEl usuario tenga protección especial\x1b[0m
• \x1b[31mMi poder esté limitado\x1b[0m

\x1b[36m🐉 Fortalece mi ki con permisos de administrador.\x1b[0m`
        ];
        
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        await m.reply(randomError);
    }
};

handler.help = ['kick @usuario'];
handler.tags = ['group', 'beast'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.register = false

export default handler;