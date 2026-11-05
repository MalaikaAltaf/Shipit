import { useState, useEffect } from 'react'
import api from '../api/client'
import StatusDot from '../components/StatusDot'

export default function HistoryPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/users/me/history')
        setTickets(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading history...</div>

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem' }}>History</h1>

      <div className="opaque-panel" style={{ padding: '2rem' }}>
        {tickets.length === 0 ? (
          <div style={{ color: 'var(--ink-solid)', fontWeight: 600 }}>No tickets yet. Go to the workspace to request your first one!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {tickets.map((ticket, index) => {
              return (
                <div key={ticket.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: index === tickets.length - 1 ? '0' : '2rem' }}>
                  
                  {/* Timeline vertical line */}
                  {index !== tickets.length - 1 && (
                    <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '0', width: '2px', background: 'var(--ink-solid)' }}></div>
                  )}

                  {/* Status Dot column */}
                  <div style={{ paddingTop: '5px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--paper-bright)', border: '2px solid var(--ink-solid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <StatusDot status={ticket.status === 'open' ? 'pending' : ticket.status} label="" />
                    </div>
                  </div>

                  {/* Content column */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <div className="mono" style={{ color: 'var(--ink-solid)', fontSize: '0.85rem', fontWeight: 600 }}>#{ticket.id.substring(0,8)}</div>
                        <h3 style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{ticket.title}</h3>
                      </div>
                      <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--ink-solid)', fontWeight: 600 }}>
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                       <span style={{ fontSize: '0.9rem', color: 'var(--ink-solid)', fontWeight: 600 }}>Status: <span style={{ color: 'var(--ink-solid)' }}>{ticket.status}</span></span>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
