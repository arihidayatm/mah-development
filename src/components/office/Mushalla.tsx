import { memo } from 'react'
import { Text } from '@react-three/drei'
import { Carpet, Wall, WoodFloor } from './Furniture'

const SAJADAH_COLORS = ['#D9A04A', '#7BA05B', '#B5651D', '#5B8FA8', '#A85B7B', '#C4A35A']

export const Mushalla = memo(function Mushalla() {
  const positions: [number, number, number][] = [
    [-13, 0.03, 8.5],
    [-14, 0.03, 9.6],
    [-12, 0.03, 9.6],
    [-14, 0.03, 11],
    [-12, 0.03, 11],
    [-16.2, 0.03, 10.4],
  ]

  return (
    <group>
      <WoodFloor position={[-13, 0.02, 9.5]} size={[9, 9]} color="#C9B48F" />
      <Carpet position={[-13, 0.025, 9.5]} size={[8, 8]} color="#A8C3A0" />
      <Wall position={[-13, 1.6, 14]} size={[9, 3.2]} color="#EAF2E6" />
      <Wall position={[-17.5, 1.6, 9.5]} size={[9, 3.2]} rotation={[0, Math.PI / 2, 0]} color="#EAF2E6" />

      {/* Mihrab + kaligrafi */}
      <group position={[-13, 1.6, 13.9]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[1.6, 2.0, 0.06]} />
          <meshStandardMaterial color="#7BA05B" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 0.05]}>
          <circleGeometry args={[0.7, 24, 0, Math.PI]} />
          <meshStandardMaterial color="#A8C3A0" roughness={0.7} />
        </mesh>
        <Text position={[0, 0, 0.06]} fontSize={0.5} color="#2F4A2A" anchorX="center" anchorY="middle">
          الله
        </Text>
      </group>

      {/* Sajadah */}
      {positions.map((p, i) => (
        <mesh key={i} position={p} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.9, 1.5]} />
          <meshStandardMaterial color={SAJADAH_COLORS[i]} roughness={0.95} />
        </mesh>
      ))}

      {/* Rak Quran kayu + 5 Quran */}
      <group position={[-16.8, 0, 12]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.35]} />
          <meshStandardMaterial color="#8A5A34" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.4, -0.15]}>
          <boxGeometry args={[1.2, 0.8, 0.05]} />
          <meshStandardMaterial color="#8A5A34" roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.45 + i * 0.22, 0.92, 0]} castShadow>
            <boxGeometry args={[0.16, 0.2, 0.26]} />
            <meshStandardMaterial color={['#2F5D3A', '#7A3A2A', '#2A3F6B'][i % 3]} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Partisi kayu 1.2m untuk vina */}
      <mesh position={[-15.3, 0.6, 10.4]} castShadow>
        <boxGeometry args={[0.06, 1.2, 2.2]} />
        <meshStandardMaterial color="#9A6A40" roughness={0.7} transparent opacity={0.75} />
      </mesh>

      <pointLight position={[-13, 2.8, 9.5]} intensity={4} distance={9} color="#EAF7E0" />
    </group>
  )
})

export const Wudu = memo(function Wudu() {
  return (
    <group>
      <mesh position={[-13, 0.02, 11.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#7FB8D4" roughness={0.3} />
      </mesh>

      {[-14.5, -13, -11.5].map((x, i) => (
        <group key={i} position={[x, 0, 11.5]}>
          <mesh position={[0, 0.9, -0.3]} castShadow>
            <boxGeometry args={[0.35, 0.08, 0.35]} />
            <meshStandardMaterial color="#DDDDDD" />
          </mesh>
          <mesh position={[0, 0.65, -0.3]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
            <meshStandardMaterial color="#AAA" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.87, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.2, 8]} />
            <meshStandardMaterial color="#BBB" metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Cermin */}
      <mesh position={[-13, 1.6, 12.4]}>
        <planeGeometry args={[5, 1.6]} />
        <meshStandardMaterial color="#DDEAF2" metalness={0.4} roughness={0.15} />
      </mesh>
    </group>
  )
})
