import { useState, useMemo } from 'react'
import PatientCard from './PatientCard'
import { ArrowUpDown } from 'lucide-react'

const SORT_OPTIONS = [
    { value: 'none', label: 'Default' },
    { value: 'ward', label: 'Ward' },
    { value: 'bed', label: 'Bed' },
    { value: 'name', label: 'Name' },
    { value: 'hospnum', label: 'Hosp No.' },
]

export default function PatientList({ patients, onDelete, onEdit }) {
    const [sortBy, setSortBy] = useState('none')

    const sorted = useMemo(() => {
        if (sortBy === 'none') return patients
        return [...patients].sort((a, b) => {
            let av = '', bv = ''
            if (sortBy === 'ward') { av = a.ward || ''; bv = b.ward || '' }
            if (sortBy === 'bed') { av = a.bed || ''; bv = b.bed || '' }
            if (sortBy === 'name') { av = a.name || ''; bv = b.name || '' }
            if (sortBy === 'hospnum') { av = a.hospitalNumber || ''; bv = b.hospitalNumber || '' }
            return av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' })
        })
    }, [patients, sortBy])

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">
                        Patient List
                    </h2>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {patients.length}
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
                className="flex flex-col gap-3"
                aria-label="Patient list"
            >
                {sorted.map((patient) => (
                    <PatientCard
                        key={patient.id}
                        patient={patient}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}
