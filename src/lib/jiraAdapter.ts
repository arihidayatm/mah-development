import jiraMapping from '../data/jiraMapping.json'
import jiraMock from '../mocks/jiraMock.json'
import type { JiraIssue, TeamMember } from '../lib/types'
import { clamp } from '../lib/utils'

const BASE = import.meta.env.VITE_JIRA_BASE as string | undefined
const EMAIL = import.meta.env.VITE_JIRA_EMAIL as string | undefined
const TOKEN = import.meta.env.VITE_JIRA_TOKEN as string | undefined
const PROJECT = (import.meta.env.VITE_JIRA_PROJECT as string | undefined) ?? 'MAH'
const USE_MOCK = (import.meta.env.VITE_USE_JIRA_MOCK as string | undefined) !== 'false'

/*
 * CORS proxy note:
 * Jira Cloud REST tidak mengizinkan browser memanggil langsung karena CORS +
 * Basic Auth token bocor di bundle. Untuk produksi jalankan reverse proxy
 * (nginx / Cloudflare Worker / Vite server.proxy) mis:
 *   server: { proxy: { '/jira': { target: 'https://your-domain.atlassian.net',
 *     changeOrigin: true, secure: true,
 *     headers: { Authorization: 'Basic <base64(email:token)>' } } } }
 * lalu set VITE_JIRA_BASE=/jira. Selalu simpan token di server, jangan di VITE_*.
 */

function materializeMock(): JiraIssue[] {
  const now = Date.now()
  const map: Record<string, string> = {
    __BLOCKED_2_5H__: new Date(now - 2.5 * 3600_000).toISOString(),
    __BLOCKED_0_5H__: new Date(now - 0.5 * 3600_000).toISOString(),
    __INPROG_5H__: new Date(now - 5 * 3600_000).toISOString(),
    __DONE_TODAY__: new Date(now - 1 * 3600_000).toISOString(),
  }
  return (jiraMock.issues as JiraIssue[]).map((i) => ({
    ...i,
    updated: map[i.updated] ?? i.updated,
    statusChangeDate: map[i.statusChangeDate] ?? i.statusChangeDate,
  }))
}

function normalize(raw: any): JiraIssue {
  const f = raw.fields ?? raw
  return {
    key: raw.key ?? f.key ?? 'UNKNOWN',
    summary: f.summary ?? '',
    status: f.status?.name ?? f.status ?? 'In Progress',
    assignee: f.assignee?.emailAddress ?? f.assignee?.email ?? f.assignee ?? '',
    updated: f.updated ?? new Date().toISOString(),
    statusChangeDate: f.statuscategorychangedate ?? f.updated ?? new Date().toISOString(),
    timeSpentHours: f.timeSpentHours,
  }
}

export async function fetchJiraIssues(): Promise<JiraIssue[]> {
  if (USE_MOCK || !BASE) {
    await new Promise((r) => setTimeout(r, 350))
    return materializeMock()
  }
  const jql = `project=${PROJECT} AND status IN (Blocked, "In Progress", Done) AND updated>=-1d`
  const url = `${BASE}/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=summary,status,assignee,updated,statuscategorychangedate`
  const auth = EMAIL && TOKEN ? `Basic ${btoa(`${EMAIL}:${TOKEN}`)}` : ''
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(auth ? { Authorization: auth } : {}),
    },
  })
  if (!res.ok) throw new Error(`Jira HTTP ${res.status}`)
  const json = (await res.json()) as { issues: any[] }
  return (json.issues ?? []).map(normalize)
}

function hoursSince(iso: string): number {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return 0
  return Math.max(0, (Date.now() - t) / 3600_000)
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
  forceNormal: boolean
}

export function mapJiraToEnergy(team: TeamMember[], issues: JiraIssue[], opts: MapOptions): TeamMember[] {
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
    if (!mine || mine.length === 0) return m

    let energy = m.energy
    let status = m.status
    let currentTask = m.currentTask
    let progress = m.progress
    let jiraKey = m.jiraKey

    const doneToday = mine.filter((i) => i.status.toLowerCase() === 'done' && isToday(i.updated))
    if (doneToday.length >= 3) {
      status = 'done'
      energy = clamp(energy + 15)
      currentTask = `Queue clear: ${doneToday.length} issue done`
      jiraKey = doneToday[0].key
    }

    for (const issue of mine) {
      const st = issue.status.toLowerCase()
      if (st === 'blocked') {
        const blockedHours = hoursSince(issue.statusChangeDate)
        energy = clamp(100 - blockedHours * 35)
        jiraKey = issue.key
        if (blockedHours >= 2) {
          status = 'sleepy'
          currentTask = `[BLOCKED ${blockedHours.toFixed(1)}j] ${issue.summary}`
        } else if (status !== 'done') {
          status = 'blocked'
          currentTask = `[BLOCKED ${blockedHours.toFixed(1)}j] ${issue.summary}`
        }
        progress = m.progress
      } else if (st === 'in progress') {
        const spent = issue.timeSpentHours ?? hoursSince(issue.statusChangeDate)
        if (spent > 4) energy = clamp(energy - (spent - 4) * 10)
        if (status !== 'done' && status !== 'blocked' && status !== 'sleepy') {
          status = 'working'
          currentTask = issue.summary
          jiraKey = issue.key
          progress = clamp(30 + spent * 8)
        }
      } else if (st === 'done' && isToday(issue.updated)) {
        if (status !== 'done' && status !== 'blocked' && status !== 'sleepy') {
          status = 'done'
          currentTask = issue.summary
          jiraKey = issue.key
          progress = 100
          energy = clamp(energy + 10)
        }
      }
    }

    return { ...m, energy, status, currentTask, progress, jiraKey }
  })
}
