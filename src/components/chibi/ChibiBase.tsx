import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type {
  Accessory,
  CharacterColors,
  HairStyle,
  Mood,
  Pose,
  PrayPhase,
} from '../../lib/types'

export interface ChibiBaseProps {
  colors: CharacterColors
  hairStyle: HairStyle
  accessory: Accessory
  pose: Pose
  prayPhase?: PrayPhase
  mood: Mood
  pakaiPeci?: boolean
  mukena?: boolean
  hijabColor?: string
  typing?: boolean
  scale?: number
  zzz?: boolean
  blink?: boolean
}

const SKIN_ROUGH = 0.85

export function ChibiBase({
  colors,
  hairStyle,
  accessory,
  pose,
  prayPhase = 'qiyam',
  mood,
  pakaiPeci = false,
  mukena = false,
  hijabColor,
  typing = false,
  scale = 1,
  zzz = false,
  blink = true,
}: ChibiBaseProps) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const leftArm = useRef<THREE.Mesh>(null)
  const rightArm = useRef<THREE.Mesh>(null)
  const leftLeg = useRef<THREE.Mesh>(null)
  const rightLeg = useRef<THREE.Mesh>(null)
  const leftEye = useRef<THREE.Mesh>(null)
  const rightEye = useRef<THREE.Mesh>(null)

  const isPray = pose === 'pray'
  const isWalk = pose === 'walk'
  const isSitting = pose === 'sit'
  const sleepy = mood === 'sleepy'

  const blinkPhase = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (root.current) {
      if (isWalk) {
        root.current.rotation.z = Math.sin(t * 8) * 0.08
        root.current.position.y = Math.abs(Math.sin(t * 8)) * 0.06
      } else {
        root.current.rotation.z *= 0.85
        root.current.position.y = Math.sin(t * 2) * 0.02 // breathing
      }
    }

    if (head.current) {
      let targetHead = Math.sin(t * 1.5) * 0.08 // nod
      if (isPray && prayPhase === 'ruku') targetHead = 0
      if (isPray && prayPhase === 'sujud') targetHead = -0.15
      if (sleepy && !isPray) targetHead = 0.3
      head.current.rotation.x += (targetHead - head.current.rotation.x) * 0.12
    }

    // Tangan: typing / waddle / sedekap qiyam / lurus
    const armTargets: [number, number] = (() => {
      if (isPray && prayPhase === 'qiyam') return [-0.9, -0.9]
      if (isPray && prayPhase === 'julus') return [-0.2, -0.2]
      if (isWalk) return [Math.sin(t * 8) * 0.5, Math.sin(t * 8 + Math.PI) * 0.5]
      if (typing && isSitting) return [-0.5 + Math.sin(t * 10) * 0.2, -0.5 + Math.sin(t * 10 + 1.2) * 0.2]
      if (isSitting) return [-0.35, -0.35]
      return [-0.12, -0.12]
    })()
    if (leftArm.current) leftArm.current.rotation.x += (armTargets[0] - leftArm.current.rotation.x) * 0.2
    if (rightArm.current)
      rightArm.current.rotation.x += (armTargets[1] - rightArm.current.rotation.x) * 0.2

    if (leftLeg.current && rightLeg.current) {
      if (isWalk) {
        leftLeg.current.rotation.x = Math.sin(t * 8) * 0.5
        rightLeg.current.rotation.x = Math.sin(t * 8 + Math.PI) * 0.5
      } else {
        leftLeg.current.rotation.x *= 0.85
        rightLeg.current.rotation.x *= 0.85
      }
    }

    // Kedip tiap 3 dtk, mata rem if pray / sleepy
    if (blink) blinkPhase.current = (blinkPhase.current + delta) % 3.2
    let eyeScaleY = 1
    if (sleepy) eyeScaleY = 0.4
    if (isPray) eyeScaleY = 0.5
    if (blink && blinkPhase.current > 3 && blinkPhase.current < 3.12) eyeScaleY = 0.1
    if (leftEye.current) leftEye.current.scale.y += (eyeScaleY - leftEye.current.scale.y) * 0.5
    if (rightEye.current) rightEye.current.scale.y += (eyeScaleY - rightEye.current.scale.y) * 0.5

    if (body.current) {
      let rx = 0
      let by = 0
      if (isPray) {
        if (prayPhase === 'qiyam') {
          rx = 0.05
          by = 0
        } else if (prayPhase === 'ruku') {
          rx = 1.35
          by = 0
        } else if (prayPhase === 'sujud') {
          rx = 1.5
          by = -0.35
        } else if (prayPhase === 'julus') {
          rx = 0.35
          by = -0.38
        }
      } else if (isSitting) {
        by = -0.28
      }
      body.current.rotation.x += (rx - body.current.rotation.x) * 0.12
      body.current.position.y += (by - body.current.position.y) * 0.12
    }
  })

  const blushOpacity = isPray ? 0.2 : 0.6
  const topMat = <meshStandardMaterial color={colors.top} roughness={SKIN_ROUGH} metalness={0} />
  const skinMat = <meshStandardMaterial color={colors.skin} roughness={SKIN_ROUGH} metalness={0} />
  const eyeMat = <meshStandardMaterial color="#171717" roughness={0.15} metalness={0.05} />

  return (
    <group ref={root} scale={scale}>
      <group ref={body}>
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.26, 0.34, 8, 16]} />
          {topMat}
        </mesh>

        {/* Kepala */}
        <group ref={head} position={[0, 1.32, 0]}>
          <mesh scale={[1, 0.9, 1]} castShadow>
            <sphereGeometry args={[0.5, 24, 24]} />
            {skinMat}
          </mesh>

          {hairStyle === 'hijab' ? (
            <Hijab color={mukena ? '#F8F5EE' : hijabColor ?? colors.hair} big={mukena} />
          ) : (
            <>
              <Hair style={hairStyle} color={colors.hair} hatColor={undefined} />
              {pakaiPeci && !isPray ? null : null}
            </>
          )}

          {pakaiPeci && (
            <mesh position={[0, 0.42, 0]} castShadow>
              <cylinderGeometry args={[0.37, 0.4, 0.26, 20]} />
              <meshStandardMaterial color="#141414" roughness={0.9} />
            </mesh>
          )}

          {/* Mata */}
          <mesh ref={leftEye} position={[-0.17, 0.02, 0.42]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            {eyeMat}
          </mesh>
          <mesh ref={rightEye} position={[0.17, 0.02, 0.42]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            {eyeMat}
          </mesh>
          <mesh position={[-0.19, 0.065, 0.475]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.15, 0.065, 0.475]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Blush */}
          <mesh position={[-0.29, -0.1, 0.35]} rotation={[0, -0.55, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial color="#FF9AA2" transparent opacity={blushOpacity} />
          </mesh>
          <mesh position={[0.29, -0.1, 0.35]} rotation={[0, 0.55, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial color="#FF9AA2" transparent opacity={blushOpacity} />
          </mesh>

          {/* Mulut: senyum torus, garis datar saat pray */}
          {isPray ? (
            <mesh position={[0, -0.2, 0.47]}>
              <boxGeometry args={[0.13, 0.02, 0.02]} />
              <meshStandardMaterial color="#8B4A3A" roughness={0.6} />
            </mesh>
          ) : (
            <mesh position={[0, -0.19, 0.455]} rotation={[0.35, 0, 0]}>
              <torusGeometry args={[0.055, 0.018, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#8B4A3A" roughness={0.6} />
            </mesh>
          )}

          <Accessory accessory={accessory} />
        </group>

        {/* Tangan (capsule, tanpa jari) */}
        <mesh ref={leftArm} position={[-0.34, 0.8, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.28, 6, 10]} />
          {topMat}
        </mesh>
        <mesh ref={rightArm} position={[0.34, 0.8, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.28, 6, 10]} />
          {topMat}
        </mesh>

        {/* Kaki (sphere gepeng) */}
        <mesh ref={leftLeg} position={[-0.14, 0.36, 0.04]} scale={[1, 0.7, 1.35]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#3A3A3A" roughness={0.9} />
        </mesh>
        <mesh ref={rightLeg} position={[0.14, 0.36, 0.04]} scale={[1, 0.7, 1.35]} castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#3A3A3A" roughness={0.9} />
        </mesh>
      </group>

      {zzz && (
        <group position={[0.42, 1.95, 0]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[0.28, 0.28]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.92} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Hair({
  style,
  color,
  hatColor,
}: {
  style: HairStyle
  color: string
  hatColor?: string
}) {
  const mat = <meshStandardMaterial color={color} roughness={SKIN_ROUGH} metalness={0} />
  switch (style) {
    case 'spiky':
      return (
        <group position={[0, 0.28, 0]}>
          <mesh scale={[1, 0.62, 1]} castShadow>
            <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {mat}
          </mesh>
          {[-0.24, 0, 0.24].map((x, i) => (
            <mesh key={i} position={[x, 0.34, -0.05]} rotation={[0, 0, x * 2]} castShadow>
              <coneGeometry args={[0.12, 0.28, 8]} />
              {mat}
            </mesh>
          ))}
        </group>
      )
    case 'bob':
      return (
        <group position={[0, 0.08, 0]}>
          <mesh scale={[1.12, 1, 1.12]} castShadow>
            <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.64]} />
            {mat}
          </mesh>
          <mesh position={[0, -0.2, -0.26]} castShadow>
            <boxGeometry args={[0.72, 0.32, 0.42]} />
            {mat}
          </mesh>
        </group>
      )
    case 'cap':
      return (
        <group position={[0, 0.32, 0]}>
          <mesh scale={[1, 0.68, 1]} castShadow>
            <sphereGeometry args={[0.53, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={hatColor ?? color} roughness={SKIN_ROUGH} metalness={0} />
          </mesh>
          <mesh position={[0, -0.06, 0.42]} castShadow>
            <boxGeometry args={[0.52, 0.05, 0.3]} />
            <meshStandardMaterial color={hatColor ?? color} roughness={SKIN_ROUGH} metalness={0} />
          </mesh>
        </group>
      )
    case 'client':
      return (
        <group position={[0, 0.22, 0]}>
          <mesh scale={[1, 0.72, 1]} castShadow>
            <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {mat}
          </mesh>
          <mesh position={[0, -0.32, 0.28]} castShadow>
            <boxGeometry args={[0.3, 0.2, 0.18]} />
            {mat}
          </mesh>
        </group>
      )
    default:
      return (
        <mesh position={[0, 0.28, 0]} scale={[1, 0.64, 1]} castShadow>
          <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {mat}
        </mesh>
      )
  }
}

function Hijab({ color, big }: { color: string; big: boolean }) {
  const mat = <meshStandardMaterial color={color} roughness={0.92} metalness={0} />
  const s = big ? 1.4 : 1
  return (
    <group position={[0, 0.02, 0]} scale={[s, s, s]}>
      <mesh scale={[1.13, 1.0, 1.13]} castShadow>
        <sphereGeometry args={[0.54, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.74]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.44, 0]} castShadow>
        <sphereGeometry args={[0.5, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.5, 0.34]} rotation={[0.22, 0, 0]} castShadow>
        <boxGeometry args={[0.46, 0.62, 0.22]} />
        {mat}
      </mesh>
    </group>
  )
}

function Accessory({ accessory }: { accessory: Accessory }) {
  if (accessory === 'headphone') {
    return (
      <group position={[0, 0.06, 0.02]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, -0.32]}>
          <torusGeometry args={[0.42, 0.05, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#222222" roughness={0.6} />
        </mesh>
        <mesh position={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.09, 12]} />
          <meshStandardMaterial color="#333333" roughness={0.5} />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.09, 12]} />
          <meshStandardMaterial color="#333333" roughness={0.5} />
        </mesh>
      </group>
    )
  }
  if (accessory === 'glasses') {
    return (
      <group position={[0, 0.02, 0.43]}>
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.115, 0.016, 6, 4]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
          </mesh>
        ))}
        <mesh>
          <boxGeometry args={[0.14, 0.016, 0.016]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    )
  }
  if (accessory === 'round-glasses') {
    return (
      <group position={[0, 0.02, 0.44]}>
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <torusGeometry args={[0.1, 0.013, 8, 20]} />
            <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
          </mesh>
        ))}
        <mesh>
          <boxGeometry args={[0.14, 0.013, 0.013]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
    )
  }
  return null
}
