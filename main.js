console.clear()
console.log('🌀 Iniciando Gohan Beast Bot...')

import fs from 'fs'
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, mkdirSync, rmSync } from 'fs';
import yargs from 'yargs';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import lodash from 'lodash';
import readline from 'readline';
import NodeCache from 'node-cache';
import qrcode from 'qrcode-terminal';
import { spawn } from 'child_process';
import { setInterval } from 'timers';

// ============================================
// 🌀 GO-HAN BEAST BOT - INICIALIZACIÓN
// ============================================
console.log(chalk.bold.hex('#FF3366')('╔══════════════════════════════════════════╗'))
console.log(chalk.bold.hex('#FFCC00')('║           🔥 GOHAN BEAST BOT 🔥          ║'))
console.log(chalk.bold.hex('#FF3366')('╚══════════════════════════════════════════╝'))
console.log(chalk.hex('#00FFFF')(`📱 Iniciando a las: ${new Date().toLocaleTimeString()}`))
console.log(chalk.hex('#FFCC00')(`⚡ Transformación Beast: 100% completada`))
console.log(chalk.hex('#FF3366')(`💪 Poder: MAXIMUM | Modo: Beast Ultrainstinct`))
console.log(chalk.hex('#00FFFF')('🔱 By Wilker | WhatsApp Multi-Device'))
console.log('')

// Animación de carga Beast
const loadAnimation = () => {
  const phases = [
    '🟡 Cargando energía Saiyan...',
    '🟠 Potencial oculto detectado...', 
    '🔴 Transformación Beast iniciando...',
    '🟣 Células Saiyan al límite...',
    '🔵 ¡GOHAN BEAST ACTIVADO!'
  ];
  
  phases.forEach((phase, i) => {
    setTimeout(() => {
      console.log(chalk.hex(i < 2 ? '#FFCC00' : i < 4 ? '#FF3366' : '#00FFFF')(phase))
    }, i * 500)
  })
}

loadAnimation()
// ============================================

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
process.env.TMPDIR = path.join(process.cwd(), 'tmp');

if (!fs.existsSync(process.env.TMPDIR)) {
  fs.mkdirSync(process.env.TMPDIR, { recursive: true });
}

import './config.js';
import { createRequire } from 'module';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  Browsers,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
} = await import('@whiskeysockets/baileys');

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) =>
  (name in global.APIs ? global.APIs[name] : name) +
  path +
  (query || apikeyqueryname
    ? '?' +
      new URLSearchParams(
        Object.entries({
          ...query,
          ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}),
        })
      )
    : '');

global.timestamp = { start: new Date() };

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp(
  '^[' +
    (opts['prefix'] || '‎z/#$%.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') +
    ']'
);

global.db = new Low(new JSONFile(`storage/databases/database.json`));

// --- INICIO DE CAMBIO PARA OPTIMIZACIÓN ---
// Variable para rastrear si la base de datos ha sido modificada.
global.isDatabaseModified = false;
// Función para marcar la base de datos como modificada.
global.markDatabaseModified = () => {
  global.isDatabaseModified = true;
};
// --- FIN DE CAMBIO PARA OPTIMIZACIÓN ---

global.DATABASE = global.db;
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ)
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this);
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
        }
      }, 1 * 1000)
    );
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = lodash.chain(global.db.data);

  // --- INICIO DE CAMBIO PARA OPTIMIZACIÓN ---
  // Sobrescribir los métodos de la base de datos para que marquen los cambios.
  const originalSet = global.db.chain.set.bind(global.db.chain);
  global.db.chain.set = (...args) => {
    const result = originalSet(...args);
    global.markDatabaseModified();
    return result;
  };
  // También se pueden envolver otras operaciones de escritura si es necesario.
  // --- FIN DE CAMBIO PARA OPTIMIZACIÓN ---
};

global.authFile = `sessions`;
const { state, saveCreds } = await useMultiFileAuthState(global.authFile);

const { version } = await fetchLatestBaileysVersion();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({ class: 'client' });
logger.level = 'fatal';

