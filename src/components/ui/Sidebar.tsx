import { useOrchestrator } from '../../store/useOrchestrator'
import { statusColor } from '../../lib/utils'

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const team = useOrchestrator((s) => s.team)
  const selectedId = useOrchestrator((s) => s.selectedId)
  const setSelected = useOrchestrator((s) => s.setSelected)

  return (
    <div
      className={
        mobile
          ? 'flex gap-2 overflow-x-auto no-scrollbar'
          : 'pointer-events-auto panel absolute left-2 top-24 z-20 hidden w-56 flex-col gap-1 rounded-2xl p-2 md:flex'
      }
    >
      {!mobile && (
        <div className="px-1 pb-1 text-[11px] font-bold uppercase tracking-wider text-white/45">
          Tim · {team.length}
        </div>
      )}
      {team.map((m) => (
        <button
          key={m.id}
          onClick={() => setSelected(m.id === selectedId ? null : m.id)}
          className={`flex shrink-0 items-center gap-2 rounded-xl px-2 py-1.5 text-left transition ${
            mobile ? 'panel' : ''
          } ${selectedId === m.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ background: statusColor(m.status) }}
          />
          <span className="min-w-0 flex-1">
            <span className="block whitespace-nowrap text-xs font-semibold text-white">{m.name}</span>
            {!mobile && <span className="block truncate text-[10px] text-white/45">{m.role}</span>}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-white/70">{Math.round(m.energy)}</span>
            {m.status === 'blocked' && (
              <span className="grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[9px] font-black text-white">
                !
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}
