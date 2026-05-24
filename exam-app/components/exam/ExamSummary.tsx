'use client'

import { useState } from 'react'
import { Question, QuestionType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QuestionEditModal } from './QuestionEditModal'
import { Trash2, Download, Eye, Save, FileText, Pencil } from 'lucide-react'

const typeBadge: Record<QuestionType, string> = {
  multiple_choice: 'bg-blue-100 text-blue-700',
  open_ended: 'bg-green-100 text-green-700',
  true_false: 'bg-yellow-100 text-yellow-700',
  fill_blank: 'bg-purple-100 text-purple-700',
}

const typeShort: Record<QuestionType, string> = {
  multiple_choice: 'ÇS',
  open_ended: 'AU',
  true_false: 'DY',
  fill_blank: 'BD',
}

const difficultyColor: Record<string, string> = {
  kolay: 'text-green-600',
  orta: 'text-yellow-600',
  zor: 'text-red-600',
}

interface Props {
  questions: Question[]
  onChange: (questions: Question[]) => void
  onSave: (title: string) => Promise<void>
  isSaving: boolean
  savedId: string | null
}

export function ExamSummary({ questions, onChange, onSave, isSaving, savedId }: Props) {
  const [title, setTitle] = useState('6. Sınıf Matematik Yazılısı')
  const [teacher, setTeacher] = useState('')
  const [school, setSchool] = useState('')
  const [includeAnswers, setIncludeAnswers] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editing, setEditing] = useState<Question | null>(null)

  const remove = (id: string) => onChange(questions.filter(q => q.id !== id))

  const updateQuestion = (updated: Question) =>
    onChange(questions.map(q => q.id === updated.id ? updated : q))

  const handleExport = async (preview = false) => {
    setExporting(true)
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, teacher_name: teacher, school, questions, include_answers: includeAnswers }),
      })
      const html = await res.text()
      if (preview) {
        const blob = new Blob([html], { type: 'text/html' })
        window.open(URL.createObjectURL(blob), '_blank')
      } else {
        const win = window.open('', '_blank')
        if (win) { win.document.write(html); win.document.close(); win.focus(); setTimeout(() => { win.print(); win.close() }, 500) }
      }
    } finally {
      setExporting(false)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-48 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl p-8">
        <FileText className="w-10 h-10 mb-3 text-gray-300" />
        <p className="font-medium text-sm">Sınav henüz boş</p>
        <p className="text-xs mt-1">Sol taraftan kazanım seçip soru üretin</p>
      </div>
    )
  }

  const grouped = questions.reduce<Record<string, Question[]>>((acc, q) => {
    const key = q.kazanim_code
    if (!acc[key]) acc[key] = []
    acc[key].push(q)
    return acc
  }, {})

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Başlık + özet */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Sınav Özeti</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {questions.length} soru · {Object.keys(grouped).length} kazanım
            </p>
          </div>
          {savedId && <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">Kaydedildi</span>}
        </div>

        {/* Soru listesi — kazanım bazlı */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {Object.entries(grouped).map(([code, qs]) => (
            <div key={code} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600">{code}</span>
                <span className="text-xs text-gray-400 truncate">{qs[0].kazanim_description}</span>
              </div>
              {qs.map((q, i) => (
                <div
                  key={q.id}
                  className="flex items-start gap-2 px-3 py-2.5 border-b last:border-0 border-gray-50 group hover:bg-gray-50 transition-colors"
                >
                  <span className="text-xs text-gray-400 shrink-0 w-5 text-right mt-0.5">{i + 1}.</span>
                  <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${typeBadge[q.type]}`}>
                    {typeShort[q.type]}
                  </span>
                  <span className={`shrink-0 text-xs font-medium ${difficultyColor[q.difficulty]}`}>
                    {q.difficulty.charAt(0).toUpperCase()}
                  </span>
                  <p className="flex-1 text-xs text-gray-700 leading-relaxed line-clamp-2 min-w-0">{q.text}</p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button
                      onClick={() => setEditing(q)}
                      className="text-gray-400 hover:text-blue-500 transition-colors p-0.5 rounded"
                      title="Düzenle"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(q.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* PDF Ayarları */}
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 space-y-3">
          <button
            onClick={() => setShowSettings(s => !s)}
            className="w-full text-left text-sm font-medium text-gray-700 flex items-center justify-between"
          >
            PDF Ayarları
            <span className="text-xs text-gray-400">{showSettings ? '▲' : '▼'}</span>
          </button>
          {showSettings && (
            <div className="space-y-2">
              <Input label="Sınav Başlığı" value={title} onChange={e => setTitle(e.target.value)} />
              <Input label="Öğretmen Adı" value={teacher} onChange={e => setTeacher(e.target.value)} placeholder="Ad Soyad" />
              <Input label="Okul" value={school} onChange={e => setSchool(e.target.value)} placeholder="Okul adı" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeAnswers}
                  onChange={e => setIncludeAnswers(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Cevap anahtarı ekle</span>
              </label>
            </div>
          )}
        </div>

        {/* Aksiyonlar */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" loading={exporting} onClick={() => handleExport(true)}>
            <Eye className="w-4 h-4" /> Önizle
          </Button>
          <Button size="sm" loading={exporting} onClick={() => handleExport(false)}>
            <Download className="w-4 h-4" /> PDF İndir
          </Button>
        </div>
        <Button variant="ghost" size="sm" loading={isSaving} onClick={() => onSave(title)} className="border border-gray-200">
          <Save className="w-4 h-4" /> Sınavı Kaydet
        </Button>
      </div>

      {/* Düzenleme modali */}
      <QuestionEditModal
        question={editing}
        onSave={updateQuestion}
        onClose={() => setEditing(null)}
      />
    </>
  )
}