const connectionOptions = {
  version: version,
  logger,
  printQRInTerminal: false,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  browser: Browsers.ubuntu('Chrome'),
  markOnlineOnclientect: false,
  generateHighQualityLinkPreview: true,
  syncFullHistory: true,
  retryRequestDelayMs: 10,
  transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
  maxMsgRetryCount: 15,
  appStateMacVerification: {
    patch: false,
    snapshot: false,
  },
  getMessage: async (key) => {
    const jid = jidNormalizedUser(key.remoteJid);
    return '';
  },
};

global.conn = makeWASocket(connectionOptions);

global.conns = global.conns || [];

let handler;
try {
  const handlerModule = await import('./handler.js');
  handler = handlerModule.handler;
} catch (e) {
  console.error(chalk.red('[ERROR] No se pudo cargar el handler principal:'), e);
  process.exit(1);
}

/**
 * Función para reconectar un sub-bot y asignarle un manejador de mensajes.
 * @param {string} botPath - Ruta completa a la carpeta de sesión del sub-bot.
 */
async function reconnectSubBot(botPath) {
  console.log(chalk.hex('#FFCC00')(`[BEAST MODE] Intentando reconectar sub-bot en: ${path.basename(botPath)}`));
  try {
    const { state: subBotState, saveCreds: saveSubBotCreds } = await useMultiFileAuthState(botPath);

    if (!subBotState.creds.registered) {
      console.warn(chalk.hex('#FFCC00')(`[BEAST MODE] Advertencia: El sub-bot en ${path.basename(botPath)} no está registrado. Salto la conexión.`));
      return;
    }

    const subBotConn = makeWASocket({
      version: version,
      logger,
      printQRInTerminal: false,
      auth: {
        creds: subBotState.creds,
        keys: makeCacheableSignalKeyStore(subBotState.keys, logger),
      },
      browser: Browsers.ubuntu('Chrome'),
      markOnlineOnclientect: false,
      generateHighQualityLinkPreview: true,
      syncFullHistory: true,
      retryRequestDelayMs: 10,
      transactionOpts: { maxCommitRetries: 10, delayBetweenTriesMs: 10 },
      maxMsgRetryCount: 15,
      appStateMacVerification: {
        patch: false,
        snapshot: false,
      },
      getMessage: async (key) => '',
    });

    subBotConn.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'open') {
        console.log(chalk.hex('#00FF00')(`✅ [BEAST MODE] Sub-bot conectado: ${path.basename(botPath)}`));
        const yaExiste = global.conns.some(c => c.user?.jid === subBotConn.user?.jid);
        if (!yaExiste) {
          global.conns.push(subBotConn);
          console.log(chalk.hex('#00FF00')(`🟢 [BEAST MODE] Sub-bot agregado: ${subBotConn.user?.jid}`));
        }
      } else if (connection === 'close') {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.error(chalk.hex('#FF3366')(`❌ [BEAST MODE] Sub-bot desconectado ${path.basename(botPath)}. Razón: ${reason}`));

        // --- INICIO DE CAMBIO IMPORTANTE: Manejo de desconexión permanente ---
        if (reason === DisconnectReason.loggedOut || reason === 401) {
          console.log(chalk.hex('#FF0000')(`💀 [BEAST MODE] Eliminando sesión del sub-bot en ${path.basename(botPath)}.`));
          // Eliminar de global.conns
          global.conns = global.conns.filter(conn => conn.user?.jid !== subBotConn.user?.jid);
          // Eliminar carpeta de sesión del filesystem
          try {
            rmSync(botPath, { recursive: true, force: true });
            console.log(chalk.hex('#FF3366')(`🗑️ [BEAST MODE] Sesión eliminada: ${botPath}`));
          } catch (e) {
            console.error(chalk.hex('#FF0000')(`❌ [ERROR] No se pudo eliminar la carpeta de sesión ${botPath}: ${e}`));
          }
        }
        // --- FIN DE CAMBIO IMPORTANTE ---
      }
    });
    subBotConn.ev.on('creds.update', saveSubBotCreds);

    subBotConn.handler = handler.bind(subBotConn);
    subBotConn.ev.on('messages.upsert', subBotConn.handler);
    console.log(chalk.hex('#00FFFF')(`🌀 [BEAST MODE] Manejador asignado: ${path.basename(botPath)}`));

    if (!global.subBots) {
      global.subBots = {};
    }
    global.subBots[path.basename(botPath)] = subBotConn;
    console.log(chalk.hex('#FFCC00')(`⚡ [BEAST MODE] Sub-bot ${path.basename(botPath)} procesado`));

  } catch (e) {
    console.error(chalk.hex('#FF0000')(`💥 [BEAST MODE] Error fatal en ${path.basename(botPath)}:`), e);
  }
}

