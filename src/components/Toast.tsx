import './Toast.scss'
import { useTaskContext } from '../hooks/useTaskContext'

export default function Toast() {
  const { pendingDelete, toast, undoDelete } = useTaskContext()

  if (!pendingDelete && !toast) return null

  return (
    <div className="toast-stack">
      {toast && (
        <div className={`toast toast--${toast.kind}`} role={toast.kind === 'error' ? 'alert' : 'status'}>
          {toast.text}
        </div>
      )}

      {pendingDelete && (
        <div className="toast" key={pendingDelete.deadline}>
          <div className="toast__row">
            <span role="status">Завдання буде видалено.</span>
            <button className="button button--secondary" type="button" onClick={undoDelete}>
              Скасувати
            </button>
          </div>
          <div className="toast__track" aria-hidden="true">
            <div className="toast__progress" />
          </div>
        </div>
      )}
    </div>
  )
}
