import PatientCard from './PatientCard'

export default function PatientList({ patients, onDelete }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">
                    Patient List
                </h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    {patients.length}
                </span>
            </div>
            <div
                role="list"
                className="flex flex-col gap-3"
                aria-label="Patient list"
            >
                {patients.map((patient) => (
                    <PatientCard
                        key={patient.id}
                        patient={patient}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    )
}
