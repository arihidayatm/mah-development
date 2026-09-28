import { memo } from 'react'
import { Text } from '@react-three/drei'
import { Floor, Rug, Wall } from './Furniture'

const SAJADAH = [
  { pos: [-13, 0.03, 8.5] as [number, number, number], color: '#D9A04A' },
  { pos: [-14, 0.03, 9.6] as [number, number, number], color: '#7BA05B' },
  { pos: [-12, 0.03, 9.6] as [number, number, number], color: '#B5651D' },
  { pos: [-14, 0.03, 11] as [number, number, number], color: '#5B8FA8' },
  { pos: [-12, 0.03, 11] as [number, number, number], color: '#A85B7B' },
  { pos: [-16.2, 0.03, 10.4] as [number, number, number], color: '#C4A35A' },
]

/** Mushalla: tenang, jauh dari Relax. Vina pakai partisi di belakang. */
export const Mushalla = memo(function Mushalla() {
  return (
    <group>
      <Floor position={[-13, 0.02, 9.5]} size={[10, 10]} color="#C9B48F" />
      <Rug position={[-13, 0.025, 9.5]} size={[9, 9]} color="#A8C3A0" />
      <Wall position={[-13, 1.7, 14.2]} size={[10, 3.4]} color="#EAF2E6" />
      <Wall position={[-18, 1.7, 9.5]} size={[10, 3.4]} rotation={[0, Math.PI / 2, 0]} color="#EAF2E6" />

      {/* Mihrab + kaligrafi */}
      <group position={[-13, 1.7, 14.1]}>
        <mesh position={[0, -0.45, 0]}>
          <boxGeometry args={[1.7, 2.1, 0.06]} />
          <meshStandardMaterial color="#7BA05B" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 0.04]}>
          <circleGeometry args={[0.72, 26, 0, Math.PI]} />
          <meshStandardMaterial color="#A8C3A0" roughness={0.7} />
        </mesh>
        <Text position={[0, 0.02, 0.07]} fontSize={0.52} color="#2F4A2A" anchorX="center" anchorY="middle">
          الله
        </Text>
      </group>

      {/* Sajadah */}
      {SAJADAH.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[0.95, 1.55]} />
          <meshStandardMaterial color={s.color} roughness={0.95} />
        </mesh>
      ))}

      {/* Rak Quran */}
      <group position={[-17.2, 0, 12]}>
        <mesh position={[0, 0.62, 0]} castShadow>
          <boxGeometry args={[1.25, 0.08, 0.36]} />
          <meshStandardMaterial color="#8A5A34" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.28, -0.16]}>
          <boxGeometry args={[1.25, 0.62, 0.05]} />
          <meshStandardMaterial color="#8A5A34" roughness={0.6} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[-0.46 + i * 0.23, 0.76, 0]} castShadow>
            <boxGeometry args={[0.17, 0.22, 0.27]} />
            <meshStandardMaterial color={['#2F5D3A', '#7A3A2A', '#2A3F6B'][i % 3]} roughness={0.7} />
          </mesh>
        ))}
      </group>

      {/* Partisi kayu 1.2m untuk Vina */}
      <mesh position={[-15.3, 0.62, 10.4]} castShadow>
        <boxGeometry args={[0.06, 1.24, 2.4]} />
        <meshStandardMaterial color="#9A6A40" roughness={0.72} transparent opacity={0.8} />
      </mesh>

      <pointLight position={[-13, 2.9, 9.5]} intensity={5} distance={10} color="#EAF7E0" />
    </group>
  )
})

/** Area wudu: 3 keran + cermin + lantai biru. */
export const Wudu = memo(function Wudu() {
  return (
    <group>
      <mesh position={[-13, 0.02, 12.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 3.4]} />
        <meshStandardMaterial color="#7FB8D4" roughness={0.3} />
      </mesh>

      {[-14.5, -13, -11.5].map((x) => (
        <group key={x} position={[x, 0, 12.6]}>
          <mesh position={[0, 0.92, -0.28]} castShadow>
            <boxGeometry args={[0.36, 0.08, 0.36]} />
            <meshStandardMaterial color="#DDDDDD" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.66, -0.28]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
            <meshStandardMaterial color="#AAAAAA" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.86, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.22, 8]} />
            <meshStandardMaterial color="#BBBBBB" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      ))}

      <mesh position={[-13, 1.65, 13.4]}>
        <planeGeometry args={[5, 1.6]} />
        <meshStandardMaterial color="#DDEAF2" metalness={0.4} roughness={0.15} />
      </mesh>
    </group>
  )
})
