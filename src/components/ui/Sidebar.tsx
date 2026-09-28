import { useOrchestrator } from '../../store/useOrchestrator'
import { statusColor } from '../../lib/utils'

export function Sidebar() {
  const team = useOrchestrator((s) => s.team)
  const selectedId = useOrchestrator((s) => s.selectedId)
  const setSelected = useOrchestrator((s) => s.setSelected)

  return (
    <aside className="pointer-events-auto absolute left-2 top-24 z-10 hidden w-52 flex-col gap-1 rounded-xl panel p-2 md:flex">
      <div className="px-1 pb-1 text-xs font-bold uppercase tracking-wide text-white/50">
        Tim ({team.length})
      </div>
      {team.map((m) => (
        <button
          key={m.id}
          onClick={() => setSelected(m.id === selectedId ? null : m.id)}
          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition ${
            selectedId === m.id ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: statusColor(m.status) }}
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-white">{m.name}</span>
            <span className="block truncate text-[10px] text-white/50">{m.role}</span>
          </span>
          <span className="text-[10px] font-bold text-white/70">{m.energy}</span>
        </button>
      ))}
    </aside>
  )
}
