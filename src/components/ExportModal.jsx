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

    const downloadCSV = () => {
        const headers = ['Ward', 'Bed', 'Name', 'HospitalNumber', 'Notes', 'Critical']
        const rows = patients.map(p => [
            p.ward || '',
            p.bed || '',
            p.name || '',
            p.hospitalNumber || '',
            `"${(p.note || '').replace(/"/g, '""')}"`,
            p.critical ? 'YES' : 'NO'
        ])
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `Handover_${listName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-box max-w-md w-[95%]" role="dialog" aria-modal="true" aria-labelledby="export-title">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 id="export-title" className="font-bold text-gray-900 text-xl">Export Control</h2>
                        <p className="text-gray-500 text-sm mt-0.5">{listName} | {patients.length} Patients</p>
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

                {/* QR Code Section */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 border border-gray-100">
                    <div className="flex justify-center mb-3">
                        <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm inline-block">
                            {qrData.length > 2300 ? (
                                <div className="w-[180px] h-[180px] flex items-center justify-center text-center p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-100">
                                    <p>⚠️ List too large for QR. Use Copy Code instead.</p>
                                </div>
                            ) : (
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={qrData}
                                    size={180}
                                    level="L"
                                    includeMargin={false}
                                    fgColor="#111827"
                                    bgColor="#ffffff"
                                />
                            )}
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-gray-500 font-medium">
                        Scan to sync with another device
                    </p>
                </div>

                {/* Export Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <button
                        className="btn-secondary py-3 px-1 flex flex-col items-center justify-center gap-1 min-h-[70px]"
                        onClick={async () => {
                            const fallbackCopy = (text) => {
                                const textArea = document.createElement("textarea");
                                textArea.value = text;
                                textArea.style.position = "fixed";
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();
                                try { return document.execCommand('copy'); } catch { return false; }
                                finally { document.body.removeChild(textArea); }
                            }
                            try {
                                if (navigator.clipboard && window.isSecureContext) {
                                    await navigator.clipboard.writeText(fullData)
                                } else {
                                    if (!fallbackCopy(fullData)) throw new Error()
                                }
                                setCopiedData(true)
                                setTimeout(() => setCopiedData(false), 2000)
                            } catch { alert('Clipboard error') }
                        }}
                    >
                        {copiedData ? (
                            <CheckCircle size={20} className="text-green-600" />
                        ) : (
                            <ClipboardPaste size={20} className="text-blue-600" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider">Copy Code</span>
                    </button>

                    <button
                        className="btn-secondary py-3 px-1 flex flex-col items-center justify-center gap-1 min-h-[70px]"
                        onClick={handleCopyOrShare}
                    >
                        {copiedText ? (
                            <CheckCircle size={20} className="text-green-600" />
                        ) : (
                            <Share2 size={20} className="text-purple-600" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{navigator.share ? 'Share Text' : 'Copy Text'}</span>
                    </button>

                    <button
                        className="btn-secondary py-3 px-1 flex flex-col items-center justify-center gap-1 min-h-[70px]"
                        onClick={downloadCSV}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider">CSV Export</span>
                    </button>

                    <button
                        className="btn-secondary py-3 px-1 flex flex-col items-center justify-center gap-1 min-h-[70px]"
                        onClick={handlePrint}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect width="12" height="8" x="6" y="14" /></svg>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Print PDF</span>
                    </button>
                </div>

                <p className="text-center text-[10px] text-gray-400 italic px-2">
                    QR excludes personal notes to maintain fast scanning.
                </p>
            </div>
        </div>
    )
}
