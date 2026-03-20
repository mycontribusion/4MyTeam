import { Trash2 } from 'lucide-react'

export default function PatientCard({ patient, onDelete }) {
    const { id, ward, bed } = patient

    // Generate a color based on ward string for visual variety
    const wardColors = [
        'bg-blue-100 text-blue-800 border-blue-200',
        'bg-purple-100 text-purple-800 border-purple-200',
        'bg-teal-100 text-teal-800 border-teal-200',
        'bg-orange-100 text-orange-800 border-orange-200',
        'bg-pink-100 text-pink-800 border-pink-200',
        'bg-indigo-100 text-indigo-800 border-indigo-200',
    ]
    const colorIdx = ward.charCodeAt(0) % wardColors.length
    const wardColor = wardColors[colorIdx]

    return (
        <div
            className="card p-4 flex items-center gap-4 group"
            role="listitem"
            aria-label={`Ward ${ward}, Bed ${bed}`}
        >
            {/* Ward badge */}
            <div className={`flex-shrink-0 rounded-xl border-2 px-3 py-2 text-center min-w-[56px] ${wardColor}`}>
                <div className="text-xs font-semibold uppercase tracking-wider opacity-70">Ward</div>
                <div className="text-lg font-extrabold leading-tight">{ward}</div>
            </div>

            {/* Bed info */}
            <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bed</div>
                <div className="text-2xl font-extrabold text-gray-900 leading-tight">{bed}</div>
            </div>

            {/* Hospital icon accent */}
            <div className="hidden sm:flex flex-shrink-0 bg-gray-50 rounded-xl p-2 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 6v4" />
                    <path d="M14 14H10" />
                    <path d="M15 18H9" />
                    <path d="M3 2h18v20H3z" />
                    <path d="M12 2v4" />
                </svg>
            </div>

            {/* Delete button */}
            <button
                id={`btn-delete-${id}`}
                className="btn-icon text-gray-300 hover:text-red-500 hover:bg-red-50 focus:ring-red-200 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                onClick={() => onDelete(id)}
                aria-label={`Remove Ward ${ward} Bed ${bed}`}
                title="Remove patient"
            >
                <Trash2 size={18} strokeWidth={2} />
            </button>
        </div>
    )
}
