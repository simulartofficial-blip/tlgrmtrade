import { supabase } from './client'
import { Exam, Question, YaziliBicimi } from '@/types'

export async function saveExam(params: {
  title: string
  topic: string
  difficulty: string
  yazili_bicimi: YaziliBicimi
  questions: Question[]
}): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açılmamış')

  const { data, error } = await supabase
    .from('exams')
    .insert({ user_id: user.id, grade: 6, subject: 'Matematik', ...params })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export async function listExams(): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Exam[]
}

export async function deleteExam(id: string): Promise<void> {
  const { error } = await supabase.from('exams').delete().eq('id', id)
  if (error) throw error
}
