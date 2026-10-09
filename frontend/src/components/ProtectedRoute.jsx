import { Navigate, useLocation } from 'react-router-dom'
import { getSession, roleCanAccess } from '../lib/auth'

function ProtectedRoute({ allowedRoles, children }) {
  const location = useLocation()
  const session = getSession()

  if (!session) {
    return (
      <Navigate
        replace
        state={{ from: `${location.pathname}${location.search}` }}
        to="/iniciar-sesion"
      />
    )
  }

  if (!roleCanAccess(session.role, allowedRoles)) {
    return (
      <Navigate
        replace
        state={{ requestedPath: location.pathname }}
        to="/acceso-denegado"
      />
    )
  }

  return children
}

export default ProtectedRoute
