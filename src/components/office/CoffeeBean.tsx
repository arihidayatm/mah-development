import { memo } from 'react'
import { Text } from '@react-three/drei'
import { Carpet, NeonSign, Wall, WoodFloor } from './Furniture'
import { usePrayerTime } from '../../store/usePrayerTime'

export const CoffeeBean = memo(function CoffeeBean() {
  const globalMode = usePrayerTime((s) => s.globalMode)
  const isLunch = globalMode === 'lunch'

  return (
    <group>
      <WoodFloor position={[-5, 0.02, 6.5]} size={[12, 8]} color="#D9A97C" />
      <Wall position={[-5, 1.6, 10.5]} size={[12, 3.2]} color="#FFEFD8" />

      <NeonSign position={[-5, 2.4, 10.4]} text="NGOPI DULU" color="#00E5FF" />

      {/* Bar counter */}
      <mesh position={[-5, 0.55, 8]} castShadow>
        <boxGeometry args={[7, 1.1, 0.8]} />
        <meshStandardMaterial color="#6B4629" roughness={0.6} />
      </mesh>
      <mesh position={[-5, 1.12, 8]} castShadow>
        <boxGeometry args={[7.2, 0.08, 0.9]} />
        <meshStandardMaterial color="#3E2A20" roughness={0.5} />
      </mesh>

      {/* Mesin kopi */}
      <group position={[-7.5, 1.15, 8]}>
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.6, 0.5]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.35, 0.15]}>
          <cylinderGeometry args={[0.08, 0.08, 0.18, 10]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>

      {/* Toples beans */}
      {[-4.5, -3.5, -2.5].map((x, i) => (
        <group key={i} position={[x, 1.35, 7.9]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.16, 0.34, 12]} />
            <meshPhysicalMaterial
              transmission={0.9}
              roughness={0.1}
              thickness={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.2, 12]} />
            <meshStandardMaterial color={['#5A3A22', '#7A4A28', '#3E2A1A'][i]} roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Bean bags */}
      {[-9, -1].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 5]} castShadow>
          <sphereGeometry args={[0.45, 16, 16]} />
          <meshStandardMaterial color={i === 0 ? '#B5651D' : '#8B4513'} roughness={0.95} />
        </mesh>
      ))}

      <Carpet position={[-5, 0.03, 4.5]} size={[8, 4]} color="#C79A6B" />

      {isLunch && (
        <group position={[-5, 0, 7.4]}>
          {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((dx, i) => (
            <group key={i} position={[dx, 1.2, 0.55]}>
              <mesh castShadow>
                <boxGeometry args={[0.5, 0.28, 0.35]} />
                <meshStandardMaterial color={['#F2E3C6', '#E8C39E', '#F2CBA0'][i % 3]} />
              </mesh>
              <Steam position={[0, 0.35, 0]} />
            </group>
          ))}
        </group>
      )}

      <pointLight position={[-5, 2.6, 8]} intensity={8} distance={9} color="#FFD9A0" />
    </group>
  )
})

function Steam({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 0.05 - 0.05, i * 0.12, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.35 - i * 0.08} />
        </mesh>
      ))}
    </group>
  )
}

export { Text }
