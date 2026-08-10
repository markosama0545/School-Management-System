// src/components/ConfirmationModal.jsx
// Props accepted (compatible with all existing call sites):
//   message     – confirmation body text (required)
//   onConfirm   – called when the confirm button is clicked
//   onCancel    – called when Cancel is clicked
//   loading     – boolean; disables buttons while the action is in-flight
//   confirmText – override the confirm button label (default "Yes, Delete")
//
// The component is rendered conditionally by the parent:
//   {deleteTarget && <ConfirmationModal ... />}
// so it does NOT need an isOpen gate — it renders whenever it's mounted.

function ConfirmationModal({
    message,
    onConfirm,
    onCancel,
    loading = false,
    confirmText = "Yes, Delete",
    // legacy prop aliases (kept for backward-compat if any caller uses them)
    isConfirming,
    title,
}) {
    const busy = loading || isConfirming || false;

    return (
        <div className="modal-overlay">
            <div className="confirm-modal">
                {title && <h3>{title}</h3>}
                <p>{message}</p>
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-primary btn-danger"
                        onClick={onConfirm}
                        disabled={busy}
                        style={{
                            background: "#ef4444",
                            borderColor: "#ef4444",
                        }}
                    >
                        {busy ? "Processing…" : confirmText}
                    </button>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancel}
                        disabled={busy}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
