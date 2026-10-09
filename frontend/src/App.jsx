import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import PasswordRecoveryPage from './pages/PasswordRecoveryPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import Hu3Page from './historias/hu3/Hu3Page'
import ConfiguracionPage from './historias/hu2/ConfiguracionPage'

function App() {
  return (
    <Routes>
      <Route path="/mis-trabajos" element={<Hu3Page />} />

      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecoveryPage />} />
        <Route path="/registro" element={<RegisterPage />} />
	<Route path="/configuracion-edicion" element={<ConfiguracionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App