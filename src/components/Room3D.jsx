import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, RoundedBox, Text, useTexture } from "@react-three/drei";
import Girl from "./Girl";



/* soft rounded block: position, size, color */
function Box({ pos, size, color, rot = [0, 0, 0], r = 0.04, rough = 0.8 }) {
  const radius = Math.min(r, Math.min(...size) / 2 - 0.002);
  return (
    <RoundedBox
      args={size}
      radius={radius}
      smoothness={3}
      position={pos}
      rotation={rot}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color} roughness={rough} />
    </RoundedBox>
  );
}

/* cylinder / cone: r1 = top radius, r2 = bottom radius */
function Cyl({ pos, r1, r2, h, color, rot = [0, 0, 0], emissive, ei = 0 }) {
  return (
    <mesh position={pos} rotation={rot} castShadow>
      <cylinderGeometry args={[r1, r2 ?? r1, h, 28]} />
      <meshStandardMaterial
        color={color}
        emissive={emissive || "#000000"}
        emissiveIntensity={ei}
        roughness={0.8}
      />
    </mesh>
  );
}

function Ball({ pos, r, color, scale = [1, 1, 1] }) {
  return (
    <mesh position={pos} scale={scale} castShadow>
      <sphereGeometry args={[r, 20, 20]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

/* draws on a hidden canvas and turns it into a texture (made once) */
function useCanvasTexture(w, h, draw) {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
   
  }, []);
}

/* =====================================================
   ROOM SHELL: floor, walls, curtain, lights, shadow
   ===================================================== */

function GroundShadow() {
  const tex = useCanvasTexture(256, 256, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(110,70,50,0.38)");
    g.addColorStop(0.6, "rgba(110,70,50,0.14)");
    g.addColorStop(1, "rgba(110,70,50,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.31, 0]}>
      <planeGeometry args={[15, 15]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Floor() {
  const wood = useCanvasTexture(1024, 1024, (ctx, w, h) => {
    const rows = 14;
    const rh = h / rows;
    for (let i = 0; i < rows; i++) {
      let x = -Math.random() * 300;
      while (x < w) {
        const len = 260 + Math.random() * 280;
        ctx.fillStyle = `hsl(30, 50%, ${58 + Math.random() * 7}%)`;
        ctx.fillRect(x, i * rh, len, rh);
        ctx.strokeStyle = "rgba(120,70,40,0.35)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, i * rh, len, rh);
        x += len;
      }
    }
  });
  return (
    <group>
      <Box pos={[0, -0.15, 0]} size={[8.5, 0.3, 8.5]} color="#c08a5e" r={0.03} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} receiveShadow>
        <planeGeometry args={[8.5, 8.5]} />
        <meshStandardMaterial map={wood} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Walls() {
  return (
    <group>
      {/* back wall (right side of the picture) */}
      <Box pos={[0, 2, -4.125]} size={[8.5, 4, 0.25]} color="#e6b4b7" r={0.02} />
      {/* left wall (a bit darker, like in the reference) */}
      <Box pos={[-4.125, 2, 0.125]} size={[0.25, 4, 8.25]} color="#d9a6ab" r={0.02} />
      {/* cream strip along the top of each wall */}
      <Box pos={[0, 4.02, -4.125]} size={[8.5, 0.06, 0.27]} color="#f7e9dc" r={0.02} />
      <Box pos={[-4.125, 4.02, 0.125]} size={[0.27, 0.06, 8.25]} color="#f7e9dc" r={0.02} />
      {/* baseboards */}
      <Box pos={[0.05, 0.12, -3.97]} size={[8, 0.24, 0.06]} color="#f8ece1" r={0.02} />
      <Box pos={[-3.97, 0.12, 0.05]} size={[0.06, 0.24, 8]} color="#f8ece1" r={0.02} />
    </group>
  );
}

function Curtain() {
  return (
    <group>
      <Box pos={[3.95, 2.05, -3.93]} size={[0.45, 3.9, 0.08]} color="#f3d2c0" r={0.03} />
      <Box pos={[3.66, 2.05, -3.92]} size={[0.1, 3.9, 0.1]} color="#e8b9a5" r={0.03} />
    </group>
  );
}

function FairyLights() {
  const bulbs = useMemo(() => {
    const out = [];
    for (let i = 0; i < 20; i++) {
      const sag = 0.2 * Math.sin(((i % 5) / 4) * Math.PI);
      out.push([-3.8 + i * 0.4, 3.72 - sag, -3.93]);
    }
    for (let i = 0; i < 19; i++) {
      const sag = 0.2 * Math.sin(((i % 5) / 4) * Math.PI);
      out.push([-3.93, 3.72 - sag, -3.6 + i * 0.4]);
    }
    return out;
  }, []);
  return (
    <group>
      {bulbs.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#fff1c9" emissive="#ffc766" emissiveIntensity={2.5} />
        </mesh>
      ))}
    </group>
  );
}

/* =====================================================
   WALL ART (frames with text and simple pictures)
   ===================================================== */

const INK = "#6e2a3f";

function Frame({ position, rotation = [0, 0, 0], scale = 1, children }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Box pos={[0, 0, 0]} size={[1.14, 1.44, 0.07]} color="#dcb894" r={0.03} />
      <mesh position={[0, 0, 0.037]}>
        <planeGeometry args={[1, 1.3]} />
        <meshStandardMaterial color="#f9eee3" roughness={1} />
      </mesh>
      <group position={[0, 0, 0.04]}>{children}</group>
    </group>
  );
}
function WallArt() {
  return (
    <group>
      {/* back wall, above the bed */}
      <Frame position={[0.45, 2.75, -3.955]} scale={0.9}>
          <Photo src="/frame.jpg"/>
      </Frame>
      <Frame position={[1.8, 2.75, -3.955]} scale={0.9}>
        <Photo src="/Bratz.jpg"/>
      </Frame>
      <Frame position={[3.15, 2.75, -3.955]} scale={0.9}>
        <Photo src="frame2.jpg"/>
      </Frame>

      {/* left wall */}
      <Frame position={[-3.955, 2.55, 0.5]} rotation={[0, Math.PI / 2, 0]} scale={0.85}>
<Photo src="/ref 1.jpg"/>
      </Frame>
      <Frame position={[-3.955, 2.55, 1.95]} rotation={[0, Math.PI / 2, 0]} scale={0.85}>
<Photo src="/ref2.jpg"/>
      </Frame>
    </group>
  );
}

/* =====================================================
   FURNITURE
   ===================================================== */

function Plant({ pos, s = 1 }) {
  const leaves = [
    [0, 0.3, 0, 0.14],
    [-0.1, 0.24, 0.04, 0.1],
    [0.1, 0.25, -0.03, 0.11],
    [0.03, 0.38, 0.05, 0.09],
    [-0.05, 0.34, -0.08, 0.09],
  ];
  return (
    <group position={pos} scale={s}>
      <Cyl pos={[0, 0.08, 0]} r1={0.11} r2={0.08} h={0.16} color="#f3d9cf" />
      {leaves.map(([x, y, z, r], i) => (
        <Ball key={i} pos={[x, y, z]} r={r} color={i % 2 ? "#6fa876" : "#5e9a68"} />
      ))}
    </group>
  );
}

function Bed() {
  return (
    <group>
      {/* frame + mattress */}
      <Box pos={[1.8, 0.225, -1.85]} size={[3.1, 0.45, 4.2]} color="#d9a0ac" r={0.08} />
      <Box pos={[1.8, 0.6, -1.85]} size={[2.9, 0.3, 4.0]} color="#f3e4d6" r={0.1} />

      {/* tufted pink headboard */}
      <Box pos={[1.8, 0.95, -3.9]} size={[3.1, 1.5, 0.2]} color="#d98ea0" r={0.06} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          pos={[0.55 + i * 0.5, 0.95, -3.78]}
          size={[0.46, 1.3, 0.12]}
          color="#e3a0b0"
          r={0.05}
        />
      ))}

      {/* pillows */}
      <Box pos={[1.1, 0.92, -3.45]} size={[0.95, 0.28, 0.6]} color="#f6e7da" r={0.12} rot={[-0.25, 0.05, 0]} />
      <Box pos={[2.5, 0.92, -3.45]} size={[0.95, 0.28, 0.6]} color="#f6e7da" r={0.12} rot={[-0.25, -0.05, 0]} />
      <Box pos={[1.8, 0.98, -3.2]} size={[0.7, 0.25, 0.4]} color="#e8a5b3" r={0.1} rot={[-0.35, 0, 0]} />

      {/* pink blanket */}
      <Box pos={[1.8, 0.84, -0.75]} size={[3.0, 0.14, 2.6]} color="#dc8fa2" r={0.07} />
      <Box pos={[1.8, 0.58, 0.49]} size={[3.02, 0.55, 0.12]} color="#dc8fa2" r={0.05} />
      <Box pos={[1.8, 0.93, -1.9]} size={[3.0, 0.06, 0.5]} color="#e8a5b3" r={0.03} />
    </group>
  );
}



