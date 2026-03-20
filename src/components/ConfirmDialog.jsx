import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
    return (
        <div
            className="modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div
                className="modal-box"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-message"
            >
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="bg-red-100 rounded-full p-4">
                        <AlertTriangle size={28} className="text-red-600" />
                    </div>

                    <div>
                        <h2 id="confirm-title" className="font-bold text-gray-900 text-xl">{title}</h2>
                        <p id="confirm-message" className="text-gray-500 text-sm mt-2 leading-relaxed">{message}</p>
                    </div>

                    <div className="flex flex-col gap-2 w-full mt-1">
                        <button
                            id="btn-confirm-action"
                            className="btn-danger w-full"
                            onClick={onConfirm}
                        >
                            {confirmLabel}
                        </button>
                        <button
                            id="btn-cancel-confirm"
                            className="btn-secondary w-full"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
