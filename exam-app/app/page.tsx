'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExamWizard } from '@/components/exam/ExamWizard'
import { ExamSummary } from '@/components/exam/ExamSummary'
import { Question } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { saveExam } from '@/lib/supabase/exams'
import { BookOpen, Sparkles, FileText, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [user, setUser] = useState<{ email: string; full_name?: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) setUser({ email: data.user.email ?? '', full_name: data.user.user_metadata?.full_name })
    })
  }, [])

  const handleSignOut = async () => {
    await createClient().auth.signOut()
    setUser(null)
    router.refresh()
  }

  const handleSave = async (title: string) => {
    if (!user) { router.push('/login'); return }
    setSaving(true)
    try {
      const id = await saveExam({ title, topic: 'Karma', difficulty: 'orta', questions })
      setSavedId(id)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-gray-900">SınavAI</span>
          </div>
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sol: Sihirbaz */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <ExamWizard
              allQuestions={questions}
              onQuestionsChange={qs => { setQuestions(qs); setSavedId(null) }}
            />
          </div>

          {/* Sağ: Sınav özeti */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm self-start sticky top-20">
            <ExamSummary
              questions={questions}
              onChange={setQuestions}
              onSave={handleSave}
              isSaving={saving}
              savedId={savedId}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
