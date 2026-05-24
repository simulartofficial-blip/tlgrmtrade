'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { GenerateRequest, QuestionType, DifficultyLevel, Question } from '@/types'
import { getTopics } from '@/lib/kazanimlar/mat6'
import { List, PenLine, ToggleLeft, Pencil } from 'lucide-react'

const QUESTION_TYPES: { value: QuestionType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'multiple_choice',
    label: 'Çoktan Seçmeli',
    description: 'A, B, C, D şıklı',
    icon: <List className="w-5 h-5" />,
  },
  {
    value: 'open_ended',
    label: 'Açık Uçlu',
    description: 'Yazılı cevap',
    icon: <PenLine className="w-5 h-5" />,
  },
  {
    value: 'true_false',
    label: 'Doğru / Yanlış',
    description: 'İki seçenekli',
    icon: <ToggleLeft className="w-5 h-5" />,
  },
  {
    value: 'fill_blank',
    label: 'Boşluk Doldurma',
    description: 'Eksik kelime',
    icon: <Pencil className="w-5 h-5" />,
  },
]

interface Props {
  onGenerated: (questions: Question[]) => void
}

export function GenerateForm({ onGenerated }: Props) {
  const topics = getTopics()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<GenerateRequest>({
    topic: topics[0],
    grade: 6,
    subject: 'Matematik',
    difficulty: 'orta',
    question_types: ['multiple_choice'],
    count: 5,
  })

  const toggleType = (type: QuestionType) => {
    setForm(prev => ({
      ...prev,
      question_types: prev.question_types.includes(type)
        ? prev.question_types.filter(t => t !== type)
        : [...prev.question_types, type],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.question_types.length) {
      setError('En az bir soru tipi seçin.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onGenerated(data.questions)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Beklenmeyen hata')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Select
        label="Konu"
        value={form.topic}
        onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
      >
        {topics.map(t => <option key={t} value={t}>{t}</option>)}
      </Select>

      <Select
        label="Zorluk Seviyesi"
        value={form.difficulty}
        onChange={e => setForm(p => ({ ...p, difficulty: e.target.value as DifficultyLevel }))}
      >
        <option value="kolay">Kolay</option>
        <option value="orta">Orta</option>
        <option value="zor">Zor</option>
      </Select>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Soru Tipi
          <span className="ml-1 font-normal text-gray-400">(birden fazla seçilebilir)</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_TYPES.map(({ value, label, description, icon }) => {
            const selected = form.question_types.includes(value)
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
                <div className={`${selected ? 'text-blue-500' : 'text-gray-400'}`}>{icon}</div>
                <span className="text-xs font-semibold leading-tight">{label}</span>
                <span className={`text-xs ${selected ? 'text-blue-500' : 'text-gray-400'}`}>{description}</span>
              </button>
            )
          })}
        </div>
        {!form.question_types.length && (
          <p className="mt-1 text-xs text-amber-600">En az bir soru tipi seçin</p>
        )}
      </div>

      <Input
        label="Soru Sayısı (1-20)"
        type="number"
        min={1}
        max={20}
        value={form.count}
        onChange={e => setForm(p => ({ ...p, count: Number(e.target.value) }))}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Soru Üret
      </Button>
    </form>
  )
}
