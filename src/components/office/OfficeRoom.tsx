import { memo } from 'react'
import { Carpet, Chair, HangingLamp, OfficeDesk, Plant, Sofa, Wall, Window, WoodFloor } from './Furniture'
import { NeonSign } from './Furniture'
import { DeskCluster } from './DeskCluster'

export const OfficeRoom = memo(function OfficeRoom() {
  return (
    <group>
      <WoodFloor position={[0, 0, 2]} size={[26, 20]} />
      <Wall position={[0, 3, -8]} size={[26, 6]} />
      <Wall position={[-13, 3, 2]} size={[20, 6]} rotation={[0, Math.PI / 2, 0]} />
      <Carpet position={[5, 0.01, 7.5]} size={[6, 5]} color="#C9A2A2" />
      <Carpet position={[0, 0.01, -3]} size={[20, 3]} color="#D9B79A" />

      <Window position={[-3, 2.2, -7.9]} />
      <Window position={[3, 2.2, -7.9]} />

      <NeonSign position={[0, 3.4, -7.8]} text="MAH Development" />

      <HangingLamp position={[-6, 3.2, -3]} />
      <HangingLamp position={[0, 3.2, -3]} />
      <HangingLamp position={[6, 3.2, -3]} />
      <HangingLamp position={[5, 3.2, 7]} color="#FFE3B8" />

      <DeskCluster />

      <Plant position={[-11.5, 0, -6]} />
      <Plant position={[11, 0, 0]} />
      <Plant position={[-10.5, 0, 10]} />

      <Sofa position={[5, 0, 6.4]} />
      <Sofa position={[5, 0, 8.6]} rotation={[0, Math.PI, 0]} />
      <Chair position={[1.5, 0, 11]} />
      <Chair position={[-1, 0, 11]} />
      <Chair position={[4, 0, 11]} />
    </group>
  )
})

export { OfficeDesk }
