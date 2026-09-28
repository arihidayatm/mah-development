import zonesRaw from '../data/zones.json'
import type { ZoneMap } from './types'

export const ZONES = zonesRaw as ZoneMap

export type Vec3 = [number, number, number]

/**
 * Waypoint graph. Tiap node nyambung ke tetangga logis supaya chibi jalan lewat
 * koridor, bukan terbang nembus dinding. Editing zones.json otomatis kebaca.
 */
const EDGES: [string, string][] = [
  // desks -> corridor row
  ['desk-A1', 'corridor-1'],
  ['desk-A2', 'corridor-2'],
  ['desk-A3', 'corridor-2'],
  ['desk-A4', 'corridor-3'],
  ['desk-server', 'corridor-3'],
  ['desk-A6', 'corridor-1'],
  ['desk-vip', 'corridor-4'],
  ['desk-admin', 'corridor-4'],

  // corridor row chained
  ['corridor-1', 'corridor-2'],
  ['corridor-2', 'corridor-3'],
  ['corridor-3', 'corridor-4'],

  // corridor -> south zones
  ['corridor-1', 'coffee-bar-1'],
  ['coffee-bar-1', 'coffee-bar-2'],
  ['coffee-bar-2', 'coffee-bar-3'],
  ['coffee-bar-3', 'coffee-bar-4'],
  ['coffee-bar-4', 'coffee-bar-5'],
  ['coffee-bar-5', 'coffee-bar-6'],

  ['coffee-bar-1', 'lunch-bar-1'],
  ['lunch-bar-1', 'lunch-bar-2'],
  ['lunch-bar-2', 'lunch-bar-3'],
  ['lunch-bar-3', 'lunch-bar-4'],
  ['lunch-bar-4', 'lunch-bar-5'],
  ['lunch-bar-5', 'lunch-bar-6'],

  ['corridor-3', 'santai-sofa-1'],
  ['santai-sofa-1', 'santai-sofa-2'],
  ['santai-sofa-1', 'santai-sofa-3'],
  ['santai-sofa-2', 'santai-sofa-4'],
  ['santai-sofa-3', 'santai-sofa-4'],

  ['santai-sofa-2', 'meeting-room'],
  ['corridor-4', 'vip-wait'],
  ['desk-vip', 'vip-wait'],

  // ke mushalla (barat, lewat corridor-1)
  ['corridor-1', 'mushalla-door'],
  ['mushalla-door', 'sajadah-1'],
  ['mushalla-door', 'sajadah-2'],
  ['mushalla-door', 'sajadah-3'],
  ['sajadah-1', 'sajadah-2'],
  ['sajadah-1', 'sajadah-3'],
  ['sajadah-2', 'sajadah-4'],
  ['sajadah-3', 'sajadah-5'],
  ['sajadah-4', 'sajadah-6'],
  ['sajadah-5', 'sajadah-6'],

  ['corridor-1', 'wudu-1'],
  ['wudu-1', 'wudu-2'],
  ['wudu-2', 'wudu-3'],
  ['wudu-3', 'sajadah-2'],
  ['wudu-1', 'sajadah-1'],
]

const ADJ: Record<string, string[]> = {}
for (const [a, b] of EDGES) {
  ;(ADJ[a] ??= []).push(b)
  ;(ADJ[b] ??= []).push(a)
}

export function zonePos(key: string): Vec3 {
  return ZONES[key] ?? ZONES['corridor-2']
}

/** BFS shortest waypoint path. Return list of positions dari start ke goal. */
export function findPath(fromKey: string, toKey: string): Vec3[] {
  if (fromKey === toKey) return [zonePos(toKey)]
  if (!ZONES[fromKey] || !ZONES[toKey]) {
    return shortestLeg(fromKey, toKey)
  }

  const queue: string[] = [fromKey]
  const prev: Record<string, string | null> = { [fromKey]: null }
  let found = false
  while (queue.length) {
    const cur = queue.shift() as string
    if (cur === toKey) {
      found = true
      break
    }
    for (const nb of ADJ[cur] ?? []) {
      if (nb in prev) continue
      prev[nb] = cur
      queue.push(nb)
    }
  }

  if (!found) return shortestLeg(fromKey, toKey)

  const keys: string[] = []
  let node: string | null = toKey
  while (node) {
    keys.unshift(node)
    node = prev[node]
  }
  return keys.map(zonePos)
}

/** Fallback kalau graph putus: lewat koridor tengah. */
function shortestLeg(fromKey: string, toKey: string): Vec3[] {
  const from = zonePos(fromKey)
  const to = zonePos(toKey)
  return [from, [from[0], 0, 1.5], [to[0], 0, 1.5], to]
}

export function nearestKeys(prefix: string, count: number): string[] {
  const keys = Object.keys(ZONES).filter((k) => k.startsWith(prefix))
  return keys.slice(0, count)
}
