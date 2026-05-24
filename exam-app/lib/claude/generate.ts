import Anthropic from '@anthropic-ai/sdk'
import { GenerateRequest, Question, QuestionType } from '@/types'

const client = new Anthropic()

const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Çoktan seçmeli (4 şık: A, B, C, D)',
  open_ended: 'Açık uçlu (yazılı cevap)',
  true_false: 'Doğru/Yanlış',
  fill_blank: 'Boşluk doldurma',
}

function buildPrompt(req: GenerateRequest): string {
  const typesList = req.question_types.map(t => questionTypeLabels[t]).join(', ')

  const kazanimLine = req.kazanim_code && req.kazanim_description
    ? `HEDEF KAZANIM: ${req.kazanim_code} — ${req.kazanim_description}`
    : `KONU: ${req.topic}`

  return `Sen deneyimli bir Türk matematik öğretmenisin. MEB 6. sınıf matematik müfredatına göre soru üretiyorsun.

${kazanimLine}
ZORLUK: ${req.difficulty}
SORU SAYISI: ${req.count}
SORU TİPLERİ: ${typesList}

KURALLAR:
- Tüm sorular Türkçe olsun
- Her soru farklı bir gerçek hayat bağlamı kullansın (market, okul, spor, yemek, seyahat vb.)
- Yalnızca belirtilen kazanımı ölçen sorular üret — konunun dışına çıkma
- Zorluk seviyesine uygun ol: kolay=tek adım, orta=iki adım, zor=çok adım/yorum gerektiren
- Çoktan seçmeli sorularda yalnızca bir doğru cevap olsun, yanlış şıklar makul ama hatalı olsun
- Boşluk doldurma sorularında boşluğu "___" ile göster

ÇIKTI FORMATI (yalnızca geçerli JSON döndür, başka hiçbir şey yazma):
{
  "questions": [
    {
      "type": "multiple_choice" | "open_ended" | "true_false" | "fill_blank",
      "text": "soru metni",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_answer": "doğru cevap",
      "kazanim_code": "${req.kazanim_code ?? ''}",
      "kazanim_description": "${req.kazanim_description ?? req.topic}",
      "difficulty": "${req.difficulty}",
      "explanation": "kısa çözüm açıklaması"
    }
  ]
}

${req.count} adet soru üret.`
}

export async function generateQuestions(req: GenerateRequest): Promise<Question[]> {
  const prompt = buildPrompt(req)

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const content = message.content[0]
  if (content.type !== 'text') throw new Error('Beklenmeyen yanıt tipi')

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('JSON yanıt bulunamadı')

  const parsed = JSON.parse(jsonMatch[0])

  return parsed.questions.map((q: Question, i: number) => ({
    ...q,
    id: `q_${Date.now()}_${i}`,
  }))
}
