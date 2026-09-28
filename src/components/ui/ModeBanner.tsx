import { usePrayerTime } from '../../store/usePrayerTime'

export function ModeBanner() {
  const globalMode = usePrayerTime((s) => s.globalMode)
  if (globalMode === 'normal') return null

  const map = {
    pray: { text: '🕌 Mode Shalat Berjamaah — Kantor Pause', cls: 'bg-emerald-700/95' },
    'pray-mini': { text: '🕌 Shalat Ashar Berjamaah — Kantor Pause', cls: 'bg-emerald-700/95' },
    lunch: { text: '🍱 Waktu Istirahat & Makan Siang', cls: 'bg-amber-700/95' },
  } as const

  const cfg = map[globalMode]
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[3.4rem] z-20 flex justify-center px-2">
      <div className={`pointer-events-auto rounded-full px-4 py-1.5 text-xs font-black text-white shadow-lg sm:text-sm ${cfg.cls}`}>
        {cfg.text}
      </div>
    </div>
  )
}
