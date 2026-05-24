'use client'

import { Target } from 'lucide-react'
import { getKazanimsByTopic } from '@/lib/kazanimlar/mat6'
import { Kazanim } from '@/types'

interface Props {
  konu: string
  onSelect: (kazanim: Kazanim) => void
}

export function StepKazanim({ konu, onSelect }: Props) {
  const kazanimlar = getKazanimsByTopic(konu)

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Kazanım Seçin</h2>
        <p className="text-sm text-gray-500 mt-1">
          <span className="font-medium text-gray-700">{konu}</span> konusundan hangi kazanım için soru üretmek istiyorsunuz?
        </p>
      </div>
      <div className="space-y-2">
        {kazanimlar.map(k => (
          <button
            key={k.id}
            onClick={() => onSelect(k)}
            className="w-full flex items-start gap-3 rounded-xl border-2 border-gray-200 bg-white p-4 text-left hover:border-blue-400 hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer group"
          >
            <span className="shrink-0 text-xs font-mono font-bold text-blue-500 bg-blue-50 group-hover:bg-blue-100 px-2 py-1 rounded-lg mt-0.5">
              {k.code}
            </span>
            <span className="text-sm text-gray-700 leading-relaxed">{k.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
