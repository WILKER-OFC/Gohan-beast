import { spawn } from 'child_process'
import fs from 'fs'
import fetch from 'node-fetch'

// Efectos visuales en consola
const GO_BEAST_MODE = true

// Colores para consola (modo bestia)
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
}

// Animación de carga bestia
const beastLoading = [
  "⚡▰▱▱▱▱▱▱▱▱",
  "⚡▰▰▱▱▱▱▱▱▱",
  "⚡▰▰▰▱▱▱▱▱▱",
  "⚡▰▰▰▰▱▱▱▱▱",
  "⚡▰▰▰▰▰▱▱▱▱",
  "⚡▰▰▰▰▰▰▱▱▱",
  "⚡▰▰▰▰▰▰▰▱▱",
  "⚡▰▰▰▰▰▰▰▰▱",
  "⚡▰▰▰▰▰▰▰▰▰",
  "⚡ ¡MODO BESTIA ACTIVADO! ⚡"
]

// Logo Gohan Beast
const beastLogo = `
${colors.magenta}╔════════════════════════════════════╗
${colors.magenta}║    🐉 ${colors.cyan}GO-HAN BEAST MODE${colors.magenta} 🐉     ║
${colors.magenta}║    YouTube Downloader ${colors.yellow}v2.0${colors.magenta}    ║
${colors.magenta}╚════════════════════════════════════╝${colors.reset}
`

