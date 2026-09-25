import { useStore } from '../context/StoreContext';
import Toast from './Toast';

function ToastHost() {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-host" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDone={() => dismissToast(toast.id)} />
      ))}
    </div>
  );
}

export default ToastHost;
