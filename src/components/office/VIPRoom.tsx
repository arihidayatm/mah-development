import { memo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { Desk, Floor, Plant, Rug, Wall } from './Furniture'

/** Ruang VIP khusus Ari: dinding kaca transmission + meja besar + trophy. */
export const VIPRoom = memo(function VIPRoom() {
  return (
    <group>
      <Floor position={[10, 0.02, -3]} size={[8, 8]} color="#DEB887" />
      <Rug position={[10, 0.03, -3]} size={[6, 6]} color="#7A5C4A" />

      {/* Dinding kaca */}
      {[
        { pos: [14, 1.7, -3] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
        { pos: [10, 1.7, 1] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
      ].map((w, i) => (
        <mesh key={i} position={w.pos} rotation={w.rot}>
          <planeGeometry args={[8, 3.4]} />
          <meshPhysicalMaterial
            transmission={1}
            roughness={0.1}
            thickness={0.6}
            ior={1.5}
            transparent
            opacity={0.32}
            color="#CFE8F0"
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <Wall position={[10, 1.7, -7]} size={[8, 3.4]} />

      {/* Pintu kayu */}
      <mesh position={[8.2, 1.15, 0.95]}>
        <boxGeometry args={[1.05, 2.3, 0.09]} />
        <meshStandardMaterial color="#8A5A34" roughness={0.6} />
      </mesh>

      {/* Meja besar */}
      <Desk position={[10.6, 0, -3]} w={2.6} d={1.3} />
      <mesh position={[9.4, 0.75, -3]} castShadow>
        <boxGeometry args={[2.6, 0.1, 1.3]} />
        <meshStandardMaterial color="#5C4033" roughness={0.5} />
      </mesh>

      {/* Trophy emas */}
      <group position={[12.6, 0.9, -3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.13, 0.06, 0.42, 14]} />
          <meshStandardMaterial color="#F5C542" metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh position={[0, -0.28, 0]}>
          <boxGeometry args={[0.26, 0.14, 0.26]} />
          <meshStandardMaterial color="#8B6A2E" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Papan nama */}
      <group position={[10, 2.05, -6.9]}>
        <mesh>
          <boxGeometry args={[2.4, 0.55, 0.07]} />
          <meshStandardMaterial color="#B8860B" metalness={0.5} roughness={0.4} />
        </mesh>
        <Text position={[0, 0, 0.05]} fontSize={0.22} color="#1a1208" anchorX="center" anchorY="middle">
          Project Leader
        </Text>
      </group>

      <Plant position={[13.4, 0, -6]} />
      <pointLight position={[10, 2.8, -3]} intensity={10} distance={9} color="#FFE0B0" />
    </group>
  )
})