const yt = {
  static: Object.freeze({
    baseUrl: 'https://cnv.cx',
    headers: {
      'accept-encoding': 'gzip, deflate, br, zstd',
      'origin': 'https://frame.y2meta-uk.com',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0'
    }
  }),

  // Log con estilo bestia
  log(m, type = 'info') {
    const icons = {
      info: '🔵',
      success: '🟢',
      warning: '🟡',
      error: '🔴',
      beast: '🐉'
    }
    
    if (GO_BEAST_MODE) {
      const color = {
        info: colors.cyan,
        success: colors.green,
        warning: colors.yellow,
        error: colors.red,
        beast: colors.magenta
      }[type]
      
      console.log(`${color}${icons[type]} [YT-BEAST] ${m}${colors.reset}`)
    } else {
      console.log(`[yt-skrep] ${m}`)
    }
  },

  // Mostrar animación de carga
  async showBeastLoading(message) {
    if (!GO_BEAST_MODE) return
    
    this.log(message, 'beast')
    
    for (let i = 0; i < beastLoading.length; i++) {
      process.stdout.write(`\r${colors.magenta}${beastLoading[i]}${colors.reset}`)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    console.log('\n')
  },

  // Función para buscar video en YouTube por texto (mejorada)
  async searchVideo(query) {
    try {
      this.log(`Buscando: "${query}"`, 'info')
      
      // Método 1: Usar YouTube Data API v3
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=AIzaSyA-OesM6ZqE4prh37VQkM4KX4E8K5jM8Ng&maxResults=1&type=video`
      
      const response = await fetch(searchUrl)
      
      if (response.ok) {
        const data = await response.json()
        if (data.items && data.items[0]) {
          const videoId = data.items[0].id.videoId
          this.log(`Encontrado: ${data.items[0].snippet.title}`, 'success')
          return `https://youtu.be/${videoId}`
        }
      }

      // Método 2: Scraping directo (fallback)
      this.log('Usando método alternativo...', 'warning')
      const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      const html = await fetch(fallbackUrl).then(r => r.text())

      // Extraer el primer video ID
      const videoIdMatch = html.match(/"videoId":"([^"]+)"/)
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://youtu.be/${videoIdMatch[1]}`
      }

      throw new Error('No se encontró el video')

    } catch (error) {
      this.log(`Error en búsqueda: ${error.message}`, 'error')

      // Método 3: Invidious (alternativa)
      try {
        this.log('Intentando con Invidious...', 'warning')
        const invidiousUrl = `https://inv.riverside.rocks/api/v1/search?q=${encodeURIComponent(query)}&type=video`
        const invidiousRes = await fetch(invidiousUrl)
        if (invidiousRes.ok) {
          const data = await invidiousRes.json()
          if (data[0] && data[0].videoId) {
            this.log(`Encontrado vía Invidious`, 'success')
            return `https://youtu.be/${data[0].videoId}`
          }
        }
      } catch (e) {
        this.log(`Error con Invidious: ${e.message}`, 'error')
      }

      throw new Error(`No se pudo encontrar "${query}" en YouTube`)
    }
  },

  resolveConverterPayload(link, f = '128k') {
    const formatos = ['128k', '320k', '144p', '240p', '360p', '480p', '720p', '1080p']
    if (!formatos.includes(f)) throw Error(`Formato inválido. Formatos disponibles: ${formatos.join(', ')}`)
    const tipo = f.endsWith('k') ? 'mp3' : 'mp4'
    const audioBitrate = tipo === 'mp3' ? parseInt(f) + '' : '128'
    const videoQuality = tipo === 'mp4' ? parseInt(f) + '' : '720'
    return { link, format: tipo, audioBitrate, videoQuality, filenameStyle: 'pretty', vCodec: 'h264' }
  },

  sanitizeFileName(n) {
    const ext = n.match(/\.[^.]+$/)[0]
    const name = n.replace(new RegExp(`\\${ext}$`), '')
      .replaceAll(/[^A-Za-z0-9áéíóúÁÉÍÓÚñÑ\s]/g, '_')
      .replace(/_+/g, '_')
      .trim()
      .substring(0, 50) // Limitar longitud
    return name + ext
  },

  async getBuffer(u) {
    const h = structuredClone(this.static.headers)
    h.referer = 'https://v6.www-y2mate.com/'
    h.range = 'bytes=0-'
    delete h.origin
    
    await this.showBeastLoading('Descargando contenido...')
    
    const r = await fetch(u, { headers: h })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    
    const contentLength = r.headers.get('content-length')
    const totalSize = contentLength ? parseInt(contentLength) : 0
    
    if (totalSize > 0) {
      let downloaded = 0
      const chunks = []
      
      const reader = r.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        chunks.push(value)
        downloaded += value.length
        
        if (GO_BEAST_MODE) {
          const percent = Math.floor((downloaded / totalSize) * 100)
          const bars = Math.floor(percent / 5)
          const progress = '█'.repeat(bars) + '░'.repeat(20 - bars)
          process.stdout.write(`\r${colors.cyan}[${progress}] ${percent}%${colors.reset}`)
        }
      }
      
      if (GO_BEAST_MODE) console.log('\n')
      const totalBuffer = Buffer.concat(chunks)
      return totalBuffer
    } else {
      const ab = await r.arrayBuffer()
      return Buffer.from(ab)
    }
  },

  async getKey() {
    const r = await fetch(this.static.baseUrl + '/v2/sanity/key', { headers: this.static.headers })
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    return await r.json()
  },

  async convert(u, f) {
    const { key } = await this.getKey()
    const p = this.resolveConverterPayload(u, f)
    const h = { key, ...this.static.headers }
    
    this.log(`Convirtiendo a formato: ${f}`, 'info')
    const r = await fetch(this.static.baseUrl + '/v2/converter', { 
      headers: h, 
      method: 'post', 
      body: new URLSearchParams(p) 
    })
    
    if (!r.ok) throw Error(`${r.status} ${r.statusText}`)
    return await r.json()
  },

  async download(u, f) {
    this.log(`Iniciando descarga: ${u}`, 'beast')
    const { url, filename } = await this.convert(u, f)
    const buffer = await this.getBuffer(url)
    return { fileName: this.sanitizeFileName(filename), buffer }
  }
}

// Convertir video a faststart
async function convertToFast(buffer) {
  const tempIn = './temp_in.mp4'
  const tempOut = './temp_out.mp4'
  
  fs.writeFileSync(tempIn, buffer)
  
  await new Promise((res, rej) => {
    yt.log('Optimizando video con FFmpeg...', 'info')
    const ff = spawn('ffmpeg', ['-i', tempIn, '-c', 'copy', '-movflags', 'faststart', tempOut])
    
    ff.stderr.on('data', (data) => {
      if (GO_BEAST_MODE && data.toString().includes('frame=')) {
        process.stdout.write(`\r${colors.yellow}Optimizando: ${data.toString().split('frame=')[1].split(' ')[0]} frames${colors.reset}`)
      }
    })
    
    ff.on('close', code => code === 0 ? res() : rej(new Error('Error al convertir con ffmpeg')))
  })
  
  const newBuffer = fs.readFileSync(tempOut)
  fs.unlinkSync(tempIn)
  fs.unlinkSync(tempOut)
  yt.log('Video optimizado exitosamente', 'success')
  return newBuffer
}

