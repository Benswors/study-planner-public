import './Toast.scss'

interface ToastProps {
  kind: 'success' | 'error'
  text: string
}

export default function Toast({ kind, text }: ToastProps) {
  return (
    <div className="toast-stack">
      <div className={`toast toast--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
        {text}
      </div>
    </div>
  )
}
