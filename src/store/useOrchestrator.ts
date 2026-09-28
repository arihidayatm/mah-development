import { create } from 'zustand'
import teamData from '../data/team.json'
import zonesData from '../data/zones.json'
import type { CameraPreset, CharacterStatus, TeamMember, ZoneMap } from '../lib/types'
import { clamp } from '../lib/utils'

export const ZONES = zonesData as unknown as ZoneMap

interface OrchestratorState {
  team: TeamMember[]
  selectedId: string | null
  cameraPreset: CameraPreset
  sleepySince: Record<string, number>
  lastTick: number
  jiraLoading: boolean
  jiraError: string | null

  setSelected: (id: string | null) => void
  setPreset: (p: CameraPreset) => void
  setJiraLoading: (v: boolean, error?: string | null) => void
  fetchTeam: () => void
  setTeam: (team: TeamMember[]) => void
  setActivity: (id: string, status: CharacterStatus, targetZone?: string) => void
  moveCharacter: (id: string, targetZone: string) => void
  tickEnergy: () => void
  resetAfterLunch: () => void
}

function cloneTeam(): TeamMember[] {
  return (teamData as TeamMember[]).map((m) => ({ ...m }))
}

export const useOrchestrator = create<OrchestratorState>((set, get) => ({
  team: cloneTeam(),
  selectedId: null,
  cameraPreset: 'office',
  sleepySince: {},
  lastTick: Date.now(),
  jiraLoading: false,
  jiraError: null,

  setSelected: (id) => set({ selectedId: id }),
  setPreset: (p) => set({ cameraPreset: p }),
  setJiraLoading: (v, error = null) => set({ jiraLoading: v, jiraError: error }),

  fetchTeam: () => set({ team: cloneTeam() }),
  setTeam: (team) => set({ team: team.map((m) => ({ ...m })) }),

  setActivity: (id, status, targetZone) =>
    set((s) => ({
      team: s.team.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              targetZone: targetZone ?? m.targetZone,
              location:
                targetZone && (status === 'to_coffee' || status === 'discussing')
                  ? m.location
                  : (targetZone ?? m.location),
            }
          : m,
      ),
      sleepySince:
        status === 'sleepy' ? { ...s.sleepySince, [id]: Date.now() } : s.sleepySince,
    })),

  moveCharacter: (id, targetZone) =>
    set((s) => ({
      team: s.team.map((m) => (m.id === id ? { ...m, targetZone } : m)),
    })),

  tickEnergy: () => {
    const now = Date.now()
    const { team, sleepySince } = get()
    const nextSleepy = { ...sleepySince }
    const nextTeam = team.map((m) => {
      let status = m.status
      let energy = m.energy
      let targetZone = m.targetZone

      if (status === 'working') {
        energy = clamp(energy - 1)
      }

      if (status === 'working' && energy < 30) {
        status = 'sleepy'
        nextSleepy[m.id] = now
      }

      if (status === 'sleepy') {
        if (!nextSleepy[m.id]) nextSleepy[m.id] = now
        const slept = now - nextSleepy[m.id]
        if (slept >= 3000) {
          status = 'to_coffee'
          const slot = (m.id === 'bima' ? 1 : 2) + (Object.keys(nextSleepy).length % 4)
          targetZone = `coffee-bar-${Math.min(slot, 6)}`
          delete nextSleepy[m.id]
        }
      }

      if (status !== 'sleepy' && nextSleepy[m.id]) {
        delete nextSleepy[m.id]
      }

      return { ...m, status, energy, targetZone }
    })
    set({ team: nextTeam, sleepySince: nextSleepy, lastTick: now })
  },

  resetAfterLunch: () =>
    set((s) => ({
      team: s.team.map((m) => ({
        ...m,
        energy: 100,
        status: m.id === 'budi' ? m.status : 'working',
        targetZone: m.id === 'budi' ? m.targetZone : m.deskZone,
      })),
    })),
}))
