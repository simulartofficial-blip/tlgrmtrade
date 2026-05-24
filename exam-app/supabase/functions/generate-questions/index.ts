import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const typeLabels: Record<string, string> = {
  multiple_choice: 'Çoktan seçmeli (4 şık: A, B, C, D)',
  open_ended: 'Açık uçlu (yazılı cevap)',
  true_false: 'Doğru/Yanlış',
  fill_blank: 'Boşluk doldurma (boşluğu ___ ile göster)',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { topic, grade, subject, difficulty, question_types, count, kazanim_code, kazanim_description } = await req.json()

    const typesList = question_types.map((t: string) => typeLabels[t] ?? t).join(', ')
    const kazanimLine = kazanim_code && kazanim_description
      ? `HEDEF KAZANIM: ${kazanim_code} — ${kazanim_description}`
      : `KONU: ${topic}`

    const prompt = `Sen deneyimli bir Türk matematik öğretmenisin. MEB ${grade}. sınıf ${subject} müfredatına göre soru üretiyorsun.

${kazanimLine}
ZORLUK: ${difficulty}
SORU SAYISI: ${count}
SORU TİPLERİ: ${typesList}

KURALLAR:
- Tüm sorular Türkçe olsun
- Her soru farklı bir gerçek hayat bağlamı kullansın
- Yalnızca belirtilen kazanımı ölçen sorular üret
- kolay=tek adım, orta=iki adım, zor=çok adım/yorum gerektiren
- Çoktan seçmeli sorularda yalnızca bir doğru cevap olsun

ÇIKTI FORMATI (yalnızca geçerli JSON döndür):
{
  "questions": [
    {
      "type": "multiple_choice|open_ended|true_false|fill_blank",
      "text": "soru metni",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_answer": "doğru cevap",
      "kazanim_code": "${kazanim_code ?? ''}",
      "kazanim_description": "${kazanim_description ?? topic}",
      "difficulty": "${difficulty}",
      "explanation": "kısa çözüm açıklaması"
    }
  ]
}

${count} adet soru üret.`

    const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON yanıt bulunamadı')

    const parsed = JSON.parse(jsonMatch[0])
    const questions = parsed.questions.map((q: object, i: number) => ({
      ...q,
      id: `q_${Date.now()}_${i}`,
    }))

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
