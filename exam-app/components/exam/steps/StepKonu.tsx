'use client'

import { Layers } from 'lucide-react'
import { getTopics } from '@/lib/kazanimlar/mat6'

const TOPIC_EMOJIS: Record<string, string> = {
  'Doğal Sayılar': '🔢',
  'Kesirler': '½',
  'Ondalık Gösterim': '📊',
  'Yüzdeler': '%',
  'Tam Sayılar': '±',
  'Oran ve Orantı': '⚖️',
  'Cebir': '🔣',
  'Geometri': '📐',
  'Veri İşleme': '📈',
}

interface Props {
  sinif: number
  ders: string
  onSelect: (konu: string) => void
}

export function StepKonu({ sinif, ders, onSelect }: Props) {
  const topics = getTopics()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Layers className="w-10 h-10 text-blue-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Konu Seçin</h2>
        <p className="text-sm text-gray-500 mt-1">{sinif}. Sınıf {ders} — hangi konudan soru eklemek istiyorsunuz?</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {topics.map(topic => (
          <button
            key={topic}
            onClick={() => onSelect(topic)}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-gray-200 bg-white p-4 gap-2 hover:border-blue-400 hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            <span className="text-2xl">{TOPIC_EMOJIS[topic] ?? '📚'}</span>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{topic}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
