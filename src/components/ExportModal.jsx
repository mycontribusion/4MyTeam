import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Copy, Share2, CheckCircle, ClipboardPaste } from 'lucide-react'

export default function ExportModal({ patients, listName, onClose }) {
    const [copiedText, setCopiedText] = useState(false)
    const [copiedData, setCopiedData] = useState(false)

    // 1. QR Data: Optimized for scanning (excludes notes to keep QR density low)
    const qrCompressed = patients.map((p) => {
        const obj = {}
        if (p.ward) obj.w = p.ward
        if (p.bed) obj.b = p.bed
        if (p.name) obj.n = p.name
        if (p.hospitalNumber) obj.h = p.hospitalNumber
        if (p.critical) obj.c = true
        return obj
    })
    const qrData = JSON.stringify(qrCompressed)

    // 2. Full Data: Includes everything for Copy/Paste sharing
    const fullCompressed = patients.map((p) => {
        const obj = {}
        if (p.ward) obj.w = p.ward
        if (p.bed) obj.b = p.bed
        if (p.name) obj.n = p.name
        if (p.hospitalNumber) obj.h = p.hospitalNumber
        if (p.note) obj.t = p.note
        if (p.critical) obj.c = true
        return obj
    })
    const fullData = JSON.stringify(fullCompressed)

    // Human-readable text
    const textData = patients
        .map((p) => {
            const parts = []
            if (p.name) parts.push(`Name: ${p.name}`)
            if (p.hospitalNumber) parts.push(`Hosp: ${p.hospitalNumber}`)
            if (p.ward) parts.push(`Ward: ${p.ward}`)
            if (p.bed) parts.push(`Bed: ${p.bed}`)
            let line = parts.join(' | ')
            if (p.note) line += `\nNote: ${p.note}`
            return line
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
            setCopiedText(true)
            setTimeout(() => setCopiedText(false), 2500)
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
                        <h2 id="export-title" className="font-bold text-gray-900 text-xl">Export: {listName}</h2>
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
                        {qrData.length > 2300 ? (
                            <div className="w-[260px] h-[260px] flex items-center justify-center text-center p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                                <div>
                                    <p className="mb-2">⚠️ Too many patients to generate a scanable QR code.</p>
                                    <p className="text-[10px] opacity-70">Please use "Copy Code" or "Share Text" instead.</p>
                                </div>
                            </div>
                        ) : (
                            <QRCodeSVG
                                id="qr-code-svg"
                                value={qrData}
                                size={260}
                                level="L"
                                includeMargin={false}
                                fgColor="#111827"
                                bgColor="#ffffff"
                            />
                        )}
                    </div>
                </div>

                {/* Patient count summary */}
                <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4 text-center">
                    <span className="text-blue-700 font-semibold text-sm">
                        {patients.length} patient{patients.length !== 1 ? 's' : ''} encoded in QR
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        id="btn-copy-data"
                        className="btn-secondary flex-1 px-2"
                        onClick={async () => {
                            // Robust fallback for non-HTTPS dev environments or strict mobile Safari
                            const fallbackCopy = (text) => {
                                const textArea = document.createElement("textarea");
                                textArea.value = text;
                                textArea.style.top = "0";
                                textArea.style.left = "0";
                                textArea.style.position = "fixed";
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();
                                try {
                                    return document.execCommand('copy');
                                } catch (err) {
                                    return false;
                                } finally {
                                    document.body.removeChild(textArea);
                                }
                            }

                            try {
                                if (navigator.clipboard && window.isSecureContext) {
                                    await navigator.clipboard.writeText(fullData)
                                } else {
                                    if (!fallbackCopy(fullData)) throw new Error('Fallback failed')
                                }
                                setCopiedData(true)
                                setTimeout(() => setCopiedData(false), 2000)
                            } catch {
                                alert('Could not copy data code. Your browser may block clipboard access outside of secure connections.')
                            }
                        }}
                    >
                        {copiedData ? (
                            <span className="inline-flex items-center gap-1.5 text-green-600"><CheckCircle size={16} /> Copied!</span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5"><ClipboardPaste size={16} /> Copy Code</span>
                        )}
                    </button>

                    <button
                        id="btn-copy-text"
                        className="btn-secondary flex-1 px-2"
                        onClick={handleCopyOrShare}
                    >
                        {copiedText ? (
                            <span className="inline-flex items-center gap-1.5 text-green-600"><CheckCircle size={16} /> Copied!</span>
                        ) : navigator.share ? (
                            <span className="inline-flex items-center gap-1.5"><Share2 size={16} /> Share Text</span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5"><Copy size={16} /> Copy Text</span>
                        )}
                    </button>
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-2 mb-2 px-6 italic">
                    Note: QR excludes notes for faster scanning.
                </p>

                <p className="text-center text-xs text-gray-400 mt-2">
                    <strong>Copy Code</strong> to paste into another device.<br />
                    <strong>Share Text</strong> to send readable info via WhatsApp.
                </p>
            </div>
        </div>
    )
}
