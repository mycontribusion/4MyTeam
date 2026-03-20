import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, Share2, CheckCircle } from 'lucide-react'

export default function ExportModal({ patients, onClose }) {
    const [copied, setCopied] = useState(false)

    // Compress to minimal JSON: omit empty values to maximize QR capacity
    const compressed = patients.map((p) => {
        const obj = {}
        if (p.ward) obj.w = p.ward
        if (p.bed) obj.b = p.bed
        if (p.name) obj.n = p.name
        if (p.hospitalNumber) obj.h = p.hospitalNumber
        if (p.note) obj.t = p.note
        return obj
    })
    const qrData = JSON.stringify(compressed)

    // Human-readable text
    const textData = patients
        .map((p) => {
            const parts = []
            if (p.name) parts.push(`Name: ${p.name}`)
            if (p.hospitalNumber) parts.push(`Hosp: ${p.hospitalNumber}`)
            if (p.ward) parts.push(`Ward: ${p.ward}`)
            if (p.bed) parts.push(`Bed: ${p.bed}`)
            if (p.note) parts.push(`Note: ${p.note}`)
            return parts.join(' | ')
        })
        .join('\n')

    const handleCopyOrShare = async () => {
        const shareText = `4MyTeam Patient List:\n${textData}`

        // Try Web Share API first (mobile)
        if (navigator.share) {
            try {
                await navigator.share({ title: '4MyTeam Patient List', text: shareText })
                return
            } catch {
                // User cancelled or not supported, fall through
            }
        }

        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(shareText)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        } catch {
            // Clipboard unavailable (very old browser)
            alert(shareText)
        }
    }

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="export-title">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 id="export-title" className="font-bold text-gray-900 text-xl">Export Team List</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Scan with another device to import</p>
                    </div>
                    <button
                        id="btn-close-export"
                        className="btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:ring-gray-200"
                        onClick={onClose}
                        aria-label="Close export modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-5">
                    <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 shadow-sm inline-block">
                        <QRCodeSVG
                            id="qr-code-svg"
                            value={qrData}
                            size={220}
                            level="M"
                            includeMargin={false}
                            fgColor="#111827"
                            bgColor="#ffffff"
                        />
                    </div>
                </div>

                {/* Patient count summary */}
                <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4 text-center">
                    <span className="text-blue-700 font-semibold text-sm">
                        {patients.length} patient{patients.length !== 1 ? 's' : ''} encoded in QR
                    </span>
                </div>

                {/* Actions */}
                <button
                    id="btn-copy-text"
                    className="btn-secondary w-full"
                    onClick={handleCopyOrShare}
                >
                    {copied ? (
                        <>
                            <CheckCircle size={18} className="text-green-500" />
                            <span className="text-green-600">Copied to clipboard!</span>
                        </>
                    ) : navigator.share ? (
                        <>
                            <Share2 size={18} />
                            Share as Text
                        </>
                    ) : (
                        <>
                            <Copy size={18} />
                            Copy as Text
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-3">
                    Text fallback for devices without camera
                </p>
            </div>
        </div>
    )
}
