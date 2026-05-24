export type QuestionType = 'multiple_choice' | 'open_ended' | 'true_false' | 'fill_blank'
export type DifficultyLevel = 'kolay' | 'orta' | 'zor'
export type YaziliBicimi = 'test' | 'klasik' | 'karma'

export interface Kazanim {
  id: string
  code: string
  description: string
  topic: string
  grade: number
  subject: string
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  correct_answer: string
  kazanim_code: string
  kazanim_description: string
  difficulty: DifficultyLevel
  explanation?: string
}

export interface Exam {
  id: string
  user_id: string
  title: string
  grade: number
  subject: string
  topic: string
  difficulty: DifficultyLevel
  yazili_bicimi: YaziliBicimi
  questions: Question[]
  created_at: string
}
