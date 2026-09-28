import { memo } from 'react'
import { Text } from '@react-three/drei'
import { Carpet, Sofa, Wall, WoodFloor } from './Furniture'

export const RelaxRoom = memo(function RelaxRoom() {
  return (
    <group>
      <WoodFloor position={[4, 0.02, 8]} size={[10, 8]} color="#C99A6A" />
      <Wall position={[4, 1.6, 12]} size={[10, 3.2]} color="#F0E2D0" />
      <Carpet position={[4, 0.03, 8]} size={[8, 6]} color="#6B5B7B" />

      {/* Gitar + Bass di stand */}
      <group position={[0.5, 0, 11.4]} rotation={[0, 0.4, -0.15]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.5, 0.6, 0.14]} />
          <meshStandardMaterial color="#C97B3A" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.35, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 10]} />
          <meshStandardMaterial color="#6B4629" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.35, 0.3, 0.08]} />
          <meshStandardMaterial color="#3E2A20" />
        </mesh>
      </group>
      <group position={[1.6, 0, 11.4]} rotation={[0, 0.2, 0.15]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[0.55, 0.65, 0.14]} />
          <meshStandardMaterial color="#2E5A88" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.1, 10]} />
          <meshStandardMaterial color="#4A3220" roughness={0.5} />
        </mesh>
      </group>

      {/* Drum + cymbal */}
      <group position={[7.5, 0, 11]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.8, 20]} />
          <meshStandardMaterial color="#C2410C" roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0.7, 0.9, 0]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.03, 20]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.7, 0.9, 0]} rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.03, 20]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.52, 0.55, 0.3, 20]} />
          <meshStandardMaterial color="#7A3A10" />
        </mesh>
      </group>

      {/* Speaker Marshall */}
      <group position={[9, 0, 8]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.5]} />
          <meshStandardMaterial color="#111" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.62, 0.26]}>
          <planeGeometry args={[0.65, 0.22]} />
          <meshStandardMaterial color="#F5F0D8" />
        </mesh>
        <Text position={[0, 0.62, 0.27]} fontSize={0.12} color="#111" anchorX="center" anchorY="middle">
          Marshall
        </Text>
        <mesh position={[0, 0.2, 0.26]}>
          <circleGeometry args={[0.18, 20]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      {/* PS5 box putih + TV */}
      <group position={[6.5, 0, 6.2]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.9, 0.3, 0.45]} />
          <meshStandardMaterial color="#F5F5F5" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0.24]}>
          <boxGeometry args={[0.6, 0.05, 0.02]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} />
        </mesh>
      </group>
      <group position={[6.5, 0, 12 - 0.1]}>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[1.8, 1.0, 0.08]} />
          <meshStandardMaterial color="#0b1220" emissive="#2563eb" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Sofa rebahan */}
      <Sofa position={[3.5, 0, 5.5]} rotation={[0, Math.PI, 0]} />

      <pointLight position={[4.5, 2.6, 9]} intensity={5} distance={9} color="#B07CC6" />
    </group>
  )
})
