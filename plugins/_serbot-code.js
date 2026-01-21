const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import * as ws from 'ws'
const { spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

// Mensajes con estilo Gohan Beast
let rtx = `
🐉 *VINCULACIÓN GOHAN BEAST - CÓDIGO QR*

📌 *Pasos para vincular:*
🌀 Abre WhatsApp en tu teléfono  
🌀 Toca ⋮ *Más opciones*  
🌀 Selecciona *Dispositivos vinculados*  
🌀 Pulsa *"Vincular un dispositivo"*  
🌀 Escanea este código QR

⚡ *Transformación Beast activada*
🌀 *By: Wilker | Gohan Beast Bot*
`.trim()

let rtx2 = `
🐉 *VINCULACIÓN GOHAN BEAST - CÓDIGO MANUAL*

📌 *Pasos para vinculartr a Gohan beast bot:*
🌀 Abre WhatsApp en tu teléfono  
⚡ Toca ⋮ *Más opciones*  
⚡ Selecciona *Dispositivos vinculados*  
⚡ Pulsa *"Vincular un dispositivo"*  
⚡ Selecciona *"Con número"*  
⚡ Introduce el código de 8 dígitos

⚠️ *Importante:*  
• El código es válido por 15 segundos  
• Solo funciona para este número  
• Recomendado solicitarlo en privado  

🌀 *Activando Sub-Saiyan...*
`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const beastOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000

  const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
  const subBotsCount = subBots.length
  
  if (subBotsCount === 50) {
    return m.reply(`❌ No hay espacios para *Sub-Bots* disponibles.`)
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = `${who.split`@`[0]}`
  let pathBeastJadiBot = path.join(`./${global.jadi || 'JadiBots'}/`, id)
  
  if (!fs.existsSync(pathBeastJadiBot)) {
    fs.mkdirSync(pathBeastJadiBot, { recursive: true })
  }
  
  beastOptions.pathBeastJadiBot = pathBeastJadiBot
  beastOptions.m = m
  beastOptions.conn = conn
  beastOptions.args = args
  beastOptions.usedPrefix = usedPrefix
  beastOptions.command = command
  beastOptions.fromCommand = true
  
  await beastJadiBot(beastOptions)
  global.db.data.users[m.sender].Subs = new Date * 1
} 

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
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
    conn.reply(m.chat, `❌ Usa correctamente: ${usedPrefix + command} code`, m)
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
      auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
      msgRetry,
      msgRetryCache,
      browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Gohan Beast','Chrome','1.0.0'],
      version: version,
      generateHighQualityLinkPreview: true
    };

    let sock = makeWASocket(connectionOptions)
    sock.isInit = false
    let isInit = true

    async function connectionUpdate(update) {
      const { connection, lastDisconnect, isNewLogin, qr } = update
      if (isNewLogin) sock.isInit = false
      
      if (qr && !mcode) {
        if (m?.chat) {
          txtQR = await conn.sendMessage(m.chat, { 
            image: await qrcode.toBuffer(qr, { scale: 8 }), 
            caption: rtx.trim()
          }, { quoted: m})
        } else {
          return 
        }
        if (txtQR && txtQR.key) {
          setTimeout(() => { 
            conn.sendMessage(m.sender, { delete: txtQR.key })
          }, 30000)
        }
        return
      } 
      
      if (qr && mcode) {
        let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
        secret = secret.match(/.{1,4}/g)?.join(" ")

        txtCode = await conn.sendMessage(m.chat, {text : rtx2}, { quoted: m })
        codeBot = await m.reply(`🐉 *CÓDIGO DE VINCULACIÓN*\n\n🔢 *${secret}*\n\n⏱️ Expira en 15 segundos`)

        console.log(`🌀 Código generado: ${secret}`)
      }
      
      if (txtCode && txtCode.key) {
        setTimeout(() => { 
          conn.sendMessage(m.sender, { delete: txtCode.key })
        }, 30000)
      }
      
      if (codeBot && codeBot.key) {
        setTimeout(() => { 
          conn.sendMessage(m.sender, { delete: codeBot.key })
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
      
      if (connection === 'close') {
        if (reason === 428) {
          console.log(chalk.yellow(`🌀 Conexión cerrada (+${path.basename(pathBeastJadiBot)}). Reconectando...`))
          await creloadHandler(true).catch(console.error)
        }
        
        if (reason === 408) {
          console.log(chalk.yellow(`⚠️ Timeout (+${path.basename(pathBeastJadiBot)}). Reconectando...`))
          await creloadHandler(true).catch(console.error)
        }
        
        if (reason === 440) {
          console.log(chalk.red(`💥 Sesión reemplazada (+${path.basename(pathBeastJadiBot)}).`))
        }
        
        if (reason == 405 || reason == 401) {
          console.log(chalk.red(`❌ Sesión cerrada (+${path.basename(pathBeastJadiBot)}).`))
          fs.rmdirSync(pathBeastJadiBot, { recursive: true })
        }
        
        if (reason === 500) {
          console.log(chalk.yellow(`🌀 Error interno (+${path.basename(pathBeastJadiBot)}). Reiniciando...`))
          return creloadHandler(true).catch(console.error)
        }
        
        if (reason === 515) {
          console.log(chalk.blue(`🌀 Reinicio automático (+${path.basename(pathBeastJadiBot)}).`))
          await creloadHandler(true).catch(console.error)
        }
        
        if (reason === 403) {
          console.log(chalk.red(`❌ Cuenta bloqueada (+${path.basename(pathBeastJadiBot)}).`))
          fs.rmdirSync(pathBeastJadiBot, { recursive: true })
        }
      }
      
      if (global.db.data == null) loadDatabase()
      
      if (connection == `open`) {
        if (!global.db.data?.users) loadDatabase()
        let userName, userJid 
        userName = sock.authState.creds.me.name || 'Usuario'
        userJid = sock.authState.creds.me.jid || `${path.basename(pathBeastJadiBot)}@s.whatsapp.net`
        
        console.log(chalk.green(`✅ ${userName} (+${path.basename(pathBeastJadiBot)}) conectado`))
        sock.isInit = true
        global.conns.push(sock)
        await joinChannels(sock)
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
        console.error('Error:', e)
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

async function joinChannels(conn) {
  for (const channelId of Object.values(global.ch || {})) {
    await conn.newsletterFollow(channelId).catch(() => {})
  }
}