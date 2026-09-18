import { useEffect, useState } from 'react'
import {
  formatActivityMessage,
  generateRandomActivity,
  getActivityIcon,
  type Activity,
} from '../activityFeed'
import './ActivityFeed.css'

const MAX_ITEMS = 5

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const initial: Activity[] = []
    for (let i = 0; i < 3; i++) {
      initial.push({
        ...generateRandomActivity(),
        timestamp: Date.now() - (3 - i) * 5000,
      })
    }
    setActivities(initial)

    const interval = setInterval(() => {
      setActivities((prev) => {
        const newActivity = generateRandomActivity()
        const updated = [newActivity, ...prev].slice(0, MAX_ITEMS)
        return updated
      })
    }, 4000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="activity-feed">
      <div className="activity-feed__header">
        <span className="activity-feed__dot" />
        <span className="activity-feed__title">Live Activity</span>
      </div>
      <ul className="activity-feed__list">
        {activities.map((a, i) => (
          <li
            key={`${a.timestamp}-${i}`}
            className={`activity-feed__item activity-feed__item--${a.type} ${i === 0 ? 'new' : ''}`}
          >
            <span className="activity-feed__icon">{getActivityIcon(a.type)}</span>
            <span className="activity-feed__msg">{formatActivityMessage(a)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ActivityTicker() {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = () => {
      setActivity(generateRandomActivity())
      setVisible(true)
      setTimeout(() => setVisible(false), 4000)
    }

    show()
    const interval = setInterval(show, 8000 + Math.random() * 4000)
    return () => clearInterval(interval)
  }, [])

  if (!activity) return null

  return (
    <div className={`activity-ticker ${visible ? 'show' : ''}`}>
      <span className="activity-ticker__icon">{getActivityIcon(activity.type)}</span>
      <span className="activity-ticker__msg">{formatActivityMessage(activity)}</span>
    </div>
  )
}
