import { X } from 'lucide-react'

export default function FeedbackModal({ onClose }) {
    return (
        <div
            className="modal-backdrop"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="modal-box dark:bg-gray-800" role="dialog" aria-modal="true" aria-labelledby="feedback-title">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 id="feedback-title" className="text-xl font-bold text-gray-900 dark:text-white">Feedback & Contact</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">We'd love to hear from you</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                {/* Contact Links */}
                <div className="flex flex-col gap-3">
                    {/* Email */}
                    <a
                        href="mailto:ahmadmusamuhd@gmail.com"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group border border-blue-100 dark:border-blue-800"
                    >
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="16" x="2" y="4" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-0.5">Email</div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">Send an Email</div>
                        </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/2347030061764"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors group border border-green-100 dark:border-green-800"
                    >
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-0.5">WhatsApp</div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Message on WhatsApp</div>
                        </div>
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/ahmad-m-musa-b93587156/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors group border border-sky-100 dark:border-sky-800"
                    >
                        <div className="w-10 h-10 rounded-xl bg-sky-700 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <div className="text-xs font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest mb-0.5">LinkedIn</div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">Ahmad M. Musa</div>
                        </div>
                    </a>
                </div>

                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
                    Built with ❤️ for healthcare teams
                </p>
            </div>
        </div>
    )
}
