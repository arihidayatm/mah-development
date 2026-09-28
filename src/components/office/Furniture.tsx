import { Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'

export function WoodFloor({
  position,
  size,
  color = '#E8C39E',
}: {
  position: [number, number, number]
  size: [number, number]
  color?: string
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

export function Wall({
  position,
  size,
  rotation = [0, 0, 0],
  color = '#FFF6EC',
}: {
  position: [number, number, number]
  size: [number, number]
  rotation?: [number, number, number]
  color?: string
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function OfficeDesk({
  position,
  rotation = [0, 0, 0],
  screens,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  screens?: React.ReactNode
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.72, 0]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.7]} />
        <meshStandardMaterial color="#C89B6C" roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, 0.36, 0]}>
        <boxGeometry args={[0.08, 0.72, 0.6]} />
        <meshStandardMaterial color="#8A6A48" />
      </mesh>
      <mesh position={[0.6, 0.36, 0]}>
        <boxGeometry args={[0.08, 0.72, 0.6]} />
        <meshStandardMaterial color="#8A6A48" />
      </mesh>
      {screens}
    </group>
  )
}

export function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#5C4033" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, -0.22]}>
        <boxGeometry args={[0.5, 0.55, 0.06]} />
        <meshStandardMaterial color="#5C4033" roughness={0.8} />
      </mesh>
    </group>
  )
}

export function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.4, 12]} />
        <meshStandardMaterial color="#B5673A" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.62, 0]} castShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#4E7A46" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 0.82, 0]} castShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#5C8A52" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function Carpet({
  position,
  size = [4, 3],
  color = '#B9897A',
}: {
  position: [number, number, number]
  size?: [number, number]
  color?: string
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  )
}

export function HangingLamp({ position, color = '#FFD9A0' }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.8, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.45, 0.4, 16, 1, true]} />
        <meshStandardMaterial color="#E8D5B5" side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
      <pointLight position={[0, -0.3, 0]} intensity={6} distance={7} color={color} castShadow={false} />
    </group>
  )
}

export function Window({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial color="#8FD6FF" emissive="#8FD6FF" emissiveIntensity={0.4} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[2.3, 0.08, 0.05]} />
        <meshStandardMaterial color="#8A6A48" />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[0.08, 1.4, 0.05]} />
        <meshStandardMaterial color="#8A6A48" />
      </mesh>
    </group>
  )
}

export function Sofa({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[1.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#9CB6A5" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.65, -0.32]} castShadow>
        <boxGeometry args={[1.8, 0.6, 0.2]} />
        <meshStandardMaterial color="#8AA896" roughness={0.9} />
      </mesh>
      <mesh position={[-0.82, 0.55, 0]}>
        <boxGeometry args={[0.18, 0.5, 0.8]} />
        <meshStandardMaterial color="#8AA896" roughness={0.9} />
      </mesh>
      <mesh position={[0.82, 0.55, 0]}>
        <boxGeometry args={[0.18, 0.5, 0.8]} />
        <meshStandardMaterial color="#8AA896" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function NeonSign({
  position,
  rotation = [0, 0, 0],
  text,
  color = '#FF4FA3',
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  text: string
  color?: string
}) {
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
      }),
    [color],
  )
  void mat
  return (
    <group position={position} rotation={rotation}>
      <Text
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#3a0f28"
      >
        {text}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <pointLight position={[0, -0.4, 0.4]} intensity={3} distance={4} color={color} />
    </group>
  )
}

export function Tooltip({ position, children }: { position: [number, number, number]; children: React.ReactNode }) {
  return <Html position={position}>{children}</Html>
}
