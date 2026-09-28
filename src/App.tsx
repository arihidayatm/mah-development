import { useCallback, useEffect, useRef } from 'react'
import { Scene } from './components/Scene'
import { Header } from './components/ui/Header'
import { Sidebar } from './components/ui/Sidebar'
import { DetailPanel } from './components/ui/DetailPanel'
import { ModeBanner } from './components/ui/ModeBanner'
import { useOrchestrator } from './store/useOrchestrator'
import { usePrayerTime } from './store/usePrayerTime'
import { fetchJiraIssues, mapJiraToEnergy } from './lib/jiraAdapter'
import type { GlobalMode } from './lib/types'

const JIRA_POLL_MS = 5 * 60_000
const SNAP_MS = 5000

const COFFEE_SLOTS = 6

export default function App() {
  const setTeam = useOrchestrator((s) => s.setTeam)
  const setJiraStatus = useOrchestrator((s) => s.setJiraStatus)
  const setActivity = useOrchestrator((s) => s.setActivity)
  const resetEveryone = useOrchestrator((s) => s.resetEveryone)

  const globalMode = usePrayerTime((s) => s.globalMode)
  const prevMode = useRef<GlobalMode>('normal')

  const refreshJira = useCallback(async () => {
    setJiraStatus(true)
    try {
      const issues = await fetchJiraIssues()
      const { team, globalMode: mode } = { ...useOrchestrator.getState(), globalMode }
      const forceNormal = mode !== 'normal'
      setTeam(mapJiraToEnergy(team, issues, { forceNormal }))
      setJiraStatus(false, null)
    } catch (e) {
      setJiraStatus(false, e instanceof Error ? e.message : 'Jira error')
    }
  }, [setJiraStatus, setTeam, globalMode])

  // Poll Jira tiap 5 menit + sekali di awal
  useEffect(() => {
    void refreshJira()
    const id = setInterval(() => void refreshJira(), JIRA_POLL_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Jam simulasi + energy tick
  useEffect(() => {
    let last = performance.now()
    const id = setInterval(() => {
      const now = performance.now()
      const dt = (now - last) / 1000
      last = now
      usePrayerTime.getState().tick(dt)
      useOrchestrator.getState().tickEnergy(dt)
    }, SNAP_MS)
    return () => clearInterval(id)
  }, [])

  // Ambil timings Aladhan (cache localStorage per hari, fallback file)
  useEffect(() => {
    void usePrayerTime.getState().fetchTimings()
  }, [])

  // Transisi globalMode -> pindahkan tim
  useEffect(() => {
    if (globalMode === prevMode.current) return
    const prev = prevMode.current
    prevMode.current = globalMode

    const state = useOrchestrator.getState()
    const muslims = state.team.filter((m) => m.religion === 'islam')

    if (globalMode === 'pray' || globalMode === 'pray-mini') {
      // Muslim dipindah & dirender PrayerGroup; non-muslim menunggu sopan di VIP
      const nonMuslim = state.team.filter((m) => m.religion === 'non-muslim')
      for (const m of nonMuslim) setActivity(m.id, 'meeting', 'vip-wait')
      for (const m of muslims) setActivity(m.id, 'praying', 'sajadah-1')
    } else if (globalMode === 'lunch') {
      state.team.forEach((m, i) => {
        const zone = m.religion === 'non-muslim' ? 'vip-wait' : 'lunch-bar-' + ((i % COFFEE_SLOTS) + 1)
        setActivity(m.id, m.religion === 'non-muslim' ? 'meeting' : 'eating', zone)
      })
    } else if (globalMode === 'normal' && (prev === 'pray' || prev === 'pray-mini')) {
      // Balik ke desk, sebagian ngopi
      const state2 = useOrchestrator.getState()
      state2.team.forEach((m) => {
        if (m.religion === 'non-muslim') {
          setActivity(m.id, 'meeting', m.deskZone)
        } else {
          setActivity(m.id, 'working', m.deskZone)
        }
      })
      void refreshJira()
    } else if (globalMode === 'normal' && prev === 'lunch') {
      // 13:00 reset energy 100 balik desk
      resetEveryone('full')
      void refreshJira()
    }
  }, [globalMode, setActivity, resetEveryone, refreshJira])

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Scene />
      <Header onRefreshJira={() => void refreshJira()} />
      <ModeBanner />
      <Sidebar />
      <DetailPanel onRefreshJira={() => void refreshJira()} />

      {/* strip tim versi mobile */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 p-2 md:hidden">
        {null}
      </div>
    </div>
  )
}
