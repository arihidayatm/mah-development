import { useState } from 'react'
import { useOrchestrator } from '../../store/useOrchestrator'
import { usePrayerTime } from '../../store/usePrayerTime'
import { statusColor } from '../../lib/utils'

const NEAREST_SOFA = ['santai-sofa-1', 'santai-sofa-2', 'santai-sofa-3', 'santai-sofa-4']

export function DetailPanel() {
  const team = useOrchestrator((s) => s.team)
  const selectedId = useOrchestrator((s) => s.selectedId)
  const setSelected = useOrchestrator((s) => s.setSelected)
  const setActivity = useOrchestrator((s) => s.setActivity)
  const globalMode = usePrayerTime((s) => s.globalMode)
  const testAdzan = usePrayerTime((s) => s.testAdzan)
  const testLunch = usePrayerTime((s) => s.testLunch)
  const speed = usePrayerTime((s) => s.speed)
  const setSpeed = usePrayerTime((s) => s.setSpeed)
  const [discussTarget, setDiscussTarget] = useState<string | null>(null)

  const member = team.find((m) => m.id === selectedId)
  if (!member) return null

  const locked = globalMode !== 'normal'
  const others = team.filter((m) => m.id !== member.id)

  const sendCoffee = () => {
    const idx = Math.floor(Math.random() * 6) + 1
    setActivity(member.id, 'to_coffee', `coffee-bar-${idx}`)
  }

  const startDiscuss = () => {
    if (!discussTarget) return
    const sofa = NEAREST_SOFA[0]
    const sofa2 = NEAREST_SOFA[1]
    setActivity(member.id, 'discussing', sofa)
    setActivity(discussTarget, 'discussing', sofa2)
    setDiscussTarget(null)
  }

  return (
    <div className="pointer-events-auto absolute inset-x-2 bottom-2 z-20 max-h-[55%] overflow-y-auto rounded-xl panel p-3 md:inset-x-auto md:right-2 md:top-24 md:w-72"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-black text-white">{member.name}</div>
          <div className="text-xs text-white/60">{member.role}</div>
        </div>
        <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white">
          ✕
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs">
        <span
          className="rounded-full px-2 py-0.5 font-semibold text-black"
          style={{ background: statusColor(member.status) }}
        >
          {member.status}
        </span>
        {member.jiraKey && (
          <span className="rounded bg-sky-900/70 px-2 py-0.5 font-mono text-sky-300">
            {member.jiraKey}
          </span>
        )}
      </div>

      <div className="mt-2 text-xs text-white/80">{member.currentTask}</div>

      <div className="mt-2">
        <Label>Progress {member.progress}%</Label>
        <Bar value={member.progress} color="#F59E0B" />
      </div>
      <div className="mt-2">
        <Label>Energy {member.energy}%</Label>
        <Bar value={member.energy} color={member.energy < 30 ? '#EF4444' : '#4ADE80'} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          onClick={sendCoffee}
          disabled={locked}
          className="rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Suruh Ngopi
        </button>
        <button
          onClick={() => setDiscussTarget(discussTarget ? null : others[0]?.id ?? null)}
          disabled={locked}
          className="rounded-lg bg-pink-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Ajak Diskusi
        </button>
      </div>

      {discussTarget && (
        <div className="mt-2 flex gap-1.5">
          <select
            value={discussTarget}
            onChange={(e) => setDiscussTarget(e.target.value)}
            className="flex-1 rounded-lg bg-white/10 px-2 py-1 text-xs text-white"
          >
            {others.map((o) => (
              <option key={o.id} value={o.id} className="text-black">
                {o.name}
              </option>
            ))}
          </select>
          <button
            onClick={startDiscuss}
            className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
          >
            Mulai
          </button>
        </div>
      )}

      <div className="mt-3 border-t border-white/10 pt-2">
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-white/40">
          Simulasi
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={testAdzan}
            className="rounded-lg bg-emerald-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
          >
            Tes Adzan
          </button>
          <button
            onClick={testLunch}
            className="rounded-lg bg-orange-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-600"
          >
            Simulasi 12.00
          </button>
          <button
            onClick={() => setSpeed(speed === 1 ? 60 : 1)}
            className="rounded-lg bg-indigo-700 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600"
          >
            Speed {speed}x
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1 text-[10px] font-semibold text-white/50">{children}</div>
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }}
      />
    </div>
  )
}
