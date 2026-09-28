import { create } from 'zustand'
import fallback from '../data/prayerFallback.json'
import type { GlobalMode } from '../lib/types'
import { dayKeyWIB, minutesOfDay, nowWIB, parseHHMM } from '../lib/utils'

interface PrayerTimings {
  Dhuhr: string
  Asr: string
  Maghrib?: string
}

export interface PrayerState {
  timings: PrayerTimings
  timingsSource: 'network' | 'cache' | 'fallback'
  loading: boolean
  globalMode: GlobalMode
  simTime: Date
  speed: 1 | 60
  muted: boolean
  imamId: string
  simAcak: boolean
  dayKey: string

  setSpeed: (s: 1 | 60) => void
  toggleMute: () => void
  fetchTimings: () => Promise<void>
  tick: (realDtSeconds: number) => void
  recomputeMode: () => void
  testAdzan: () => void
  testLunch: () => void
  resetToNormal: () => void
  setSimAcak: (v: boolean) => void
}

const CANDIDATE_IMAMS = ['bima', 'dedi', 'riko', 'ucup']

const pickName = (raw: Record<string, string>, target: string): string | undefined => {
  const key = Object.keys(raw).find((k) => k.toLowerCase().includes(target.toLowerCase()))
  return key ? raw[key].slice(0, 5) : undefined
}

export const usePrayerTime = create<PrayerState>((set, get) => ({
  timings: { Dhuhr: fallback.Dhuhr, Asr: fallback.Asr, Maghrib: fallback.Maghrib },
  timingsSource: 'fallback',
  loading: false,
  globalMode: 'normal',
  simTime: new Date(),
  speed: 1,
  muted: true,
  imamId: 'ari',
  simAcak: false,
  dayKey: dayKeyWIB(new Date()),

  setSpeed: (s) => set({ speed: s }),
  toggleMute: () => set((st) => ({ muted: !st.muted })),
  setSimAcak: (v) => set({ simAcak: v }),

  async fetchTimings() {
    const day = dayKeyWIB(new Date())
    const cacheKey = `mah-prayer-${day}`
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        set({ timings: JSON.parse(cached), timingsSource: 'cache', dayKey: day })
        return
      }
    } catch {
      /* localStorage tidak tersedia */
    }
    set({ loading: true })
    try {
      const res = await fetch(
        'https://api.aladhan.com/v1/timingsByCity?city=Jakarta&country=Indonesia&method=20',
      )
      if (!res.ok) throw new Error(`Aladhan HTTP ${res.status}`)
      const json = (await res.json()) as { data: { timings: Record<string, string> } }
      const raw = json.data.timings
      const picked: PrayerTimings = {
        Dhuhr: pickName(raw, 'dhuhr') ?? pickName(raw, 'zuhr') ?? fallback.Dhuhr,
        Asr: pickName(raw, 'asr') ?? fallback.Asr,
        Maghrib: pickName(raw, 'maghrib') ?? fallback.Maghrib,
      }
      set({ timings: picked, timingsSource: 'network', loading: false, dayKey: day })
      try {
        localStorage.setItem(cacheKey, JSON.stringify(picked))
      } catch {
        /* ignore */
      }
    } catch (e) {
      console.warn('[prayer] pakai fallback:', e)
      set({ loading: false, timingsSource: 'fallback' })
    }
  },

  recomputeMode() {
    const { simTime, timings, imamId, simAcak } = get()
    const { h, m } = nowWIB(simTime)
    const cur = minutesOfDay(h, m)
    const asr = parseHHMM(timings.Asr)

    let mode: GlobalMode = 'normal'
    if (cur >= 12 * 60 && cur < 12 * 60 + 20) mode = 'pray'
    else if (cur >= 12 * 60 + 20 && cur < 12 * 60 + 45) mode = 'lunch'
    else if (cur >= 12 * 60 + 45 && cur < 13 * 60) mode = 'normal' // free/chilling
    if (cur >= asr && cur < asr + 15) mode = 'pray-mini'

    let nextImam = imamId
    if (simAcak && mode === 'pray' && Math.random() < 0.2) {
      nextImam = CANDIDATE_IMAMS[Math.floor(Math.random() * CANDIDATE_IMAMS.length)]
    }

    const enteringPray = mode === 'pray' && get().globalMode !== 'pray'
    set({ globalMode: mode, imamId: nextImam })
    if (enteringPray && !get().muted) playAdzan()
  },

  tick(realDtSeconds) {
    const { speed, simTime } = get()
    const next = new Date(simTime.getTime() + realDtSeconds * 1000 * speed)
    set({ simTime: next })
    get().recomputeMode()
  },

  testAdzan() {
    set({ globalMode: 'pray' })
    if (!get().muted) playAdzan()
  },

  testLunch() {
    set({ globalMode: 'lunch' })
  },

  resetToNormal() {
    set({ globalMode: 'normal' })
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
    void audioEl.play().catch(() => {
      /* butuh gesture user; diabaikan */
    })
  } catch {
    /* ignore */
  }
}
