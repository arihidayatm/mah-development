import type { TeamMember } from '../lib/types'

export function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v))
}

export const STATUS_COLORS: Record<string, string> = {
  working: '#4ADE80',
  sleepy: '#A78BFA',
  to_coffee: '#F59E0B',
  drinking: '#F59E0B',
  chilling: '#38BDF8',
  discussing: '#F472B6',
  meeting: '#60A5FA',
  blocked: '#EF4444',
  done: '#34D399',
  praying: '#86EFAC',
  eating: '#FBBF24',
}

export function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? '#94A3B8'
}

const WIB = 'Asia/Jakarta'

export function nowInWIB(date: Date = new Date()): { h: number; m: number; s: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: WIB,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0)
  return { h: get('hour'), m: get('minute'), s: get('second') }
}

export function minutesOfDay(h: number, m: number): number {
  return h * 60 + m
}

export function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number)
  return h * 60 + m
}

export function formatWIB(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    timeZone: WIB,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

export function isMuslim(m: TeamMember): boolean {
  return m.religion === 'islam'
}
