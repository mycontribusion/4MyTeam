import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'

export default function AddPatientForm({ onAdd }) {
    const [ward, setWard] = useState('')
    const [bed, setBed] = useState('')
    const [error, setError] = useState('')
    const bedRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!ward.trim()) {
            setError('Ward is required.')
            return
        }
        if (!bed.trim()) {
            setError('Bed number is required.')
            return
        }

        const result = onAdd({ ward, bed })
        if (result === 'duplicate') {
            setError(`Ward ${ward.trim().toUpperCase()} Bed ${bed.trim()} is already on the list.`)
            return
        }
        if (result) {
            setWard('')
            setBed('')
            setError('')
        }
    }

    const handleWardKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            bedRef.current?.focus()
        }
    }

    return (
        <div className="card p-4 mb-6">
            <h2 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
                Add Patient
            </h2>
            <form id="add-patient-form" onSubmit={handleSubmit}>
                <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                        <label htmlFor="input-ward" className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Ward
                        </label>
                        <input
                            id="input-ward"
                            type="text"
                            className="input-field text-center font-bold uppercase text-lg tracking-wider"
                            placeholder="A1"
                            value={ward}
                            onChange={(e) => { setWard(e.target.value); setError('') }}
                            onKeyDown={handleWardKeyDown}
                            maxLength={10}
                            autoCapitalize="characters"
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="input-bed" className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Bed No.
                        </label>
                        <input
                            id="input-bed"
                            ref={bedRef}
                            type="text"
                            className="input-field text-center font-bold text-lg"
                            placeholder="12"
                            value={bed}
                            onChange={(e) => { setBed(e.target.value); setError('') }}
                            maxLength={10}
                            autoComplete="off"
                            spellCheck={false}
                            inputMode="text"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            id="btn-add-patient"
                            type="submit"
                            className="btn-primary px-4"
                            aria-label="Add patient"
                        >
                            <Plus size={20} strokeWidth={2.5} />
                            <span className="hidden sm:inline">Add</span>
                        </button>
                    </div>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        {error}
                    </div>
                )}
            </form>
        </div>
    )
}
