import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <nav style={{
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      borderBottom: '2px solid var(--ink-solid)',
      justifyContent: 'space-between',
      background: 'var(--paper-bright)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/workspace" style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--ink-solid)' }}>ShipIt</Link>
        <div style={{ display: 'flex', gap: '1rem', fontWeight: 600 }}>
          <Link to="/workspace" style={{ color: 'var(--ink-solid)' }}>[Tickets]</Link>
          <Link to="/history" style={{ color: 'var(--ink-solid)' }}>[History]</Link>
        </div>
      </div>
      <div>
        <button onClick={handleLogout} style={{ color: 'var(--ink-solid)', fontWeight: 600 }}>Logout ▾</button>
      </div>
    </nav>
  )
}
