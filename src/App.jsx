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
    const [activeTab, setActiveTab] = useState('my_team') // 'my_team' | 'other_team'
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
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingPatient, setEditingPatient] = useState(null)
    const [deleteCandidateId, setDeleteCandidateId] = useState(null)
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

    const savePatient = useCallback(({ team = 'my_team', name, hospitalNumber, ward, bed, note }) => {
        const n = name.trim()
        const h = hospitalNumber.trim()
        const w = ward.trim().toUpperCase()
        const b = bed.trim()
        const t = note.trim()

        if (!w && !h && !n) return false

        // Duplicate check: same hospital number OR same ward+bed combo
        const exists = patients.some((p) => {
            if (editingPatient && p.id === editingPatient.id) return false;

            if (h && p.hospitalNumber === h) return true;
            if (w && b && p.ward === w && p.bed === b) return true;
            return false;
        })

        if (exists) return 'duplicate'

        if (editingPatient) {
            setPatients((prev) => prev.map(p =>
                p.id === editingPatient.id
                    ? { ...p, team, name: n, hospitalNumber: h, ward: w, bed: b, note: t }
                    : p
            ))
            setEditingPatient(null)
        } else {
            setPatients((prev) => [
                ...prev,
                { id: generateId(), team, name: n, hospitalNumber: h, ward: w, bed: b, note: t },
            ])
            // Form stays open so the user can add the next patient
        }
        return true
    }, [patients, editingPatient])

    const startEditing = useCallback((patient) => {
        setEditingPatient(patient)
        setShowAddForm(false)
        // Scroll to top to ensure form is visible
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

    const cancelForm = useCallback(() => {
        setShowAddForm(false)
        setEditingPatient(null)
    }, [])

    const confirmDeletePatient = useCallback((id) => {
        setDeleteCandidateId(id)
    }, [])

    const deletePatient = useCallback(() => {
        if (deleteCandidateId) {
            setPatients((prev) => prev.filter((p) => p.id !== deleteCandidateId))
            setDeleteCandidateId(null)
        }
    }, [deleteCandidateId])

    const clearAll = useCallback(() => {
        setPatients(prev => prev.filter(p => (p.team || 'my_team') !== activeTab))
        setShowConfirmClear(false)
    }, [activeTab])

    // Merge imported patients, deduplicate
    const importPatients = useCallback((incoming) => {
        setPatients((prev) => {
            const existingHospNums = new Set(prev.filter(p => p.hospitalNumber).map(p => p.hospitalNumber))
            const existingCombos = new Set(prev.filter(p => !p.hospitalNumber).map(p => `${p.name}|${p.ward}|${p.bed}`))

            const newOnes = incoming
                .map((p) => ({
                    id: generateId(),
                    team: p.team || activeTab,
                    name: (p.n || p.name || '').trim(),
                    hospitalNumber: (p.h || p.hospitalNumber || '').trim(),
                    ward: (p.w || p.ward || '').trim().toUpperCase(),
                    bed: (p.b || p.bed || '').trim(),
                    note: (p.t || p.note || '').trim(),
                }))
                .filter((p) => {
                    if (!p.name && !p.hospitalNumber && !p.ward) return false;
                    if (p.hospitalNumber && existingHospNums.has(p.hospitalNumber)) return false;
                    if (!p.hospitalNumber && existingCombos.has(`${p.name}|${p.ward}|${p.bed}`)) return false;

                    if (p.hospitalNumber) existingHospNums.add(p.hospitalNumber);
                    else existingCombos.add(`${p.name}|${p.ward}|${p.bed}`);
                    return true;
                })
            return [...prev, ...newOnes]
        })
        setShowScanner(false)
    }, [activeTab])

    const activePatients = patients.filter(p => (p.team || 'my_team') === activeTab)
    const myTeamCount = patients.filter(p => (p.team || 'my_team') === 'my_team').length
    const otherTeamCount = patients.filter(p => p.team === 'other_team').length

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header saveFlash={saveFlash} patientCount={patients.length} />

            <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-6 pb-28">
                {!showAddForm && !editingPatient ? (
                    <button
                        className="btn-primary w-full shadow-md mb-6 py-4 text-base"
                        onClick={() => setShowAddForm(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        Add New Patient
                    </button>
                ) : (
                    <AddPatientForm
                        initialData={editingPatient}
                        initialTeam={activeTab}
                        onAdd={savePatient}
                        onCancel={cancelForm}
                    />
                )}

                {/* Tabs */}
                {!showAddForm && !editingPatient && (
                    <div className="flex border-b border-gray-200 mb-4 mt-2">
                        <button
                            onClick={() => setActiveTab('my_team')}
                            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'my_team' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            My Team
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'my_team' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                {myTeamCount}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('other_team')}
                            className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center justify-center gap-2 ${activeTab === 'other_team' ? 'border-purple-600 text-purple-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            List B
                            <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'other_team' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                                {otherTeamCount}
                            </span>
                        </button>
                    </div>
                )}

                {activePatients.length === 0 ? (
                    <EmptyState onAddClick={() => setShowAddForm(true)} />
                ) : (
                    <PatientList
                        patients={activePatients}
                        onEdit={startEditing}
                        onDelete={confirmDeletePatient}
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
                        onClick={() => activePatients.length > 0 && setShowConfirmClear(true)}
                        disabled={activePatients.length === 0}
                        aria-label={`Clear ${activeTab === 'my_team' ? 'My Team' : 'List B'}`}
                    >
                        Clear {activeTab === 'my_team' ? 'My Team' : 'List B'}
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
                            disabled={activePatients.length === 0}
                            aria-label="Export patient list as QR code"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /><rect width="3" height="3" x="6" y="6" rx=".5" /><rect width="3" height="3" x="17" y="6" rx=".5" /><rect width="3" height="3" x="6" y="17" rx=".5" /><path d="M21 14h-3v3h3" /><path d="M18 21v-3" /></svg>
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showExport && (
                <ExportModal
                    patients={activePatients}
                    listName={activeTab === 'my_team' ? 'My Team' : 'List B'}
                    onClose={() => setShowExport(false)}
                />
            )}
            {showScanner && (
                <ScannerComponent
                    listName={activeTab === 'my_team' ? 'My Team' : 'List B'}
                    onImport={importPatients}
                    onClose={() => setShowScanner(false)}
                />
            )}
            {showConfirmClear && (
                <ConfirmDialog
                    title={`Clear ${activeTab === 'my_team' ? 'My Team' : 'List B'}?`}
                    message={`This will remove all ${activePatients.length} patient${activePatients.length !== 1 ? 's' : ''} from ${activeTab === 'my_team' ? 'My Team' : 'Other Team'}. This cannot be undone.`}
                    confirmLabel="Yes, Clear"
                    onConfirm={clearAll}
                    onCancel={() => setShowConfirmClear(false)}
                />
            )}
            {deleteCandidateId && (
                <ConfirmDialog
                    title="Remove Patient?"
                    message={`Are you sure you want to remove ${patients.find(p => p.id === deleteCandidateId)?.name || 'this patient'}? This cannot be undone.`}
                    confirmLabel="Yes, Remove"
                    onConfirm={deletePatient}
                    onCancel={() => setDeleteCandidateId(null)}
                />
            )}
        </div>
    )
}
