import { create } from 'zustand'
import teamData from '../data/team.json'
import type { CameraPreset, CharacterStatus, TeamMember } from '../lib/types'
import { clamp } from '../lib/utils'

interface OrchestratorState {
  team: TeamMember[]
  selectedId: string | null
  cameraPreset: CameraPreset
  discussPair: [string, string] | null
  jiraLoading: boolean
  jiraError: string | null
  lastJiraSync: number | null

  setSelected: (id: string | null) => void
  setPreset: (p: CameraPreset) => void
  setJiraStatus: (loading: boolean, error?: string | null) => void
  fetchTeam: () => void
  setTeam: (team: TeamMember[]) => void
  setActivity: (id: string, status: CharacterStatus, targetZone?: string) => void
  moveCharacter: (id: string, targetZone: string) => void
  arrive: (id: string, zone: string) => void
  tickEnergy: (dtSeconds: number) => void
  resetEveryone: (mode: 'desk' | 'full') => void
  startDiscussion: (a: string, b: string) => void
  clearDiscussion: () => void
}

const cloneTeam = () => (teamData as TeamMember[]).map((m) => ({ ...m }))

export const useOrchestrator = create<OrchestratorState>((set, get) => ({
  team: cloneTeam(),
  selectedId: null,
  cameraPreset: 'office',
  discussPair: null,
  jiraLoading: false,
  jiraError: null,
  lastJiraSync: null,

  setSelected: (id) => set({ selectedId: id }),
  setPreset: (p) => set({ cameraPreset: p }),
  setJiraStatus: (loading, error = null) => set({ jiraLoading: loading, jiraError: error }),

  fetchTeam: () => set({ team: cloneTeam() }),
  setTeam: (team) =>
    set({ team: team.map((m) => ({ ...m })), lastJiraSync: Date.now() }),

  setActivity: (id, status, targetZone) =>
    set((s) => ({
      team: s.team.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              targetZone: targetZone ?? m.targetZone,
              ...(targetZone && targetZone !== m.location ? {} : { location: targetZone ?? m.location }),
            }
          : m,
      ),
    })),

  moveCharacter: (id, targetZone) =>
    set((s) => ({ team: s.team.map((m) => (m.id === id ? { ...m, targetZone } : m)) })),

  arrive: (id, zone) =>
    set((s) => ({
      team: s.team.map((m) => (m.id === id ? { ...m, location: zone, targetZone: zone } : m)),
    })),

  /**
   * Working nguras energy. Dipanggil pakai dt detik supaya speed 60x tetap
   * konsisten. Melewati batas: working -> sleepy -> to_coffee (Bima prioritas).
   */
  tickEnergy: (dtSeconds) =>
    set((s) => {
      const drain = dtSeconds / 5 // -1 tiap 5 detik
      return {
        team: s.team.map((m) => {
          if (m.religion !== 'islam' || m.status !== 'working') return m
          const energy = clamp(m.energy - drain)
          if (energy <= 0.001 && m.status === 'working') return { ...m, energy, status: 'sleepy' }
          if (energy < 30 && m.status === 'working') return { ...m, energy, status: 'sleepy' }
          return { ...m, energy }
        }),
      }
    }),

  resetEveryone: (mode) =>
    set((s) => ({
      team: s.team.map((m) =>
        m.id === 'budi'
          ? m
          : {
              ...m,
              energy: mode === 'full' ? 100 : m.energy,
              status: 'working',
              targetZone: m.deskZone,
              location: mode === 'full' ? m.deskZone : m.location,
            },
      ),
    })),

  startDiscussion: (a, b) =>
    set((s) => ({
      discussPair: [a, b],
      team: s.team.map((m) => {
        if (m.id === a) return { ...m, status: 'discussing', targetZone: 'santai-sofa-1' }
        if (m.id === b) return { ...m, status: 'discussing', targetZone: 'santai-sofa-2' }
        return m
      }),
    })),

  clearDiscussion: () => set({ discussPair: null }),
}))

export function getSelected(): TeamMember | undefined {
  const { team, selectedId } = useOrchestrator.getState()
  return team.find((m) => m.id === selectedId)
}

void getSelected
