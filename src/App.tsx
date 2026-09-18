import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ArcadeHome } from './arcade/ArcadeHome'
import { ArcadeLayout } from './arcade/ArcadeLayout'
import { GamePage } from './arcade/games/GamePage'
import { StatsPage } from './arcade/pages/StatsPage'
import { AchievementsPage } from './arcade/pages/AchievementsPage'
import { LeaderboardPage } from './arcade/pages/LeaderboardPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/arcade" element={<ArcadeLayout />}>
          <Route index element={<ArcadeHome />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path=":gameId" element={<GamePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
