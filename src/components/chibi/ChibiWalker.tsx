import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { TeamMember } from '../../lib/types'
import type { Pose } from '../../lib/types'
import { useOrchestrator, ZONES } from '../../store/useOrchestrator'
import { statusColor } from '../../lib/utils'
import { ChibiBase } from './ChibiBase'

interface Props {
  member: TeamMember
  index: number
  onClick?: (id: string) => void
}

const DESKS = [
  'desk-A1',
  'desk-A2',
  'desk-A3',
  'desk-A4',
  'desk-server',
  'desk-A6',
  'desk-admin',
  'desk-vip',
]

type Vec3 = [number, number, number]

function routeTo(fromKey: string, toKey: string): Vec3[] {
  const from: Vec3 = (ZONES[fromKey] as Vec3) ?? (ZONES['corridor-2'] as Vec3)
  const to: Vec3 = (ZONES[toKey] as Vec3) ?? (ZONES['corridor-2'] as Vec3)
  if (fromKey === toKey) return [from]

  const path: Vec3[] = []
  const midZ = Math.max(from[2], to[2]) + 1
  path.push([from[0], from[1], midZ])
  path.push([to[0], to[1], midZ])
  path.push(to)
  return path
}

export function ChibiWalker({ member, index, onClick }: Props) {
  const group = useRef<THREE.Group>(null)
  const [wpIndex, setWpIndex] = useState(0)
  const [arrived, setArrived] = useState(true)
  const setActivity = useOrchestrator((s) => s.setActivity)
  const currentPath = useRef<string>('')

  const startKey = member.location
  const targetKey = member.targetZone
  const pathKey = `${startKey}->${targetKey}`

  const waypoints = useMemo(
    () => routeTo(startKey, targetKey),
    [startKey, targetKey, pathKey],
  )

  useEffect(() => {
    if (currentPath.current !== pathKey) {
      currentPath.current = pathKey
      setWpIndex(0)
      setArrived(false)
    }
  }, [pathKey])

  const pose: Pose = useMemo(() => {
    if (member.status === 'praying') return 'pray'
    if (member.status === 'discussing') return 'sit'
    if (!arrived) return 'walk'
    if (['working', 'drinking', 'blocked', 'done', 'eating'].includes(member.status)) return 'sit'
    return 'stand'
  }, [member.status, arrived])

  useFrame((_, delta) => {
    if (arrived || !group.current) return
    const target = waypoints[wpIndex]
    if (!target) return
    const p = group.current.position
    const dx = target[0] - p.x
    const dz = target[2] - p.z
    const dist = Math.hypot(dx, dz)
    const step = 1.2 * delta
    if (dist < step || dist < 0.05) {
      p.x = target[0]
      p.z = target[2]
      if (wpIndex < waypoints.length - 1) {
        setWpIndex((i) => i + 1)
      } else {
        setArrived(true)
        setActivity(member.id, member.status, targetKey)
        useOrchestrator.setState((s) => ({
          team: s.team.map((m) =>
            m.id === member.id ? { ...m, location: targetKey, targetZone: targetKey } : m,
          ),
        }))
      }
      return
    }
    p.x += (dx / dist) * step
    p.z += (dz / dist) * step
    const angle = Math.atan2(dx, dz)
    group.current.rotation.y = angle
  })

  const pose2 = useMemo(() => pose, [pose])

  const typing =
    member.status === 'working' && arrived && pose2 === 'sit' && member.religion === 'islam'

  const capOnPray = pose === 'pray' && member.religion === 'islam' && member.appearance.hairStyle !== 'hijab'

  return (
    <group
      ref={group}
      position={waypoints[0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(member.id)
      }}
    >
      <ChibiBase
        colors={member.colors}
        hairStyle={member.appearance.hairStyle}
        accessory={member.appearance.accessory}
        pose={pose2}
        mood={member.status === 'sleepy' ? 'sleepy' : member.status === 'done' ? 'happy' : 'normal'}
        pakaiPeci={capOnPray}
        mukena={pose === 'pray' && member.appearance.hairStyle === 'hijab'}
        hijabColor={member.appearance.hijabColor}
        typing={typing}
        zzz={member.status === 'sleepy'}
      />

      {/* Ring status bawah */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.38, 0.46, 32]} />
        <meshBasicMaterial
          color={statusColor(member.status)}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {member.status === 'blocked' && (
        <Html position={[0, 2.0, 0]} center distanceFactor={9}>
          <div
            style={{
              background: '#EF4444',
              color: '#fff',
              borderRadius: 999,
              width: 22,
              height: 22,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,.4)',
            }}
          >
            !
          </div>
        </Html>
      )}

      {member.status === 'discussing' && (
        <Html position={[0, 2.0, 0]} center distanceFactor={9}>
          <div
            style={{
              background: '#fff',
              color: '#333',
              borderRadius: 12,
              padding: '2px 8px',
              fontWeight: 800,
              fontSize: 13,
              boxShadow: '0 2px 8px rgba(0,0,0,.25)',
            }}
          >
            ...
          </div>
        </Html>
      )}

      <Html position={[0, 2.4, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            textShadow: '0 1px 3px rgba(0,0,0,.8)',
            whiteSpace: 'nowrap',
          }}
        >
          {member.name}
          {index >= 0 ? '' : ''}
        </div>
      </Html>
    </group>
  )
}

void DESKS
