'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { listExams, deleteExam } from '@/lib/supabase/exams'
import { Exam } from '@/types'
import { Button } from '@/components/ui/button'
import { BookOpen, Trash2, FileText, Plus, Clock } from 'lucide-react'

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    listExams().then(setExams).finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sınavı silmek istediğinizden emin misiniz?')) return
    setDeletingId(id)
    try {
      await deleteExam(id)
      setExams(prev => prev.filter(e => e.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const difficultyLabel: Record<string, string> = { kolay: 'Kolay', orta: 'Orta', zor: 'Zor' }
  const difficultyColor: Record<string, string> = {
    kolay: 'bg-green-100 text-green-700',
    orta: 'bg-yellow-100 text-yellow-700',
    zor: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">SınavAI</span>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-600">Sınavlarım</span>
          <Link href="/" className="ml-auto">
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Yeni Sınav
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Sınavlarım</h1>

        {loading ? (
          <div className="text-center text-gray-400 py-16">Yükleniyor...</div>
        ) : exams.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            <FileText className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-medium">Henüz sınav oluşturmadınız</p>
            <Link href="/" className="mt-3">
              <Button size="sm">İlk sınavı oluştur</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {exams.map(exam => (
              <div key={exam.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-gray-900 text-sm leading-snug">{exam.title}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${difficultyColor[exam.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                    {difficultyLabel[exam.difficulty] ?? exam.difficulty}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{exam.topic}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{exam.questions.length} soru</span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
                  <Clock className="w-3 h-3" />
                  {new Date(exam.created_at).toLocaleDateString('tr-TR')}
                </div>

                <div className="flex gap-2">
                  <Link href={`/?exam=${exam.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">Düzenle</Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deletingId === exam.id}
                    onClick={() => handleDelete(exam.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
