// Código Gohan Beast Mode - Eliminador de basura de descargas
// Creado con el poder del Ultra Instinto

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';
const execPromise = util.promisify(exec);

let handler = async (m, { conn, args, isOwner, isROwner }) => {
  // 🔥 MODO GOHAN BEAST - ACTIVADO 🔥
  
  // Verificar permisos (solo owner/root)
  if (!isOwner && !isROwner) {
    await conn.sendMessage(m.chat, {
      text: `⚡ *MODO GOHAN BEAST - ACCESO DENEGADO* ⚡\n\n❌ Solo el *propietario* puede activar este poder.\n\n▸ *Razón:* Demasiado destructivo para usuarios normales.`,
      ...rcanal
    }, { quoted: m });
    return m.react('❌');
  }

  // React inicial épica
  await m.react('⚡');
  await m.react('🐉');
  
  const startTime = Date.now();
  const cleanupMessage = await conn.sendMessage(m.chat, {
    text: `🦖 *MODO GOHAN BEAST - ACTIVADO* 🦖\n\n» Eliminando basura de descargas...\n» Rastreando archivos innecesarios...\n» Preparando *Makankosappo* digital...`,
    ...rcanal
  }, { quoted: m });

  // Definir carpetas y extensiones de basura
  const downloadFolders = [
    './downloads',
    './tmp',
    './temp',
    './cache',
    './sessions',
    './media',
    './audio',
    './videos',
    './images',
    './thumbnails',
    './sticker',
    './database/backup',
    './node_modules/.cache',
    './.npm-cache',
    process.cwd() + '/downloads',
    './sesiones',
    './.temp'
  ];

  const garbageExtensions = [
    // 📦 Archivos de descarga
    '.mp3', '.m4a', '.opus', '.ogg', '.wav', '.aac',
    '.mp4', '.mov', '.avi', '.mkv', '.webm', '.flv',
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.ico',
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.apk', '.exe', '.msi',
    '.vcf', '.ics',
    
    // 🗑️ Archivos temporales
    '.tmp', '.temp', '.cache', '.log', '.bak', '.backup',
    
    // 📱 Archivos específicos de WhatsApp/Telegram
    '.wa', '.telegram', '.crdownload',
    
    // 🎵 Formatos adicionales
    '.flac', '.wma', '.mpeg', '.3gp', '.3gpp',
    
    // 🖼️ Formatos de imagen adicionales
    '.svg', '.bmp', '.tiff', '.psd', '.ai',
    
    // 📄 Documentos
    '.txt', '.rtf', '.csv', '.ods', '.odt',
    
    // 🗜️ Comprimidos
    '.xz', '.zst', '.br', '.bz2',
    
    // 🎬 Subtítulos
    '.srt', '.vtt', '.ass', '.sub',
    
    // 🔧 Archivos de sistema
    '.lock', '.pid', '.socket',
    
    // ☕ Archivos de JavaScript/Node.js
    '.npm', '.node', '.node-gyp',
    
    // 🐍 Python cache
    '__pycache__', '.pyc', '.pyo',
    
    // 🦎 Rust/Cargo
    '.cargo-lock',
    
    // 📦 NPM/Node
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'
  ];

  const garbageFolders = [
    'node_modules/.cache',
    '.cache-loader',
    '.parcel-cache',
    '.webpack',
    '.vite',
    '.next/cache',
    '.nuxt/cache',
    '.angular/cache'
  ];

  let totalDeleted = 0;
  let totalSize = 0;
  let deletedItems = [];

  // 🔥 MODO BEAST - LIMPIEZA EXTREMA 🔥
  const beastMode = args.includes('--beast') || args.includes('-b');
  const ultraBeast = args.includes('--ultra') || args.includes('-u');
  
  if (ultraBeast) {
    // ⚡ GOHAN ULTRA BEAST
    downloadFolders.push(
      './node_modules',
      './.git',
      './logs',
      './npm-debug.log*',
      './yarn-debug.log*',
      './yarn-error.log*',
      './.pnpm-store',
      './.eslintcache',
      './.pytest_cache',
      './.mypy_cache',
      './.jupyter_cache',
      './.dart_tool',
      './.flutter-plugins',
      './.packages',
      './.pub-cache',
      './build',
      './dist',
      './out',
      './coverage',
      './.nyc_output',
      './.serverless',
      './.serverless_nextjs',
      './.terraform',
      './.serverless'
    );
  }

  // Función para obtener tamaño en formato legible
  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }

  // Función para eliminar archivos con furia de Saiyan
  async function deleteGarbage(folder) {
    if (!fs.existsSync(folder)) return;
    
    try {
      const files = fs.readdirSync(folder);
      
      for (const file of files) {
        const filePath = path.join(folder, file);
        
        try {
          const stat = fs.statSync(filePath);
          
          // Si es un directorio
          if (stat.isDirectory()) {
            // Extensiones de carpetas basura
            if (garbageExtensions.some(ext => 
              file.toLowerCase().includes(ext.toLowerCase()) || 
              filePath.toLowerCase().includes(ext.toLowerCase())
            )) {
              const size = await getFolderSize(filePath);
              fs.rmSync(filePath, { recursive: true, force: true });
              totalDeleted++;
              totalSize += size;
              deletedItems.push(`${filePath} (${formatBytes(size)})`);
            } else {
              await deleteGarbage(filePath);
            }
          } 
          // Si es un archivo
          else {
            const ext = path.extname(file).toLowerCase();
            if (garbageExtensions.includes(ext) || 
                garbageExtensions.some(g => file.toLowerCase().includes(g))) {
              const size = stat.size;
              fs.unlinkSync(filePath);
              totalDeleted++;
              totalSize += size;
              deletedItems.push(`${filePath} (${formatBytes(size)})`);
            }
          }
        } catch (err) {
          // Ignorar errores de permisos
        }
      }
    } catch (err) {
      // Ignorar errores de carpeta
    }
  }

  // Función para obtener tamaño de carpeta
  function getFolderSize(folderPath) {
    let size = 0;
    if (!fs.existsSync(folderPath)) return size;
    
    try {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          size += getFolderSize(filePath);
        } else {
          size += stat.size;
        }
      }
    } catch (err) {}
    return size;
  }

  // Limpiar carpetas de basura específicas
  for (const folder of garbageFolders) {
    if (fs.existsSync(folder)) {
      const size = await getFolderSize(folder);
      fs.rmSync(folder, { recursive: true, force: true, maxRetries: 5 });
      totalDeleted++;
      totalSize += size;
      deletedItems.push(`${folder} (${formatBytes(size)})`);
    }
  }

  // Limpiar todas las carpetas de descargas
  for (const folder of downloadFolders) {
    await deleteGarbage(folder);
  }

  // 🧹 Limpiar archivos temporales del sistema
  try {
    if (process.platform === 'win32') {
      await execPromise('del /q/f/s %TEMP%\\*');
    } else {
      await execPromise('rm -rf /tmp/*');
    }
  } catch (err) {}

  const endTime = Date.now();
  const executionTime = ((endTime - startTime) / 1000).toFixed(2);

  // Preparar mensaje épico
  let deletedList = '';
  if (deletedItems.length > 0) {
    deletedList = deletedItems.slice(0, 5).map((item, i) => `▸ ${i + 1}. ${path.basename(item)}`).join('\n');
    if (deletedItems.length > 5) {
      deletedList += `\n▸ ... y ${deletedItems.length - 5} archivos más`;
    }
  } else {
    deletedList = '▸ No se encontró basura 🧹';
  }

  // Mensaje final con poder Gohan Beast
  const finalMessage = `🦖 *━ GOHAN BEAST - CLEANER ━* 🦖

╔══════════════════╗
  📊 *ESTADÍSTICAS DE DESTRUCCIÓN*
╚══════════════════╝

🗑️ *Archivos eliminados:* ${totalDeleted}
💾 *Espacio liberado:* ${formatBytes(totalSize)}
⚡ *Modo:* ${ultraBeast ? 'ULTRA BEAST 🌋' : beastMode ? 'BEAST 🦖' : 'Normal'}
⏱️ *Tiempo:* ${executionTime} segundos

📁 *ARCHIVOS ELIMINADOS:*
${deletedList}

╔══════════════════╗
 🧹 *SISTEMA OPTIMIZADO*
╚══════════════════╝

> *"Este es mi poder... ¡GOHAN BEAST!"*
> *"No es basura, son recuerdos... QUE YA NO NECESITAS"*

✨ *Comandos especiales:*
▸ .deletebs — Modo normal
▸ .deletebs --beast — Beast bot 🦖
▸ .deletebs --ultra — Modo Ultra Beast 🌋

💫 *Gohan Beast Cleaner v1.0*`;

  await conn.sendMessage(m.chat, {
    text: finalMessage,
    contextInfo: {
      externalAdReply: {
        title: 'GOHAN BEAST • CLEANER',
        body: 'Poder del Ultra Instinto',
        thumbnail: fs.readFileSync('./media/beast.jpg') || null,
        mediaType: 1,
        renderLargerThumbnail: true,
      }
    },
    ...rcanal
  }, { quoted: m });

  await m.react('✅');
  await m.react('🦖');
};

handler.help = ['deletebs'];
handler.tags = ['tools'];
handler.command = /^(deletebs|limpiar|cleanup|cleanbeast)$/i;
handler.rowner = true;
handler.owner = true;

export default handler;