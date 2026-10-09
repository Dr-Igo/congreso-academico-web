import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import PasswordRecoveryPage from './pages/PasswordRecoveryPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecoveryPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
