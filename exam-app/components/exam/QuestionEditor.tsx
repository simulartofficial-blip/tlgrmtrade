'use client'

import { useState } from 'react'
import { Question, QuestionType } from '@/types'
import { Button } from '@/components/ui/button'
import { Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'

const typeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Çoktan Seçmeli',
  open_ended: 'Açık Uçlu',
  true_false: 'Doğru / Yanlış',
  fill_blank: 'Boşluk Doldurma',
}

const typeBadgeColor: Record<QuestionType, string> = {
  multiple_choice: 'bg-blue-100 text-blue-700',
  open_ended: 'bg-green-100 text-green-700',
  true_false: 'bg-yellow-100 text-yellow-700',
  fill_blank: 'bg-purple-100 text-purple-700',
}

interface QuestionCardProps {
  question: Question
  index: number
  onUpdate: (q: Question) => void
  onDelete: () => void
}

function QuestionCard({ question, index, onUpdate, onDelete }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-3 p-3 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <GripVertical className="w-4 h-4 text-gray-400 shrink-0" />
        <span className="font-semibold text-gray-500 text-sm w-6">{index + 1}.</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeBadgeColor[question.type]}`}>
          {typeLabels[question.type]}
        </span>
        <span className="text-xs text-gray-400 font-mono">{question.kazanim_code}</span>
        <p className="flex-1 text-sm text-gray-700 truncate">{question.text}</p>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Soru Metni</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
              rows={3}
              value={question.text}
              onChange={e => onUpdate({ ...question, text: e.target.value })}
            />
          </div>

          {question.type === 'multiple_choice' && question.options && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Şıklar</label>
              <div className="mt-1 space-y-2">
                {question.options.map((opt, i) => (
                  <input
                    key={i}
                    className="block w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={opt}
                    onChange={e => {
                      const opts = [...question.options!]
                      opts[i] = e.target.value
                      onUpdate({ ...question, options: opts })
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Doğru Cevap</label>
            <input
              className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={question.correct_answer}
              onChange={e => onUpdate({ ...question, correct_answer: e.target.value })}
            />
          </div>

          {question.explanation && (
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Açıklama</label>
              <input
                className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={question.explanation}
                onChange={e => onUpdate({ ...question, explanation: e.target.value })}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="danger" size="sm" onClick={onDelete}>
              <Trash2 className="w-3.5 h-3.5" />
              Sil
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  questions: Question[]
  onChange: (questions: Question[]) => void
}

export function QuestionEditor({ questions, onChange }: Props) {
  const update = (index: number, q: Question) => {
    const updated = [...questions]
    updated[index] = q
    onChange(updated)
  }

  const remove = (index: number) => {
    onChange(questions.filter((_, i) => i !== index))
  }

  if (!questions.length) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{questions.length} Soru Üretildi</h2>
        <span className="text-xs text-gray-500">Düzenlemek için soruya tıklayın</span>
      </div>
      {questions.map((q, i) => (
        <QuestionCard
          key={q.id}
          question={q}
          index={i}
          onUpdate={updated => update(i, updated)}
          onDelete={() => remove(i)}
        />
      ))}
    </div>
  )
}
