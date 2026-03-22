import { useEffect, useRef, useState } from 'react'
import { X, Camera } from 'lucide-react'

export default function ScannerComponent({ onImport, listName, onClose }) {
    const scannerRef = useRef(null)
    const mountedRef = useRef(true)
    const [mode, setMode] = useState('camera') // 'camera' | 'paste'
    const [pasteData, setPasteData] = useState('')
    const [status, setStatus] = useState('initializing') // 'initializing' | 'scanning' | 'success' | 'error'
    const [statusMsg, setStatusMsg] = useState('Starting camera…')
    const [importedCount, setImportedCount] = useState(0)

    useEffect(() => {
        if (mode !== 'camera') return
        mountedRef.current = true
        let html5QrCode = null

        const startScanner = async () => {
            try {
                const { Html5Qrcode } = await import('html5-qrcode')
                if (!mountedRef.current) return

                html5QrCode = new Html5Qrcode('qr-reader')
                scannerRef.current = html5QrCode

                await html5QrCode.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        if (!mountedRef.current) return
                        try {
                            const parsed = JSON.parse(decodedText)
                            if (!Array.isArray(parsed)) throw new Error('Not an array')
                            setImportedCount(parsed.length)
                            setStatus('success')
                            setStatusMsg(`Found ${parsed.length} patient${parsed.length !== 1 ? 's' : ''}! Importing…`)

                            // Stop scanner then import (slight delay for UX)
                            setTimeout(() => {
                                if (mountedRef.current) {
                                    onImport(parsed)
                                }
                            }, 800)
                        } catch {
                            setStatus('error')
                            setStatusMsg('Invalid QR code. Please scan a 4MyTeam export code.')
                            // Reset to scanning after 2s
                            setTimeout(() => {
                                if (mountedRef.current && status !== 'success') {
                                    setStatus('scanning')
                                    setStatusMsg('Point camera at QR code')
                                }
                            }, 2000)
                        }
                    },
                    () => {
                        // Scan failure – normal, ignore
                    }
                )

                if (mountedRef.current) {
                    setStatus('scanning')
                    setStatusMsg('Point camera at QR code')
                }
            } catch (err) {
                if (mountedRef.current) {
                    setStatus('error')
                    setStatusMsg(
                        err.name === 'NotAllowedError'
                            ? 'Camera permission denied. Please allow camera access.'
                            : 'Could not start camera. Please check permissions.'
                    )
                }
            }
        }

        startScanner()

        return () => {
            mountedRef.current = false
            if (scannerRef.current) {
                try {
                    scannerRef.current
                        .stop()
                        .then(() => scannerRef.current?.clear())
                        .catch(() => { })
                } catch (error) {
                    // Throws synchronously if not started
                    try {
                        scannerRef.current.clear()
                    } catch (e) { }
                }
                scannerRef.current = null
            }
        }
    }, [mode]) // restart scanner if returning to camera mode

    const statusColors = {
        initializing: 'bg-gray-100 text-gray-600',
        scanning: 'bg-blue-50 text-blue-700',
        success: 'bg-green-50 text-green-700',
        error: 'bg-red-50 text-red-600',
    }

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="scanner-title">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 id="scanner-title" className="font-bold text-gray-900 text-xl flex items-center gap-2">
                            <Camera size={20} className="text-blue-700" />
                            Import to {listName}
                        </h2>
                        <p className="text-gray-500 text-sm mt-0.5">Scan a 4MyTeam QR export code</p>
                    </div>
                    <button
                        id="btn-close-scanner"
                        className="btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-200"
                        onClick={onClose}
                        aria-label="Close scanner"
                    >
                        <X size={20} />
                    </button>
                </div>

                {mode === 'camera' ? (
                    <>
                        {/* QR Viewer */}
                        <div className="rounded-2xl overflow-hidden bg-gray-900 mb-4" style={{ minHeight: 260 }}>
                            <div id="qr-reader" className="w-full" />
                        </div>

                        {/* Status */}
                        <div className={`rounded-xl px-4 py-3 text-sm font-medium text-center transition-colors mb-4 ${statusColors[status]}`}>
                            {status === 'success' && <span className="mr-1.5">✅</span>}
                            {status === 'error' && <span className="mr-1.5">⚠️</span>}
                            {statusMsg}
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                className="btn-primary w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-none"
                                onClick={() => setMode('paste')}
                            >
                                Paste Data Code Instead
                            </button>
                            <button className="btn-secondary w-full" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-4">
                            <textarea
                                className="input-field text-sm font-mono h-32 resize-none"
                                placeholder='Paste data code here...'
                                value={pasteData}
                                onChange={(e) => setPasteData(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                className="btn-primary w-full"
                                disabled={!pasteData.trim()}
                                onClick={() => {
                                    // 1. Scrub smart quotes that mobile keyboards often insert
                                    const cleaned = pasteData.trim().replace(/[“”]/g, '"').replace(/[‘’]/g, "'")

                                    // 2. Check if they accidentally pasted the human-readable "Share Text"
                                    if (cleaned.includes('4MyTeam Patient List:') || cleaned.includes('Name: ')) {
                                        alert('It looks like you pasted the readable "Share Text". Please go back to Export and click "Copy Code" instead.')
                                        return
                                    }

                                    try {
                                        const parsed = JSON.parse(cleaned)
                                        if (!Array.isArray(parsed)) throw new Error('Not an array')
                                        onImport(parsed)
                                    } catch {
                                        alert('Invalid data code. Please ensure you copied the exact code from the "Copy Code" button.')
                                    }
                                }}
                            >
                                Import Code
                            </button>
                            <button
                                className="btn-secondary w-full border-none text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                onClick={() => { setPasteData(''); setMode('camera') }}
                            >
                                Use Camera Instead
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
