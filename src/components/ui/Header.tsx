import type { CameraPreset } from '../../lib/types'
import { formatWIB } from '../../lib/utils'
import { useOrchestrator } from '../../store/useOrchestrator'
import { usePrayerTime } from '../../store/usePrayerTime'
import { RefreshIcon } from './Icons'

const PRESETS: { key: CameraPreset; label: string; icon: string }[] = [
  { key: 'office', label: 'Office', icon: '🏢' },
  { key: 'vip', label: 'VIP', icon: '💼' },
  { key: 'coffee', label: 'Coffee', icon: '☕' },
  { key: 'santai', label: 'Santai', icon: '🎮' },
  { key: 'mushalla', label: 'Mushalla', icon: '🕌' },
]

export function Header({ onRefreshJira }: { onRefreshJira: () => void }) {
  const preset = useOrchestrator((s) => s.cameraPreset)
  const setPreset = useOrchestrator((s) => s.setPreset)
  const jiraLoading = useOrchestrator((s) => s.jiraLoading)
  const lastJiraSync = useOrchestrator((s) => s.lastJiraSync)

  const simTime = usePrayerTime((s) => s.simTime)
  const speed = usePrayerTime((s) => s.speed)
  const setSpeed = usePrayerTime((s) => s.setSpeed)
  const muted = usePrayerTime((s) => s.muted)
  const toggleMute = usePrayerTime((s) => s.toggleMute)

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col gap-2 p-2">
      <div className="pointer-events-auto panel flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2">
        <div className="mr-1 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-pink-500 to-amber-400 text-sm font-black text-slate-900">
            M
          </span>
          <h1 className="bg-gradient-to-r from-pink-300 to-amber-200 bg-clip-text text-base font-black text-transparent sm:text-lg">
            MAH Development Live
          </h1>
        </div>

        <div className="flex flex-wrap gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-bold transition ${
                preset === p.key
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span className="mr-1">{p.icon}</span>
              <span className="hidden sm:inline">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5 text-xs">
          <div className="hidden flex-col items-end leading-none sm:flex">
            <span className="font-semibold text-white/85">{formatWIB(simTime)} WIB</span>
            <span className="text-[10px] text-white/45">
              {lastJiraSync ? `Jira sync ${new Date(lastJiraSync).toLocaleTimeString('id-ID')}` : 'Jira —'}
            </span>
          </div>
          <button
            onClick={() => setSpeed(speed === 1 ? 60 : 1)}
            title="Kecepatan simulasi"
            className="rounded-lg bg-indigo-600/80 px-2 py-1.5 font-bold text-white hover:bg-indigo-500"
          >
            {speed}x
          </button>
          <button
            onClick={toggleMute}
            title={muted ? 'Adzan MUTE (klik untuk nyalakan)' : 'Adzan ON'}
            className="rounded-lg bg-white/10 px-2 py-1.5 hover:bg-white/20"
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            onClick={onRefreshJira}
            disabled={jiraLoading}
            className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-2.5 py-1.5 font-bold text-white hover:bg-sky-500 disabled:opacity-50"
          >
            <RefreshIcon className={`h-3.5 w-3.5 ${jiraLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{jiraLoading ? 'Syncing' : 'Refresh Jira'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
