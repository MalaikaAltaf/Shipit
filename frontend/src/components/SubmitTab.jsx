import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function SubmitTab({ ticketId }) {
  const [codeText, setCodeText] = useState('')
  const [openapiSpec, setOpenapiSpec] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!codeText.trim() || !openapiSpec.trim()) {
      alert("Please provide both code and OpenAPI spec")
      return
    }
    
    let parsedSpec
    try {
      parsedSpec = JSON.parse(openapiSpec)
    } catch (e) {
      alert("OpenAPI spec must be valid JSON")
      return
    }

    setSubmitting(true)
    try {
      const res = await api.post(`/tickets/${ticketId}/submissions`, {
        code_text: codeText,
        openapi_spec: parsedSpec
      })
      // Navigate to review report
      navigate(`/review/${res.data.id}`)
    } catch (err) {
      console.error(err)
      alert("Submission failed")
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <label className="mono" style={{ fontSize: '0.85rem', color: 'var(--ink-solid)', fontWeight: 600, marginBottom: '0.5rem' }}>Code (Python)</label>
        <textarea 
          className="mono opaque-panel"
          value={codeText}
          onChange={e => setCodeText(e.target.value)}
          placeholder="Paste your python code here..."
          style={{ flex: 1, width: '100%', padding: '1rem', border: '2px solid var(--ink-solid)', color: 'var(--ink-solid)', resize: 'none' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', height: '200px' }}>
        <label className="mono" style={{ fontSize: '0.85rem', color: 'var(--ink-solid)', fontWeight: 600, marginBottom: '0.5rem' }}>OpenAPI Spec (JSON)</label>
        <textarea 
          className="mono opaque-panel"
          value={openapiSpec}
          onChange={e => setOpenapiSpec(e.target.value)}
          placeholder="{ ... }"
          style={{ flex: 1, width: '100%', padding: '1rem', border: '2px solid var(--ink-solid)', color: 'var(--ink-solid)', resize: 'none' }}
        />
      </div>

      <div>
        <button 
          className="btn-primary" 
          onClick={handleSubmit} 
          disabled={submitting}
          style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}
        >
          {submitting ? 'Submitting...' : 'Submit →'}
        </button>
      </div>
    </div>
  )
}