/**
 * Función para iniciar la reconexión de todos los sub-bots.
 */
async function startSubBots() {
  const rutaJadiBot = join(__dirname, './JadiBots');

  if (!existsSync(rutaJadiBot)) {
    mkdirSync(rutaJadiBot, { recursive: true });
    console.log(chalk.hex('#00FFFF')(`📁 Carpeta creada: ${rutaJadiBot}`));
  } else {
    console.log(chalk.hex('#00FFFF')(`📁 Carpeta ya existe: ${rutaJadiBot}`));
  }

  const readRutaJadiBot = readdirSync(rutaJadiBot);
  if (readRutaJadiBot.length > 0) {
    const credsFile = 'creds.json';
    console.log(chalk.hex('#FF3366')(`🌀 [BEAST MODE] Iniciando sub-bots: ${readRutaJadiBot.length} encontrados`));
    for (const subBotDir of readRutaJadiBot) {
      const botPath = join(rutaJadiBot, subBotDir);
      if (statSync(botPath).isDirectory()) {
        const readBotPath = readdirSync(botPath);
        if (readBotPath.includes(credsFile)) {
          console.log(chalk.hex('#FFCC00')(`📱 [BEAST MODE] Conectando: ${subBotDir}`));
          await reconnectSubBot(botPath);
        } else {
          console.log(chalk.hex('#FF9900')(`⚠️ [BEAST MODE] Sin creds.json: ${subBotDir}`));
        }
      } else {
        console.log(chalk.hex('#999999')(`📄 [BEAST MODE] No es directorio: ${subBotDir}`));
      }
    }
    console.log(chalk.hex('#00FF00')(`✅ [BEAST MODE] Sub-bots conectados`));
  } else {
    console.log(chalk.hex('#999999')(`📭 [BEAST MODE] No hay sub-bots en ${rutaJadiBot}`));
  }
}

await startSubBots();

