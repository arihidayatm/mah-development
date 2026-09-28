import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { TeamMember } from '../../lib/types'
import { findPath } from '../../lib/pathfinding'
import { statusColor } from '../../lib/utils'
import { useOrchestrator } from '../../store/useOrchestrator'
import { ChibiBase } from './ChibiBase'

const WALK_SPEED = 1.2

interface ChibiWalkerProps {
  member: TeamMember
  onClick?: (id: string) => void
}

export function ChibiWalker({ member, onClick }: ChibiWalkerProps) {
  const group = useRef<THREE.Group>(null)
  const waypoints = useMemo(
    () => findPath(member.location, member.targetZone),
    [member.location, member.targetZone],
  )
  const [wp, setWp] = useState(0)
  const [walking, setWalking] = useState(false)
  const routeKey = `${member.location}->${member.targetZone}`
  const lastRoute = useRef('')

  useEffect(() => {
    if (lastRoute.current === routeKey) return
    lastRoute.current = routeKey
    setWp(0)
    setWalking(waypoints.length > 1)
  }, [routeKey, waypoints.length])

  useFrame((_, delta) => {
    const g = group.current
    if (!g || !walking) return
    const target = waypoints[wp]
    if (!target) return

    const dx = target[0] - g.position.x
    const dz = target[2] - g.position.z
    const dist = Math.hypot(dx, dz)
    const step = WALK_SPEED * delta

    if (dist <= step) {
      g.position.set(target[0], 0, target[2])
      if (wp < waypoints.length - 1) {
        setWp((i) => i + 1)
      } else {
        setWalking(false)
        useOrchestrator.getState().arrive(member.id, member.targetZone)
      }
      return
    }

    g.position.x += (dx / dist) * step
    g.position.z += (dz / dist) * step
    // hadap arah jalan (model menghadap +Z)
    const targetYaw = Math.atan2(dx, dz)
    let diff = targetYaw - g.rotation.y
    while (diff > Math.PI) diff -= Math.PI * 2
    while (diff < -Math.PI) diff += Math.PI * 2
    g.rotation.y += diff * Math.min(1, delta * 10)
  })

  // snap ke wp pertama saat spawn
  const startPos = waypoints[0] ?? [0, 0, 0]

  const pose = useMemo(() => {
    if (member.status === 'praying') return 'pray'
    if (walking) return 'walk'
    if (['working', 'drinking', 'chilling', 'discussing', 'meeting', 'eating', 'done', 'blocked'].includes(member.status))
      return 'sit'
    return 'stand'
  }, [member.status, walking])

  const typing = !walking && member.status === 'working'
  const mood = member.status === 'sleepy' ? 'sleepy' : member.status === 'done' ? 'happy' : 'normal'
  const capped = member.religion === 'islam' && member.appearance.hairStyle !== 'hijab'

  return (
    <group
      ref={group}
      position={startPos as [number, number, number]}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(member.id)
      }}
    >
      <ChibiBase
        colors={member.colors}
        hairStyle={member.appearance.hairStyle}
        accessory={member.appearance.accessory}
        pose={pose}
        mood={mood}
        pakaiPeci={capped && pose === 'pray'}
        mukena={member.appearance.hairStyle === 'hijab' && pose === 'pray'}
        hijabColor={member.appearance.hijabColor}
        typing={typing}
        zzz={member.status === 'sleepy'}
      />

      {/* Ring status */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.4, 0.48, 32]} />
        <meshBasicMaterial color={statusColor(member.status)} transparent opacity={0.9} side={THREE.DoubleSide} />
      </mesh>

      {member.status === 'blocked' && (
        <Html position={[0, 2.15, 0]} center distanceFactor={9} zIndexRange={[20, 0]}>
          <div className="grid h-6 w-6 place-items-center rounded-full bg-red-500 text-sm font-black text-white shadow-lg">
            !
          </div>
        </Html>
      )}

      {member.status === 'discussing' && (
        <Html position={[0, 2.05, 0]} center distanceFactor={9} zIndexRange={[20, 0]}>
          <div className="rounded-xl bg-white px-2 py-0.5 text-xs font-black text-slate-700 shadow-lg">
            ...
          </div>
        </Html>
      )}

      <Html position={[0, 2.45, 0]} center distanceFactor={13} pointerEvents="none" zIndexRange={[10, 0]}>
        <div className="whitespace-nowrap text-[11px] font-semibold text-white [text-shadow:0_1px_3px_rgba(0,0,0,.85)]">
          {member.name}
        </div>
      </Html>
    </group>
  )
}
