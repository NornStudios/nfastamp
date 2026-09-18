/**
 * NFA Arcade Fake Activity Feed
 * Simulated live activity for social proof vibes
 */

import { GAMES } from './games'

const FAKE_NAMES = [
  'anon_stamper',
  'diamond_ink',
  'paper_pete',
  'dyor_dan',
  'fomo_fred',
  'hodl_hank',
  'moon_mike',
  'rekt_randy',
  'whale_wally',
  'jeet_jeff',
  'cope_carl',
  'ape_andy',
  'bag_bob',
  'pump_paul',
  'dump_dave',
  'chart_chad',
  'candle_chris',
  'degen_dean',
  'lambo_larry',
  'hopium_harry',
] as const

type ActivityType = 'win' | 'loss' | 'big_win' | 'streak' | 'achievement' | 'daily'

interface Activity {
  type: ActivityType
  name: string
  message: string
  amount?: number
  timestamp: number
}

function randomName(): string {
  return FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]
}

function randomGame(): string {
  const playableGames = GAMES.filter((g) => g.wagering)
  return playableGames[Math.floor(Math.random() * playableGames.length)].title
}

function generateWinActivity(): Activity {
  const amount = [10, 19, 25, 47.5, 50, 95, 100, 190][
    Math.floor(Math.random() * 8)
  ]
  return {
    type: amount >= 100 ? 'big_win' : 'win',
    name: randomName(),
    message: `won ${amount} NFA on ${randomGame()}`,
    amount,
    timestamp: Date.now(),
  }
}

function generateLossActivity(): Activity {
  const amount = [5, 10, 25, 50, 100][Math.floor(Math.random() * 5)]
  return {
    type: 'loss',
    name: randomName(),
    message: `just lost ${amount} NFA. House thanks them.`,
    amount,
    timestamp: Date.now(),
  }
}

function generateStreakActivity(): Activity {
  const streak = Math.floor(Math.random() * 5) + 3
  return {
    type: 'streak',
    name: randomName(),
    message: `is on a ${streak}-win streak! 🔥`,
    timestamp: Date.now(),
  }
}

function generateAchievementActivity(): Activity {
  const achievements = [
    'First Stamp 🎰',
    'Lucky 7 🍀',
    'High Roller 🎩',
    'Diamond Hands 💎',
    'Paper Hands 📄',
  ]
  const ach = achievements[Math.floor(Math.random() * achievements.length)]
  return {
    type: 'achievement',
    name: randomName(),
    message: `unlocked "${ach}"`,
    timestamp: Date.now(),
  }
}

function generateDailyActivity(): Activity {
  const streak = Math.floor(Math.random() * 7) + 1
  return {
    type: 'daily',
    name: randomName(),
    message: `claimed daily bonus (${streak}-day streak)`,
    timestamp: Date.now(),
  }
}

export function generateRandomActivity(): Activity {
  const roll = Math.random()
  if (roll < 0.35) return generateWinActivity()
  if (roll < 0.65) return generateLossActivity()
  if (roll < 0.8) return generateStreakActivity()
  if (roll < 0.92) return generateAchievementActivity()
  return generateDailyActivity()
}

export function formatActivityMessage(activity: Activity): string {
  const prefix = activity.type === 'big_win' ? '🎉 ' : 
                 activity.type === 'streak' ? '🔥 ' :
                 activity.type === 'achievement' ? '🏆 ' :
                 activity.type === 'daily' ? '📅 ' : ''
  return `${prefix}${activity.name} ${activity.message}`
}

export function getActivityIcon(type: ActivityType): string {
  switch (type) {
    case 'win': return '✓'
    case 'big_win': return '🎉'
    case 'loss': return '×'
    case 'streak': return '🔥'
    case 'achievement': return '🏆'
    case 'daily': return '📅'
  }
}

export type { Activity, ActivityType }
