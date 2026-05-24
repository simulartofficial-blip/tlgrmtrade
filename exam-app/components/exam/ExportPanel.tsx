'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Question } from '@/types'
import { Download, Eye } from 'lucide-react'

interface Props {
  questions: Question[]
}

export function ExportPanel({ questions }: Props) {
  const [title, setTitle] = useState('6. Sınıf Matematik Sınavı')
  const [teacherName, setTeacherName] = useState('')
  const [school, setSchool] = useState('')
  const [includeAnswers, setIncludeAnswers] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleExport = async (preview = false) => {
    setLoading(true)
    try {
      const res = await fetch('/api/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          teacher_name: teacherName,
          school,
          date: new Date().toLocaleDateString('tr-TR'),
          questions,
          include_answers: includeAnswers,
        }),
      })
      const html = await res.text()
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)

      if (preview) {
        window.open(url, '_blank')
      } else {
        const win = window.open('', '_blank')
        if (win) {
          win.document.write(html)
          win.document.close()
          win.focus()
          setTimeout(() => { win.print(); win.close() }, 500)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  if (!questions.length) return null

  return (
    <div className="border border-gray-200 rounded-lg bg-white p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">PDF Dışa Aktar</h3>

      <Input
        label="Sınav Başlığı"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <Input
        label="Öğretmen Adı (opsiyonel)"
        value={teacherName}
        onChange={e => setTeacherName(e.target.value)}
        placeholder="Ad Soyad"
      />
      <Input
        label="Okul Adı (opsiyonel)"
        value={school}
        onChange={e => setSchool(e.target.value)}
        placeholder="Okul adını girin"
      />

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={includeAnswers}
          onChange={e => setIncludeAnswers(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm text-gray-700">Cevap anahtarı ekle</span>
      </label>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleExport(true)}
          loading={loading}
          className="flex-1"
        >
          <Eye className="w-4 h-4" />
          Önizle
        </Button>
        <Button
          size="sm"
          onClick={() => handleExport(false)}
          loading={loading}
          className="flex-1"
        >
          <Download className="w-4 h-4" />
          PDF İndir
        </Button>
      </div>
    </div>
  )
}
