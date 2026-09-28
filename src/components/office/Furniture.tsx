import { useMemo } from 'react'
import * as THREE from 'three'

export const COLORS = {
  floorWood: '#E8C39E',
  floorLight: '#DEB887',
  wall: '#FFF6EC',
  wallWarm: '#FFEFD8',
  deskTop: '#C89B6C',
  deskLeg: '#8A6A48',
  darkWood: '#5C4033',
}

export function Floor({
  position,
  size,
  color = COLORS.floorWood,
}: {
  position: [number, number, number]
  size: [number, number]
  color?: string
}) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.92} />
    </mesh>
  )
}

export function Rug({
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
      <meshStandardMaterial color={color} roughness={0.96} />
    </mesh>
  )
}

export function Wall({
  position,
  size,
  rotation = [0, 0, 0] as [number, number, number],
  color = COLORS.wall,
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

export function Desk({
  position,
  w = 1.4,
  d = 0.7,
}: {
  position: [number, number, number]
  w?: number
  d?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.08, d]} />
        <meshStandardMaterial color={COLORS.deskTop} roughness={0.7} />
      </mesh>
      {[-w / 2 + 0.06, w / 2 - 0.06].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]}>
          <boxGeometry args={[0.08, 0.72, d - 0.1]} />
          <meshStandardMaterial color={COLORS.deskLeg} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

export function Chair({
  position,
  rotation = [0, 0, 0] as [number, number, number],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color={COLORS.darkWood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, -0.22]}>
        <boxGeometry args={[0.5, 0.55, 0.06]} />
        <meshStandardMaterial color={COLORS.darkWood} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  )
}

export function Sofa({
  position,
  rotation = [0, 0, 0] as [number, number, number],
  color = '#9CB6A5',
  colorDark = '#8AA896',
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  colorDark?: string
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.3, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.92} />
      </mesh>
      <mesh position={[0, 0.66, -0.33]} castShadow>
        <boxGeometry args={[1.8, 0.6, 0.18]} />
        <meshStandardMaterial color={colorDark} roughness={0.92} />
      </mesh>
      {[-0.83, 0.83].map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <boxGeometry args={[0.16, 0.5, 0.8]} />
          <meshStandardMaterial color={colorDark} roughness={0.92} />
        </mesh>
      ))}
    </group>
  )
}

export function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.16, 0.44, 12]} />
        <meshStandardMaterial color="#B5673A" roughness={0.85} />
      </mesh>
      {[
        [0, 0.66, 0, 0.3],
        [0.18, 0.86, 0, 0.2],
        [-0.16, 0.8, 0.08, 0.18],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <sphereGeometry args={[p[3], 12, 12]} />
          <meshStandardMaterial color={i === 0 ? '#4E7A46' : '#5C8A52'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

export function HangingLamp({
  position,
  color = '#FFD9A0',
  intensity = 8,
}: {
  position: [number, number, number]
  color?: string
  intensity?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 6]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh castShadow>
        <coneGeometry args={[0.45, 0.4, 16, 1, true]} />
        <meshStandardMaterial color="#E8D5B5" side={THREE.DoubleSide} roughness={0.5} />
      </mesh>
      <pointLight position={[0, -0.35, 0]} intensity={intensity} distance={8} color={color} />
    </group>
  )
}

export function WindowPane({
  position,
  rotation = [0, 0, 0] as [number, number, number],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial
          color="#8FD6FF"
          emissive="#8FD6FF"
          emissiveIntensity={0.45}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[2.3, 0.08, 0.06]} />
        <meshStandardMaterial color={COLORS.deskLeg} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.08, 1.4, 0.06]} />
        <meshStandardMaterial color={COLORS.deskLeg} />
      </mesh>
    </group>
  )
}

export function useNeonColor(color: string, intensity = 1) {
  return useMemo(
    () => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, toneMapped: false }),
    [color, intensity],
  )
}
