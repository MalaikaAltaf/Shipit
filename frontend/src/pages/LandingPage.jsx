import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
      <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap', maxWidth: '1000px' }}>
        
        {/* Left column: Copy */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Ship your first real ticket.<br />
            Before your first real job.
          </h1>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <Link to="/auth" className="btn-brutalist">Start a ticket</Link>
          </div>
        </div>

        {/* Right column: Rotated brutalist card */}
        <div style={{ flex: '0 1 350px' }}>
          <div className="brutalist-card" style={{ 
            transform: 'rotate(3deg)', 
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div className="mono" style={{ color: 'var(--paper-muted)', fontSize: '0.9rem' }}>#041</div>
            <h3 style={{ fontSize: '1.25rem' }}>Add pagination to GET /users</h3>
            
            <div style={{ 
              marginTop: '1rem',
              padding: '0.5rem 1rem', 
              background: 'var(--status-pass)', 
              color: 'var(--ink-base)',
              fontWeight: 700,
              display: 'inline-block',
              alignSelf: 'flex-start',
              border: '2px solid var(--ink-solid)'
            }}>
              PASSED ✓
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
