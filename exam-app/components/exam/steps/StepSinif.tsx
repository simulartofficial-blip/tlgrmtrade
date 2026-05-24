'use client'

import { GraduationCap } from 'lucide-react'

const SINIFLAR = [
  { value: 5, label: '5. Sınıf', available: false },
  { value: 6, label: '6. Sınıf', available: true },
  { value: 7, label: '7. Sınıf', available: false },
  { value: 8, label: '8. Sınıf', available: false },
]

interface Props {
  onSelect: (sinif: number) => void
}

export function StepSinif({ onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <GraduationCap className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Sınıf Seçin</h2>
        <p className="text-sm text-gray-500 mt-1">Hangi sınıf için sınav hazırlıyorsunuz?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {SINIFLAR.map(({ value, label, available }) => (
          <button
            key={value}
            disabled={!available}
            onClick={() => onSelect(value)}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              available
                ? 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
            }`}
          >
            <span className="text-2xl font-bold text-gray-800">{value}</span>
            <span className="text-sm text-gray-500 mt-1">{label}</span>
            {!available && (
              <span className="absolute top-2 right-2 text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">
                Yakında
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
