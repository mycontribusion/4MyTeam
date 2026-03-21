import { useState, useRef, useEffect } from 'react'
import { Plus, Save } from 'lucide-react'

export default function AddPatientForm({ onAdd, onCancel, initialData }) {
    const [name, setName] = useState('')
    const [hospitalNumber, setHospitalNumber] = useState('')
    const [ward, setWard] = useState('')
    const [bed, setBed] = useState('')
    const [note, setNote] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '')
            setHospitalNumber(initialData.hospitalNumber || '')
            setWard(initialData.ward || '')
            setBed(initialData.bed || '')
            setNote(initialData.note || '')
        } else {
            setName('')
            setHospitalNumber('')
            setWard('')
            setBed('')
            setNote('')
        }
    }, [initialData])

    const hospNumRef = useRef(null)
    const wardRef = useRef(null)
    const bedRef = useRef(null)
    const noteRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        const n = name.trim()
        const h = hospitalNumber.trim()
        const w = ward.trim()

        if (!w && !h && !n) {
            setError('Please provide at least a Name, Hospital Number, or Ward.')
            return
        }

        const result = onAdd({ name, hospitalNumber, ward, bed, note })
        if (result === 'duplicate') {
            setError('A patient with this Hospital Number (or identical details) already exists.')
            return
        }
        if (result) {
            setName('')
            setHospitalNumber('')
            setWard('')
            setBed('')
            setNote('')
            setError('')
        }
    }

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            nextRef.current?.focus()
        }
    }

    return (
        <div className="card p-4 mb-6">
            <h2 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
                {initialData ? 'Edit Patient' : 'Add Patient'}
            </h2>
            <form id="add-patient-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div className="col-span-2 md:col-span-2">
                        <label htmlFor="input-name" className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Patient Name
                        </label>
                        <input
                            id="input-name"
                            type="text"
                            className="input-field text-left font-medium text-base"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setError('') }}
                            onKeyDown={(e) => handleKeyDown(e, hospNumRef)}
                            autoComplete="off"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-2">
                        <label htmlFor="input-hospnum" className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Hospital Number
                        </label>
                        <input
                            id="input-hospnum"
                            ref={hospNumRef}
                            type="text"
                            className="input-field text-center font-bold text-base"
                            placeholder="H-123456"
                            value={hospitalNumber}
                            onChange={(e) => { setHospitalNumber(e.target.value); setError('') }}
                            onKeyDown={(e) => handleKeyDown(e, wardRef)}
                            autoComplete="off"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-1">
                        <label htmlFor="input-ward" className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Ward
                        </label>
                        <input
                            id="input-ward"
                            ref={wardRef}
                            type="text"
                            className="input-field text-center font-bold uppercase text-lg tracking-wider"
                            placeholder="A1"
                            value={ward}
                            onChange={(e) => { setWard(e.target.value); setError('') }}
                            onKeyDown={(e) => handleKeyDown(e, bedRef)}
                            maxLength={10}
                            autoCapitalize="characters"
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-1">
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
                            onKeyDown={(e) => handleKeyDown(e, noteRef)}
                            maxLength={10}
                            autoComplete="off"
                            spellCheck={false}
                            inputMode="text"
                        />
                    </div>

                    <div className="col-span-2 md:col-span-4 flex gap-3">
                        <div className="flex-1">
                            <label htmlFor="input-note" className="block text-xs font-semibold text-gray-500 mb-1.5">
                                Note (Optional)
                            </label>
                            <input
                                id="input-note"
                                ref={noteRef}
                                type="text"
                                className="input-field text-left text-sm"
                                placeholder="Requires fasting..."
                                value={note}
                                onChange={(e) => { setNote(e.target.value); setError('') }}
                                autoComplete="off"
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="button"
                                className="btn-secondary px-4 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                onClick={onCancel}
                                aria-label="Cancel adding patient"
                                style={{ minHeight: '48px' }}
                            >
                                Cancel
                            </button>
                            <button
                                id="btn-add-patient"
                                type="submit"
                                className="btn-primary px-4"
                                aria-label={initialData ? "Save changes" : "Add patient"}
                                style={{ minHeight: '48px' }}
                            >
                                {initialData ? (
                                    <>
                                        <Save size={20} className="sm:hidden" strokeWidth={2.5} />
                                        <span className="hidden sm:inline-flex items-center gap-1"><Save size={18} strokeWidth={2.5} /> Save</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} className="sm:hidden" strokeWidth={2.5} />
                                        <span className="hidden sm:inline-flex items-center gap-1"><Plus size={18} strokeWidth={2.5} /> Add</span>
                                    </>
                                )}
                            </button>
                        </div>
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
