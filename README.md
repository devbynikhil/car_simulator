# NK Drive

![image info](./static/social/share-image.png)

**NK Drive** is an interactive **3D driving simulation experience** built with modern web technologies.  
The project features a physics-driven vehicle system, dynamic environmental effects, and optimized rendering for smooth browser performance.

Developed by **Nikhil Kumar**.

---

# Features

- Physics-based vehicle movement
- Dynamic weather system
- Day and year cycles
- Environmental effects (wind, snow, rain, fog)
- Interactive world objects
- Optimized 3D rendering
- Asset compression pipeline
- Modular game loop architecture

---

# Installation

Download and install **Node.js**

https://nodejs.org/en/download/

Clone the repository:

```bash
git clone https://github.com/nk10nikhil/car_simulator.git
cd car_simulator
```

Create a `.env` file using the `.env.example` template.

Install dependencies:

```bash
npm install --force
```

Start the development server:

```bash
npm run dev
```

If you want the online features, including the **Race Arena** leaderboard, start the local WebSocket server in a second terminal:

```bash
npm run server
```

Open in browser:

```
http://localhost:5173
```

The local arena server listens on:

```text
ws://localhost:8787
```

Build for production:

```bash
npm run build
```

The production build will be generated inside the `dist/` directory.

---

# Race Arena Server Setup

This repository contains the **client** and now also includes a minimal local WebSocket backend at `scripts/server.js`.

1. Install dependencies with `npm install --force`.
2. Copy `.env.example` to `.env`.
3. Keep `VITE_SERVER_URL=ws://localhost:8787` for local development.
4. Start the backend with `npm run server`.
5. Start the client with `npm run dev`.

The server uses **MessagePack over WebSocket** because the client decodes binary payloads with `msgpack-lite`.

The `init` payload must include these keys for the race arena and other online systems to work:

- `circuitResetTime`: Unix timestamp in milliseconds for the last daily leaderboard reset
- `circuitLeaderboard`: array of `[tag, countryCode, durationMs]`
- `cookiesCount`: shared cookie counter
- `whispers`: whisper entries used by the world flames
- `cataclysmCount`, `cataclysmProgress`, `cataclysmRunning`: shared altar and tornado state

For the **Race Arena** specifically, the client sends:

- `circuitInsert` with `tag`, `countryCode`, `duration`, and `checkpointTimings`

The server answers with:

- `init` on first connection
- `circuitUpdate` after a new race time is inserted

If you deploy the client over HTTPS, change `VITE_SERVER_URL` to a `wss://` endpoint or the browser will block the WebSocket connection.

---

# Game Loop Architecture

The simulation runs using a structured **game loop system** where each module updates sequentially.

---

## Stage 0 — Initialization

- Time
- Inputs

---

## Stage 1 — Player Pre Physics

- Player input processing

---

## Stage 2 — Vehicle Pre Physics

- PhysicalVehicle updates based on player input

---

## Stage 3 — Physics

- Core physics simulation

---

## Stage 4 — Physics Output

- PhysicsWireframe
- Objects

---

## Stage 5 — Vehicle Post Physics

- PhysicalVehicle adjustments

---

## Stage 6 — Player Post Physics

- Player state updates

---

## Stage 7 — Camera / View

- View updates based on player and input

---

## Stage 8 — World Systems

- Intro
- DayCycles
- YearCycles
- Weather (DayCycles, YearCycles)
- Zones (Player:post-physics)
- VisualVehicle (PhysicalVehicle:post-physics, Inputs, Player:post-physics, View)

---

## Stage 9 — Environmental Effects

- Wind (Weather)
- Lighting (DayCycles, View)
- Tornado (DayCycles, PhysicalVehicle)
- InteractivePoints (Player:post-physics)
- Tracks (VisualVehicle)

---

## Stage 10 — World Rendering Systems

- Area++ (View, PhysicalVehicle:post-physics, Player:post-physics, Wind)
- Foliage (VisualVehicle, View)
- Fog (View)
- Reveal (DayCycles)
- Terrain (Tracks)
- Trails (PhysicalVehicle)
- Floor (View)
- Grass (View, Wind)
- Leaves (View, PhysicalVehicle)
- Lightnings (View, Weather)
- RainLines (View, Weather, Reveal)
- Snow (View, Weather, Reveal, Tracks)
- VisualTornado (Tornado)
- WaterSurface (Weather, View)
- Benches (Objects)
- Bricks (Objects)
- ExplosiveCrates (Objects)
- Fences (Objects)
- Lanterns (Objects)
- Whispers (Player)

---

## Stage 13 — Instancing

- InstancedGroup (Objects, [SpecificObjects])

---

## Stage 14 — Interface Systems

- Audio (View, Objects)
- Notifications
- Title (PhysicalVehicle:post-physics)

---

## Stage 15 — Rendering

- Scene rendering pipeline

---

## Stage 16 — Monitoring

- Performance monitoring

---

# Blender Workflow

## Export

When exporting models from **Blender**:

- Mute the palette texture node (loaded directly in Three.js `Material`)
- Use the corresponding export presets
- Do **not enable compression during export**

---

# Asset Compression

Run the compression pipeline:

```bash
npm run compress
```

This script automatically optimizes assets inside the `static/` directory.

---

## GLB Model Compression

- Traverses the `static/` folder looking for `.glb` files
- Ignores already compressed files
- Compresses embedded textures using:

```
etc1s --quality 255
```

- Generates optimized copies while preserving original files

---

## Texture Compression

Searches for:

```
png
jpg
```

Compression method:

```
--encode etc1s --qlevel 255
```

Optimized for **GPU-friendly textures**.

---

## UI Asset Compression

Images inside:

```
static/ui
```

are converted to **WebP** format for improved performance.

---

# Author

**Nikhil Kumar**

GitHub  
https://github.com/nk10nikhil/

Portfolio  
https://www.nk10nikhil.dev/

LinkedIn  
https://www.linkedin.com/in/nk10nikhil/
