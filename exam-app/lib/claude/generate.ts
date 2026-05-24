import Anthropic from '@anthropic-ai/sdk'
import { GenerateRequest, Question, QuestionType } from '@/types'
import { getKazanimsByTopic } from '@/lib/kazanimlar/mat6'

const client = new Anthropic()

const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: 'Çoktan seçmeli (4 şık: A, B, C, D)',
  open_ended: 'Açık uçlu (yazılı cevap)',
  true_false: 'Doğru/Yanlış',
  fill_blank: 'Boşluk doldurma',
}

function buildPrompt(req: GenerateRequest): string {
  const kazanimlar = getKazanimsByTopic(req.topic)
  const kazanimText = kazanimlar
    .map(k => `- ${k.code}: ${k.description}`)
    .join('\n')

  const typesList = req.question_types
    .map(t => questionTypeLabels[t])
    .join(', ')

  return `Sen deneyimli bir Türk matematik öğretmenisin. MEB 6. sınıf matematik müfredatına göre soru üretiyorsun.

KONU: ${req.topic}
ZORLUK: ${req.difficulty}
SORU SAYISI: ${req.count}
SORU TİPLERİ: ${typesList}

İLGİLİ KAZANIMLAR:
${kazanimText}

KURALLAR:
- Tüm sorular Türkçe olsun
- Her soru gerçek hayat bağlamı kullansın (market, okul, spor vb.)
- Sorular birbirinden farklı bağlamlarda olsun
- Zorluk seviyesine uygun ol: kolay=tek adım, orta=iki adım, zor=çok adım
- Çoktan seçmeli sorularda yalnızca bir doğru cevap olsun
- Cevaplar mantıklı ve öğrenci seviyesine uygun olsun

ÇIKTI FORMATI (kesinlikle geçerli JSON döndür):
{
  "questions": [
    {
      "type": "multiple_choice" | "open_ended" | "true_false" | "fill_blank",
      "text": "soru metni",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],  // sadece multiple_choice için
      "correct_answer": "doğru cevap",
      "kazanim_code": "M.6.x.x.x",
      "kazanim_description": "kazanım açıklaması",
      "difficulty": "${req.difficulty}",
      "explanation": "kısa çözüm açıklaması"
    }
  ]
}

Şimdi ${req.count} adet soru üret.`
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
