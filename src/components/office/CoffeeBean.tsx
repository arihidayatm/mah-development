import { memo } from 'react'
import { Text } from '@react-three/drei'
import { Floor, Rug, Wall } from './Furniture'
import { usePrayerTime } from '../../store/usePrayerTime'

/** Coffee & lunch bar. Saat mode lunch, 6 lunchbox + uap muncul. */
export const CoffeeBean = memo(function CoffeeBean() {
  const globalMode = usePrayerTime((s) => s.globalMode)
  const isLunch = globalMode === 'lunch'

  return (
    <group>
      <Floor position={[-5, 0.02, 6.5]} size={[13, 8]} color="#D9A97C" />
      <Wall position={[-5, 1.7, 10.5]} size={[13, 3.4]} color="#FFEFD8" />

      {/* Neon NGOPI DULU */}
      <group position={[-5, 2.5, 10.4]}>
        <Text fontSize={0.55} color="#00E5FF" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#062a2e">
          NGOPI DULU
        </Text>
        <pointLight position={[0, -0.4, 0.5]} intensity={3.5} distance={5} color="#00E5FF" />
      </group>

      {/* Bar counter */}
      <mesh position={[-5, 0.55, 8]} castShadow receiveShadow>
        <boxGeometry args={[7.2, 1.1, 0.8]} />
        <meshStandardMaterial color="#6B4629" roughness={0.6} />
      </mesh>
      <mesh position={[-5, 1.14, 8]} castShadow>
        <boxGeometry args={[7.4, 0.08, 0.92]} />
        <meshStandardMaterial color="#3E2A20" roughness={0.5} />
      </mesh>

      {/* Mesin kopi */}
      <group position={[-7.6, 1.18, 8]}>
        <mesh castShadow>
          <boxGeometry args={[0.72, 0.62, 0.52]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.36, 0.16]}>
          <cylinderGeometry args={[0.08, 0.08, 0.18, 10]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>

      {/* Toples beans */}
      {[-4.6, -3.6, -2.6].map((x, i) => (
        <group key={i} position={[x, 1.36, 7.8]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 0.34, 12]} />
            <meshPhysicalMaterial transmission={0.85} roughness={0.1} thickness={0.3} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.2, 12]} />
            <meshStandardMaterial color={['#5A3A22', '#7A4A28', '#3E2A1A'][i]} roughness={0.9} />
          </mesh>
        </group>
      ))}

      <Rug position={[-5, 0.03, 4.5]} size={[8.5, 4]} color="#C79A6B" />

      {/* Bean bag */}
      {[-9.2, -1].map((x, i) => (
        <mesh key={i} position={[x, 0.32, 5]} castShadow>
          <sphereGeometry args={[0.46, 16, 16]} />
          <meshStandardMaterial color={i === 0 ? '#B5651D' : '#8B4513'} roughness={0.96} />
        </mesh>
      ))}

      {/* Lunchbox saat lunch */}
      {isLunch &&
        [-3, -1.8, -0.6, 0.6, 1.8, 3].map((dx, i) => (
          <group key={i} position={[-5 + dx, 1.24, 7.35]}>
            <mesh castShadow>
              <boxGeometry args={[0.52, 0.3, 0.36]} />
              <meshStandardMaterial color={['#F2E3C6', '#E8C39E', '#F2CBA0'][i % 3]} roughness={0.7} />
            </mesh>
            <Steam y={0.4} />
          </group>
        ))}

      <pointLight position={[-5, 2.7, 8]} intensity={9} distance={10} color="#FFD9A0" />
    </group>
  )
})

function Steam({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.05 - 0.05, i * 0.12, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.34 - i * 0.08} />
        </mesh>
      ))}
    </group>
  )
}
