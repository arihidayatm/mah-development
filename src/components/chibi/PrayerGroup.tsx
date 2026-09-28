import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PrayPhase, TeamMember } from '../../lib/types'
import { zonePos } from '../../lib/pathfinding'
import { useOrchestrator } from '../../store/useOrchestrator'
import { ChibiBase } from './ChibiBase'

const PHASES: { phase: PrayPhase; dur: number }[] = [
  { phase: 'qiyam', dur: 5 },
  { phase: 'ruku', dur: 4 },
  { phase: 'sujud', dur: 6 },
  { phase: 'julus', dur: 4 },
]

const ROUND = PHASES.reduce((a, b) => a + b.dur, 0)
const TOTAL = ROUND * 2 // 2 rakaat ~38 dtk

const SAJADAH_ORDER = ['sajadah-1', 'sajadah-2', 'sajadah-3', 'sajadah-4', 'sajadah-5', 'sajadah-6']

interface PrayerGroupProps {
  members: TeamMember[]
  imamId: string
  onComplete?: () => void
}

export function PrayerGroup({ members, imamId, onComplete }: PrayerGroupProps) {
  const [elapsed, setElapsed] = useState(0)
  const done = useRef(false)
  const setActivity = useOrchestrator((s) => s.setActivity)

  useEffect(() => {
    done.current = false
    setElapsed(0)
  }, [members.length])

  useFrame((_, delta) => {
    if (done.current) return
    setElapsed((e) => {
      const next = e + delta
      if (next >= TOTAL) {
        done.current = true
        for (const m of members) setActivity(m.id, 'working', m.deskZone)
        onComplete?.()
        return TOTAL
      }
      return next
    })
  })

  const cycle = elapsed % ROUND
  let acc = 0
  let phase: PrayPhase = 'qiyam'
  for (const p of PHASES) {
    if (cycle < acc + p.dur) {
      phase = p.phase
      break
    }
    acc += p.dur
  }

  return (
    <group>
      {members.map((m, i) => {
        const isImam = m.id === imamId
        // Vina selalu partisi belakang; imam selalu sajadah-1
        let zone = SAJADAH_ORDER[i % SAJADAH_ORDER.length]
        if (isImam) zone = 'sajadah-1'
        else if (m.appearance.hairStyle === 'hijab') zone = 'sajadah-6'
        const pos = zonePos(zone)
        const angle = isImam ? 0 : 0
        return (
          <group key={m.id} position={pos} rotation={[0, angle, 0]}>
            <ChibiBase
              colors={m.colors}
              hairStyle={m.appearance.hairStyle}
              accessory="none"
              pose="pray"
              prayPhase={phase}
              mood="normal"
              pakaiPeci={m.appearance.hairStyle !== 'hijab'}
              mukena={m.appearance.hairStyle === 'hijab'}
              hijabColor={m.appearance.hijabColor}
              blink={false}
            />
          </group>
        )
      })}
    </group>
  )
}