async function handleLogin() {
  if (conn.authState.creds.registered) {
    console.log(chalk.hex('#00FF00')('✅ Sesión Beast ya registrada.'));
    console.log(chalk.hex('#FFCC00')('⚡ Gohan Beast listo para la batalla!'));
    return;
  }

  let loginMethod = await question(
    chalk.hex('#FF3366')(
      `╔═══════════════════════════════╗\n` +
      `║    🔥 GOHAN BEAST BOT 🔥     ║\n` +
      `╠═══════════════════════════════╣\n` +
      `║ 💎 Transformación disponible  ║\n` +
      `║ 📱 Escribe "code" para iniciar║\n` +
      `║ 🌀 Beast Mode activation      ║\n` +
      `╚═══════════════════════════════╝\n` +
      `\n> `
    )
  );

  loginMethod = loginMethod.toLowerCase().trim();

  if (loginMethod === 'code') {
    let phoneNumber = await question(chalk.hex('#FF0000')('🔥 Ingresa el número de WhatsApp donde estará el bot (incluye código país, ej: 521XXXXXXXXXX):\n'));
    phoneNumber = phoneNumber.replace(/\D/g, '');

    if (phoneNumber.startsWith('52') && phoneNumber.length === 12) {
      phoneNumber = `521${phoneNumber.slice(2)}`;
    } else if (phoneNumber.startsWith('52') && phoneNumber.length === 10) {
      phoneNumber = `521${phoneNumber.slice(2)}`;
    } else if (phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.replace(/^0/, '');
    }

    if (typeof conn.requestPairingCode === 'function') {
      try {
        if (conn.ws.readyState === ws.OPEN) {
          let code = await conn.requestPairingCode(phoneNumber);
          code = code?.match(/.{1,4}/g)?.join('-') || code;
          console.log(chalk.hex('#00FFFF')('╔══════════════════════════════════════════╗'));
          console.log(chalk.hex('#FFCC00')('║        🔥 CÓDIGO BEAST ACTIVADO 🔥       ║'));
          console.log(chalk.hex('#00FFFF')('╠══════════════════════════════════════════╣'));
          console.log(chalk.bold.hex('#FFFFFF')(`║           📱 ${code}           ║`));
          console.log(chalk.hex('#00FFFF')('╚══════════════════════════════════════════╝'));
          console.log(chalk.hex('#FFCC00')('⚠️ Ingresa este código en WhatsApp > Dispositivos vinculados'));
        } else {
          console.log(chalk.hex('#FF0000')('❌ Conexión principal no abierta. Intenta nuevamente.'));
        }
      } catch (e) {
        console.log(chalk.hex('#FF0000')('💥 Error al solicitar código de emparejamiento:'), e.message || e);
      }
    } else {
      console.log(chalk.hex('#FF0000')('❌ Tu versión de Baileys no soporta emparejamiento por código.'));
    }
  } else {
    console.log(chalk.hex('#FFCC00')('🌀 Generando código QR Beast, escanéalo...'));
    conn.ev.on('connection.update', ({ qr }) => {
      if (qr) {
        console.log(chalk.hex('#00FFFF')('╔══════════════════════════════════════════╗'));
        console.log(chalk.hex('#FF3366')('║         🔥 QR BEAST GENERADO 🔥         ║'));
        console.log(chalk.hex('#00FFFF')('╚══════════════════════════════════════════╝'));
        qrcode.generate(qr, { small: true });
      }
    });
  }
}

await handleLogin();

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
  if (global.db) {
    // --- INICIO DE CAMBIO PARA OPTIMIZACIÓN DE BASE DE DATOS ---
    // Optimización de la base de datos: solo escribe si hay cambios.
    setInterval(async () => {
      if (global.db.data && global.isDatabaseModified) {
        await global.db.write();
        global.isDatabaseModified = false; // Resetear la bandera
      }
      if (opts['autocleartmp']) {
        const tmp = [tmpdir(), 'tmp', 'serbot'];
        tmp.forEach((filename) => {
          spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete']);
        });
      }
    }, 30 * 1000);
    // --- FIN DE CAMBIO PARA OPTIMIZACIÓN DE BASE DE DATOS ---
  }
}

function clearTmp() {
  const tmp = [join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && Date.now() - stats.mtimeMs >= 1000 * 60 * 1) return unlinkSync(file);
    return false;
  });
}

// --- INICIO DE CAMBIO PARA OPTIMIZACIÓN DE TEMPORALES ---
// Limpiar la carpeta temporal con más frecuencia (cada 3 minutos).
setInterval(() => {
  if (global.stopped === 'close' || !conn || !conn.user) return;
  clearTmp();
}, 180000);
// --- FIN DE CAMBIO PARA OPTIMIZACIÓN DE TEMPORALES ---

