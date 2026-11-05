import { useState, useEffect } from 'react'
import api from '../api/client'
import StatusDot from './StatusDot'

export default function TicketList({ activeTicketId, onSelectTicket }) {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    try {
      const res = await api.get('/users/me/history')
      setTickets(res.data)
    } catch (err) {
      console.error('Failed to fetch history', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleRequestTicket = async () => {
    try {
      const res = await api.post('/tickets')
      setTickets([res.data, ...tickets])
      onSelectTicket(res.data)
    } catch (err) {
      console.error('Failed to request ticket', err)
    }
  }

  if (loading) return <div style={{ padding: '1rem' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '1rem', fontWeight: 700, borderBottom: '2px solid var(--ink-solid)', background: 'var(--brand-bolt)', color: 'var(--ink-solid)' }}>TICKETS</div>
      
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tickets.map(ticket => (
          <div 
            key={ticket.id}
            onClick={() => onSelectTicket(ticket)}
            style={{
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              background: activeTicketId === ticket.id ? 'rgba(0,0,0,0.05)' : 'transparent',
              borderLeft: activeTicketId === ticket.id ? '4px solid var(--brand-bolt)' : '4px solid transparent',
              borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            <StatusDot status={ticket.status === 'open' ? 'pending' : ticket.status} />
            <div style={{ marginLeft: '1.1rem', marginTop: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
              #{ticket.id.substring(0, 4)} — {ticket.title}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', borderTop: '2px solid var(--ink-solid)' }}>
        <button className="btn-primary" style={{ width: '100%' }} onClick={handleRequestTicket}>
          + Request ticket
        </button>
      </div>
    </div>
  )
}
