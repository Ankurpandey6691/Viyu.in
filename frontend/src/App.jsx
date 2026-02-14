import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import UserManagement from './pages/UserManagement'
import InfrastructureManagement from './pages/InfrastructureManagement'
import AdminDashboard from './pages/AdminDashboard'
import FacultyManagement from './pages/FacultyManagement'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/users" element={<UserManagement />} />
                <Route path="/dashboard/infrastructure" element={<InfrastructureManagement />} />

                {/* Admin Routes */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/faculty" element={<FacultyManagement />} />
            </Route>
        </Routes>
    )
}

export default App
