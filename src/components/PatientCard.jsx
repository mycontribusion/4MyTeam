import { Trash2, Pencil } from 'lucide-react'

export default function PatientCard({ patient, onEdit, onDelete }) {
    const { id, name, hospitalNumber, ward, bed, note } = patient

    // Generate a color based on ward or name or id string for visual variety
    const colorStr = ward || name || id || ''
    const wardColors = [
        'bg-blue-100 text-blue-800 border-blue-200',
        'bg-purple-100 text-purple-800 border-purple-200',
        'bg-teal-100 text-teal-800 border-teal-200',
        'bg-orange-100 text-orange-800 border-orange-200',
        'bg-pink-100 text-pink-800 border-pink-200',
        'bg-indigo-100 text-indigo-800 border-indigo-200',
    ]
    const hash = String(colorStr).split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0)
    const colorIdx = Math.abs(hash) % wardColors.length
    const badgeColor = wardColors[colorIdx]

    return (
        <div
            className="card p-4 flex flex-col sm:flex-row gap-4 group"
            role="listitem"
        >
            <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">

                {/* Ward/Bed or Initial Badge */}
                <div className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl border-2 px-3 py-2 text-center min-w-[64px] min-h-[64px] ${badgeColor}`}>
                    {ward || bed ? (
                        <>
                            {ward && <div className="text-xs font-semibold uppercase tracking-wider opacity-70 leading-none mb-1">{ward}</div>}
                            {bed && <div className="text-xl font-extrabold leading-tight">{bed}</div>}
                            {!bed && ward && <div className="text-xl font-extrabold leading-tight">-</div>}
                        </>
                    ) : (
                        <div className="text-2xl font-extrabold uppercase leading-none">
                            {name ? name.charAt(0) : '?'}
                        </div>
                    )}
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        {name && <div className="text-lg font-bold text-gray-900 leading-tight overflow-x-auto whitespace-nowrap">{name}</div>}
                        {hospitalNumber && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                                {hospitalNumber}
                            </span>
                        )}
                    </div>
                    {(!name && !hospitalNumber) && (
                        <div className="text-sm font-medium text-gray-500 italic">No name provided</div>
                    )}
                    {note && <div className="text-sm text-gray-600 mt-1 overflow-y-auto" style={{ whiteSpace: 'pre-wrap', maxHeight: '5.5rem' }}>{note}</div>}
                </div>
            </div>

            {/* Actions (moved to top right on mobile, aligned center on desktop) */}
            <div className="flex justify-end sm:items-center -mt-2 sm:mt-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <button
                    className="btn-icon text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:ring-blue-200 flex-shrink-0"
                    onClick={() => onEdit(patient)}
                    aria-label="Edit patient"
                    title="Edit patient"
                >
                    <Pencil size={18} strokeWidth={2} />
                </button>
                <button
                    id={`btn-delete-${id}`}
                    className="btn-icon text-gray-400 hover:text-red-600 hover:bg-red-50 focus:ring-red-200 flex-shrink-0"
                    onClick={() => onDelete(id)}
                    aria-label="Remove patient"
                    title="Remove patient"
                >
                    <Trash2 size={18} strokeWidth={2} />
                </button>
            </div>
        </div>
    )
}
