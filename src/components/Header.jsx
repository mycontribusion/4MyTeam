import { CheckCircle } from 'lucide-react'

export default function Header({ saveFlash, patientCount }) {
    return (
        <header className="bg-blue-700 text-white shadow-lg shadow-blue-900/30 sticky top-0 z-30">
            <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
                {/* Logo + Title */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex-shrink-0 bg-white/20 rounded-xl p-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-bold text-xl leading-tight tracking-tight">4MyTeam</h1>
                        <p className="text-blue-200 text-xs font-medium leading-tight">
                            {patientCount === 0
                                ? 'No patients tracked'
                                : `${patientCount} patient${patientCount !== 1 ? 's' : ''} tracked`}
                        </p>
                    </div>
                </div>

                {/* Saved Locally badge */}
                <div
                    className={`flex-shrink-0 flex items-center gap-1.5 bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1.5 transition-opacity duration-500 pulse-badge ${saveFlash ? 'opacity-100' : 'opacity-60'
                        }`}
                    title="Data saved to this device"
                >
                    <CheckCircle size={13} className="text-green-300" />
                    <span className="text-green-200 text-xs font-semibold whitespace-nowrap">Saved Locally</span>
                </div>
            </div>
        </header>
    )
}
