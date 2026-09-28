import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useOrchestrator } from '../store/useOrchestrator'
import { usePrayerTime } from '../store/usePrayerTime'
import { OfficeRoom } from './office/OfficeRoom'
import { VIPRoom } from './office/VIPRoom'
import { CoffeeBean } from './office/CoffeeBean'
import { RelaxRoom } from './office/RelaxRoom'
import { Mushalla, Wudu } from './office/Mushalla'
import { ChibiWalker } from './chibi/ChibiWalker'
import { PrayerGroup } from './chibi/PrayerGroup'
import type { CameraPreset, TeamMember } from '../lib/types'

const PRESET_TARGET: Record<CameraPreset, [number, number, number]> = {
  office: [0, 0, 0],
  vip: [10, 0, -3],
  coffee: [-5, 2, 6.5],
  santai: [4, 0, 7],
  mushalla: [-13, 0, 9.5],
}

function walkers(team: TeamMember[], globalMode: string) {
  if (globalMode === 'normal') return team
  return team.filter((m) => m.religion === 'non-muslim')
}

function MushallaLights() {
  return null
}

export function Scene() {
  const team = useOrchestrator((s) => s.team)
  const cameraPreset = useOrchestrator((s) => s.cameraPreset)
  const setSelected = useOrchestrator((s) => s.setSelected)
  const globalMode = usePrayerTime((s) => s.globalMode)
  const imamId = usePrayerTime((s) => s.imamId)

  const visibleWalkers = useMemo(() => walkers(team, globalMode), [team, globalMode])
  const prayingMembers = useMemo(
    () => team.filter((m) => m.religion === 'islam'),
    [team],
  )

  const target = PRESET_TARGET[cameraPreset]

  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [10, 7, 10], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => setSelected(null)}
    >
      <color attach="background" args={['#2a1f1a']} />
      <fog attach="fog" args={['#2a1f1a', 30, 70]} />

      <hemisphereLight intensity={0.7} groundColor="#8A6A48" color="#FFF3E0" />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.6}
        color="#FFE0B0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <ambientLight intensity={0.35} />

      <Suspense fallback={<SuspenseFallback />}>
        <Environment preset="apartment" />
        <OfficeRoom />
        <VIPRoom />
        <CoffeeBean />
        <RelaxRoom />
        <Mushalla />
        <Wudu />
        <MushallaLights />

        {visibleWalkers.map((m, i) => (
          <ChibiWalker key={m.id} member={m} index={i} onClick={setSelected} />
        ))}

        {globalMode === 'pray' || globalMode === 'pray-mini' ? (
          <PrayerGroup members={prayingMembers} imamId={imamId} />
        ) : null}

        <ContactShadows
          position={[0, 0.04, 2]}
          opacity={0.45}
          scale={40}
          blur={2.4}
          far={8}
          resolution={512}
          color="#2a1f1a"
        />
      </Suspense>

      <OrbitControls
        target={target}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={4}
        maxDistance={18}
        enablePan
      />
    </Canvas>
  )
}

function SuspenseFallback() {
  return (
    <Html center>
      <div style={{ color: '#FFE0B0', fontWeight: 700 }}>Memuat kantor...</div>
    </Html>
  )
}

export { THREE }
