import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

// Variables de configuración Beast
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

// Mensajes de vinculación temáticos Beast
let rtx = `
╔═══════════════════════════════╗
║   🐉 VINCULACIÓN SAIYAN BEAST  ║
╠═══════════════════════════════╣
║ 📱 *PASOS PARA VINCULAR:*
║ 
║ 1️⃣ Abre WhatsApp en tu teléfono
║ 2️⃣ Toca ⋮ *Más opciones*
║ 3️⃣ Selecciona *Dispositivos vinculados*
║ 4️⃣ Pulsa *"Vincular un dispositivo"*
║ 5️⃣ Escanea este código QR
║ 
║ ⚡ *Transformación Beast activada*
║ 🌀 *Energía Saiyan: 100%*
╚═══════════════════════════════╝
`.trim()

let rtx2 = `
╔═══════════════════════════════╗
║   ⚡ CÓDIGO BEAST (8 dígitos)   ║
╠═══════════════════════════════╣
║ 📱 *PASOS PARA VINCULAR:*
║ 
║ 1️⃣ Abre WhatsApp en tu teléfono
║ 2️⃣ Toca ⋮ *Más opciones*
║ 3️⃣ Selecciona *Dispositivos vinculados*
║ 4️⃣ Pulsa *"Vincular un dispositivo"*
║ 5️⃣ Selecciona *"Con número"*
║ 6️⃣ Introduce el código BEAST
║ 
║ ⚠️ *IMPORTANTE SAIYAN:*
║ • Código válido por 15 segundos
║ • Solo para este número
║ • Recomendado: Solicitarlo en privado
║ 
║ 🐉 *¡Activando Sub-Saiyan!*
╚═══════════════════════════════╝
`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const beastJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000
  
  // Contar Sub-Saiyans activos
  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
  const subBotsCount = subBots.length
  
  if (subBotsCount === 50) {
    return m.reply(`🐉 *LÍMITE DE SUB-SAIYANS ALCANZADO* ⚡\n\nNo hay espacio disponible para más Sub-Saiyans.`)
  }
  
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split`@`[0]}`
  let pathBeastJadiBot = path.join(`./${global.jadi || 'JadiBots'}/`, id)
  
  if (!fs.existsSync(pathBeastJadiBot)) {
    fs.mkdirSync(pathBeastJadiBot, { recursive: true })
    console.log(chalk.hex('#FF3366')(`🌀 [BEAST] Nueva carpeta Sub-Saiyan creada: ${id}`))
  }
  
  beastJBOptions.pathBeastJadiBot = pathBeastJadiBot
  beastJBOptions.m = m
  beastJBOptions.conn = conn
  beastJBOptions.args = args
  beastJBOptions.usedPrefix = usedPrefix
  beastJBOptions.command = command
  beastJBOptions.fromCommand = true
  
  // Mostrar mensaje de inicio Beast
  await m.react('🌀')
  await m.reply(`🐉 *INICIANDO VINCULACIÓN SAIYAN* ⚡\n\nPreparando transformación Sub-Saiyan...`)
  
  await beastJadiBot(beastJBOptions)
  global.db.data.users[m.sender].Subs = new Date * 1
} 

handler.help = ['qr', 'code', 'subbeast', 'saiyan']
handler.tags = ['serbot', 'beast']
handler.command = ['qr', 'code', 'subbeast', 'saiyan', 'beastcode']
export default handler 

export async function beastJadiBot(options) {
  let { pathBeastJadiBot, m, conn, args, usedPrefix, command } = options
  
  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }
  
  const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
  let txtCode, codeBot, txtQR
  
  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, "").trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
    if (args[0] == "") args[0] = undefined
  }
  
  const pathCreds = path.join(pathBeastJadiBot, "creds.json")
  if (!fs.existsSync(pathBeastJadiBot)) {
    fs.mkdirSync(pathBeastJadiBot, { recursive: true })
  }
  
  try {
    args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
  } catch {
    await m.reply(`🐉 *USO CORRECTO* ⚡\n\nUsa: ${usedPrefix + command} code`)
    return
  }
  
  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
  exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
    const drmer = Buffer.from(drm1 + drm2, `base64`)
    
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const msgRetry = (MessageRetryMap) => { }
    const msgRetryCache = new NodeCache()
    const { state, saveState, saveCreds } = await useMultiFileAuthState(pathBeastJadiBot)
    
    const connectionOptions = {
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      auth: { 
        creds: state.creds, 
        keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) 
      },
      msgRetry,
      msgRetryCache,
      browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['🐉 Gohan Beast', 'Chrome', 'Beast v1.0'],
      version: version,
      generateHighQualityLinkPreview: true
    };
    
    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    let isInit = true
    
    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      
      if (isNewLogin) sock.isInit = false
      
      // QR CODE BEAST MODE
      if (qr && !mcode) {
        if (m?.chat) {
          // Crear QR con diseño Beast
          const qrBuffer = await qrcode.toBuffer(qr, { 
            scale: 10,
            margin: 2,
            color: {
              dark: '#FF3366',
              light: '#000000'
            }
          })
          
          txtQR = await conn.sendMessage(m.chat, { 
            image: qrBuffer, 
            caption: rtx.trim()
          }, { quoted: m })
          
          // Reacción Beast
          await m.react('⚡')
        } else {
          return 
        }
        
        if (txtQR && txtQR.key) {
          setTimeout(() => { 
            conn.sendMessage(m.sender, { 
              text: '🌀 *CÓDIGO QR EXPIRADO*\n\nEl código Beast ha expirado. Usa nuevamente `.code`',
              delete: txtQR.key 
            })
          }, 30000)
        }
        return
      } 
      
      // CÓDIGO NUMÉRICO BEAST
      if (qr && mcode) {
        let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
        secret = secret.match(/.{1,4}/g)?.join(" ")
        
        txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
        codeBot = await m.reply(`╔═══════════════════════════════╗\n║        🐉 *CÓDIGO BEAST* ⚡      ║\n╠═══════════════════════════════╣\n║           🔢 *${secret}*          ║\n╠═══════════════════════════════╣\n║ ⏱️ *Expira en:* 15 segundos\n║ ⚡ *Usa rápido Saiyan!*\n╚═══════════════════════════════╝`)
        
        console.log(chalk.hex('#FFCC00')(`🌀 [BEAST CODE] Código generado: ${secret}`))
        
        // Reacción especial
        await m.react('🔢')
        await m.react('⚡')
      }
      
      if (txtCode && txtCode.key) {
        setTimeout(() => { 
          conn.sendMessage(m.sender, { 
            delete: txtCode.key 
          })
        }, 30000)
      }
      
      if (codeBot && codeBot.key) {
        setTimeout(() => { 
          conn.sendMessage(m.sender, { 
            text: '⏱️ *CÓDIGO BEAST EXPIRADO*\n\nEl código de vinculación ha expirado.',
            delete: codeBot.key 
          })
        }, 30000)
      }
      
      const endSesion = async (loaded) => {
        if (!loaded) {
          try {
            sock.ws.close()
          } catch {
          }
          sock.ev.removeAllListeners()
          let i = global.conns.indexOf(sock)                
          if (i < 0) return 
          delete global.conns[i]
          global.conns.splice(i, 1)
        }
      }
      
      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
      
      // Manejo de errores con temática Beast
      if (connection === 'close') {
        if (reason === 428) {
          console.log(chalk.hex('#FF3366')(`🌀 [BEAST] Conexión perdida (+${path.basename(pathBeastJadiBot)}). Reactivando células Saiyan...`))
          await creloadHandler(true).catch(console.error)
        }
        
        if (reason === 408) {
          console.log(chalk.hex('#FF9900')(`⚠️ [BEAST] Timeout en Sub-Saiyan (+${path.basename(pathBeastJadiBot)}). Reconectando...`))
          await creloadHandler(true).catch(console.error)
        }
        
        if (reason === 440) {
          console.log(chalk.hex('#FF0000')(`💥 [BEAST] Sesión reemplazada (+${path.basename(pathBeastJadiBot)}).`))
          try {
            // Mensaje de sesión reemplazada
          } catch (error) {
            console.error(chalk.hex('#FF9900')(`🌀 [BEAST] Error 440 en Sub-Saiyan: +${path.basename(pathBeastJadiBot)}`))
          }
        }
        
        if (reason == 405 || reason == 401) {
          console.log(chalk.hex('#FF0000')(`💀 [BEAST] Sesión cerrada (+${path.basename(pathBeastJadiBot)}). Credenciales inválidas.`))
          try {
            // Mensaje de sesión cerrada
          } catch (error) {
            console.error(chalk.hex('#FF9900')(`🌀 [BEAST] Error 405 en Sub-Saiyan: +${path.basename(pathBeastJadiBot)}`))
          }
          fs.rmdirSync(pathBeastJadiBot, { recursive: true })
        }
        
        if (reason === 500) {
          console.log(chalk.hex('#FF3366')(`🌀 [BEAST] Error interno (+${path.basename(pathBeastJadiBot)}). Reiniciando...`))
          return creloadHandler(true).catch(console.error)
        }
        
        if (reason === 515) {
          console.log(chalk.hex('#00FFFF')(`🌀 [BEAST] Reinicio automático (+${path.basename(pathBeastJadiBot)}).`))
          await creloadHandler(true).catch(console.error)
        }
        
        if (reason === 403) {
          console.log(chalk.hex('#FF0000')(`💀 [BEAST] Cuenta en soporte (+${path.basename(pathBeastJadiBot)}).`))
          fs.rmdirSync(pathBeastJadiBot, { recursive: true })
        }
      }
      
      if (global.db.data == null) loadDatabase()
      
      if (connection == `open`) {
        if (!global.db.data?.users) loadDatabase()
        let userName, userJid 
        userName = sock.authState.creds.me.name || 'Saiyan Anónimo'
        userJid = sock.authState.creds.me.jid || `${path.basename(pathBeastJadiBot)}@s.whatsapp.net`
        
        // Mensaje de conexión exitosa Beast
        console.log(chalk.hex('#00FF00')(`
