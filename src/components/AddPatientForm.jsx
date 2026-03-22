import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Save } from 'lucide-react'

export default function AddPatientForm({ onAdd, onCancel, initialData, initialTeam = 'my_team' }) {
    const [team, setTeam] = useState(initialTeam)
    const [name, setName] = useState('')
    const [hospitalNumber, setHospitalNumber] = useState('')
    const [ward, setWard] = useState('')
    const [bed, setBed] = useState('')
    const [note, setNote] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (initialData) {
            setTeam(initialData.team || 'my_team')
            setName(initialData.name || '')
            setHospitalNumber(initialData.hospitalNumber || '')
            setWard(initialData.ward || '')
            setBed(initialData.bed || '')
            setNote(initialData.note || '')
        } else {
            setTeam(initialTeam)
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

    const autoGrow = useCallback((el) => {
        if (!el) return
        el.style.height = 'auto'
        el.style.height = Math.min(el.scrollHeight, 96) + 'px'
    }, [])

    useEffect(() => {
        autoGrow(noteRef.current)
    }, [note, autoGrow])

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

        const result = onAdd({ team, name, hospitalNumber, ward, bed, note })
        if (result === 'duplicate') {
            setError('A patient with this Hospital Number or Ward/Bed already exists.')
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
        <div className="card p-3 sm:p-4 mb-6">
            <h2 className="hidden sm:block font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
                {initialData ? 'Edit Patient' : 'Add Patient'}
            </h2>
            <form id="add-patient-form" onSubmit={handleSubmit}>
                {/* Team Selector Indicator */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-4 sm:mb-5">
                    <button
                        type="button"
                        onClick={() => setTeam('my_team')}
                        className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-lg transition-all ${team === 'my_team' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Team
                    </button>
                    <button
                        type="button"
                        onClick={() => setTeam('other_team')}
                        className={`flex-1 text-xs sm:text-sm font-semibold py-2 rounded-lg transition-all ${team === 'other_team' ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Other Team
                    </button>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4 mb-3 sm:mb-4">

                    {/* Row 1: Name (Full width) */}
                    <div>
                        <label htmlFor="input-name" className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Patient Name
                        </label>
                        <input
                            id="input-name"
                            type="text"
                            className="input-field text-left font-medium text-sm"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => {
                                // Strip out any numbers
                                let val = e.target.value.replace(/[0-9]/g, '')
                                if (!e.nativeEvent.isComposing) {
                                    val = val.replace(/(?:^|\s)\S/g, (c) => c.toUpperCase())
                                    setName(val)
                                } else {
                                    setName(val)
                                }
                                setError('')
                            }}
                            onKeyDown={(e) => handleKeyDown(e, hospNumRef)}
                            autoCapitalize="words"
                            autoComplete="off"
                        />
                    </div>

                    {/* Row 2: HospNum (45%) + Ward (35%) + Bed (20%) */}
                    <div className="flex gap-2 sm:gap-3">
                        <div className="min-w-0" style={{ flex: '45 1 0%' }}>
                            <label htmlFor="input-hospnum" className="block text-xs font-semibold text-gray-500 mb-1.5">
                                Hospital Number
                            </label>
                            <input
                                id="input-hospnum"
                                ref={hospNumRef}
                                type="text"
                                className="input-field text-center font-bold text-sm"
                                placeholder="H-123456"
                                value={hospitalNumber}
                                onChange={(e) => { setHospitalNumber(e.target.value); setError('') }}
                                onKeyDown={(e) => handleKeyDown(e, wardRef)}
                                autoComplete="off"
                            />
                        </div>
                        <div className="min-w-0" style={{ flex: '35 1 0%' }}>
                            <label htmlFor="input-ward" className="block text-xs font-semibold text-gray-500 mb-1.5">
                                Ward
                            </label>
                            <input
                                id="input-ward"
                                ref={wardRef}
                                type="text"
                                className="input-field text-center font-bold uppercase text-sm tracking-wider"
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
                        <div className="min-w-0" style={{ flex: '20 1 0%' }}>
                            <label htmlFor="input-bed" className="block text-xs font-semibold text-gray-500 mb-1.5">
                                Bed
                            </label>
                            <input
                                id="input-bed"
                                ref={bedRef}
                                type="text"
                                className="input-field text-center font-bold text-sm"
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
                    </div>

                    {/* Row 3: Note (Full width) */}
                    <div>
                        <label htmlFor="input-note" className="block text-xs font-semibold text-gray-500 mb-1.5">
                            Note
                        </label>
                        <textarea
                            id="input-note"
                            ref={noteRef}
                            rows={1}
                            className="input-field text-left text-sm resize-none"
                            placeholder="Requires fasting..."
                            value={note}
                            onChange={(e) => { setNote(e.target.value); setError(''); autoGrow(e.target) }}
                            autoComplete="off"
                            style={{ minHeight: '40px', maxHeight: '96px', overflowY: 'auto' }}
                        />
                    </div>

                    {/* Row 4: Buttons (Right aligned) */}
                    <div className="flex justify-end gap-2 mt-1">
                        <button
                            type="button"
                            className="btn-secondary px-4 text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                            onClick={onCancel}
                            aria-label="Close patient form"
                            style={{ minHeight: '40px', fontSize: '0.875rem' }}
                        >
                            Close
                        </button>
                        <button
                            id="btn-add-patient"
                            type="submit"
                            className="btn-primary px-5"
                            aria-label={initialData ? "Save changes" : "Add patient"}
                            style={{ minHeight: '40px', fontSize: '0.875rem' }}
                        >
                            {initialData ? (
                                <>
                                    <span className="inline-flex items-center gap-1"><Save size={16} strokeWidth={2.5} /> Save</span>
                                </>
                            ) : (
                                <>
                                    <span className="inline-flex items-center gap-1"><Plus size={16} strokeWidth={2.5} /> Add</span>
                                </>
                            )}
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