function Desk() {
  const screen = useCanvasTexture(512, 320, (ctx, w, h) => {
    ctx.fillStyle = "#1b1740";
    ctx.fillRect(0, 0, w, h);
    const colors = ["#8be9fd", "#ff79c6", "#f1fa8c", "#50fa7b", "#bd93f9", "#ffb86c"];
    for (let row = 0; row < 14; row++) {
      let x = 28 + (row % 3) * 26;
      const y = 26 + row * 20;
      for (let seg = 0; seg < 3; seg++) {
        const len = 30 + ((row * 37 + seg * 53) % 90);
        ctx.fillStyle = colors[(row + seg * 2) % colors.length];
        ctx.fillRect(x, y, len, 8);
        x += len + 12;
      }
    }
  });

  return (
    <group>
      {/* desk top + side panels */}
      <Box pos={[-2.45, 1.05, -3.5]} size={[2.4, 0.1, 1.0]} color="#f8ece0" r={0.03} />
      <Box pos={[-3.6, 0.5, -3.5]} size={[0.08, 1.0, 0.9]} color="#f8ece0" r={0.02} />
      <Box pos={[-1.3, 0.5, -3.5]} size={[0.08, 1.0, 0.9]} color="#f8ece0" r={0.02} />

      {/* monitor */}
      <Cyl pos={[-2.45, 1.115, -3.65]} r1={0.2} h={0.03} color="#efe7e1" />
      <Box pos={[-2.45, 1.27, -3.7]} size={[0.06, 0.3, 0.05]} color="#efe7e1" r={0.02} />
      <Box pos={[-2.45, 1.78, -3.72]} size={[1.15, 0.72, 0.07]} color="#e9e1dc" r={0.03} />
      <mesh position={[-2.45, 1.82, -3.683]}>
        <planeGeometry args={[1.05, 0.6]} />
        <meshBasicMaterial map={screen} />
      </mesh>

      {/* keyboard + mouse */}
      <Box pos={[-2.45, 1.12, -3.15]} size={[0.62, 0.03, 0.2]} color="#f0b8c4" r={0.012} />
      <Box pos={[-1.95, 1.12, -3.15]} size={[0.08, 0.03, 0.12]} color="#f6e6d8" r={0.015} />

      {/* pen cup */}
      <Cyl pos={[-3.35, 1.17, -3.6]} r1={0.07} h={0.14} color="#f0a9b8" />
      <Cyl pos={[-3.37, 1.3, -3.6]} r1={0.008} h={0.2} color="#7a3b52" rot={[0, 0, 0.2]} />
      <Cyl pos={[-3.33, 1.3, -3.6]} r1={0.008} h={0.2} color="#e0a458" rot={[0, 0, -0.2]} />

      {/* desk lamp */}
      <Cyl pos={[-1.6, 1.12, -3.6]} r1={0.1} h={0.03} color="#f6e6d8" />
      <Box pos={[-1.6, 1.4, -3.6]} size={[0.03, 0.5, 0.03]} color="#f6e6d8" r={0.01} rot={[0, 0, 0.15]} />
      <Cyl pos={[-1.5, 1.7, -3.6]} r1={0.05} r2={0.17} h={0.22} color="#f3b9c7" rot={[0, 0, 0.6]} emissive="#ffd9a0" ei={0.35} />
    </group>
  );
}

