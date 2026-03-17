import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import { ToastProvider } from './components/ToastContainer'
import HomePage from './pages/HomePage'
import SetupPage from './pages/SetupPage'
import StudyPage from './pages/StudyPage'
import StudyResultPage from './pages/StudyResultPage'
import StatsPage from './pages/StatsPage'
import AdminPage from './pages/AdminPage'
import './App.css'

function AppContent() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Estudar', path: '/study', icon: '📚' },
    { label: 'Estatísticas', path: '/stats', icon: '📊' },
    { label: 'Administração', path: '/admin', icon: '⚙️' },
  ];

  return (
    <div className="app">
      <div className="app-container">
        <aside className="app-sidebar">
          <div className="app-sidebar-title">Preparátorio para o Exame ao Ministério Pastoral Batista</div>
          <nav className="app-sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`app-sidebar-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>
        <div className="app-main">
          <main className="app-main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/setup" element={<SetupPage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/study-result" element={<StudyResultPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router>
          <AppContent />
        </Router>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App
