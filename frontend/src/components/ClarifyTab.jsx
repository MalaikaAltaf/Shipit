import { useState, useEffect, useRef } from 'react'
import api from '../api/client'

export default function ClarifyTab({ ticketId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}/clarifications`)
        setMessages(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [ticketId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = { id: Date.now(), role: 'student', message: input }
    setMessages(prev => [...prev, userMsg])
    const currentInput = input
    setInput('')

    try {
      const res = await api.post(`/tickets/${ticketId}/clarifications`, { message: currentInput })
      setMessages(prev => [...prev, res.data])
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1rem' }}>
        {messages.length === 0 && (
          <div style={{ color: 'var(--ink-solid)', textAlign: 'center', marginTop: '2rem', fontWeight: 600 }}>
            Ask the PM engine a clarifying question.
          </div>
        )}
        
        {messages.map((msg, i) => {
          const isStudent = msg.role === 'student'
          const isVague = !isStudent && msg.message.includes('not sure')

          return (
            <div key={msg.id || i} style={{ alignSelf: isStudent ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ 
                background: isStudent ? 'var(--brand-bolt)' : '#fff',
                color: 'var(--ink-solid)',
                border: '2px solid var(--ink-solid)',
                padding: '0.75rem 1rem',
                borderRadius: '0',
                boxShadow: '2px 2px 0 var(--ink-solid)',
                lineHeight: 1.5,
                fontWeight: 500
              }}>
                {msg.message}
              </div>
              {isVague && (
                <div style={{ fontSize: '0.8rem', color: 'var(--status-pending)', marginTop: '0.5rem', fontStyle: 'italic', fontWeight: 600 }}>
                  The PM isn't sure — use your judgment
                </div>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question..."
          style={{ flex: 1, padding: '0.75rem', borderRadius: '0', border: '2px solid var(--ink-solid)', background: '#fff', color: 'var(--ink-solid)' }}
        />
        <button type="submit" className="btn-primary" disabled={!input.trim()}>Send</button>
      </form>
    </div>
  )
}
