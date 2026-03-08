import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import msgpack from "msgpack-lite";
import { WebSocketServer } from "ws";

const port = Number.parseInt(process.env.PORT ?? "8787", 10);
const dayDuration = 24 * 60 * 60 * 1000;
const circuitLeaderboardLimit = 10;
const whispersLimit = Number.parseInt(
  process.env.VITE_WHISPERS_COUNT ?? "30",
  10,
);
const dataFilePath = path.resolve(process.cwd(), "server-data.json");

const createDefaultState = () => ({
  circuitResetTime: Date.now(),
  circuitLeaderboard: [],
  cookiesCount: 0,
  whispers: [],
  cataclysmCount: 0,
  cataclysmProgress: 0,
  cataclysmRunning: false,
});

const sanitizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sanitizeCountryCode = (value) => {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .slice(0, 2);
};

const sanitizeTag = (value) => {
  return String(value ?? "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
};

const sanitizeWhisper = (value) => {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, whispersLimit);
};

const normalizeCircuitLeaderboard = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!Array.isArray(entry)) return null;

      const tag = sanitizeTag(entry[0]);
      const countryCode = sanitizeCountryCode(entry[1]);
      const duration = Math.max(1, Math.round(sanitizeNumber(entry[2], 0)));

      if (tag.length !== 3) return null;

      return [tag, countryCode, duration];
    })
    .filter(Boolean)
    .sort((a, b) => a[2] - b[2])
    .slice(0, circuitLeaderboardLimit);
};

const normalizeWhispers = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      const id = String(entry?.id ?? "").trim();
      const message = sanitizeWhisper(entry?.message);

      if (!id || !message) return null;

      return {
        id,
        message,
        countrycode: sanitizeCountryCode(entry?.countrycode),
        x: sanitizeNumber(entry?.x),
        y: sanitizeNumber(entry?.y),
        z: sanitizeNumber(entry?.z),
      };
    })
    .filter(Boolean)
    .slice(-whispersLimit);
};

const normalizeState = (value) => {
  const defaults = createDefaultState();

  return {
    circuitResetTime: Math.max(
      0,
      Math.round(sanitizeNumber(value?.circuitResetTime, defaults.circuitResetTime)),
    ),
    circuitLeaderboard: normalizeCircuitLeaderboard(value?.circuitLeaderboard),
    cookiesCount: Math.max(
      0,
      Math.round(sanitizeNumber(value?.cookiesCount, defaults.cookiesCount)),
    ),
    whispers: normalizeWhispers(value?.whispers),
    cataclysmCount: Math.max(
      0,
      Math.round(sanitizeNumber(value?.cataclysmCount, defaults.cataclysmCount)),
    ),
    cataclysmProgress: Math.min(
      1,
      Math.max(0, sanitizeNumber(value?.cataclysmProgress, defaults.cataclysmProgress)),
    ),
    cataclysmRunning: Boolean(value?.cataclysmRunning),
  };
};

const loadState = () => {
  if (!fs.existsSync(dataFilePath)) return createDefaultState();

  try {
    const raw = fs.readFileSync(dataFilePath, "utf8");
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.warn("Failed to load persisted server state, using defaults.", error);
    return createDefaultState();
  }
};

const state = loadState();

const saveState = () => {
  fs.writeFileSync(dataFilePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
};

const encode = (payload) => msgpack.encode(payload);

const send = (socket, payload) => {
  if (socket.readyState === socket.OPEN) {
    socket.send(encode(payload));
  }
};

const broadcast = (payload) => {
  const encoded = encode(payload);

  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(encoded);
  }
};

const maybeResetCircuit = () => {
  if (Date.now() - state.circuitResetTime < dayDuration) return false;

  state.circuitResetTime = Date.now();
  state.circuitLeaderboard = [];
  saveState();

  return true;
};

const buildInitPayload = () => {
  maybeResetCircuit();

  return {
    type: "init",
    circuitResetTime: state.circuitResetTime,
    circuitLeaderboard: state.circuitLeaderboard,
    cookiesCount: state.cookiesCount,
    whispers: state.whispers,
    cataclysmCount: state.cataclysmCount,
    cataclysmProgress: state.cataclysmProgress,
    cataclysmRunning: state.cataclysmRunning,
  };
};

