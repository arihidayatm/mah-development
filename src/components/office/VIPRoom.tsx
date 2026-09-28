import { memo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Carpet, Plant, Wall, WoodFloor } from './Furniture'

export const VIPRoom = memo(function VIPRoom() {
  return (
    <group>
      <WoodFloor position={[10, 0.02, -3]} size={[7, 7]} color="#DEB887" />
      <Carpet position={[10, 0.03, -3]} size={[5, 5]} color="#7A5C4A" />

      {/* Dinding kaca transmission */}
      <mesh position={[13.5, 1.6, -3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[7, 3.2]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          transparent
          opacity={0.35}
          color="#CFE8F0"
        />
      </mesh>
      <mesh position={[10, 1.6, 0.5]}>
        <planeGeometry args={[7, 3.2]} />
        <meshPhysicalMaterial
          transmission={1}
          roughness={0.1}
          thickness={0.5}
          ior={1.5}
          transparent
          opacity={0.35}
          color="#CFE8F0"
        />
      </mesh>
      <Wall position={[10, 1.6, -6.5]} size={[7, 3.2]} />

      {/* Meja besar */}
      <mesh position={[11, 0.75, -3]} castShadow>
        <boxGeometry args={[2.6, 0.1, 1.3]} />
        <meshStandardMaterial color="#5C4033" roughness={0.5} />
      </mesh>
      <mesh position={[9.9, 0.37, -3]}>
        <boxGeometry args={[0.1, 0.75, 1.1]} />
        <meshStandardMaterial color="#3E2A20" />
      </mesh>
      <mesh position={[12.1, 0.37, -3]}>
        <boxGeometry args={[0.1, 0.75, 1.1]} />
        <meshStandardMaterial color="#3E2A20" />
      </mesh>

      {/* Trophy emas */}
      <group position={[12.6, 0.85, -3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.12, 0.06, 0.4, 12]} />
          <meshStandardMaterial color="#F5C542" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.26, 0]}>
          <boxGeometry args={[0.24, 0.12, 0.24]} />
          <meshStandardMaterial color="#8B6A2E" metalness={0.6} />
        </mesh>
      </group>

      {/* Papan nama */}
      <group position={[10, 1.9, -6.4]}>
        <mesh>
          <boxGeometry args={[2, 0.5, 0.06]} />
          <meshStandardMaterial color="#B8860B" metalness={0.5} roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.04]} fontSize={0.2} color="#1a1208" anchorX="center" anchorY="middle">
          Project Leader
        </Text>
      </group>

      {/* Pintu kayu */}
      <mesh position={[8.2, 1.1, 0.48]}>
        <boxGeometry args={[1.0, 2.2, 0.08]} />
        <meshStandardMaterial color="#8A5A34" roughness={0.6} />
      </mesh>

      <Plant position={[13, 0, -5.8]} />
      <pointLight position={[10, 2.6, -3]} intensity={8} distance={8} color="#FFE0B0" />
    </group>
  )
})

export { THREE }
