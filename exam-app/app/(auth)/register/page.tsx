'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '', full_name: '', school: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.full_name, school: form.school },
        },
      })
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız')
    } finally {
      setLoading(false)
    }
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }))

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SınavAI</span>
          </div>
          <p className="text-gray-500 text-sm">Ücretsiz hesap oluşturun</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Ad Soyad" value={form.full_name} onChange={set('full_name')} placeholder="Ahmet Yılmaz" required />
            <Input label="Okul" value={form.school} onChange={set('school')} placeholder="Atatürk Ortaokulu" />
            <Input label="E-posta" type="email" value={form.email} onChange={set('email')} placeholder="ornek@okul.k12.tr" required />
            <Input label="Şifre" type="password" value={form.password} onChange={set('password')} placeholder="En az 8 karakter" minLength={8} required />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Hesap Oluştur
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  )
}
