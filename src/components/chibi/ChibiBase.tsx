import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
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
}

const SKIN_ROUGH = 0.85

function useBlink() {
  const eyeL = useRef<THREE.Mesh>(null)
  const eyeR = useRef<THREE.Mesh>(null)
  return { eyeL, eyeR }
}

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
}: ChibiBaseProps) {
  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Mesh>(null)
  const armR = useRef<THREE.Mesh>(null)
  const legL = useRef<THREE.Mesh>(null)
  const legR = useRef<THREE.Mesh>(null)
  const { eyeL, eyeR } = useBlink()

  const isPray = pose === 'pray'
  const isWalk = pose === 'walk'
  const isSleepy = mood === 'sleepy' || isPray

  const skinMat = (
    <meshStandardMaterial color={colors.skin} roughness={SKIN_ROUGH} metalness={0} />
  )
  const topMat = (
    <meshStandardMaterial color={colors.top} roughness={SKIN_ROUGH} metalness={0} />
  )

  const blinkPhase = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

    if (root.current) {
      root.current.position.y = Math.sin(t * 2) * 0.02
      if (isWalk) {
        root.current.rotation.z = Math.sin(t * 8) * 0.08
        root.current.position.y += Math.abs(Math.sin(t * 8)) * 0.06
      } else {
        root.current.rotation.z *= 0.8
      }
    }

    if (head.current) {
      let tilt = Math.sin(t * 1.5) * 0.08
      if (isSleepy && !isPray) tilt = 0.35
      if (isPray && prayPhase === 'ruku') tilt = 0
      head.current.rotation.x += (tilt - head.current.rotation.x) * 0.15
    }

    if (!isPray) {
      if (armL.current) {
        if (typing && pose === 'sit') {
          armL.current.rotation.x = Math.sin(t * 10) * 0.2 - 0.4
        } else if (isWalk) {
          armL.current.rotation.x = Math.sin(t * 8) * 0.5
        } else {
          armL.current.rotation.x += (-0.1 - armL.current.rotation.x) * 0.1
        }
      }
      if (armR.current) {
        if (typing && pose === 'sit') {
          armR.current.rotation.x = Math.sin(t * 10 + 1.2) * 0.2 - 0.4
        } else if (isWalk) {
          armR.current.rotation.x = Math.sin(t * 8 + Math.PI) * 0.5
        } else {
          armR.current.rotation.x += (-0.1 - armR.current.rotation.x) * 0.1
        }
      }
    }

    if (legL.current && isWalk) legL.current.rotation.x = Math.sin(t * 8) * 0.5
    if (legR.current && isWalk) legR.current.rotation.x = Math.sin(t * 8 + Math.PI) * 0.5

    blinkPhase.current += delta
    const sleepy = mood === 'sleepy'
    const prayEyes = isPray ? 0.5 : 1
    let targetY = 1
    if (sleepy) targetY = 0.4
    if (blinkPhase.current > 3 && blinkPhase.current < 3.12) targetY = 0.1
    if (blinkPhase.current > 3.2) blinkPhase.current = 0
    targetY *= prayEyes
    if (eyeL.current) eyeL.current.scale.y += (targetY - eyeL.current.scale.y) * 0.5
    if (eyeR.current) eyeR.current.scale.y += (targetY - eyeR.current.scale.y) * 0.5

    if (body.current) {
      let rx = 0
      let by = 0
      if (isPray) {
        if (prayPhase === 'qiyam') {
          rx = 0.05
        } else if (prayPhase === 'ruku') {
          rx = 1.35
        } else if (prayPhase === 'sujud') {
          rx = 1.5
          by = -0.35
        } else if (prayPhase === 'julus') {
          rx = 0.15
          by = -0.4
        }
      }
      body.current.rotation.x += (rx - body.current.rotation.x) * 0.12
      body.current.position.y += (by - body.current.position.y) * 0.12
    }
  })

  const blushOpacity = isPray ? 0.2 : 0.6
  const bodyScaleY = isSleepy && !isPray ? 0.96 : 1

  const eyeColor = '#171717'

  return (
    <group ref={root} scale={scale}>
      <group ref={body}>
        {/* Badan */}
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

          {/* Rambut / hijab */}
          {hairStyle === 'hijab' || mukena ? (
            <Hijab
              color={mukena ? '#F8F5EE' : hijabColor ?? colors.hair}
              scaleY={mukena ? 1.4 : 1}
            />
          ) : (
            <Hair style={hairStyle} color={colors.hair} />
          )}

          {pakaiPeci && (
            <mesh position={[0, 0.4, 0]} castShadow>
              <cylinderGeometry args={[0.36, 0.38, 0.24, 20]} />
              <meshStandardMaterial color="#141414" roughness={0.9} />
            </mesh>
          )}

          {/* Mata */}
          <mesh ref={eyeL} position={[-0.17, 0.02, 0.42]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color={eyeColor} roughness={0.15} metalness={0} />
          </mesh>
          <mesh ref={eyeR} position={[0.17, 0.02, 0.42]}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial color={eyeColor} roughness={0.15} metalness={0} />
          </mesh>
          {/* Highlight */}
          <mesh position={[-0.19, 0.06, 0.47]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.15, 0.06, 0.47]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Blush */}
          <mesh position={[-0.28, -0.1, 0.38]} rotation={[0, -0.5, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial color="#FF9AA2" transparent opacity={blushOpacity} />
          </mesh>
          <mesh position={[0.28, -0.1, 0.38]} rotation={[0, 0.5, 0]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial color="#FF9AA2" transparent opacity={blushOpacity} />
          </mesh>

          {/* Mulut */}
          {isPray ? (
            <mesh position={[0, -0.18, 0.46]}>
              <boxGeometry args={[0.12, 0.018, 0.02]} />
              <meshStandardMaterial color="#8B4A3A" roughness={0.6} />
            </mesh>
          ) : (
            <mesh position={[0, -0.18, 0.45]} rotation={[0.2, 0, 0]}>
              <torusGeometry args={[0.055, 0.018, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#8B4A3A" roughness={0.6} />
            </mesh>
          )}

          <Accessory accessory={accessory} />
        </group>

        {/* Lengan */}
        <mesh ref={armL} position={[-0.34, 0.78, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.28, 6, 10]} />
          {topMat}
        </mesh>
        <mesh ref={armR} position={[0.34, 0.78, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.28, 6, 10]} />
          {topMat}
        </mesh>

        {/* Kaki */}
        <mesh ref={legL} position={[-0.14, 0.34, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#3A3A3A" roughness={0.9} />
        </mesh>
        <mesh ref={legR} position={[0.14, 0.34, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#3A3A3A" roughness={0.9} />
        </mesh>
      </group>

      <group scale={[1, bodyScaleY, 1]} />

      {zzz && (
        <Html position={[0.35, 1.9, 0]} center distanceFactor={8}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>Zzz</div>
        </Html>
      )}
    </group>
  )
}

function Hair({ style, color }: { style: HairStyle; color: string }) {
  const mat = <meshStandardMaterial color={color} roughness={SKIN_ROUGH} metalness={0} />
  switch (style) {
    case 'spiky':
      return (
        <group position={[0, 0.3, 0]}>
          <mesh scale={[1, 0.6, 1]}>
            <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {mat}
          </mesh>
          {[-0.22, 0, 0.22].map((x, i) => (
            <mesh key={i} position={[x, 0.34, -0.05]} rotation={[0, 0, x * 2]}>
              <coneGeometry args={[0.12, 0.28, 8]} />
              {mat}
            </mesh>
          ))}
        </group>
      )
    case 'bob':
      return (
        <group position={[0, 0.08, 0]}>
          <mesh scale={[1.1, 1, 1.1]}>
            <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
            {mat}
          </mesh>
          <mesh position={[0, -0.18, -0.28]}>
            <boxGeometry args={[0.7, 0.28, 0.4]} />
            {mat}
          </mesh>
        </group>
      )
    case 'cap':
      return (
        <group position={[0, 0.34, 0]}>
          <mesh scale={[1, 0.65, 1]}>
            <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {mat}
          </mesh>
          <mesh position={[0, -0.05, 0.42]}>
            <boxGeometry args={[0.5, 0.05, 0.28]} />
            {mat}
          </mesh>
        </group>
      )
    case 'client':
      return (
        <group position={[0, 0.24, 0]}>
          <mesh scale={[1, 0.7, 1]}>
            <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {mat}
          </mesh>
          <mesh position={[0, -0.3, 0.3]}>
            <boxGeometry args={[0.34, 0.2, 0.2]} />
            {mat}
          </mesh>
        </group>
      )
    default:
      return (
        <mesh position={[0, 0.3, 0]} scale={[1, 0.62, 1]}>
          <sphereGeometry args={[0.52, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          {mat}
        </mesh>
      )
  }
}

function Hijab({ color, scaleY }: { color: string; scaleY: number }) {
  const mat = <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
  return (
    <group position={[0, 0.05, 0]} scale={[1, scaleY, 1]}>
      <mesh scale={[1.12, 1.0, 1.12]}>
        <sphereGeometry args={[0.54, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <sphereGeometry args={[0.5, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        {mat}
      </mesh>
      <mesh position={[0, -0.5, 0.36]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.44, 0.6, 0.2]} />
        {mat}
      </mesh>
    </group>
  )
}

function Accessory({ accessory }: { accessory: Accessory }) {
  if (accessory === 'headphone') {
    return (
      <group position={[0, 0.06, 0.02]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.28, -0.34]}>
          <torusGeometry args={[0.42, 0.05, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#222" roughness={0.6} />
        </mesh>
        <mesh position={[-0.44, 0.0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} />
        </mesh>
        <mesh position={[0.44, 0.0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 12]} />
          <meshStandardMaterial color="#333" roughness={0.5} />
        </mesh>
      </group>
    )
  }
  if (accessory === 'glasses') {
    return (
      <group position={[0, 0.02, 0.42]}>
        <mesh>
          <torusGeometry args={[0.11, 0.015, 6, 4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <mesh position={[0.34, 0, 0]}>
          <torusGeometry args={[0.11, 0.015, 6, 4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
        </mesh>
        <mesh position={[0.17, 0, 0]}>
          <boxGeometry args={[0.12, 0.015, 0.015]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    )
  }
  if (accessory === 'round-glasses') {
    return (
      <group position={[0, 0.02, 0.43]}>
        <mesh position={[-0.17, 0, 0]}>
          <torusGeometry args={[0.1, 0.012, 8, 20]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
        </mesh>
        <mesh position={[0.17, 0, 0]}>
          <torusGeometry args={[0.1, 0.012, 8, 20]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.14, 0.012, 0.012]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
    )
  }
  return null
}
