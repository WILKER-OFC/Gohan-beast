import fetch from 'node-fetch';

const handler = async (m, { conn, args, usedPrefix, command }) => {
    const emoji = "⚡";
    
    if (!args[0]) {
        return conn.reply(m.chat, 
            `*GOHAN BEAST BOT - TIKTOK*\n\n` +
            `*Uso:* ${usedPrefix + command} <enlace_tiktok>\n` +
            `*Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/ZM6UHJYtE/`,
        m);
    }

    try {
        await m.react('⏳');
        
        const tiktokData = await tiktokdl(args[0]);
        const result = tiktokData?.data;

        if (!result?.play) {
            await m.react('❌');
            return conn.reply(m.chat, '❌ No se pudo descargar el video', m);
        }

        const caption = 
            `*⚡ GOHAN BEAST BOT - TIKTOK ⚡*\n\n` +
            `*Título:* ${result.title || 'Sin título'}\n` +
            `*Autor:* ${result.author?.nickname || 'Desconocido'}\n` +
            `*Duración:* ${result.duration || 0}s\n` +
            `*Vistas:* ${result.play_count || 0}\n\n` +
            `*🌩️ Descarga realizada con éxito*`;

        await conn.sendFile(m.chat, result.play, 'gohan_tiktok.mp4', caption, m);
        await m.react('✅');

    } catch (e) {
        console.error(e);
        await m.react('❌');
        return conn.reply(m.chat, '❌ Error al descargar', m);
    }
};

handler.help = ['tiktok'].map(v => v + ' <enlace>');
handler.tags = ['descargas'];
handler.command = ['tiktok', 'tt', 'tiktokdl'];
handler.group = true;
handler.register = false;

export default handler;

async function tiktokdl(url) {
    const api = `https://www.tikwm.com/api/?url=${url}&hd=1`;
    const res = await fetch(api);
    return await res.json();
}