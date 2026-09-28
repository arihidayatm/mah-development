import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
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
import type { CameraPreset } from '../lib/types'

const PRESET_CAM: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  office: { pos: [10, 8, 14], target: [0, 0, 0] },
  vip: { pos: [15, 5, 4], target: [10, 1, -3] },
  coffee: { pos: [-5, 5, 13], target: [-5, 1, 7] },
  santai: { pos: [6, 4, 13], target: [5, 1, 7] },
  mushalla: { pos: [-8, 5, 15], target: [-13, 1, 10] },
}

function CameraRig({ preset }: { preset: CameraPreset }) {
  const { camera } = useThree()
  const controls = useRef<any>(null)
  const desired = PRESET_CAM[preset]
  const goal = useMemo(() => new THREE.Vector3(...desired.pos), [desired])
  const goalTarget = useMemo(() => new THREE.Vector3(...desired.target), [desired])
  const animating = useRef(false)
  const prevPreset = useRef(preset)

  useEffect(() => {
    if (prevPreset.current !== preset) {
      prevPreset.current = preset
      animating.current = true
    }
  }, [preset])

  useFrame((_, delta) => {
    if (!animating.current) return
    camera.position.lerp(goal, Math.min(1, delta * 2.2))
    if (controls.current) {
      controls.current.target.lerp(goalTarget, Math.min(1, delta * 2.2))
      controls.current.update()
    }
    if (camera.position.distanceTo(goal) < 0.08) animating.current = false
  })

  return (
    <OrbitControls
      ref={controls}
      target={desired.target}
      maxPolarAngle={Math.PI / 2.2}
      minDistance={4}
      maxDistance={18}
      enablePan
      enableDamping
    />
  )
}

function WalkerList({ onSelect }: { onSelect: (id: string) => void }) {
  const team = useOrchestrator((s) => s.team)
  const globalMode = usePrayerTime((s) => s.globalMode)

  // Saat pray / pray-mini, muslim pindah ke mushalla (render oleh PrayerGroup).
  const visible = useMemo(
    () =>
      globalMode === 'pray' || globalMode === 'pray-mini'
        ? team.filter((m) => m.religion === 'non-muslim')
        : team,
    [team, globalMode],
  )

  return (
    <>
      {visible.map((m) => (
        <ChibiWalker key={m.id} member={m} onClick={onSelect} />
      ))}
    </>
  )
}

function OfficeScene() {
  const team = useOrchestrator((s) => s.team)
  const setSelected = useOrchestrator((s) => s.setSelected)
  const cameraPreset = useOrchestrator((s) => s.cameraPreset)
  const globalMode = usePrayerTime((s) => s.globalMode)
  const imamId = usePrayerTime((s) => s.imamId)

  const muslims = useMemo(() => team.filter((m) => m.religion === 'islam'), [team])
  const onSelect = useCallback((id: string) => setSelected(id), [setSelected])

  return (
    <>
      <color attach="background" args={['#2a1f1a']} />
      <fog attach="fog" args={['#2a1f1a', 34, 78]} />

      {/* Lighting cozy claymation */}
      <hemisphereLight intensity={0.7} color="#FFF3E0" groundColor="#8A6A48" />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.7}
        color="#FFE0B0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0004}
      />

      {/* Environment di-suspend terpisah supaya tidak remount seluruh scene
          saat HDR selesai dimuat (menghindari race removeChild drei Html). */}
      <Suspense fallback={null}>
        <Environment preset="apartment" />
      </Suspense>

      <OfficeRoom />
      <VIPRoom />
      <CoffeeBean />
      <RelaxRoom />
      <Mushalla />
      <Wudu />

      <WalkerList onSelect={onSelect} />

      {(globalMode === 'pray' || globalMode === 'pray-mini') && (
        <PrayerGroup members={muslims} imamId={imamId} />
      )}

      <ContactShadows
        position={[0, 0.03, 2]}
        opacity={0.42}
        scale={44}
        blur={2.4}
        far={9}
        resolution={512}
        color="#1c130e"
      />

      <CameraRig preset={cameraPreset} />
    </>
  )
}

export function Scene() {
  const setSelected = useOrchestrator((s) => s.setSelected)
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [10, 8, 14], fov: 42, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onPointerMissed={() => setSelected(null)}
    >
      <OfficeScene />
    </Canvas>
  )
}
