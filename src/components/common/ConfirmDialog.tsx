export default function ConfirmDialog({ isOpen, title, message, confirmLabel = "Confirm",
  variant = "danger", onConfirm, onCancel, isLoading = false }: {
  isOpen: boolean; title: string; message: string; confirmLabel?: string;
  variant?: "danger" | "warning" | "info"; onConfirm: () => void; onCancel: () => void; isLoading?: boolean;
}) {
  if (!isOpen) return null;
  const styles = { danger: "bg-red-600 hover:bg-red-700", warning: "bg-yellow-600 hover:bg-yellow-700", info: "bg-blue-600 hover:bg-blue-700" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={isLoading} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} className={`px-4 py-2 text-sm text-white rounded-lg ${styles[variant]} disabled:opacity-50`}>
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
