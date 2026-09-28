import { useEffect, useState } from 'react'
import { useOrchestrator } from '../../store/useOrchestrator'
import { usePrayerTime } from '../../store/usePrayerTime'
import { statusColor } from '../../lib/utils'
import { ChatIcon, CoffeeIcon } from './Icons'

const COFFEE_SLOTS = 6

export function DetailPanel({ onRefreshJira }: { onRefreshJira: () => void }) {
  const team = useOrchestrator((s) => s.team)
  const selectedId = useOrchestrator((s) => s.selectedId)
  const setSelected = useOrchestrator((s) => s.setSelected)
  const setActivity = useOrchestrator((s) => s.setActivity)
  const startDiscussion = useOrchestrator((s) => s.startDiscussion)

  const globalMode = usePrayerTime((s) => s.globalMode)
  const testAdzan = usePrayerTime((s) => s.testAdzan)
  const testLunch = usePrayerTime((s) => s.testLunch)
  const speed = usePrayerTime((s) => s.speed)
  const setSpeed = usePrayerTime((s) => s.setSpeed)
  const resetToNormal = usePrayerTime((s) => s.resetToNormal)

  const [discussOpen, setDiscussOpen] = useState(false)
  const [target, setTarget] = useState<string>('')

  const member = team.find((m) => m.id === selectedId)
  const locked = globalMode !== 'normal'
  const others = team.filter((m) => m.id !== selectedId)

  useEffect(() => {
    setDiscussOpen(false)
    setTarget(others[0]?.id ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  if (!member) return null

  const sendCoffee = () => {
    const slot = (Math.floor(Math.random() * COFFEE_SLOTS) + 1).toString()
    setActivity(member.id, 'to_coffee', `coffee-bar-${slot}`)
  }

  const confirmDiscuss = () => {
    if (target) startDiscussion(member.id, target)
    setDiscussOpen(false)
  }

  return (
    <div className="pointer-events-auto panel absolute inset-x-2 bottom-2 z-30 max-h-[58vh] overflow-y-auto rounded-2xl p-3 md:inset-x-auto md:right-2 md:top-24 md:w-80 md:max-h-[calc(100vh-7rem)] no-scrollbar">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor(member.status) }} />
            <span className="truncate text-sm font-black text-white">{member.name}</span>
          </div>
          <div className="mt-0.5 text-xs text-white/55">{member.role}</div>
        </div>
        <button
          onClick={() => setSelected(null)}
          className="rounded-lg px-1.5 text-lg leading-none text-white/45 hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="rounded-full px-2 py-0.5 font-bold text-black" style={{ background: statusColor(member.status) }}>
          {member.status}
        </span>
        {member.jiraKey && (
          <span className="rounded bg-sky-900/60 px-2 py-0.5 font-mono text-sky-300">{member.jiraKey}</span>
        )}
        {member.status === 'blocked' && (
          <span className="rounded bg-red-600 px-2 py-0.5 font-bold text-white">BLOCKED</span>
        )}
      </div>

      <div className="mt-2 rounded-xl bg-black/20 px-2.5 py-2 text-xs leading-relaxed text-white/80">
        {member.currentTask || '—'}
      </div>

      <div className="mt-2.5 space-y-2">
        <Meter label={`Progress ${member.progress}%`} value={member.progress} color="#F59E0B" />
        <Meter
          label={`Energy ${Math.round(member.energy)}%`}
          value={member.energy}
          color={member.energy < 30 ? '#EF4444' : '#4ADE80'}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          onClick={sendCoffee}
          disabled={locked}
          title={locked ? 'Terkunci saat mode shalat/lunch' : 'Kirim ke coffee bar'}
          className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CoffeeIcon className="h-3.5 w-3.5" />
          Suruh Ngopi
        </button>
        <button
          onClick={() => setDiscussOpen((v) => !v)}
          disabled={locked}
          title={locked ? 'Terkunci saat mode shalat/lunch' : 'Ajak diskusi ke sofa'}
          className="flex items-center gap-1.5 rounded-xl bg-pink-600 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChatIcon className="h-3.5 w-3.5" />
          Ajak Diskusi
        </button>
      </div>

      {discussOpen && !locked && (
        <div className="mt-2 flex gap-1.5">
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/10 px-2 py-1.5 text-xs text-white"
          >
            {others.map((o) => (
              <option key={o.id} value={o.id} className="text-black">
                {o.name} — {o.role}
              </option>
            ))}
          </select>
          <button onClick={confirmDiscuss} className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-bold text-white">
            Mulai
          </button>
        </div>
      )}

      <div className="mt-3 border-t border-white/10 pt-2.5">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">Simulasi & Jira</div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={testAdzan}
            className="rounded-lg bg-emerald-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-600"
          >
            Tes Adzan
          </button>
          <button
            onClick={testLunch}
            className="rounded-lg bg-orange-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-orange-600"
          >
            Simulasi 12.00
          </button>
          <button
            onClick={() => setSpeed(speed === 1 ? 60 : 1)}
            className="rounded-lg bg-indigo-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-600"
          >
            Speed {speed}x
          </button>
          <button
            onClick={resetToNormal}
            className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/20"
          >
            Normal
          </button>
          <button
            onClick={onRefreshJira}
            className="rounded-lg bg-sky-700 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-sky-600"
          >
            Refresh Jira
          </button>
        </div>
      </div>
    </div>
  )
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 text-[10px] font-semibold text-white/50">{label}</div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
        />
      </div>
    </div>
  )
}
