import { useOrchestrator } from '../../store/useOrchestrator'
import { usePrayerTime } from '../../store/usePrayerTime'
import { formatWIB, statusColor } from '../../lib/utils'
import type { CameraPreset } from '../../lib/types'

const PRESETS: { key: CameraPreset; label: string }[] = [
  { key: 'office', label: 'Office' },
  { key: 'vip', label: 'VIP' },
  { key: 'coffee', label: 'Coffee' },
  { key: 'santai', label: 'Santai' },
  { key: 'mushalla', label: 'Mushalla' },
]

export function Header({ onRefreshJira }: { onRefreshJira: () => void }) {
  const preset = useOrchestrator((s) => s.cameraPreset)
  const setPreset = useOrchestrator((s) => s.setPreset)
  const jiraLoading = useOrchestrator((s) => s.jiraLoading)
  const globalMode = usePrayerTime((s) => s.globalMode)
  const muted = usePrayerTime((s) => s.muted)
  const toggleMute = usePrayerTime((s) => s.toggleMute)
  const simTime = usePrayerTime((s) => s.simTime)
  const speed = usePrayerTime((s) => s.speed)

  const pause = globalMode === 'pray' || globalMode === 'pray-mini'

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20">
      {pause && (
        <div className="pointer-events-auto flex items-center justify-center gap-2 bg-emerald-700/90 px-4 py-2 text-sm font-bold text-white">
          🕌 Mode Shalat Berjamaah - Kantor Pause
        </div>
      )}
      <div className="pointer-events-auto mx-2 mt-2 flex flex-wrap items-center gap-2 rounded-xl panel px-3 py-2">
        <h1 className="mr-2 bg-gradient-to-r from-pink-400 to-amber-300 bg-clip-text text-base font-black text-transparent">
          MAH Development Live
        </h1>

        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                preset === p.key
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-white/80">
          <span className="hidden sm:inline">{formatWIB(simTime)} WIB</span>
          <span className="rounded bg-white/10 px-2 py-0.5">{speed}x</span>
          <button
            onClick={toggleMute}
            className="rounded bg-white/10 px-2 py-1 hover:bg-white/20"
            title={muted ? 'Adzan MUTE' : 'Adzan ON'}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={onRefreshJira}
            disabled={jiraLoading}
            className="rounded bg-sky-600 px-2 py-1 font-semibold text-white hover:bg-sky-500 disabled:opacity-50"
          >
            {jiraLoading ? '...' : 'Refresh Jira'}
          </button>
        </div>
      </div>
    </header>
  )
}

export { statusColor }
