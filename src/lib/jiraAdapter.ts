import jiraMapping from '../data/jiraMapping.json'
import jiraMock from '../mocks/jiraMock.json'
import type { JiraIssue, TeamMember } from './types'
import { clamp, formatBlocked } from './utils'

const BASE = import.meta.env.VITE_JIRA_BASE
const EMAIL = import.meta.env.VITE_JIRA_EMAIL
const TOKEN = import.meta.env.VITE_JIRA_TOKEN
const PROJECT = import.meta.env.VITE_JIRA_PROJECT || 'MAH'
export const USE_JIRA_MOCK = import.meta.env.VITE_USE_JIRA_MOCK !== 'false'

/*
 * CORS proxy note:
 * Jira Cloud REST ga bisa dipanggil langsung dari browser (CORS + Basic Auth
 * bocor di bundle). Untuk produksi pakai reverse proxy, mis. di vite.config:
 *   server: { proxy: { '/jira': { target: 'https://<domain>.atlassian.net',
 *     changeOrigin: true, secure: true,
 *     headers: { Authorization: 'Basic <base64(email:token)>' } } } }
 * lalu set VITE_JIRA_BASE=/jira. Token JANGAN disimpan di env VITE_* (kebaca
 * client). Simpan di server proxy.
 */

function materializeMock(): JiraIssue[] {
  const now = Date.now()
  const at = (h: number) => new Date(now - h * 3_600_000).toISOString()
  const tokens: Record<string, string> = {
    __BLOCKED_2_5H__: at(2.5),
    __BLOCKED_0_5H__: at(0.5),
    __INPROG_5H__: at(5),
    __DONE_TODAY__: at(1),
  }
  return (jiraMock.issues as JiraIssue[]).map((i) => ({
    ...i,
    updated: tokens[i.updated] ?? i.updated,
    statusChangeDate: tokens[i.statusChangeDate] ?? i.statusChangeDate,
  }))
}

function normalizeIssue(raw: any): JiraIssue {
  const f = raw.fields ?? raw
  return {
    key: raw.key ?? f.key ?? 'UNKNOWN',
    summary: f.summary ?? '',
    status: f.status?.name ?? f.status ?? 'In Progress',
    assignee: f.assignee?.emailAddress ?? f.assignee?.email ?? '',
    updated: f.updated ?? new Date().toISOString(),
    statusChangeDate: f.statuscategorychangedate ?? f.updated ?? new Date().toISOString(),
    timeSpentHours: f.timeSpentHours,
  }
}

export async function fetchJiraIssues(): Promise<JiraIssue[]> {
  if (USE_JIRA_MOCK || !BASE) {
    await new Promise((r) => setTimeout(r, 250))
    return materializeMock()
  }
  const jql = `project=${PROJECT} AND status IN (Blocked, "In Progress", Done) AND updated>=-1d`
  const url = `${BASE}/rest/api/3/search?jql=${encodeURIComponent(
    jql,
  )}&fields=summary,status,assignee,updated,statuscategorychangedate,timeSpentHours`
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (EMAIL && TOKEN) headers.Authorization = `Basic ${btoa(`${EMAIL}:${TOKEN}`)}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Jira HTTP ${res.status}`)
  const json = (await res.json()) as { issues?: any[] }
  return (json.issues ?? []).map(normalizeIssue)
}

const hoursSince = (iso: string) => {
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? 0 : Math.max(0, (Date.now() - t) / 3_600_000)
}

function isToday(iso: string): boolean {
  const d = new Date(iso)
  const n = new Date()
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  )
}

export interface MapOptions {
  forceNormal?: boolean
}

export function mapJiraToEnergy(
  team: TeamMember[],
  issues: JiraIssue[],
  opts: MapOptions = {},
): TeamMember[] {
  if (opts.forceNormal) return team

  const mapping = jiraMapping as Record<string, string>
  const byMember = new Map<string, JiraIssue[]>()
  for (const issue of issues) {
    const id = mapping[issue.assignee]
    if (!id) continue
    const arr = byMember.get(id) ?? []
    arr.push(issue)
    byMember.set(id, arr)
  }

  return team.map((m) => {
    const mine = byMember.get(m.id)
    if (!mine?.length) return m

    let energy = m.energy
    let status = m.status
    let currentTask = m.currentTask
    let progress = m.progress
    let jiraKey = m.jiraKey

    const doneToday = mine.filter((i) => i.status.toLowerCase() === 'done' && isToday(i.updated))
    const blocked = mine.filter((i) => i.status.toLowerCase() === 'blocked')
    const inProgress = mine.filter((i) => i.status.toLowerCase() === 'in progress')

    if (blocked.length) {
      const worst = blocked.reduce((a, b) =>
        hoursSince(b.statusChangeDate) > hoursSince(a.statusChangeDate) ? b : a,
      )
      const blockedHours = hoursSince(worst.statusChangeDate)
      energy = clamp(100 - blockedHours * 35)
      jiraKey = worst.key
      progress = m.progress
      if (blockedHours >= 2) {
        status = 'sleepy'
        currentTask = `[BLOCKED ${formatBlocked(blockedHours)}] ${worst.summary}`
      } else {
        status = 'blocked'
        currentTask = `[BLOCKED ${formatBlocked(blockedHours)}] ${worst.summary}`
      }
    } else if (inProgress.length) {
      const top = inProgress[0]
      const spent = top.timeSpentHours ?? hoursSince(top.statusChangeDate)
      if (spent > 4) energy = clamp(energy - (spent - 4) * 10)
      status = 'working'
      currentTask = top.summary
      jiraKey = top.key
      progress = clamp(30 + spent * 8)
    }

    if (doneToday.length >= 3) {
      status = 'done'
      energy = clamp(energy + 15)
      currentTask = `Queue clear: ${doneToday.length} issue done`
      jiraKey = doneToday[0].key
      progress = 100
    }

    return { ...m, energy, status, currentTask, progress, jiraKey }
  })
}
