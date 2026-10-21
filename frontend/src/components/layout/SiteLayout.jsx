import { Outlet } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import './site-layout.css'

function SiteLayout() {
  return (
    <div className="hu1-shell">
      <SiteHeader />
      <main className="hu1-main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

export default SiteLayout
