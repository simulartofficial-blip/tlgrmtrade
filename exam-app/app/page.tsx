'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GenerateForm } from '@/components/exam/GenerateForm'
import { QuestionEditor } from '@/components/exam/QuestionEditor'
import { ExportPanel } from '@/components/exam/ExportPanel'
import { Question } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { saveExam } from '@/lib/supabase/exams'
import { BookOpen, Sparkles, Save, FileText, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentTopic, setCurrentTopic] = useState('')
  const [currentDifficulty, setCurrentDifficulty] = useState('orta')
  const [user, setUser] = useState<{ email: string; full_name?: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          email: data.user.email ?? '',
          full_name: data.user.user_metadata?.full_name,
        })
      }
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    setUser(null)
  }

  const handleGenerated = (qs: Question[], topic: string, difficulty: string) => {
    setQuestions(qs)
    setCurrentTopic(topic)
    setCurrentDifficulty(difficulty)
    setSavedId(null)
  }

  const handleSave = async () => {
    if (!user) { router.push('/login'); return }
    setSaving(true)
    try {
      const id = await saveExam({
        title: `${currentTopic} — ${new Date().toLocaleDateString('tr-TR')}`,
        topic: currentTopic,
        difficulty: currentDifficulty,
        questions,
      })
      setSavedId(id)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">SınavAI</span>
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">6. Sınıf Matematik</span>
          <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Claude AI
          </div>

          <div className="ml-auto flex items-center gap-2">
            {user ? (
              <>
                <Link href="/exams">
                  <Button variant="ghost" size="sm">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:block">Sınavlarım</span>
                  </Button>
                </Link>
                <span className="text-xs text-gray-500 hidden sm:flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {user.full_name ?? user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">Giriş Yap</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h1 className="font-semibold text-gray-900 mb-4">Soru Üret</h1>
              <GenerateForm onGenerated={handleGenerated} />
            </div>
            <ExportPanel questions={questions} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {questions.length > 0 && (
              <div className="flex items-center justify-between">
                <span />
                <div className="flex items-center gap-2">
                  {savedId && (
                    <span className="text-xs text-green-600 font-medium">Kaydedildi</span>
                  )}
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={saving}
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4" />
                    {user ? 'Sınavı Kaydet' : 'Kaydetmek için giriş yap'}
                  </Button>
                </div>
              </div>
            )}

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
