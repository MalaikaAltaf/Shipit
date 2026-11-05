export default function StatusDot({ status, label }) {
  // Map our backend statuses to our CSS classes
  const statusClass = status === 'passed' ? 'pass' 
                    : status === 'failed' ? 'fail'
                    : 'pending';
  
  return (
    <span className={`status-dot ${statusClass}`}>
      {label || status}
    </span>
  )
}