const broadcastInit = () => {
  broadcast(buildInitPayload());
};

const upsertWhisper = (whisper) => {
  const existingIndex = state.whispers.findIndex((entry) => entry.id === whisper.id);

  if (existingIndex >= 0) state.whispers.splice(existingIndex, 1, whisper);
  else state.whispers.push(whisper);

  const removed = [];

  while (state.whispers.length > whispersLimit) {
    const deleted = state.whispers.shift();
    if (deleted) removed.push({ id: deleted.id });
  }

  return removed;
};

const circuitCycleLength = 25;
let cataclysmTimeout = null;

const stopCataclysm = () => {
  state.cataclysmRunning = false;
  saveState();
  broadcast({
    type: "cataclysmUpdate",
    cataclysmCount: state.cataclysmCount,
    cataclysmProgress: state.cataclysmProgress,
    cataclysmRunning: state.cataclysmRunning,
  });
};

const scheduleCataclysmStop = () => {
  if (cataclysmTimeout) clearTimeout(cataclysmTimeout);

  cataclysmTimeout = setTimeout(() => {
    stopCataclysm();
  }, 15000);
};

const wss = new WebSocketServer({ port });

wss.on("connection", (socket) => {
  send(socket, buildInitPayload());

  socket.on("message", (buffer) => {
    let message = null;

    try {
      message = msgpack.decode(new Uint8Array(buffer));
    } catch (error) {
      console.warn("Ignoring malformed websocket payload.", error);
      return;
    }

    if (!message || typeof message !== "object") return;

    switch (message.type) {
      case "circuitInsert": {
        maybeResetCircuit();

        const tag = sanitizeTag(message.tag);
        const duration = Math.max(1, Math.round(sanitizeNumber(message.duration, 0)));

        if (tag.length !== 3) return;

        state.circuitLeaderboard = [...state.circuitLeaderboard, [
          tag,
          sanitizeCountryCode(message.countryCode),
          duration,
        ]]
          .sort((a, b) => a[2] - b[2])
          .slice(0, circuitLeaderboardLimit);

        saveState();
        broadcast({
          type: "circuitUpdate",
          circuitLeaderboard: state.circuitLeaderboard,
        });
        break;
      }

      case "cookiesInsert": {
        const amount = Math.max(0, Math.round(sanitizeNumber(message.amount, 0)));

        if (amount === 0) return;

        state.cookiesCount += amount;
        saveState();
        broadcast({ type: "cookiesUpdate", cookiesCount: state.cookiesCount });
        break;
      }

      case "whispersInsert": {
        const id = String(message.uuid ?? "").trim();
        const whisperMessage = sanitizeWhisper(message.message);

        if (!id || !whisperMessage) return;

        const whisper = {
          id,
          message: whisperMessage,
          countrycode: sanitizeCountryCode(message.countryCode),
          x: sanitizeNumber(message.x),
          y: sanitizeNumber(message.y),
          z: sanitizeNumber(message.z),
        };

        const removed = upsertWhisper(whisper);

        saveState();

        if (removed.length) {
          broadcast({ type: "whispersDelete", whispers: removed });
        }

        broadcast({ type: "whispersInsert", whispers: [whisper] });
        break;
      }

      case "cataclysmInsert": {
        state.cataclysmCount += 1;
        state.cataclysmProgress =
          (state.cataclysmCount % circuitCycleLength) / circuitCycleLength;
        state.cataclysmRunning = state.cataclysmProgress === 0;

        saveState();
        broadcast({
          type: "cataclysmUpdate",
          cataclysmCount: state.cataclysmCount,
          cataclysmProgress: state.cataclysmProgress,
          cataclysmRunning: state.cataclysmRunning,
        });

        if (state.cataclysmRunning) scheduleCataclysmStop();
        break;
      }

      default:
        break;
    }
  });
});

setInterval(() => {
  if (maybeResetCircuit()) broadcastInit();
}, 60 * 1000);

if (!fs.existsSync(dataFilePath)) saveState();

console.log(`Race arena server listening on ws://localhost:${port}`);