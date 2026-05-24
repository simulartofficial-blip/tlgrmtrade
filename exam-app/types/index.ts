export type QuestionType = 'multiple_choice' | 'open_ended' | 'true_false' | 'fill_blank'

export type DifficultyLevel = 'kolay' | 'orta' | 'zor'

export interface Kazanim {
  id: string
  code: string
  description: string
  topic: string
  subtopic?: string
  grade: number
  subject: string
}

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]        // A, B, C, D for multiple choice
  correct_answer: string
  kazanim_code: string
  kazanim_description: string
  difficulty: DifficultyLevel
  explanation?: string
}

export interface GenerateRequest {
  topic: string
  subtopic?: string
  grade: number
  subject: string
  difficulty: DifficultyLevel
  question_types: QuestionType[]
  count: number
}

export interface Exam {
  id: string
  user_id: string
  title: string
  questions: Question[]
  created_at: string
  grade: number
  subject: string
  topic: string
  difficulty: DifficultyLevel
}

export interface User {
  id: string
  email: string
  full_name?: string
  school?: string
}
