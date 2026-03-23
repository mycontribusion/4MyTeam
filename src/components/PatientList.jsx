import { useState, useMemo } from 'react'
import PatientCard from './PatientCard'
import { ArrowUpDown, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react'

const SORT_OPTIONS = [
    { value: 'none', label: 'Default' },
    { value: 'ward', label: 'Ward' },
    { value: 'bed', label: 'Bed' },
    { value: 'name', label: 'Name' },
    { value: 'hospnum', label: 'Hosp No.' },
]

export default function PatientList({ patients, onDelete, onEdit, onReview, onResetReviews }) {
    const [sortBy, setSortBy] = useState('none')
    const [isReviewedOpen, setIsReviewedOpen] = useState(false)

    const activePatients = patients.filter(p => !p.reviewed)
    const reviewedPatients = patients.filter(p => p.reviewed)

    const sortPatients = (list) => {
        if (sortBy === 'none') return list
        return [...list].sort((a, b) => {
            let av = '', bv = ''
            if (sortBy === 'ward') { av = a.ward || ''; bv = b.ward || '' }
            if (sortBy === 'bed') { av = a.bed || ''; bv = b.bed || '' }
            if (sortBy === 'name') { av = a.name || ''; bv = b.name || '' }
            if (sortBy === 'hospnum') { av = a.hospitalNumber || ''; bv = b.hospitalNumber || '' }
            return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' })
        })
    }

    const sortedActive = useMemo(() => sortPatients(activePatients), [activePatients, sortBy, sortPatients])
    const sortedReviewed = useMemo(() => sortPatients(reviewedPatients), [reviewedPatients, sortBy, sortPatients])

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">
                        Patient List
                    </h2>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {activePatients.length}
                    </span>
                </div>

                {/* Sort controls */}
                <div className="flex items-center gap-1.5">
                    <ArrowUpDown size={13} className="text-gray-400 flex-shrink-0" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-xs text-gray-600 font-medium bg-gray-100 hover:bg-gray-200 border-0 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                        aria-label="Sort patients by"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div
                role="list"
                className="flex flex-col gap-3 mb-6"
                aria-label="Patient list"
            >
                {sortedActive.map((patient) => (
                    <PatientCard
                        key={patient.id}
                        patient={patient}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onReview={onReview}
                    />
                ))}
                {sortedActive.length === 0 && reviewedPatients.length > 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        All patients reviewed! Great job! 🎉
                    </div>
                )}
            </div>

            {reviewedPatients.length > 0 && (
                <div className="mt-4 border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold"
                            onClick={() => setIsReviewedOpen(!isReviewedOpen)}
                        >
                            {isReviewedOpen ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
                            Reviewed Patients ({reviewedPatients.length})
                        </button>
                        <button
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border-none cursor-pointer"
                            onClick={onResetReviews}
                        >
                            <RotateCcw size={15} />
                            Reset All
                        </button>
                    </div>

                    {isReviewedOpen && (
                        <div role="list" className="flex flex-col gap-3 opacity-80" aria-label="Reviewed patient list">
                            {sortedReviewed.map((patient) => (
                                <PatientCard
                                    key={patient.id}
                                    patient={patient}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onReview={onReview}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