// Emojis animados para reacciones
const beastReactions = ['🐉', '⚡', '🔥', '💥', '🌟', '✨']

// Handler principal para play (audio)
let handler = async (m, { conn, args, command }) => {
  // Mostrar logo al inicio si está en modo bestia
  if (GO_BEAST_MODE) console.log(beastLogo)
  
  if (!args[0]) {
    await m.react('❌')
    return m.reply(`${colors.red}*🐉 MODO BESTIA ACTIVADO 🐉*\n\n*Escribe el nombre de la canción o artista*\n\n*Ejemplos:*\n${colors.green}.play ${colors.cyan}bad bunny tití me preguntó\n${colors.green}.play ${colors.cyan}feid lucky\n${colors.green}.play ${colors.cyan}morat no se va${colors.reset}`)
  }

  try {
    // Reacción aleatoria bestia
    const randomReaction = beastReactions[Math.floor(Math.random() * beastReactions.length)]
    await m.react(randomReaction)
    
    const searchQuery = args.join(' ')
    await m.reply(`${colors.magenta}🐉 *GO-HAN BEAST MODE ACTIVADO* 🐉\n${colors.cyan}🔍 Buscando: *${searchQuery}*${colors.reset}`)

    // Buscar el video
    await yt.showBeastLoading('Buscando en YouTube...')
    const videoUrl = await yt.searchVideo(searchQuery)

    await m.react('⚡')
    await m.reply(`${colors.yellow}⚡ *¡VIDEO ENCONTRADO!*\n${colors.green}📥 Descargando audio en calidad premium...${colors.reset}`)

    // Descargar audio
    const formato = args[1] || '320k' // Mejor calidad por defecto
    await yt.showBeastLoading('Descargando audio...')
    const { buffer, fileName } = await yt.download(videoUrl, formato)

    // Enviar audio con metadatos
    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: fileName,
      contextInfo: {
        externalAdReply: {
          title: `🎵 ${searchQuery.substring(0, 30)}`,
          body: '🐉 Modo Bestia - Descarga Completa',
          mediaType: 1,
          thumbnail: await conn.getFile(buffer.slice(0, 1024)).catch(() => null)
        }
      }
    }, { quoted: m })

    // Reacciones finales
    await m.react('✅')
    await m.react('🔥')
    
    yt.log(`Descarga completada: ${fileName}`, 'success')
    return m.reply(`${colors.green}✅ *DESCARGA COMPLETADA*\n${colors.cyan}🐉 ¡MODO BESTIA FINALIZADO CON ÉXITO! 🐉${colors.reset}`)

  } catch (e) {
    console.error(e)
    await m.react('❌')
    await m.react('💀')
    yt.log(`Error: ${e.message}`, 'error')
    return m.reply(`${colors.red}❌ *ERROR BESTIAL*\n\n${e.message}\n\n${colors.yellow}Intenta con otro nombre o verifica la conexión*${colors.reset}`)
  }
}

// Handler para play con video
let handler2 = async (m, { conn, args, command }) => {
  if (GO_BEAST_MODE) console.log(beastLogo)
  
  if (!args[0]) {
    await m.react('❌')
    return m.reply(`${colors.red}*🎬 MODO VIDEO BESTIA 🎬*\n\n*Escribe el nombre del video*\n\n*Ejemplos:*\n${colors.green}.playv ${colors.cyan}trailers 2024\n${colors.green}.playv ${colors.cyan}shakira bzrp\n${colors.green}.playv ${colors.cyan}tutorial javascript${colors.reset}`)
  }

  try {
    await m.react('🎬')
    const searchQuery = args.join(' ')
    
    await m.reply(`${colors.magenta}🎬 *MODO VIDEO BESTIA ACTIVADO* 🎬\n${colors.cyan}🔍 Buscando: *${searchQuery}*${colors.reset}`)

    await yt.showBeastLoading('Buscando video...')
    const videoUrl = await yt.searchVideo(searchQuery)

    await m.react('⚡')
    await m.reply(`${colors.yellow}⚡ *¡VIDEO ENCONTRADO!*\n${colors.green}📥 Descargando video en HD...${colors.reset}`)

    // Descargar video
    const formato = args[1] || '720p'
    await yt.showBeastLoading('Descargando video...')
    let { buffer, fileName } = await yt.download(videoUrl, formato)
    
    // Optimizar video
    await yt.showBeastLoading('Optimizando video...')
    buffer = await convertToFast(buffer)

    // Enviar video
    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName: fileName,
      caption: `${colors.green}✅ *VIDEO DESCARGADO*\n${colors.cyan}🎬 ${searchQuery}\n🐉 Modo Bestia - Calidad HD${colors.reset}`
    }, { quoted: m })

    await m.react('✅')
    await m.react('🌟')
    
    yt.log(`Video descargado: ${fileName}`, 'success')
    
  } catch (e) {
    console.error(e)
    await m.react('❌')
    yt.log(`Error: ${e.message}`, 'error')
    return m.reply(`${colors.red}❌ *ERROR EN VIDEO*\n\n${e.message}${colors.reset}`)
  }
}

