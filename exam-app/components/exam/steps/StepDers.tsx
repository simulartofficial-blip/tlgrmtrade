'use client'

import { BookOpen } from 'lucide-react'

const DERSLER = [
  { value: 'Matematik', emoji: '📐', available: true },
  { value: 'Türkçe', emoji: '📖', available: false },
  { value: 'Fen Bilimleri', emoji: '🔬', available: false },
  { value: 'Sosyal Bilgiler', emoji: '🌍', available: false },
]

interface Props {
  sinif: number
  onSelect: (ders: string) => void
}

export function StepDers({ sinif, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <BookOpen className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Ders Seçin</h2>
        <p className="text-sm text-gray-500 mt-1">{sinif}. sınıf için hangi dersten sınav yapacaksınız?</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {DERSLER.map(({ value, emoji, available }) => (
          <button
            key={value}
            disabled={!available}
            onClick={() => onSelect(value)}
            className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              available
                ? 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
            }`}
          >
            <span className="text-3xl">{emoji}</span>
            <span className="text-sm font-semibold text-gray-700">{value}</span>
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
