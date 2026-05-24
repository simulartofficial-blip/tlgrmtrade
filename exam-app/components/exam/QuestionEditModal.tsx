'use client'

import { useState, useEffect } from 'react'
import { Question, QuestionType } from '@/types'
import { Button } from '@/components/ui/button'
import { X, Check } from 'lucide-react'

interface Props {
  question: Question | null
  onSave: (q: Question) => void
  onClose: () => void
}

const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: 'Çoktan Seçmeli',
  open_ended: 'Açık Uçlu',
  true_false: 'Doğru / Yanlış',
  fill_blank: 'Boşluk Doldurma',
}

export function QuestionEditModal({ question, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Question | null>(null)

  useEffect(() => {
    setDraft(question ? { ...question, options: question.options ? [...question.options] : undefined } : null)
  }, [question])

  if (!draft) return null

  const updateOption = (i: number, val: string) => {
    if (!draft.options) return
    const opts = [...draft.options]
    opts[i] = val
    setDraft({ ...draft, options: opts })
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Başlık */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="font-semibold text-gray-900">Soruyu Düzenle</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {TYPE_LABELS[draft.type]} · {draft.kazanim_code}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* İçerik */}
        <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1">
          {/* Soru metni */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Soru Metni
            </label>
            <textarea
              rows={4}
              value={draft.text}
              onChange={e => setDraft({ ...draft, text: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Şıklar — sadece çoktan seçmeli */}
          {draft.type === 'multiple_choice' && draft.options && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Şıklar
              </label>
              <div className="space-y-2">
                {draft.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5 shrink-0 text-right">
                      {['A', 'B', 'C', 'D'][i]})
                    </span>
                    <input
                      value={opt.replace(/^[A-D]\)\s*/, '')}
                      onChange={e => updateOption(i, `${['A', 'B', 'C', 'D'][i]}) ${e.target.value}`)}
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doğru cevap */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Doğru Cevap
            </label>
            {draft.type === 'true_false' ? (
              <div className="flex gap-2">
                {['Doğru', 'Yanlış'].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDraft({ ...draft, correct_answer: v })}
                    className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      draft.correct_answer === v
                        ? v === 'Doğru'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            ) : (
              <input
                value={draft.correct_answer}
                onChange={e => setDraft({ ...draft, correct_answer: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            )}
          </div>

          {/* Açıklama */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Çözüm Açıklaması <span className="font-normal text-gray-400">(opsiyonel)</span>
            </label>
            <input
              value={draft.explanation ?? ''}
              onChange={e => setDraft({ ...draft, explanation: e.target.value })}
              placeholder="Kısa çözüm yolu..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-gray-100">
          <Button variant="secondary" size="sm" onClick={onClose} className="flex-1">
            İptal
          </Button>
          <Button size="sm" onClick={() => { onSave(draft); onClose() }} className="flex-1">
            <Check className="w-4 h-4" />
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  )
}
