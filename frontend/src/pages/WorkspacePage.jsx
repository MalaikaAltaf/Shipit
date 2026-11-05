import { useState, useEffect } from 'react'
import api from '../api/client'
import TicketList from '../components/TicketList'
import ClarifyTab from '../components/ClarifyTab'
import SubmitTab from '../components/SubmitTab'

export default function WorkspacePage() {
  const [activeTicket, setActiveTicket] = useState(null)
  const [activeTab, setActiveTab] = useState('description') // description, clarify, submit

  return (
    <div className="workspace-layout container" style={{ padding: '2rem 1rem', gap: '2rem' }}>
      
      {/* Left rail: Opaque list */}
      <div className="opaque-panel" style={{ width: '300px', flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <TicketList activeTicketId={activeTicket?.id} onSelectTicket={setActiveTicket} />
      </div>

      {/* Right pane: Brutalist panel */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {activeTicket ? (
          <>
            <div style={{ padding: '1.5rem 1.5rem 0', borderBottom: '2px solid var(--ink-solid)' }}>
              <div className="mono" style={{ color: 'var(--ink-solid)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>#{activeTicket.id.substring(0,8)} — {activeTicket.difficulty}</div>
              <h2 style={{ marginBottom: '1.5rem' }}>{activeTicket.title}</h2>
              
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <button 
                  style={{ paddingBottom: '0.75rem', borderBottom: activeTab === 'description' ? '4px solid var(--brand-bolt)' : '4px solid transparent', color: 'var(--ink-solid)', fontWeight: 700 }}
                  onClick={() => setActiveTab('description')}
                >Description</button>
                <button 
                  style={{ paddingBottom: '0.75rem', borderBottom: activeTab === 'clarify' ? '4px solid var(--brand-bolt)' : '4px solid transparent', color: 'var(--ink-solid)', fontWeight: 700 }}
                  onClick={() => setActiveTab('clarify')}
                >Clarify</button>
                <button 
                  style={{ paddingBottom: '0.75rem', borderBottom: activeTab === 'submit' ? '4px solid var(--brand-bolt)' : '4px solid transparent', color: 'var(--ink-solid)', fontWeight: 700 }}
                  onClick={() => setActiveTab('submit')}
                >Submit</button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {activeTab === 'description' && (
                <div style={{ lineHeight: 1.6 }}>
                  {activeTicket.description}
                </div>
              )}
              {activeTab === 'clarify' && <ClarifyTab ticketId={activeTicket.id} />}
              {activeTab === 'submit' && <SubmitTab ticketId={activeTicket.id} />}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--paper-muted)' }}>
            Select or request a ticket to begin.
          </div>
        )}
      </div>

    </div>
  )
}