╔═══════════════════════════════╗
║    🐉 SUB-SAIYAN CONECTADO ⚡   ║
╠═══════════════════════════════╣
║ 👤 *Nombre:* ${userName}
║ 📱 *Número:* +${path.basename(pathBeastJadiBot)}
║ 🌀 *Estado:* Beast Mode ACTIVADO
║ ⚡ *Energía:* 100%
╚═══════════════════════════════╝`))
        
        sock.isInit = true
        global.conns.push(sock)
        
        // Notificar en el chat principal
        if (m?.chat) {
          await conn.sendMessage(m.chat, {
            text: `🎉 *¡SUB-SAIYAN ACTIVADO!* ⚡\n\n✅ *${userName}* se ha conectado exitosamente.\n🌀 *Estado:* Beast Mode completado\n🔱 *¡Listo para la batalla!*`
          })
        }
        
        await joinChannels(sock)
        await m.react('✅')
      }
    }
    
    setInterval(async () => {
      if (!sock.user) {
        try { sock.ws.close() } catch (e) {      
        }
        sock.ev.removeAllListeners()
        let i = global.conns.indexOf(sock)                
        if (i < 0) return
        delete global.conns[i]
        global.conns.splice(i, 1)
      }
    }, 60000)
    
    let handler = await import('../handler.js')
    let creloadHandler = async function (restatConn) {
      try {
        const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
        if (Object.keys(Handler || {}).length) handler = Handler
      } catch (e) {
        console.error('🌀 [BEAST] Error al recargar handler:', e)
      }
      
      if (restatConn) {
        const oldChats = sock.chats
        try { sock.ws.close() } catch { }
        sock.ev.removeAllListeners()
        sock = makeWASocket(connectionOptions, { chats: oldChats })
        isInit = true
      }
      
      if (!isInit) {
        sock.ev.off("messages.upsert", sock.handler)
        sock.ev.off("connection.update", sock.connectionUpdate)
        sock.ev.off('creds.update', sock.credsUpdate)
      }
      
      sock.handler = handler.handler.bind(sock)
      sock.connectionUpdate = connectionUpdate.bind(sock)
      sock.credsUpdate = saveCreds.bind(sock, true)
      sock.ev.on("messages.upsert", sock.handler)
      sock.ev.on("connection.update", sock.connectionUpdate)
      sock.ev.on("creds.update", sock.credsUpdate)
      isInit = false
      return true
    }
    
    creloadHandler(false)
  })
}

// Función para unirse a canales
async function joinChannels(conn) {
  for (const channelId of Object.values(global.ch || {})) {
    await conn.newsletterFollow(channelId).catch(() => {})
  }
}

// Aliases adicionales
handler.alias = ['gohanqr', 'gohanqr', 'gohancode']