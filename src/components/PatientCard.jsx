import { Trash2, Pencil, CheckCircle2 } from 'lucide-react'
import { useState, useRef } from 'react'

export default function PatientCard({ patient, onEdit, onDelete, onReview }) {
    const { id, name, hospitalNumber, ward, bed, note, reviewed, critical } = patient

    const [offsetX, setOffsetX] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const startX = useRef(null)

    const handlePointerDown = (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        // Don't intercept pointer if clicking on a button
        if (e.target.closest('button')) return;

        startX.current = e.clientX;
        setIsDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
    }
    const handlePointerMove = (e) => {
        if (!isDragging || startX.current === null) return;
        const currentX = e.clientX;
        let diff = currentX - startX.current;
        if (diff > 120) diff = 120 + (diff - 120) * 0.2;
        if (diff < -120) diff = -120 + (diff + 120) * 0.2;
        setOffsetX(diff);
    }
    const handlePointerUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);

        if (offsetX > 80 && onReview) {
            onReview(id, !reviewed);
        } else if (offsetX < -80) {
            onDelete(id);
        }
        setOffsetX(0);
        startX.current = null;
    }

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
        <div className="relative overflow-hidden rounded-2xl" role="listitem">
            {/* Background Actions */}
            <div className={`absolute inset-0 flex justify-between items-center px-6 transition-colors duration-200 ${offsetX > 0 ? (reviewed ? 'bg-gray-200' : 'bg-green-100') : (offsetX < 0 ? 'bg-red-100' : 'bg-transparent')}`}>
                <div className={`font-bold tracking-widest text-lg flex items-center gap-2 transition-opacity ${offsetX > 20 ? 'opacity-100' : 'opacity-0'} ${reviewed ? 'text-gray-600' : 'text-green-700'}`}>
                    <CheckCircle2 size={24} />
                    {reviewed ? 'UN-REVIEW' : 'REVIEWED'}
                </div>
                <div className={`font-bold tracking-widest text-lg flex items-center gap-2 transition-opacity ${offsetX < -20 ? 'opacity-100 text-red-600' : 'opacity-0'}`}>
                    DELETE
                    <Trash2 size={24} />
                </div>
            </div>

            {/* Fore Card */}
            <div
                className={`card p-4 flex flex-col sm:flex-row gap-4 group relative z-10 touch-pan-y
                    ${isDragging ? 'transition-none' : 'transition-transform duration-300'} 
                    ${reviewed ? 'opacity-70 bg-gray-50 grayscale-[15%]' : critical ? 'bg-red-50/40 border-red-200 shadow-sm shadow-red-100/50' : 'bg-white'}`}
                style={{ transform: `translateX(${offsetX}px)` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
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
                            {critical && !reviewed && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white animate-pulse tracking-tighter">
                                    CRITICAL
                                </span>
                            )}
                            {name && <div className={`text-lg font-bold leading-tight overflow-x-auto whitespace-nowrap ${reviewed ? 'line-through text-gray-500' : 'text-gray-900'}`}>{name}</div>}
                            {hospitalNumber && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis ${reviewed ? 'bg-gray-200 text-gray-500 line-through' : 'bg-gray-100 text-gray-800'}`}>
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
                </div>
            </div>
        </div>
    )
}
