import fetch from 'node-fetch';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import FormData from 'form-data';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    // Reacción de espera
    await m.react('🕒');
    
    // Verificar si hay archivo adjunto
    if (!m.quoted && !/image|video|sticker|audio|document/.test(m.mtype)) {
      await conn.reply(m.chat, 
        `📤 *SUBIR ARCHIVO TEMPORAL*\n\n` +
        `✨ *Cómo usar:*\n` +
        `1. Responde a una imagen, video, audio o archivo\n` +
        `2. O envía el archivo junto con el comando\n\n` +
        `📌 *Ejemplos:*\n` +
        `• ${usedPrefix}subir (respondiendo a un archivo)\n` +
        `• ${usedPrefix}upload (respondiendo a un archivo)\n\n` +
        `📂 *Formatos soportados:*\n` +
        `• Imágenes: JPG, PNG, GIF, WEBP, BMP\n` +
        `• Videos: MP4, AVI, MOV, MKV\n` +
        `• Audio: MP3, WAV, OGG\n` +
        `• Documentos: PDF, TXT, DOC\n` +
        `• Tamaño máximo: 32MB`,
        m
      );
      await m.react('ℹ️');
      return;
    }

    await conn.reply(m.chat, '📤 *Subiendo archivo...*', m);
    
    let media, fileName, mimeType, buffer;
    
    // Obtener el archivo según el tipo
    if (m.quoted) {
      // Si es respuesta a un mensaje
      if (m.quoted.mtype === 'imageMessage') {
        media = await m.quoted.download();
        fileName = `image_${Date.now()}.jpg`;
        mimeType = 'image/jpeg';
      } else if (m.quoted.mtype === 'videoMessage') {
        media = await m.quoted.download();
        fileName = `video_${Date.now()}.mp4`;
        mimeType = 'video/mp4';
      } else if (m.quoted.mtype === 'audioMessage') {
        media = await m.quoted.download();
        fileName = `audio_${Date.now()}.mp3`;
        mimeType = 'audio/mpeg';
      } else if (m.quoted.mtype === 'documentMessage') {
        media = await m.quoted.download();
        fileName = m.quoted.fileName || `document_${Date.now()}`;
        mimeType = m.quoted.mimetype;
      } else if (m.quoted.mtype === 'stickerMessage') {
        media = await m.quoted.download();
        fileName = `sticker_${Date.now()}.webp`;
        mimeType = 'image/webp';
      } else {
        await conn.reply(m.chat, '❌ Tipo de archivo no soportado.', m);
        await m.react('❌');
        return;
      }
    } else {
      // Si el archivo viene en el mensaje
      if (m.mtype === 'imageMessage') {
        media = await m.download();
        fileName = `image_${Date.now()}.jpg`;
        mimeType = 'image/jpeg';
      } else if (m.mtype === 'videoMessage') {
        media = await m.download();
        fileName = `video_${Date.now()}.mp4`;
        mimeType = 'video/mp4';
      } else if (m.mtype === 'audioMessage') {
        media = await m.download();
        fileName = `audio_${Date.now()}.mp3`;
        mimeType = 'audio/mpeg';
      } else if (m.mtype === 'documentMessage') {
        media = await m.download();
        fileName = m.fileName || `document_${Date.now()}`;
        mimeType = m.mimetype;
      } else {
        await conn.reply(m.chat, '❌ Tipo de archivo no soportado.', m);
        await m.react('❌');
        return;
      }
    }
    
    // Verificar tamaño (32MB máximo)
    if (media.length > 32 * 1024 * 1024) {
      await conn.reply(m.chat, '❌ El archivo es demasiado grande. Máximo 32MB.', m);
      await m.react('❌');
      return;
    }
    
    // Detectar tipo de archivo
    const fileType = await fileTypeFromBuffer(media).catch(() => null);
    const extension = fileType ? fileType.ext : fileName.split('.').pop();
    
    // Crear FormData
    const form = new FormData();
    form.append('file', media, {
      filename: fileName,
      contentType: mimeType
    });
    
    // Subir a la API
    const response = await fetch('https://gohanfile-storage.neocities.org/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error en la API: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success || !result.url) {
      throw new Error('No se pudo obtener el enlace de descarga');
    }
    
    // Mostrar resultados
    const fileSize = (media.length / (1024 * 1024)).toFixed(2);
    const downloadUrl = result.url;
    const viewUrl = downloadUrl.replace('/download/', '/view/');
    
    let infoMessage = `✅ *ARCHIVO SUBIDO EXITOSAMENTE*\n\n`;
    infoMessage += `📁 *Nombre:* ${fileName}\n`;
    infoMessage += `📊 *Tamaño:* ${fileSize} MB\n`;
    infoMessage += `📄 *Tipo:* ${mimeType}\n`;
    infoMessage += `🔗 *Enlace de descarga:*\n${downloadUrl}\n`;
    infoMessage += `👁️ *Vista previa:*\n${viewUrl}\n\n`;
    infoMessage += `⏳ *El archivo estará disponible por 30 días.*`;
    
    await conn.reply(m.chat, infoMessage, m);
    
    // Enviar vista previa si es imagen
    if (mimeType.startsWith('image/') && !mimeType.includes('webp')) {
      await conn.sendFile(m.chat, media, 'preview.jpg', `📸 Vista previa de ${fileName}`, m);
    }
    
    await m.react('✅');
    
  } catch (error) {
    console.error('Error en subir archivo:', error);
    await conn.reply(m.chat, `❌ Error al subir el archivo: ${error.message}`, m);
    await m.react('⚠️');
  }
};

handler.command = ['tourl', 'upload', 'tempmail', 'tmpupload'];
handler.help = [
  'tourl - Subir archivos temporales (32MB max)',
  'upload - Upload files to temporary storage'
];
handler.tags = ['herramientas'];
handler.group = false;

export default handler;