import { NextRequest, NextResponse } from 'next/server'
import { Question, QuestionType } from '@/types'

interface ExportRequest {
  title: string
  teacher_name?: string
  school?: string
  date?: string
  questions: Question[]
  include_answers: boolean
}

const typeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Çoktan Seçmeli',
  open_ended: 'Açık Uçlu',
  true_false: 'Doğru / Yanlış',
  fill_blank: 'Boşluk Doldurma',
}

function buildHtml(data: ExportRequest): string {
  const questionsHtml = data.questions
    .map((q, i) => {
      const optionsHtml =
        q.type === 'multiple_choice' && q.options
          ? `<div class="options">${q.options.map(o => `<div class="option">${o}</div>`).join('')}</div>`
          : q.type === 'fill_blank'
          ? '<div class="blank-line"></div>'
          : q.type === 'open_ended'
          ? '<div class="answer-lines"><div class="answer-line"></div><div class="answer-line"></div><div class="answer-line"></div></div>'
          : '<div class="tf-options"><span>A) Doğru</span><span>B) Yanlış</span></div>'

      const answerHtml =
        data.include_answers
          ? `<div class="answer">Cevap: <strong>${q.correct_answer}</strong>${q.explanation ? ` — ${q.explanation}` : ''}</div>`
          : ''

      return `
        <div class="question">
          <div class="question-header">
            <span class="question-number">${i + 1}.</span>
            <span class="question-type">[${typeLabels[q.type]}]</span>
            <span class="kazanim">${q.kazanim_code}</span>
          </div>
          <div class="question-text">${q.text}</div>
          ${optionsHtml}
          ${answerHtml}
        </div>
      `
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #111; padding: 20mm 15mm; }
  .header { text-align: center; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 20px; }
  .header h1 { font-size: 18px; margin-bottom: 4px; }
  .header .meta { font-size: 11px; color: #444; display: flex; justify-content: space-between; margin-top: 8px; }
  .question { margin-bottom: 20px; page-break-inside: avoid; }
  .question-header { display: flex; gap: 8px; align-items: center; margin-bottom: 6px; }
  .question-number { font-weight: bold; font-size: 13px; }
  .question-type { background: #f0f0f0; padding: 1px 6px; border-radius: 3px; font-size: 10px; }
  .kazanim { font-size: 10px; color: #666; }
  .question-text { margin-bottom: 8px; line-height: 1.5; }
  .options { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-left: 16px; }
  .option { padding: 2px 0; }
  .tf-options { display: flex; gap: 24px; margin-left: 16px; }
  .blank-line { border-bottom: 1px solid #333; margin: 8px 0 8px 16px; width: 60%; }
  .answer-lines { margin-left: 16px; }
  .answer-line { border-bottom: 1px solid #ccc; margin-bottom: 10px; height: 18px; }
  .answer { margin-top: 6px; font-size: 11px; color: #1a5276; border-left: 3px solid #1a5276; padding-left: 8px; }
  .footer { margin-top: 30px; font-size: 10px; color: #888; text-align: center; border-top: 1px solid #ccc; padding-top: 8px; }
</style>
</head>
<body>
  <div class="header">
    <h1>${data.title}</h1>
    <div class="meta">
      <span>${data.school || ''}</span>
      <span>${data.teacher_name ? `Hazırlayan: ${data.teacher_name}` : ''}</span>
      <span>${data.date || new Date().toLocaleDateString('tr-TR')}</span>
    </div>
  </div>
  ${questionsHtml}
  <div class="footer">6. Sınıf Matematik • ${data.questions.length} Soru</div>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    const body: ExportRequest = await req.json()
    const html = buildHtml(body)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('PDF export hatası:', error)
    return NextResponse.json({ error: 'PDF oluşturulamadı' }, { status: 500 })
  }
}
