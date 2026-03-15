import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import SetupPage from './pages/SetupPage'
import StudyPage from './pages/StudyPage'
import StudyResultPage from './pages/StudyResultPage'
import StatsPage from './pages/StatsPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/study-result" element={<StudyResultPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
