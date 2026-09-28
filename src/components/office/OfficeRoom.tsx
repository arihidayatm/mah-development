import { memo } from 'react'
import { Text } from '@react-three/drei'
import {
  Chair,
  COLORS,
  Desk,
  Floor,
  HangingLamp,
  Plant,
  Rug,
  Sofa,
  Wall,
  WindowPane,
} from './Furniture'
import {
  KanbanBoard,
  LockScreen,
  Monitor,
  ServerRack,
  useCanvasTextures,
} from '../chibi/Devices'

/** Zona kantor utama: baris meja A1..A6, koridor, area santai. */
export const OfficeRoom = memo(function OfficeRoom() {
  const { vs, term } = useCanvasTextures()

  return (
    <group>
      <Floor position={[0, 0, 2]} size={[30, 22]} />
      <Wall position={[1, 3, -8]} size={[28, 6]} />
      <Wall position={[-14, 3, 2]} size={[22, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Wall position={[16, 3, 2]} size={[22, 6]} rotation={[0, -Math.PI / 2, 0]} />

      <WindowPane position={[-4, 2.3, -7.9]} />
      <WindowPane position={[4, 2.3, -7.9]} />

      {/* Neon sign kantor */}
      <group position={[0, 3.5, -7.8]}>
        <Text fontSize={0.6} color="#FF4FA3" anchorX="center" anchorY="middle" outlineWidth={0.015} outlineColor="#3a0f28">
          MAH Development
        </Text>
        <pointLight position={[0, -0.5, 0.6]} intensity={4} distance={6} color="#FF4FA3" />
      </group>

      <HangingLamp position={[-6, 3.2, -3]} />
      <HangingLamp position={[0, 3.2, -3]} />
      <HangingLamp position={[6, 3.2, -3]} />
      <HangingLamp position={[5, 3.2, 7]} color="#FFE3B8" intensity={6} />

      {/* ===== Baris meja ===== */}
      {/* Ari - desk-vip (10,-3) */}
      <Desk position={[10, 0, -3]} w={1.8} d={0.9} />
      <KanbanBoard position={[10, 1.05, -3.15]} />
      <Chair position={[10, 0, -1.7]} rotation={[0, Math.PI, 0]} />

      {/* Bima - dual monitor beda (desk-A2 -3,-3) */}
      <Desk position={[-3, 0, -3]} w={1.7} />
      <Monitor position={[-3.4, 0.98, -3.2]} size={[0.66, 0.5]} map={vs} />
      <Monitor position={[-2.6, 0.98, -3.2]} size={[0.66, 0.5]} map={term} />
      <Chair position={[-3, 0, -1.7]} rotation={[0, Math.PI, 0]} />

      {/* Sasa - Figma (0,-3) */}
      <Desk position={[0, 0, -3]} />
      <group position={[0, 0.98, -3.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.55, 0.04]} />
          <meshStandardMaterial color="#F24E1E" emissive="#F24E1E" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0, -0.34, -0.05]}>
          <cylinderGeometry args={[0.05, 0.06, 0.2, 10]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>
      <Chair position={[0, 0, -1.7]} rotation={[0, Math.PI, 0]} />

      {/* Ucup (3,-3) */}
      <Desk position={[3, 0, -3]} />
      <Monitor position={[3, 0.98, -3.2]} color="#1a1a1a" emissive="#E4B85B" emissiveIntensity={0.4} />
      <Chair position={[3, 0, -1.7]} rotation={[0, Math.PI, 0]} />

      {/* Hendri - server (6,-3) */}
      <Desk position={[6, 0, -3]} />
      <Monitor position={[6, 0.98, -3.2]} color="#0b1220" emissive="#22c55e" emissiveIntensity={0.5} />
      <ServerRack position={[7.4, 0, -3.4]} />
      <Chair position={[6, 0, -1.7]} rotation={[0, Math.PI, 0]} />

      {/* Nanda - security (-9,-3) */}
      <Desk position={[-9, 0, -3]} />
      <LockScreen position={[-9, 0.98, -3.2]} />
      <Chair position={[-9, 0, -1.7]} rotation={[0, Math.PI, 0]} />

      {/* ===== Area santai ===== */}
      <Rug position={[5.5, 0.015, 7.5]} size={[6.5, 5]} color="#C9A2A2" />
      <Sofa position={[5.5, 0, 6.2]} />
      <Sofa position={[5.5, 0, 8.8]} rotation={[0, Math.PI, 0]} />
      <Chair position={[2, 0, 11]} />
      <Chair position={[4, 0, 11]} />
      <Chair position={[6, 0, 11]} />

      <Plant position={[-12.5, 0, -6]} />
      <Plant position={[13.5, 0, 1]} />
      <Plant position={[-10.5, 0, 11]} />
      <Plant position={[12, 0, 10]} />
    </group>
  )
})

export { COLORS }
