import { Outlet } from 'react-router-dom'
import Hu1Footer from './Hu1Footer'
import Hu1Header from './Hu1Header'
import './hu1.css'

function Hu1Layout() {
  return (
    <div className="hu1-shell">
      <Hu1Header />
      <main className="hu1-main">
        <Outlet />
      </main>
      <Hu1Footer />
    </div>
  )
}

export default Hu1Layout
