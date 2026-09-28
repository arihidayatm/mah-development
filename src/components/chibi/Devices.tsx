import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** Layar VSCode digambar ke canvas, dipakai sebagai texture. */
export function makeVSCodeTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 160
  const g = c.getContext('2d')!
  g.fillStyle = '#1e1e2e'
  g.fillRect(0, 0, 256, 160)
  g.fillStyle = '#2a2a3c'
  g.fillRect(0, 0, 256, 16)
  const colors = ['#89DDFF', '#C099FF', '#A6E3A1', '#F9E2AF', '#F38BA8', '#89B4FA']
  for (let i = 0; i < 10; i++) {
    g.fillStyle = colors[i % colors.length]
    const x = 14 + (i % 3) * 14
    g.fillRect(x, 26 + i * 12, 55 + ((i * 41) % 130), 5)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Layar terminal: bg hitam, teks hijau. */
export function makeTerminalTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 160
  const g = c.getContext('2d')!
  g.fillStyle = '#000000'
  g.fillRect(0, 0, 256, 160)
  g.fillStyle = '#22c55e'
  g.font = '11px monospace'
  const lines = [
    '$ npm run dev',
    'ready - local: 5173',
    'GET /api/auth 200 12ms',
    'GET /api/health 200 3ms',
    'compiled successfully',
    '$ _',
  ]
  lines.forEach((l, i) => g.fillText(l, 8, 22 + i * 20))
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function useCanvasTextures() {
  return useMemo(() => {
    if (typeof document === 'undefined') return { vs: null, term: null }
    return { vs: makeVSCodeTexture(), term: makeTerminalTexture() }
  }, [])
}

/** LED emissive yang berkedip. */
export function Led({ color = '#22c55e', speed = 2, intensity = 2 }: { color?: string; speed?: number; intensity?: number }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const loop = () => {
      const t = (performance.now() - start) / 1000
      if (ref.current) ref.current.emissiveIntensity = (0.5 + Math.abs(Math.sin(t * speed)) * 1.5) * intensity
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [speed, intensity])
  return (
    <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={intensity} />
  )
}

/** Monitor generik dengan texture opsional. */
export function Monitor({
  position = [0, 0, 0] as [number, number, number],
  size = [0.9, 0.55] as [number, number],
  color = '#111111',
  emissive = '#000000',
  emissiveIntensity = 0.4,
  map = null,
}: {
  position?: [number, number, number]
  size?: [number, number]
  color?: string
  emissive?: string
  emissiveIntensity?: number
  map?: THREE.Texture | null
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[size[0], size[1], 0.04]} />
        {map ? (
          <meshStandardMaterial map={map} roughness={0.35} emissiveMap={map} emissive="#ffffff" emissiveIntensity={0.35} />
        ) : (
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} roughness={0.4} />
        )}
      </mesh>
      <mesh position={[0, -0.34, -0.05]}>
        <cylinderGeometry args={[0.05, 0.06, 0.2, 10]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, -0.44, -0.05]}>
        <cylinderGeometry args={[0.16, 0.16, 0.03, 12]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  )
}

/** Kanban board kecil untuk meja Ari. */
export function KanbanBoard({ position }: { position: [number, number, number] }) {
  const cols = ['#89B4FA', '#F9E2AF', '#A6E3A1']
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[1.15, 0.7, 0.05]} />
        <meshStandardMaterial color="#F7F4EF" />
      </mesh>
      {cols.map((c, ci) => (
        <group key={ci} position={[-0.37 + ci * 0.37, 0, 0.04]}>
          {[0, 1, 2].map((r) => (
            <mesh key={r} position={[0, 0.2 - r * 0.2, 0]}>
              <boxGeometry args={[0.29, 0.14, 0.02]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.3} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

/** Server rack LED untuk meja Hendri. */
export function ServerRack({ position }: { position: [number, number, number] }) {
  const leds = [0.3, 0.62, 0.94, 1.26, 1.58]
  return (
    <group position={position}>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.7, 1.9, 0.6]} />
        <meshStandardMaterial color="#1b1b1f" roughness={0.7} />
      </mesh>
      {leds.map((y, i) => (
        <mesh key={i} position={[-0.36, y, 0.31]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.035, 8]} />
          <Led color={i % 2 === 0 ? '#22c55e' : '#f59e0b'} speed={1 + i} />
        </mesh>
      ))}
    </group>
  )
}

/** Layar gembok merah untuk Nanda. */
export function LockScreen({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.55, 0.04]} />
        <meshStandardMaterial color="#0b0b0b" emissive="#7f1d1d" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.02, 0.03]}>
        <boxGeometry args={[0.24, 0.2, 0.02]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0, 0.24, 0.03]}>
        <torusGeometry args={[0.09, 0.022, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
      <mesh position={[0, -0.34, -0.05]}>
        <cylinderGeometry args={[0.05, 0.06, 0.2, 10]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    </group>
  )
}

void useFrame
