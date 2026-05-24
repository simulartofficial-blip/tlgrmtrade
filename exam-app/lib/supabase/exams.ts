import { createClient } from './client'
import { Exam, Question } from '@/types'

export async function saveExam(params: {
  title: string
  topic: string
  difficulty: string
  questions: Question[]
}): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Oturum açılmamış')

  const { data, error } = await supabase
    .from('exams')
    .insert({
      user_id: user.id,
      title: params.title,
      grade: 6,
      subject: 'Matematik',
      topic: params.topic,
      difficulty: params.difficulty,
      questions: params.questions,
    })
    .select('id')
    .single()

  if (error) throw error
  return data.id
}

export async function updateExam(id: string, questions: Question[]): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase
    .from('exams')
    .update({ questions })
    .eq('id', id)

  if (error) throw error
}

export async function listExams(): Promise<Exam[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Exam[]
}

export async function deleteExam(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('exams').delete().eq('id', id)
  if (error) throw error
}

export async function getExam(id: string): Promise<Exam> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Exam
}
