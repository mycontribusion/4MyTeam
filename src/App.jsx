import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import AddPatientForm from './components/AddPatientForm'
import PatientList from './components/PatientList'
import ExportModal from './components/ExportModal'
import ScannerComponent from './components/ScannerComponent'
import ConfirmDialog from './components/ConfirmDialog'
import EmptyState from './components/EmptyState'

const STORAGE_KEY = '4myteam_patients'

function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export default function App() {
    const [patients, setPatients] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })
    const [showExport, setShowExport] = useState(false)
    const [showScanner, setShowScanner] = useState(false)
    const [showConfirmClear, setShowConfirmClear] = useState(false)
    const [saveFlash, setSaveFlash] = useState(false)

    // Persist to localStorage on every change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(patients))
            setSaveFlash(true)
            const t = setTimeout(() => setSaveFlash(false), 1200)
            return () => clearTimeout(t)
        } catch {
            // localStorage full / unavailable
        }
    }, [patients])

    const addPatient = useCallback(({ ward, bed }) => {
        const wardTrimmed = ward.trim().toUpperCase()
        const bedTrimmed = bed.trim()
        if (!wardTrimmed || !bedTrimmed) return false

        // Duplicate check
        const exists = patients.some(
            (p) => p.ward === wardTrimmed && p.bed === bedTrimmed
        )
        if (exists) return 'duplicate'

        setPatients((prev) => [
            ...prev,
            { id: generateId(), ward: wardTrimmed, bed: bedTrimmed },
        ])
        return true
    }, [patients])

    const deletePatient = useCallback((id) => {
        setPatients((prev) => prev.filter((p) => p.id !== id))
    }, [])

    const clearAll = useCallback(() => {
        setPatients([])
        setShowConfirmClear(false)
    }, [])

    // Merge imported patients, deduplicate by ward+bed
    const importPatients = useCallback((incoming) => {
        setPatients((prev) => {
            const existingKeys = new Set(prev.map((p) => `${p.ward}|${p.bed}`))
            const newOnes = incoming
                .filter((p) => {
                    const w = (p.w || p.ward || '').trim().toUpperCase()
                    const b = (p.b || p.bed || '').trim()
                    return w && b && !existingKeys.has(`${w}|${b}`)
                })
                .map((p) => ({
                    id: generateId(),
                    ward: (p.w || p.ward || '').trim().toUpperCase(),
                    bed: (p.b || p.bed || '').trim(),
                }))
            return [...prev, ...newOnes]
        })
        setShowScanner(false)
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header saveFlash={saveFlash} patientCount={patients.length} />

            <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-6 pb-28">
                <AddPatientForm onAdd={addPatient} />

                {patients.length === 0 ? (
                    <EmptyState />
                ) : (
                    <PatientList
                        patients={patients}
                        onDelete={deletePatient}
                    />
                )}
            </main>

            {/* Bottom action bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200 shadow-lg z-40">
                <div className="max-w-2xl mx-auto px-4 py-3 flex gap-2 justify-between items-center">
                    {/* Clear All */}
                    <button
                        id="btn-clear-all"
                        className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50 focus:ring-red-200 text-sm px-3"
                        onClick={() => patients.length > 0 && setShowConfirmClear(true)}
                        disabled={patients.length === 0}
                        aria-label="Clear all patients"
                    >
                        Clear All
                    </button>

                    <div className="flex gap-2">
                        {/* Import / Scan */}
                        <button
                            id="btn-import"
                            className="btn-secondary text-sm"
                            onClick={() => setShowScanner(true)}
                            aria-label="Import patient list by scanning QR code"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /><rect width="3" height="3" x="6" y="6" rx=".5" /><rect width="3" height="3" x="17" y="6" rx=".5" /><rect width="3" height="3" x="6" y="17" rx=".5" /><path d="M21 14h-3v3h3" /><path d="M18 21v-3" /></svg>
                            Import
                        </button>

                        {/* Export */}
                        <button
                            id="btn-export"
                            className="btn-primary text-sm"
                            onClick={() => setShowExport(true)}
                            disabled={patients.length === 0}
                            aria-label="Export patient list as QR code"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /><rect width="3" height="3" x="6" y="6" rx=".5" /><rect width="3" height="3" x="17" y="6" rx=".5" /><rect width="3" height="3" x="6" y="17" rx=".5" /><path d="M21 14h-3v3h3" /><path d="M18 21v-3" /></svg>
                            Export QR
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showExport && (
                <ExportModal patients={patients} onClose={() => setShowExport(false)} />
            )}
            {showScanner && (
                <ScannerComponent
                    onImport={importPatients}
                    onClose={() => setShowScanner(false)}
                />
            )}
            {showConfirmClear && (
                <ConfirmDialog
                    title="Clear All Patients?"
                    message={`This will remove all ${patients.length} patient${patients.length !== 1 ? 's' : ''} from your list. This cannot be undone.`}
                    confirmLabel="Yes, Clear All"
                    onConfirm={clearAll}
                    onCancel={() => setShowConfirmClear(false)}
                />
            )}
        </div>
    )
}
