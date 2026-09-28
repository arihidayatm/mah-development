import { create } from 'zustand'
import fallback from '../data/prayerFallback.json'
import type { GlobalMode } from '../lib/types'
import { minutesOfDay, nowInWIB, parseHHMM } from '../lib/utils'

interface PrayerTimings {
  Dhuhr: string
  Asr: string
  Maghrib?: string
}

interface PrayerState {
  timings: PrayerTimings
  loading: boolean
  globalMode: GlobalMode
  simTime: Date
  speed: 1 | 60
  muted: boolean
  imamId: string
  simAcak: boolean
  lastDayKey: string

  refreshMode: () => void
  fetchTimings: () => Promise<void>
  setSpeed: (s: 1 | 60) => void
  toggleMute: () => void
  tick: () => void
  testAdzan: () => void
  testLunch: () => void
}

const DAY_MS = 86_400_000

function cacheKey(d: Date): string {
  const { h } = nowInWIB(d)
  void h
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(d)
}

function filterName(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('dhuhr') || n.includes('dhuhur') || n.includes('zuhr')) return 'Dhuhr'
  if (n.includes('asr')) return 'Asr'
  if (n.includes('maghrib')) return 'Maghrib'
  return name
}

export const usePrayerTime = create<PrayerState>((set, get) => ({
  timings: {
    Dhuhr: fallback.Dhuhr,
    Asr: fallback.Asr,
    Maghrib: fallback.Maghrib,
  },
  loading: false,
  globalMode: 'normal',
  simTime: new Date(),
  speed: 1,
  muted: true,
  imamId: 'ari',
  simAcak: false,
  lastDayKey: cacheKey(new Date()),

  setSpeed: (s) => set({ speed: s }),
  toggleMute: () => set((st) => ({ muted: !st.muted })),

  testAdzan: () => {
    set({ globalMode: 'pray' })
    const { muted } = get()
    if (!muted) playAdzan()
  },

  testLunch: () => set({ globalMode: 'lunch' }),

  refreshMode: () => {
    const { simTime, timings, imamId, simAcak } = get()
    const { h, m } = nowInWIB(simTime)
    const cur = minutesOfDay(h, m)
    const asr = parseHHMM(timings.Asr)
    let mode: GlobalMode = 'normal'

    if (cur >= 12 * 60 && cur < 12 * 60 + 20) mode = 'pray'
    else if (cur >= 12 * 60 + 20 && cur < 12 * 60 + 45) mode = 'lunch'

    if (cur >= asr && cur < asr + 15) mode = 'pray-mini'

    let nextImam = imamId
    if (simAcak && Math.random() < 0.2) {
      const pool = ['bima', 'dedi', 'riko', 'ucup']
      nextImam = pool[Math.floor(Math.random() * pool.length)]
    }

    if (mode === 'pray' && get().globalMode !== 'pray') {
      const { muted } = get()
      if (!muted) playAdzan()
    }

    set({ globalMode: mode, imamId: nextImam })
  },

  fetchTimings: async () => {
    const dayKey = cacheKey(new Date())
    try {
      const cached = localStorage.getItem(`mah-prayer-${dayKey}`)
      if (cached) {
        set({ timings: JSON.parse(cached) as PrayerTimings, lastDayKey: dayKey })
        return
      }
    } catch {
      /* ignore */
    }
    set({ loading: true })
    try {
      const res = await fetch(
        'https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=20',
      )
      if (!res.ok) throw new Error(`Aladhan HTTP ${res.status}`)
      const json = (await res.json()) as { data: { timings: Record<string, string> } }
      const raw = json.data.timings
      const picked: PrayerTimings = { Dhuhr: fallback.Dhuhr, Asr: fallback.Asr, Maghrib: fallback.Maghrib }
      for (const [k, v] of Object.entries(raw)) {
        const name = filterName(k)
        if (name === 'Dhuhr' || name === 'Asr' || name === 'Maghrib') {
          picked[name] = v.slice(0, 5)
        }
      }
      set({ timings: picked, lastDayKey: dayKey, loading: false })
      try {
        localStorage.setItem(`mah-prayer-${dayKey}`, JSON.stringify(picked))
      } catch {
        /* ignore */
      }
    } catch (e) {
      console.warn('[prayer] fallback used:', e)
      set({ loading: false })
    }
  },

  tick: () => {
    const { speed, simTime } = get()
    const next = new Date(simTime.getTime() + (speed === 60 ? 10_000 : 0) * 6)
    const advanced = speed === 60 ? new Date(simTime.getTime() + 60_000) : next
    set({ simTime: advanced })
    get().refreshMode()
  },
}))

let audioEl: HTMLAudioElement | null = null

function playAdzan() {
  try {
    if (!audioEl) {
      audioEl = new Audio('/adzan-short.mp3')
      audioEl.volume = 0.6
    }
    audioEl.currentTime = 0
    void audioEl.play().catch(() => {})
  } catch {
    /* ignore */
  }
}

void DAY_MS