function Chair() {
  return (
    <group position={[-2.5, 0, -2.5]} rotation={[0, 0.25, 0]}>
      <Box pos={[0, 0.62, 0]} size={[0.62, 0.12, 0.6]} color="#eba2b2" r={0.05} />
      <Box pos={[0, 1.05, 0.3]} size={[0.6, 0.75, 0.1]} color="#eba2b2" r={0.05} rot={[-0.1, 0, 0]} />
      <Cyl pos={[0, 0.34, 0]} r1={0.04} h={0.5} color="#dcdce0" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i}>
            <Box
              pos={[Math.cos(a) * 0.17, 0.07, Math.sin(a) * 0.17]}
              size={[0.34, 0.04, 0.05]}
              color="#f4efe9"
              r={0.015}
              rot={[0, -a, 0]}
            />
            <Ball pos={[Math.cos(a) * 0.33, 0.04, Math.sin(a) * 0.33]} r={0.04} color="#c9c4be" />
          </group>
        );
      })}
    </group>
  );
}

const BOOK_COLORS = ["#b4506a", "#e3b1a0", "#7a3b52", "#f1d3c4", "#c9788a", "#8c5a63", "#d99aa6"];

function Books({ y, seed = 0, end = 0.52 }) {
  const books = [];
  let z = -0.55;
  let i = 0;
  while (z < end) {
    const w = 0.07 + ((i * 7 + seed) % 4) * 0.02;
    const h = 0.34 + ((i * 5 + seed) % 5) * 0.04;
    books.push({ z: z + w / 2, w, h, c: BOOK_COLORS[(i + seed) % BOOK_COLORS.length] });
    z += w + 0.012;
    i++;
  }
  return (
    <group position={[0, y, 0]}>
      {books.map((b, k) => (
        <mesh key={k} position={[0.02, b.h / 2, b.z]} castShadow>
          <boxGeometry args={[0.3, b.h, b.w]} />
          <meshStandardMaterial color={b.c} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Bookshelf() {
  const shelfY = [0.04, 0.66, 1.28, 1.9, 2.52];
  return (
    <group position={[-3.75, 0, -1.7]}>
      <Box pos={[-0.23, 1.3, 0]} size={[0.04, 2.6, 1.3]} color="#f6e8dc" r={0.01} />
      <Box pos={[0, 1.3, -0.65]} size={[0.5, 2.6, 0.05]} color="#f6e8dc" r={0.015} />
      <Box pos={[0, 1.3, 0.65]} size={[0.5, 2.6, 0.05]} color="#f6e8dc" r={0.015} />
      {shelfY.map((y) => (
        <Box key={y} pos={[0, y, 0]} size={[0.5, 0.05, 1.3]} color="#f6e8dc" r={0.015} />
      ))}
      <Books y={0.065} seed={0} />
      <Books y={0.685} seed={3} end={0.3} />
      <Books y={1.305} seed={5} />
      <Books y={1.925} seed={1} end={0.1} />
      <Plant pos={[0, 2.55, 0.1]} s={1.2} />
    </group>
  );
}
function Phone(props) {
  /* 10 finger holes around the dial */
  const holes = Array.from({ length: 10 }, (_, i) => {
    const a = ((30 + i * 30) * Math.PI) / 180;
    return [Math.cos(a) * 0.05, Math.sin(a) * 0.05];
  });

  return (
    <group {...props}>
      {/* body: wide base + raised middle */}
      <Box pos={[0, 0.03, 0]} size={[0.38, 0.06, 0.28]} color="#e8909f" r={0.03} />
      <Box pos={[0, 0.085, 0]} size={[0.28, 0.05, 0.2]} color="#e8909f" r={0.02} />

      {/* dial */}
      <group position={[0, 0, 0.05]}>
        <Cyl pos={[0, 0.116, 0]} r1={0.075} h={0.012} color="#fbeee3" />
        {holes.map(([x, z], i) => (
          <Cyl key={i} pos={[x, 0.1225, z]} r1={0.011} h={0.004} color="#6e2a3f" />
        ))}
        <Cyl pos={[0, 0.124, 0]} r1={0.028} h={0.006} color="#e8909f" />
      </group>

      {/* handset lying on top */}
      <group position={[0, 0.15, -0.055]}>
        <Box pos={[0, 0, 0]} size={[0.38, 0.04, 0.07]} color="#d96f86" r={0.018} />
        <Cyl pos={[-0.17, -0.035, 0]} r1={0.05} r2={0.04} h={0.07} color="#d96f86" />
        <Cyl pos={[0.17, -0.035, 0]} r1={0.05} r2={0.04} h={0.07} color="#d96f86" />
      </group>
    </group>
  );
}
function Nightstand() {
  return (
    <group position={[3.7, 0, -3.5]}>
      <Box pos={[0, 0.425, 0]} size={[0.8, 0.85, 0.7]} color="#f6e8dc" r={0.04} />
      <Box pos={[0, 0.6, 0.355]} size={[0.7, 0.035, 0.01]} color="#d9c3b3" r={0.004} />
      <Box pos={[0, 0.3, 0.355]} size={[0.7, 0.035, 0.01]} color="#d9c3b3" r={0.004} />
      <Ball pos={[0, 0.5, 0.37]} r={0.025} color="#c9a590" />
      <Ball pos={[0, 0.18, 0.37]} r={0.025} color="#c9a590" />

      {/* lamp (back left) */}
      <Cyl pos={[-0.18, 0.865, -0.17]} r1={0.09} h={0.03} color="#f6e6d8" />
      <Cyl pos={[-0.18, 1.0, -0.17]} r1={0.015} h={0.3} color="#f6e6d8" />
      <Cyl pos={[-0.18, 1.22, -0.17]} r1={0.1} r2={0.17} h={0.2} color="#fbe6cf" emissive="#ffe3b8" ei={0.7} />

      {/* plant (front left) */}
      <Plant pos={[-0.28, 0.85, 0.12]} s={0.6} />

      {/* TELEPHONE */}
      <Phone position={[0.08, 0.85, 0.08]} rotation={[0, 0.4, 0]} />
    </group>
  );
}
function Rug() {
  return (
    <group position={[-0.5, 0, 1.5]}>
      <mesh position={[0, 0.03, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 1.9, 0.06, 64]} />
        <meshStandardMaterial color="#f1e0d6" roughness={1} />
      </mesh>
      <mesh position={[0, 0.045, 0]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.06, 64]} />
        <meshStandardMaterial color="#f6e9e0" roughness={1} />
      </mesh>
    </group>
  );
}



function Photo({ src }) {
  const tex = useTexture(src);
  return (
    <mesh position={[0, 0, 0.002]}>
      <planeGeometry args={[0.9, 1.2]} />
      <meshBasicMaterial map={tex} />
    </mesh>
  );
}
const iconProps = {
  viewBox: "0 0 24 24",
  width: 22,
  height: 22,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const UserIcon = (
  <svg {...iconProps}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </svg>
);
const CodeIcon = (
  <svg {...iconProps}>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
  </svg>
);
const MailIcon = (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

function Label({ position, title, sub, href, icon, dx, dy, side, tone = "dark" }) {
  return (
    <Html position={position} zIndexRange={[20, 0]} pointerEvents="none">
      <div className="tag">
        <svg className="tag-line" width="2" height="2">
          <line x1="0" y1="0" x2={dx} y2={dy} />
        </svg>
        <span className="tag-dot" />
        <a href={href} className={`tag-card ${side}`} style={{ left: dx, top: dy }}>
          <span className={`tag-icon ${tone}`}>{icon}</span>
          <span className="tag-text">
            <strong>{title}</strong>
            <small>{sub}</small>
          </span>
        </a>
      </div>
    </Html>
  );
}
/* =====================================================
   PUTTING IT ALL TOGETHER
   ===================================================== */
function Room() {
  return (
    <group>
      <GroundShadow />
      <Floor />
      <Walls />
      <Curtain />
      <FairyLights />
      <WallArt />
      <Bed />
<Girl position={[1.8, 1.7, -1.8]} scale={1.8} rotation={[0, 0.7, 0]} />
      <Desk />
      <Chair />
      <Bookshelf />
      <Nightstand />
      <Rug />
<Label
  position={[1.8, 0.95, -0.5]}
  title="About me"
  sub="The girl behind the code"
  href="#about"
  icon={UserIcon}
  tone="light"
  dx={-80}
  dy={150}
  side="left"
/>
<Label
  position={[-2.45, 2.1, -3.65]}
  title="Projects"
  sub="A few things I've built"
  href="#projects"
  icon={CodeIcon}
  dx={120}
  dy={-100}
  side="right"
/>
<Label
  position={[3.78, 1.0, -3.42]}
  title="Say hello"
  sub="Let's create something great"
  href="#contact"
  icon={MailIcon}
  dx={170}
  dy={90}
  side="right"
/>
     
    </group>
  );
}

function Room3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [14, 11.5, 14], fov: 30, near: 1, far: 100 }}
    >
      {/* soft warm light, like the reference */}
      <ambientLight intensity={0.9} color="#fff1e6" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.5}
        color="#fff0e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-camera-near={1}
        shadow-camera-far={40}
      />
      <pointLight position={[3.6, 1.5, -3.2]} intensity={6} distance={9} color="#ffcf9e" />
      <pointLight position={[-1.6, 1.9, -3.3]} intensity={4} distance={7} color="#ffd9b0" />

      <Suspense fallback={null}>
        <Room />
      </Suspense>

      {/* gentle look-around only: no zoom, so page scrolling still works */}
      <OrbitControls
        target={[0, 1.4, 0]}
        enableZoom={true}
        enablePan={false}
        enableDamping
        minAzimuthAngle={Math.PI / 4 - 0.5}
        maxAzimuthAngle={Math.PI / 4 + 0.5}
        minPolarAngle={0.85}
        maxPolarAngle={1.3}
      />
    </Canvas>
  );
}

export default Room3D;