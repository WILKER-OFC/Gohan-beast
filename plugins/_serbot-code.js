const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
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
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""

let rtx = `
🐉 *VINCULACIÓN GOHAN BEAST MODE - QR*

📱 *Pasos para vincular:*
1️⃣ Abre WhatsApp en tu teléfono  
2️⃣ Toca ⋮ *Más opciones*  
3️⃣ Selecciona *Dispositivos vinculados*  
4️⃣ Pulsa *"Vincular un dispositivo"*  
5️⃣ Escanea este código QR

⚡ *Transformación Beast activada*
`.trim()

let rtx2 = `
🐉 *VINCULACIÓN CON CÓDIGO*

📱 *Pasos para vincular:*
1️⃣ Abre WhatsApp en tu teléfono  
2️⃣ Toca ⋮ *Más opciones*  
3️⃣ Selecciona *Dispositivos vinculados*  
4️⃣ Pulsa *"Vincular un dispositivo"*  
5️⃣ Selecciona *"Con número"*  
6️⃣ Introduce el código de 8 dígitos

⚠️ *Importante:*  
• El código expira en 15 segundos  
• Solo para este número  
• Recomendado en privado
`.trim()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const yukiJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {

let time = global.db.data.users[m.sender].Subs + 120000

const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
const subBotsCount = subBots.length
if (subBotsCount === 50) {
return m.reply(`❌ No hay espacios para Sub-Bots.`)
}

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
let pathYukiJadiBot = path.join(`./${global.jadi || 'JadiBots'}/`, id)
if (!fs.existsSync(pathYukiJadiBot)){
fs.mkdirSync(pathYukiJadiBot, { recursive: true })
}
yukiJBOptions.pathYukiJadiBot = pathYukiJadiBot
yukiJBOptions.m = m
yukiJBOptions.conn = conn
yukiJBOptions.args = args
yukiJBOptions.usedPrefix = usedPrefix
yukiJBOptions.command = command
yukiJBOptions.fromCommand = true
yukiJadiBot(yukiJBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler 

export async function yukiJadiBot(options) {
let { pathYukiJadiBot, m, conn, args, usedPrefix, command } = options
if (command === 'code') {
command = 'qr'; 
args.unshift('code')}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "", "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathYukiJadiBot, "creds.json")
if (!fs.existsSync(pathYukiJadiBot)){
fs.mkdirSync(pathYukiJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `❌ Usa: ${usedPrefix + command} code`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathYukiJadiBot)

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
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
let secretFormatted = secret.match(/.{1,4}/g)?.join("-") || secret

txtCode = await conn.sendMessage(m.chat, {text : rtx2}, { quoted: m })
codeBot = await conn.sendMessage(m.chat, {
  text: `*🐉 CÓDIGO DE VINCULACIÓN*\n\n` +
        `📋 *Código:* \`\`\`${secretFormatted}\`\`\`\n\n` +
        `⏱️ *Expira en:* 15 segundos\n` +
        `📲 *Toca y mantén para copiar*\n\n` +
        `_⚡ Gohan Beast Bot_`,
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: "📋 COPIAR CÓDIGO",
      body: "Toca para copiar el código",
      mediaType: 1,
      thumbnailUrl: "https://telegra.ph/file/1c5b4d5e8e9a5f5a5a5a5.jpg",
      sourceUrl: "https://whatsapp.com"
    }
  }
}, { quoted: m })

console.log(secretFormatted)
}
if (txtCode && txtCode.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
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
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
console.log(chalk.yellow(`🌀 Conexión cerrada (+${path.basename(pathYukiJadiBot)}). Reconectando...`))
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
console.log(chalk.yellow(`⚠️ Timeout (+${path.basename(pathYukiJadiBot)}). Reconectando...`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.red(`💥 Sesión reemplazada (+${path.basename(pathYukiJadiBot)}).`))
try {

} catch (error) {
console.error(chalk.yellow(`Error 440: +${path.basename(pathYukiJadiBot)}`))
}}
if (reason == 405 || reason == 401) {
console.log(chalk.red(`❌ Sesión cerrada (+${path.basename(pathYukiJadiBot)}).`))
try {

} catch (error) {
console.error(chalk.yellow(`Error 405: +${path.basename(pathYukiJadiBot)}`))
}
fs.rmdirSync(pathYukiJadiBot, { recursive: true })
}
if (reason === 500) {
console.log(chalk.yellow(`🌀 Error interno (+${path.basename(pathYukiJadiBot)}). Reiniciando...`))
return creloadHandler(true).catch(console.error)

}
if (reason === 515) {
console.log(chalk.blue(`🌀 Reinicio automático (+${path.basename(pathYukiJadiBot)}).`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.red(`❌ Cuenta bloqueada (+${path.basename(pathYukiJadiBot)}).`))
fs.rmdirSync(pathYukiJadiBot, { recursive: true })
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Usuario'
userJid = sock.authState.creds.me.jid || `${path.basename(pathYukiJadiBot)}@s.whatsapp.net`
console.log(chalk.green(`✅ ${userName} (+${path.basename(pathYukiJadiBot)}) conectado`))
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)

}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      

}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch || {})) {
await conn.newsletterFollow(channelId).catch(() => {})
}}