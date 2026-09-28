export type Religion = 'islam' | 'non-muslim'

export type CharacterStatus =
  | 'working'
  | 'sleepy'
  | 'to_coffee'
  | 'drinking'
  | 'chilling'
  | 'discussing'
  | 'meeting'
  | 'blocked'
  | 'done'
  | 'praying'
  | 'eating'

export type HairStyle = 'spiky' | 'bob' | 'hijab' | 'cap' | 'neat' | 'client'
export type Accessory = 'headphone' | 'glasses' | 'round-glasses' | 'none'
export type Pose = 'sit' | 'stand' | 'walk' | 'pray'
export type PrayPhase = 'qiyam' | 'ruku' | 'sujud' | 'julus'
export type Mood = 'normal' | 'sleepy' | 'happy'

export interface CharacterColors {
  skin: string
  top: string
  hair: string
}

export interface Appearance {
  hairStyle: HairStyle
  accessory: Accessory
  hat: string
  hatColor?: string
  hijabColor?: string
  isLeader: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  religion: Religion
  status: CharacterStatus
  energy: number
  currentTask: string
  progress: number
  jiraKey: string
  location: string
  targetZone: string
  deskZone: string
  colors: CharacterColors
  appearance: Appearance
}

export interface ZoneMap {
  [key: string]: [number, number, number]
}

export type CameraPreset = 'office' | 'vip' | 'coffee' | 'santai' | 'mushalla'
export type GlobalMode = 'normal' | 'pray' | 'lunch' | 'pray-mini'

export interface JiraIssue {
  key: string
  summary: string
  status: string
  assignee: string
  updated: string
  statusChangeDate: string
  timeSpentHours?: number
}
