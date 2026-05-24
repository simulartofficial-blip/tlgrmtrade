'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { GenerateRequest, QuestionType, DifficultyLevel, Question } from '@/types'
import { getTopics } from '@/lib/kazanimlar/mat6'

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'multiple_choice', label: 'Çoktan Seçmeli' },
  { value: 'open_ended', label: 'Açık Uçlu' },
  { value: 'true_false', label: 'Doğru / Yanlış' },
  { value: 'fill_blank', label: 'Boşluk Doldurma' },
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
        <label className="text-sm font-medium text-gray-700 block mb-2">Soru Tipleri</label>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.question_types.includes(value)}
                onChange={() => toggleType(value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
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
