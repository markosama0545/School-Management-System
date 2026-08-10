// src/components/ConfirmationModal.jsx
function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel, confirmText = "Yes, Delete", isConfirming = false }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="confirm-modal">
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="form-actions">
                    <button
                        type="button"
                        className="delete-button"
                        onClick={onConfirm}
                        disabled={isConfirming}
                    >
                        {isConfirming ? "Processing..." : confirmText}
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                        disabled={isConfirming}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
