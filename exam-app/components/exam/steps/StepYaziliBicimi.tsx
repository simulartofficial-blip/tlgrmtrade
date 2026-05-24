'use client'

import { ClipboardList } from 'lucide-react'
import { QuestionType } from '@/types'

export type YaziliBicimi = 'test' | 'klasik' | 'karma'

export const BICIM_TIPLERI: Record<YaziliBicimi, QuestionType[]> = {
  test: ['multiple_choice'],
  klasik: ['open_ended', 'true_false', 'fill_blank'],
  karma: ['multiple_choice', 'open_ended', 'true_false', 'fill_blank'],
}

const BICIMLER: { value: YaziliBicimi; label: string; description: string; emoji: string }[] = [
  {
    value: 'test',
    label: 'Test',
    description: 'Yalnızca çoktan seçmeli sorular (A, B, C, D)',
    emoji: '🔘',
  },
  {
    value: 'klasik',
    label: 'Klasik Yazılı',
    description: 'Açık uçlu, boşluk doldurma ve doğru/yanlış soruları',
    emoji: '✏️',
  },
  {
    value: 'karma',
    label: 'Karma',
    description: 'Test ve klasik soruların bir arada bulunduğu yazılı',
    emoji: '📋',
  },
]

interface Props {
  sinif: number
  ders: string
  onSelect: (bicim: YaziliBicimi) => void
}

export function StepYaziliBicimi({ sinif, ders, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <ClipboardList className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Yazılı Biçimi</h2>
        <p className="text-sm text-gray-500 mt-1">
          {sinif}. Sınıf {ders} yazılısı nasıl olacak?
        </p>
      </div>
      <div className="space-y-3">
        {BICIMLER.map(({ value, label, description, emoji }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="w-full flex items-center gap-4 rounded-2xl border-2 border-gray-200 bg-white p-4 text-left hover:border-blue-400 hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer group"
          >
            <span className="text-3xl shrink-0">{emoji}</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-blue-700">{label}</p>
              <p className="text-sm text-gray-500 mt-0.5">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
