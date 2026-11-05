import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'
import StatusDot from '../components/StatusDot'

function ExpandableReviewRow({ title, issue, delayMs }) {
  const [expanded, setExpanded] = useState(false)
  const isPass = !issue

  return (
    <div 
      className="animate-land" 
      style={{ animationDelay: `${delayMs}ms`, borderBottom: '1px solid var(--ink-base)' }}
    >
      <div 
        onClick={() => !isPass && setExpanded(!expanded)}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '1rem',
          cursor: isPass ? 'default' : 'pointer',
          background: expanded ? 'var(--ink-base)' : 'transparent'
        }}
      >
        <span style={{ fontWeight: 500 }}>{title}</span>
        <StatusDot status={isPass ? 'passed' : 'failed'} label={isPass ? 'pass' : 'fail'} />
      </div>
      
      {expanded && !isPass && (
        <div style={{ padding: '0 1rem 1rem 1rem', color: 'var(--ink-solid)', lineHeight: 1.5, background: 'var(--brand-bolt)' }}>
          {issue}
        </div>
      )}
    </div>
  )
}

export default function ReviewPage() {
  const { submissionId } = useParams()
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let interval
    const fetchSubmission = async () => {
      try {
        const res = await api.get(`/submissions/${submissionId}`)
        setSubmission(res.data)
        
        // If status is still pending_review, poll every 2s
        if (res.data.status === 'pending_review') {
          interval = setTimeout(fetchSubmission, 2000)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }
    fetchSubmission()
    return () => clearTimeout(interval)
  }, [submissionId])

  if (loading || !submission) return <div className="container" style={{ padding: '2rem' }}>Loading review report...</div>

  // Separate the reviews
  const apiAudit = submission.reviews.find(r => r.review_type === 'api_audit')
  const codeReview = submission.reviews.find(r => r.review_type === 'code_review')
  const totalScore = (apiAudit?.score || 0) + (codeReview?.score || 0)

  // Map the feedback items to rows
  const apiFeedback = apiAudit?.categorized_result?.feedback || []
  const codeFeedback = codeReview?.categorized_result?.feedback || []

  // Create a list of all distinct categories to show pass/fail
  const apiCategories = ['API Maturity', 'Completeness', 'Error Handling', 'REST Conventions']
  const codeCategories = ['Code Quality (Ruff)', 'Security (Bandit)', 'Maintainability (Radon)']

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="mono" style={{ color: 'var(--ink-solid)', marginBottom: '0.5rem', fontWeight: 600 }}>Submission {submission.id.substring(0,8)}</div>
          <h1>Review Report</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: totalScore >= 160 ? 'var(--status-pass)' : 'var(--status-fail)' }}>
            {totalScore} <span style={{ fontSize: '1rem', color: 'var(--ink-solid)' }}>/ 200</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: API Audit */}
        <div className="opaque-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem', background: 'var(--brand-bolt)', color: 'var(--ink-solid)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', borderBottom: '2px solid var(--ink-solid)' }}>
            API DESIGN AUDIT
          </div>
          <div>
            {apiCategories.map((category, idx) => {
              const issue = apiFeedback.find(f => f.category === category)?.issue
              return <ExpandableReviewRow key={category} title={category} issue={issue} delayMs={idx * 150} />
            })}
          </div>
        </div>

        {/* Right Column: Code Review */}
        <div className="opaque-panel" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem', background: 'var(--brand-bolt)', color: 'var(--ink-solid)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '1px', borderBottom: '2px solid var(--ink-solid)' }}>
            CODE REVIEW
          </div>
          <div>
            {submission.status === 'pending_review' ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--status-pending)' }}>Running static analysis in background...</div>
            ) : (
              codeCategories.map((category, idx) => {
                const issue = codeFeedback.find(f => f.category === category)?.issue
                return <ExpandableReviewRow key={category} title={category} issue={issue} delayMs={(apiCategories.length + idx) * 150} />
              })
            )}
          </div>
        </div>

      </div>
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link to="/workspace" className="btn-primary">Return to Workspace</Link>
      </div>

    </div>
  )
}
