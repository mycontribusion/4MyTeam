import { Trash2, DoorOpen, X, AlertCircle } from 'lucide-react'

export default function RemovalChoiceDialog({ patientName, onDischarge, onMortality, onCancel }) {
    return (
        <div
            className="modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div
                className="modal-box max-w-sm"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="removal-title"
            >
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl">
                            <AlertCircle size={24} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div>
                        <h2 id="removal-title" className="text-xl font-bold text-gray-900 dark:text-white group">
                            Remove <span className="text-blue-600 dark:text-blue-400 underline decoration-blue-200 underline-offset-4">{patientName}</span>?
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Please select the reason for removal. Mortalities will be archived for records.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onDischarge}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
                        >
                            <DoorOpen size={20} className="group-hover:scale-110 transition-transform" />
                            Discharge Patient
                        </button>

                        <button
                            onClick={onMortality}
                            className="w-full py-4 flex items-center justify-center gap-2 rounded-xl font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-800"
                        >
                            <Trash2 size={20} />
                            Mark as Mortality
                        </button>

                        <button
                            onClick={onCancel}
                            className="w-full py-3 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                            Keep on List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