// --- INICIO DE CAMBIO: Optimización de memoria ---
if (typeof global.gc === 'function') {
  setInterval(() => {
    console.log(chalk.hex('#999999')(`🌀 [BEAST MODE] Ejecutando recolección de basura...`));
    global.gc();
  }, 180000);
} else {
  console.log(chalk.hex('#FFCC00')(`⚠️ [BEAST MODE] Recolección de basura no disponible. Ejecuta con --expose-gc`));
}
// --- FIN DE CAMBIO ---

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code =
    lastDisconnect?.error?.output?.statusCode ||
    lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date();
  }
  if (global.db.data == null) await loadDatabase();
  if (connection === 'open') {
    console.log(chalk.hex('#00FF00')('╔══════════════════════════════════════════╗'));
    console.log(chalk.hex('#FFCC00')('║      ✅ GOHAN BEAST CONECTADO ✅        ║'));
    console.log(chalk.hex('#00FF00')('╚══════════════════════════════════════════╝'));
    console.log(chalk.hex('#00FFFF')(`📱 Listo para recibir comandos Beast!`));
    console.log(chalk.hex('#FFCC00')(`⚡ ¡Transformación completada con éxito!`));
  }
  const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
  if (reason === 405) {
    if (existsSync('./sessions/creds.json')) unlinkSync('./sessions/creds.json');
    console.log(
      chalk.bold.hex('#FF0000')(
        `💥 Conexión reemplazada para el bot Beast, reiniciando...\n🔄 Si hay errores, vuelve a iniciar: npm start`
      )
    );
    process.send('reset');
  }
  if (connection === 'close') {
    switch (reason) {
      case DisconnectReason.badSession:
        conn.logger.error(chalk.hex('#FF0000')(`❌ Sesión Beast incorrecta, elimina la carpeta ${global.authFile} y escanea nuevamente.`));
        break;
      case DisconnectReason.connectionClosed:
      case DisconnectReason.connectionLost:
      case DisconnectReason.timedOut:
        conn.logger.warn(chalk.hex('#FF9900')(`⚠️ Conexión Beast perdida, reconectando...`));
        await global.reloadHandler(true).catch(console.error);
        break;
      case DisconnectReason.connectionReplaced:
        conn.logger.error(chalk.hex('#FF0000')(`💥 Conexión Beast reemplazada, cierra la otra sesión primero.`));
        break;
      case DisconnectReason.loggedOut:
        conn.logger.error(chalk.hex('#FF0000')(`💀 Sesión Beast cerrada, elimina ${global.authFile} y escanea nuevamente.`));
        break;
      case DisconnectReason.restartRequired:
        conn.logger.info(chalk.hex('#FFCC00')(`🔄 Reinicio necesario del bot Beast, reiniciando...`));
        await global.reloadHandler(true).catch(console.error);
        break;
      default:
        conn.logger.warn(chalk.hex('#FF9900')(`⚠️ Desconexión desconocida Beast: ${reason || ''}`));
        await global.reloadHandler(true).catch(console.error);
        break;
    }
  }
}

process.on('uncaughtException', console.error);

let isInit = true;

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Handler && Handler.handler) handler = Handler.handler;
  } catch (e) {
    console.error(chalk.hex('#FF0000')(`💥 [ERROR] Fallo al cargar handler.js: ${e}`));
  }

  if (restartConn) {
    try {
      if (global.conn.ws) global.conn.ws.close();
    } catch {}
    global.conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions);
    isInit = true;
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  conn.handler = handler.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);

  isInit = false;
  return true;
};

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(chalk.hex('#FF0000')(`💥 Error al cargar el plugin '${filename}': ${e}`));
      delete global.plugins[filename];
    }
  }
}
await filesInit();

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(chalk.hex('#00FFFF')(`🌀 Plugin actualizado - '${filename}'`));
      else {
        conn.logger.warn(chalk.hex('#FF9900')(`⚠️ Plugin eliminado - '${filename}'`));
        return delete global.plugins[filename];
      }
    } else conn.logger.info(chalk.hex('#00FF00')(`✅ Nuevo plugin - '${filename}'`));

    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(chalk.hex('#FF0000')(`💥 Error de sintaxis en '${filename}':\n${format(err)}`));
    else {
      try {
        const module = await import(`${global.__filename(dir)}?update=${Date.now()}`);
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(chalk.hex('#FF0000')(`💥 Error cargando plugin '${filename}':\n${format(e)}`));
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);

watch(pluginFolder, global.reload);
await global.reloadHandler();

console.log(chalk.hex('#FFCC00')('\n╔══════════════════════════════════════════╗'));
console.log(chalk.hex('#FF3366')('║     🌀 GOHAN BEAST BOT INICIADO 🌀      ║'));
console.log(chalk.hex('#FFCC00')('╚══════════════════════════════════════════╝'));
console.log(chalk.hex('#00FFFF')('💎 By Wilker | Transformación Beast completada'));
console.log(chalk.hex('#FF3366')('🔥 ¡Listo para dominar WhatsApp!'));