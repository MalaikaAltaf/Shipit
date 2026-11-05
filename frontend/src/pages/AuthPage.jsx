import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { loginRequest } from '../api/client'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')

    try {
      if (isLogin) {
        const res = await loginRequest(email, password)
        localStorage.setItem('token', res.data.access_token)
        navigate('/workspace')
      } else {
        await api.post('/auth/register', { email, password })
        setMsg('Registered successfully! Please log in.')
        setIsLogin(true)
        setPassword('')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--ink-solid)' }}>
          <button 
            style={{ paddingBottom: '0.5rem', borderBottom: isLogin ? '4px solid var(--brand-bolt)' : 'none', color: 'var(--ink-solid)', fontWeight: 700 }}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            style={{ paddingBottom: '0.5rem', borderBottom: !isLogin ? '4px solid var(--brand-bolt)' : 'none', color: 'var(--ink-solid)', fontWeight: 700 }}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {error && <div style={{ color: 'var(--status-fail)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700 }}>{error}</div>}
        {msg && <div style={{ color: 'var(--status-pass)', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 700 }}>{msg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink-solid)', fontWeight: 700, marginBottom: '0.25rem' }}>Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#fff', border: '2px solid var(--ink-solid)', color: 'var(--ink-solid)', borderRadius: '0' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--ink-solid)', fontWeight: 700, marginBottom: '0.25rem' }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', background: '#fff', border: '2px solid var(--ink-solid)', color: 'var(--ink-solid)', borderRadius: '0' }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>

    </div>
  )
}
