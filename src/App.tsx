import { useCallback, useEffect, useRef } from 'react'
import { Scene } from './components/Scene'
import { Header } from './components/ui/Header'
import { Sidebar } from './components/ui/Sidebar'
import { DetailPanel } from './components/ui/DetailPanel'
import { useOrchestrator } from './store/useOrchestrator'
import { usePrayerTime } from './store/usePrayerTime'
import { fetchJiraIssues, mapJiraToEnergy } from './lib/jiraAdapter'
import type { GlobalMode } from './lib/types'

const LUNCH_SLOTS = [
  'lunch-bar-1',
  'lunch-bar-2',
  'lunch-bar-3',
  'lunch-bar-4',
  'lunch-bar-5',
  'lunch-bar-6',
]

const SAJADAH_ORDER = ['sajadah-1', 'sajadah-2', 'sajadah-3', 'sajadah-4', 'sajadah-5', 'sajadah-6']
const COFFEE_SLOTS = [
  'coffee-bar-1',
  'coffee-bar-2',
  'coffee-bar-3',
  'coffee-bar-4',
  'coffee-bar-5',
  'coffee-bar-6',
]

export default function App() {
  const tickEnergy = useOrchestrator((s) => s.tickEnergy)
  const resetAfterLunch = useOrchestrator((s) => s.resetAfterLunch)
  const setTeam = useOrchestrator((s) => s.setTeam)
  const setJiraLoading = useOrchestrator((s) => s.setJiraLoading)
  const setActivity = useOrchestrator((s) => s.setActivity)

  const globalMode = usePrayerTime((s) => s.globalMode)
  const tickPrayer = usePrayerTime((s) => s.tick)
  const fetchTimings = usePrayerTime((s) => s.fetchTimings)
  const simTime = usePrayerTime((s) => s.simTime)

  const prevMode = useRef<GlobalMode>('normal')
  const lunchResetDone = useRef(false)

  const refreshJira = useCallback(async () => {
    setJiraLoading(true)
    try {
      const issues = await fetchJiraIssues()
      const { team, } = useOrchestrator.getState()
      const next = mapJiraToEnergy(team, issues, { forceNormal: false })
      setTeam(next)
      setJiraLoading(false, null)
    } catch (e) {
      setJiraLoading(false, e instanceof Error ? e.message : 'Jira error')
    }
  }, [setJiraLoading, setTeam])

  // Poll Jira tiap 5 menit
  useEffect(() => {
    void refreshJira()
    const id = setInterval(() => void refreshJira(), 5 * 60_000)
    return () => clearInterval(id)
  }, [refreshJira])

  // Energy tick tiap 5 detik
  useEffect(() => {
    const id = setInterval(() => tickEnergy(), 5000)
    return () => clearInterval(id)
  }, [tickEnergy])

  // Prayer clock
  useEffect(() => {
    void fetchTimings()
    const id = setInterval(() => tickPrayer(), 10_000)
    return () => clearInterval(id)
  }, [fetchTimings, tickPrayer])

  // React ke perubahan globalMode: ubah lokasi/aktivitas tim
  useEffect(() => {
    if (globalMode === prevMode.current) return
    const prev = prevMode.current
    prevMode.current = globalMode
    const { team } = useOrchestrator.getState()
    const muslims = team.filter((m) => m.religion === 'islam')
    const nonMuslims = team.filter((m) => m.religion === 'non-muslim')

    if (globalMode === 'pray' || globalMode === 'pray-mini') {
      lunchResetDone.current = false
      muslims.forEach((m, i) => {
        setActivity(m.id, 'praying', SAJADAH_ORDER[i % SAJADAH_ORDER.length])
      })
      nonMuslims.forEach((m) => setActivity(m.id, 'meeting', 'vip-wait'))
    } else if (globalMode === 'lunch') {
      team.forEach((m, i) => {
        setActivity(m.id, 'eating', LUNCH_SLOTS[i % LUNCH_SLOTS.length])
      })
    } else if (globalMode === 'normal' && prev === 'lunch') {
      if (!lunchResetDone.current) {
        lunchResetDone.current = true
        resetAfterLunch()
      }
    } else if (globalMode === 'normal' && (prev === 'pray' || prev === 'pray-mini')) {
      muslims.forEach((m) => setActivity(m.id, 'working', m.deskZone))
      nonMuslims.forEach((m) => setActivity(m.id, 'meeting', m.deskZone))
      void refreshJira()
    }
    if (globalMode === 'normal') {
      void COFFEE_SLOTS
    }
  }, [globalMode, setActivity, resetAfterLunch, refreshJira])

  // Auto 13:00 reset
  useEffect(() => {
    const h = Number(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        hour12: false,
      }).format(simTime),
    )
    void h
  }, [simTime])

  return (
    <div className="relative h-full w-full">
      <Scene />
      <Header onRefreshJira={() => void refreshJira()} />
      <Sidebar />
      <DetailPanel />
    </div>
  )
}
