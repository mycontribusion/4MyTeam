import { useEffect, useRef, useState } from 'react'
import { X, Camera } from 'lucide-react'

export default function ScannerComponent({ onImport, onClose }) {
    const scannerRef = useRef(null)
    const mountedRef = useRef(true)
    const [status, setStatus] = useState('initializing') // 'initializing' | 'scanning' | 'success' | 'error'
    const [statusMsg, setStatusMsg] = useState('Starting camera…')
    const [importedCount, setImportedCount] = useState(0)

    useEffect(() => {
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
                scannerRef.current
                    .stop()
                    .then(() => scannerRef.current?.clear())
                    .catch(() => {
                        // Camera already stopped or never started
                    })
                scannerRef.current = null
            }
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
                            Import / Scan
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

                {/* QR Viewer */}
                <div className="rounded-2xl overflow-hidden bg-gray-900 mb-4" style={{ minHeight: 260 }}>
                    <div id="qr-reader" className="w-full" />
                </div>

                {/* Status */}
                <div className={`rounded-xl px-4 py-3 text-sm font-medium text-center transition-colors ${statusColors[status]}`}>
                    {status === 'success' && <span className="mr-1.5">✅</span>}
                    {status === 'error' && <span className="mr-1.5">⚠️</span>}
                    {statusMsg}
                </div>

                <button
                    id="btn-cancel-scanner"
                    className="btn-secondary w-full mt-3"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}