// Handler para audio desde URL directa
let handler3 = async (m, { conn, args, command }) => {
  if (!args[0]) {
    await m.react('🔗')
    return m.reply(`${colors.red}*🔗 MODO URL DIRECTA*\n\n*Pega un link de YouTube*\n\n*Ejemplo:*\n${colors.green}.ytmp3 ${colors.cyan}https://youtu.be/JiEW1agPqNY${colors.reset}`)
  }

  try {
    await m.react('⚡')
    await m.reply(`${colors.magenta}🔗 *PROCESANDO URL*\n${colors.yellow}${args[0]}${colors.reset}`)

    const formato = args[1] || '320k'
    await yt.showBeastLoading('Descargando desde URL...')
    const { buffer, fileName } = await yt.download(args[0], formato)

    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: fileName
    }, { quoted: m })

    await m.react('✅')
    await m.reply(`${colors.green}✅ *AUDIO DESCARGADO*\n${colors.cyan}🔗 URL procesada con éxito${colors.reset}`)
    
  } catch (e) {
    await m.react('❌')
    return m.reply(`${colors.red}❌ Error: ${e.message}${colors.reset}`)
  }
}

// Handler para video desde URL directa
let handler4 = async (m, { conn, args, command }) => {
  if (!args[0]) {
    await m.react('🔗')
    return m.reply(`${colors.red}*🎥 VIDEO DESDE URL*\n\n*Pega un link de YouTube*\n\n*Ejemplo:*\n${colors.green}.ytmp4 ${colors.cyan}https://youtu.be/JiEW1agPqNY 1080p${colors.reset}`)
  }

  try {
    await m.react('🎥')
    await m.reply(`${colors.magenta}🎥 *PROCESANDO VIDEO URL*\n${colors.yellow}${args[0]}${colors.reset}`)

    const formato = args[1] || '720p'
    await yt.showBeastLoading('Descargando video desde URL...')
    let { buffer, fileName } = await yt.download(args[0], formato)
    
    await yt.showBeastLoading('Optimizando video...')
    buffer = await convertToFast(buffer)

    await conn.sendMessage(m.chat, {
      video: buffer,
      mimetype: 'video/mp4',
      fileName: fileName,
      caption: `${colors.green}✅ *VIDEO DESCARGADO*\n${colors.cyan}🎥 Desde URL - Modo Bestia${colors.reset}`
    }, { quoted: m })

    await m.react('✅')
    await m.react('🎬')
    
  } catch (e) {
    await m.react('❌')
    return m.reply(`${colors.red}❌ Error: ${e.message}${colors.reset}`)
  }
}

// Comandos mejorados
handler.help = ['play <nombre canción>', 'p <nombre canción>', 'musica <nombre canción>']
handler.tags = ['dl', 'audio', 'beast']
handler.command = ['play', 'p', 'musica', 'goaudio', 'beastplay']

handler2.help = ['playv <nombre video>', 'pv <nombre video>', 'videoplay <nombre video>']
handler2.tags = ['dl', 'video', 'beast']
handler2.command = ['playv', 'pv', 'videoplay', 'govideo', 'beastvideo']

handler3.help = ['ytmp3 <link youtube> [calidad]', 'yta <link>', 'ytmp3vd <link>']
handler3.tags = ['dl', 'audio', 'beast']
handler3.command = ['ytmp3', 'yta', 'ytmp3vd', 'beastmp3']

handler4.help = ['ytmp4 <link youtube> [calidad]', 'ytv <link>', 'ytvideovd <link>']
handler4.tags = ['dl', 'video', 'beast']
handler4.command = ['ytmp4', 'ytv', 'ytvideovd', 'beastmp4']

export default handler
export { handler2, handler3, handler4 }