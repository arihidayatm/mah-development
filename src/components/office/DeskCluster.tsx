import { memo, useEffect, useRef } from 'react'
import { CanvasTexture } from 'three'
import * as THREE from 'three'
import { OfficeDesk, Chair } from './Furniture'

function makeVSCodeTexture(): CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 160
  const g = c.getContext('2d')!
  g.fillStyle = '#1e1e2e'
  g.fillRect(0, 0, 256, 160)
  g.fillStyle = '#2a2a3c'
  g.fillRect(0, 0, 256, 18)
  const colors = ['#89DDFF', '#C099FF', '#A6E3A1', '#F9E2AF', '#F38BA8', '#89B4FA']
  for (let i = 0; i < 9; i++) {
    const y = 30 + i * 13
    g.fillStyle = colors[i % colors.length]
    const x = 16 + (i % 3) * 12
    g.fillRect(x, y, 60 + ((i * 37) % 120), 5)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function makeTerminalTexture(): CanvasTexture {
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
    'ready - started server',
    'GET /api/auth 200 12ms',
    'GET /api/health 200 3ms',
    'compiled successfully',
    '$ _',
  ]
  lines.forEach((l, i) => g.fillText(l, 8, 22 + i * 20))
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function NeonBlink({ color = '#22c55e', speed = 2, intensity = 2 }: { color?: string; speed?: number; intensity?: number }) {
  const ref = useRef<THREE.MeshStandardMaterial>(null)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const loop = () => {
      const t = (performance.now() - start) / 1000
      if (ref.current) {
        const v = 0.6 + Math.abs(Math.sin(t * speed)) * 1.4
        ref.current.emissiveIntensity = v * intensity
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [speed, intensity])
  return (
    <meshStandardMaterial ref={ref} color={color} emissive={color} emissiveIntensity={intensity} />
  )
}

export const DeskCluster = memo(function DeskCluster() {
  const vs = useRef<CanvasTexture | null>(null)
  const term = useRef<CanvasTexture | null>(null)
  if (!vs.current && typeof document !== 'undefined') {
    vs.current = makeVSCodeTexture()
    term.current = makeTerminalTexture()
  }

  return (
    <group>
      {/* Ari - desk-vip */}
      <OfficeDesk
        position={[10, 0, -3]}
        screens={
          <>
            <Kanban isLeader />
          </>
        }
      />
      <Chair position={[10, 0, -1.8]} />

      {/* Bima - dual monitor beda */}
      <OfficeDesk
        position={[-3, 0, -3]}
        screens={
          <group position={[0, 0.95, -0.15]}>
            <mesh position={[-0.38, 0, 0]} castShadow>
              <boxGeometry args={[0.68, 0.5, 0.04]} />
              <meshStandardMaterial map={vs.current ?? undefined} roughness={0.4} />
            </mesh>
            <mesh position={[0.38, 0, 0]} castShadow>
              <boxGeometry args={[0.68, 0.5, 0.04]} />
              <meshStandardMaterial map={term.current ?? undefined} roughness={0.4} />
            </mesh>
            <mesh position={[0, -0.32, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          </group>
        }
      />
      <Chair position={[-3, 0, -1.8]} />

      {/* Sasa */}
      <OfficeDesk
        position={[0, 0, -3]}
        screens={
          <group position={[0, 0.95, -0.15]}>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.55, 0.04]} />
              <meshStandardMaterial color="#F24E1E" emissive="#F24E1E" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[0, -0.34, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
              <meshStandardMaterial color="#222" />
            </mesh>
          </group>
        }
      />
      <Chair position={[0, 0, -1.8]} />

      {/* Ucup */}
      <OfficeDesk position={[3, 0, -3]} />
      <Chair position={[3, 0, -1.8]} />

      {/* Hendri - server rack */}
      <OfficeDesk position={[6, 0, -3]} />
      <Chair position={[6, 0, -1.8]} />
      <group position={[7.2, 0, -3.6]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.7, 1.8, 0.6]} />
          <meshStandardMaterial color="#1b1b1f" roughness={0.7} />
        </mesh>
        {[0.3, 0.6, 0.9, 1.2, 1.5].map((y, i) => (
          <mesh key={i} position={[-0.36, y, 0.31]}>
            <boxGeometry args={[0.05, 0.05, 0.02]} />
            <NeonBlink color={i % 2 === 0 ? '#22c55e' : '#f59e0b'} speed={1 + i} />
          </mesh>
        ))}
      </group>

      {/* Nanda - security lock screen */}
      <OfficeDesk
        position={[-9, 0, -3]}
        screens={
          <group position={[0, 0.95, -0.15]}>
            <mesh castShadow>
              <boxGeometry args={[0.9, 0.55, 0.04]} />
              <meshStandardMaterial color="#111" emissive="#7f1d1d" emissiveIntensity={0.4} />
            </mesh>
            <mesh position={[0, 0.05, 0.03]}>
              <boxGeometry args={[0.22, 0.18, 0.02]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
            </mesh>
            <mesh position={[0, 0.28, 0.03]}>
              <torusGeometry args={[0.08, 0.02, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1} />
            </mesh>
          </group>
        }
      />
      <Chair position={[-9, 0, -1.8]} />
    </group>
  )
})

function Kanban({ isLeader }: { isLeader?: boolean }) {
  return (
    <group position={[0, 1.0, -0.2]}>
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.7, 0.04]} />
        <meshStandardMaterial color="#F7F4EF" />
      </mesh>
      {[0, 1, 2].map((col) => (
        <group key={col} position={[-0.36 + col * 0.36, 0, 0.03]}>
          {[0, 1, 2].map((row) => (
            <mesh key={row} position={[0, 0.2 - row * 0.2, 0]}>
              <boxGeometry args={[0.28, 0.14, 0.02]} />
              <meshStandardMaterial
                color={['#89B4FA', '#F9E2AF', '#A6E3A1'][col]}
                emissive={['#89B4FA', '#F9E2AF', '#A6E3A1'][col]}
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}
      {isLeader && (
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[1.2, 0.08, 0.5]} />
          <meshStandardMaterial color="#C89B6C" />
        </mesh>
      )}
    </group>
  )
}
