'use client'

import { useState } from 'react'
import { Kazanim, Question, QuestionType, DifficultyLevel } from '@/types'
import { Button } from '@/components/ui/button'
import { List, PenLine, ToggleLeft, Pencil, Sparkles } from 'lucide-react'

const QUESTION_TYPES: { value: QuestionType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: 'multiple_choice', label: 'Çoktan Seçmeli', description: 'A, B, C, D şıklı', icon: <List className="w-5 h-5" /> },
  { value: 'open_ended', label: 'Açık Uçlu', description: 'Yazılı cevap', icon: <PenLine className="w-5 h-5" /> },
  { value: 'true_false', label: 'Doğru / Yanlış', description: 'İki seçenekli', icon: <ToggleLeft className="w-5 h-5" /> },
  { value: 'fill_blank', label: 'Boşluk Doldurma', description: 'Eksik kelime', icon: <Pencil className="w-5 h-5" /> },
]

interface Props {
  kazanim: Kazanim
  onGenerated: (questions: Question[]) => void
}

export function StepUret({ kazanim, onGenerated }: Props) {
  const [types, setTypes] = useState<QuestionType[]>(['multiple_choice'])
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('orta')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const toggleType = (t: QuestionType) =>
    setTypes(prev =>
      prev.includes(t) ? (prev.length > 1 ? prev.filter(x => x !== t) : prev) : [...prev, t]
    )

  const handleGenerate = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: kazanim.topic,
          grade: kazanim.grade,
          subject: kazanim.subject,
          difficulty,
          question_types: types,
          count,
          kazanim_code: kazanim.code,
          kazanim_description: kazanim.description,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onGenerated(data.questions)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <span className="shrink-0 text-xs font-mono font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-lg mt-0.5">
            {kazanim.code}
          </span>
          <p className="text-sm text-blue-800 leading-relaxed">{kazanim.description}</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Soru Tipi
          <span className="ml-1 font-normal text-gray-400">(birden fazla seçilebilir)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_TYPES.map(({ value, label, description, icon }) => {
            const selected = types.includes(value)
            return (
              <button
                key={value}
                type="button"
                onClick={() => toggleType(value)}
                className={`flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                  selected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={selected ? 'text-blue-500' : 'text-gray-400'}>{icon}</div>
                <span className="text-xs font-semibold leading-tight">{label}</span>
                <span className={`text-xs ${selected ? 'text-blue-500' : 'text-gray-400'}`}>{description}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">Zorluk Seviyesi</label>
        <div className="flex gap-2">
          {(['kolay', 'orta', 'zor'] as DifficultyLevel[]).map(d => (
            <button
              key={d}
              type="button"
              onClick={() => setDifficulty(d)}
              className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium capitalize transition-all focus:outline-none ${
                difficulty === d
                  ? d === 'kolay' ? 'border-green-500 bg-green-50 text-green-700'
                    : d === 'orta' ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
              }`}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Soru Sayısı: <span className="text-blue-600 font-bold">{count}</span>
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={count}
          onChange={e => setCount(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span><span>10</span><span>20</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleGenerate} loading={loading} className="w-full" size="lg">
        <Sparkles className="w-4 h-4" />
        {count} Soru Üret
      </Button>
    </div>
  )
}
