import { NextRequest, NextResponse } from 'next/server'
import { generateQuestions } from '@/lib/claude/generate'
import { GenerateRequest } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json()

    if (!body.topic || !body.question_types?.length || !body.count) {
      return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 })
    }

    if (body.count < 1 || body.count > 20) {
      return NextResponse.json({ error: 'Soru sayısı 1-20 arasında olmalıdır' }, { status: 400 })
    }

    const questions = await generateQuestions(body)
    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Soru üretme hatası:', error)
    return NextResponse.json({ error: 'Sorular üretilemedi' }, { status: 500 })
  }
}
