import type { TeamMember } from './types'

export const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v))

export const STATUS_COLORS: Record<string, string> = {
  working: '#4ADE80',
  sleepy: '#A78BFA',
  to_coffee: '#F59E0B',
  drinking: '#FB923C',
  chilling: '#38BDF8',
  discussing: '#F472B6',
  meeting: '#60A5FA',
  blocked: '#EF4444',
  done: '#34D399',
  praying: '#86EFAC',
  eating: '#FBBF24',
}

export const statusColor = (s: string) => STATUS_COLORS[s] ?? '#94A3B8'

const TZ = 'Asia/Jakarta'

export function nowWIB(date: Date = new Date()): { h: number; m: number; s: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return { h: get('hour'), m: get('minute'), s: get('second') }
}

export function dayKeyWIB(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export const minutesOfDay = (h: number, m: number) => h * 60 + m

export function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

export function formatWIB(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export const isMuslim = (m: TeamMember) => m.religion === 'islam'

export function formatBlocked(hours: number): string {
  return `${hours.toFixed(1)}j`
}
