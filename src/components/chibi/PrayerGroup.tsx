import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import type { PrayPhase, TeamMember } from '../../lib/types'
import { ZONES } from '../../store/useOrchestrator'
import { useOrchestrator } from '../../store/useOrchestrator'
import { ChibiBase } from './ChibiBase'

const PHASES: { phase: PrayPhase; dur: number }[] = [
  { phase: 'qiyam', dur: 5 },
  { phase: 'ruku', dur: 4 },
  { phase: 'sujud', dur: 6 },
  { phase: 'julus', dur: 4 },
]

const TOTAL = PHASES.reduce((a, b) => a + b.dur, 0) * 2

interface Props {
  members: TeamMember[]
  imamId: string
}

export function PrayerGroup({ members, imamId }: Props) {
  const [elapsed, setElapsed] = useState(0)
  const doneRef = useRef(false)
  const bumpEnergy = useOrchestrator((s) => s.setActivity)

  useFrame((_, delta) => {
    setElapsed((e) => {
      const next = e + delta
      if (next >= TOTAL && !doneRef.current) {
        doneRef.current = true
        bumpEnergy(imamId, 'done', ZONES['sajadah-1'] ? 'sajadah-1' : undefined)
      }
      return next
    })
  })

  useEffect(() => {
    doneRef.current = false
    setElapsed(0)
  }, [members.length])

  const cycle = elapsed % TOTAL
  let acc = 0
  let phase: PrayPhase = 'qiyam'
  for (const p of PHASES) {
    if (cycle >= acc && cycle < acc + p.dur * 2) {
      phase = p.phase
      break
    }
    acc += p.dur * 2
  }
  if (cycle >= TOTAL - 2) phase = 'julus'

  return (
    <group>
      {members.map((m, i) => {
        const zoneKey = `sajadah-${i + 1}`
        const pos = ZONES[zoneKey] ?? [-13 + i, 0, 9]
        const isImam = m.id === imamId
        return (
          <group key={m.id} position={isImam ? ZONES['sajadah-1'] ?? pos : pos}>
            <ChibiBase
              colors={m.colors}
              hairStyle={m.appearance.hairStyle}
              accessory={m.appearance.accessory}
              pose="pray"
              prayPhase={phase}
              mood="normal"
              pakaiPeci={m.appearance.hairStyle !== 'hijab'}
              mukena={m.appearance.hairStyle === 'hijab'}
              hijabColor={m.appearance.hijabColor}
            />
          </group>
        )
      })}
    </group>
  )
}
