import { memo } from 'react'
import { Text } from '@react-three/drei'
import { Floor, Rug, Sofa, Wall } from './Furniture'

/** Ruang istirahat: band alat musik + PS5 + TV. */
export const RelaxRoom = memo(function RelaxRoom() {
  return (
    <group>
      <Floor position={[4, 0.02, 8]} size={[10, 8]} color="#C99A6A" />
      <Wall position={[4, 1.7, 12]} size={[10, 3.4]} color="#F0E2D0" />
      <Rug position={[4, 0.03, 8]} size={[8, 6]} color="#6B5B7B" />

      {/* Gitar */}
      <group position={[0.6, 0, 11.3]} rotation={[0, 0.4, 0]}>
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.5, 0.62, 0.14]} />
          <meshStandardMaterial color="#C97B3A" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.38, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.0, 10]} />
          <meshStandardMaterial color="#6B4629" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.36, 0.3, 0.08]} />
          <meshStandardMaterial color="#3E2A20" />
        </mesh>
      </group>

      {/* Bass */}
      <group position={[1.7, 0, 11.3]} rotation={[0, 0.2, 0]}>
        <mesh position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[0.55, 0.66, 0.14]} />
          <meshStandardMaterial color="#2E5A88" roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.42, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.1, 10]} />
          <meshStandardMaterial color="#4A3220" roughness={0.5} />
        </mesh>
      </group>

      {/* Drum kit */}
      <group position={[7.4, 0, 11]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.84, 22]} />
          <meshStandardMaterial color="#C2410C" roughness={0.5} metalness={0.2} />
        </mesh>
        {[-0.72, 0.72].map((x) => (
          <group key={x} position={[x, 0.95, 0]}>
            <mesh rotation={[0.22, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.03, 22]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.45, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
              <meshStandardMaterial color="#555555" metalness={0.7} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.53, 0.56, 0.32, 22]} />
          <meshStandardMaterial color="#7A3A10" />
        </mesh>
      </group>

      {/* Speaker Marshall */}
      <group position={[9, 0, 8]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.92, 1.0, 0.5]} />
          <meshStandardMaterial color="#111111" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.64, 0.26]}>
          <planeGeometry args={[0.66, 0.22]} />
          <meshStandardMaterial color="#F5F0D8" />
        </mesh>
        <Text position={[0, 0.64, 0.27]} fontSize={0.12} color="#111111" anchorX="center" anchorY="middle">
          Marshall
        </Text>
        <mesh position={[0, 0.22, 0.26]}>
          <circleGeometry args={[0.18, 20]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      {/* PS5 */}
      <group position={[6.6, 0, 6.2]}>
        <mesh position={[0, 0.16, 0]} castShadow>
          <boxGeometry args={[0.9, 0.32, 0.46]} />
          <meshStandardMaterial color="#F5F5F5" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.22, 0.24]}>
          <boxGeometry args={[0.6, 0.04, 0.02]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1.2} />
        </mesh>
      </group>

      {/* TV */}
      <mesh position={[6.6, 1.25, 11.9]} castShadow>
        <boxGeometry args={[1.9, 1.05, 0.08]} />
        <meshStandardMaterial color="#0b1220" emissive="#2563eb" emissiveIntensity={0.55} />
      </mesh>

      <Sofa position={[3.5, 0, 5.5]} rotation={[0, Math.PI, 0]} color="#8E7BA8" colorDark="#7B689A" />

      <pointLight position={[4.5, 2.7, 9]} intensity={6} distance={10} color="#B07CC6" />
    </group>
  )
})
