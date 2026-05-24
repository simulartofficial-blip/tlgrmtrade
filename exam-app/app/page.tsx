'use client'

import { useState } from 'react'
import { GenerateForm } from '@/components/exam/GenerateForm'
import { QuestionEditor } from '@/components/exam/QuestionEditor'
import { ExportPanel } from '@/components/exam/ExportPanel'
import { Question } from '@/types'
import { BookOpen, Sparkles } from 'lucide-react'

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">SınavAI</span>
          </div>
          <span className="text-sm text-gray-500">6. Sınıf Matematik Sınav Hazırlama</span>
          <div className="ml-auto flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Claude AI ile güçlendirildi
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h1 className="font-semibold text-gray-900 mb-4">Soru Üret</h1>
              <GenerateForm onGenerated={setQuestions} />
            </div>
            <ExportPanel questions={questions} />
          </div>

          <div className="lg:col-span-2">
            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <BookOpen className="w-12 h-12 mb-3 text-gray-300" />
                <p className="font-medium">Henüz soru oluşturulmadı</p>
                <p className="text-sm mt-1">Soldan konu ve ayarları seçerek başlayın</p>
              </div>
            ) : (
              <QuestionEditor questions={questions} onChange={setQuestions} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
