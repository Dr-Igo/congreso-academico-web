import { Route, Routes } from 'react-router-dom'
import LandingPage from './features/hu1-cuenta-acceso/pages/LandingPage'
import LoginPage from './features/hu1-cuenta-acceso/pages/LoginPage'
import PasswordRecoveryPage from './features/hu1-cuenta-acceso/pages/PasswordRecoveryPage'
import RegisterPage from './features/hu1-cuenta-acceso/pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import Hu3Page from './features/hu3-trabajos/Hu3Page'
import ConfiguracionPage from './features/hu2-configuracion/ConfiguracionPage'
import AssignmentsPage from './features/hu4-revisiones/AssignmentsPage'
import { BandejaRevisor } from './features/hu5-bandeja-revisor/BandejaRevisor'
import AccountPage from './features/hu1-cuenta-acceso/pages/AccountPage'
import AccessDeniedPage from './features/hu1-cuenta-acceso/pages/AccessDeniedPage'
import CommitteeInvitationPage from './features/hu1-cuenta-acceso/pages/CommitteeInvitationPage'
import RegistrationSuccessPage from './features/hu1-cuenta-acceso/pages/RegistrationSuccessPage'
import ProtectedRoute from './components/ProtectedRoute'
import SiteLayout from './components/layout/SiteLayout'

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
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
        <Route
          path="/mis-trabajos"
          element={
            <ProtectedRoute allowedRoles={['autor', 'ambos']}>
              <Hu3Page key="work-list" initialView="list" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/nuevo-trabajo"
          element={
            <ProtectedRoute allowedRoles={['autor', 'ambos']}>
              <Hu3Page key="new-work" initialView="form" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mi-presentacion"
          element={
            <ProtectedRoute allowedRoles={['autor', 'ambos']}>
              <Hu3Page key="presentation" initialView="presentation" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion-edicion"
          element={
            <ProtectedRoute allowedRoles={['comite']}>
              <ConfiguracionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestion-revisiones"
          element={
            <ProtectedRoute allowedRoles={['comite']}>
              <div className="hu4-assignments-scope">
                <AssignmentsPage />
              </div>
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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
