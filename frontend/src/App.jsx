import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import PasswordRecoveryPage from './pages/PasswordRecoveryPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import Hu3Page from './historias/hu3/Hu3Page'
import ConfiguracionPage from './historias/hu2/ConfiguracionPage'
import Hu4App from './Hu4App'
import { BandejaRevisor } from './pages/BandejaRevisor'
import DemoPage from './pages/DemoPage'
import AccountPage from './pages/AccountPage'
import AccessDeniedPage from './pages/AccessDeniedPage'
import CommitteeInvitationPage from './pages/CommitteeInvitationPage'
import RegistrationSuccessPage from './pages/RegistrationSuccessPage'
import ProtectedRoute from './components/ProtectedRoute'
import Hu1Layout from './historias/hu1/Hu1Layout'

function App() {
  return (
    <Routes>
      <Route
        path="/mis-trabajos"
        element={
          <ProtectedRoute allowedRoles={['autor', 'ambos']}>
            <Hu3Page />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gestion-revisiones"
        element={
          <ProtectedRoute allowedRoles={['comite']}>
            <div className="hu4-scope tailwind-scope">
              <Hu4App />
            </div>
          </ProtectedRoute>
        }
      />

      <Route element={<Hu1Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecoveryPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/registro-comite" element={<CommitteeInvitationPage />} />
        <Route path="/acceso-denegado" element={<AccessDeniedPage />} />
        <Route
          path="/registro-exitoso"
          element={
            <ProtectedRoute>
              <RegistrationSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mi-cuenta"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<Layout />}>
        <Route
          path="/configuracion-edicion"
          element={
            <ProtectedRoute allowedRoles={['comite']}>
              <ConfiguracionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bandeja-revisor"
          element={
            <ProtectedRoute allowedRoles={['revisor', 'ambos']}>
              <div className="hu5-scope">
                <BandejaRevisor />
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="/demo" element={<DemoPage />} />
      </Route>
    </Routes>
  )
}

export default App
