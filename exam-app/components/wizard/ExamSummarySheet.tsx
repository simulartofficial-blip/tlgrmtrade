import { useState } from 'react'
import { View, Text, Modal, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native'
import { printAsync, printToFileAsync } from 'expo-print'
import { shareAsync } from 'expo-sharing'
import { Question, QuestionType } from '@/types'

const TYPE_SHORT: Record<QuestionType, string> = {
  multiple_choice: 'ÇS', open_ended: 'AU', true_false: 'DY', fill_blank: 'BD',
}
const TYPE_COLOR: Record<QuestionType, string> = {
  multiple_choice: 'bg-blue-100 text-blue-700',
  open_ended: 'bg-green-100 text-green-700',
  true_false: 'bg-yellow-100 text-yellow-700',
  fill_blank: 'bg-purple-100 text-purple-700',
}
const DIFF_COLOR: Record<string, string> = { kolay: 'text-green-600', orta: 'text-yellow-600', zor: 'text-red-600' }

function buildHtml(title: string, teacher: string, questions: Question[], includeAnswers: boolean) {
  const qs = questions.map((q, i) => {
    const opts = q.type === 'multiple_choice' && q.options
      ? `<div class="opts">${q.options.map(o => `<div class="opt">${o}</div>`).join('')}</div>`
      : q.type === 'fill_blank' ? '<div class="blank"></div>'
      : q.type === 'open_ended' ? '<div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>'
      : '<div class="tf"><span>A) Doğru</span><span>B) Yanlış</span></div>'
    const ans = includeAnswers ? `<div class="ans">Cevap: <b>${q.correct_answer}</b></div>` : ''
    return `<div class="q"><b>${i + 1}.</b> ${q.text}${opts}${ans}</div>`
  }).join('')

  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
<style>
body{font-family:Arial,sans-serif;font-size:12px;padding:20mm 15mm;color:#111}
h1{text-align:center;font-size:16px;margin-bottom:4px}
.meta{text-align:center;font-size:11px;color:#555;margin-bottom:20px}
.q{margin-bottom:18px;page-break-inside:avoid}
.opts{display:grid;grid-template-columns:1fr 1fr;gap:3px;margin:6px 0 0 16px}
.tf{display:flex;gap:20px;margin:6px 0 0 16px}
.blank{border-bottom:1px solid #333;width:60%;margin:8px 0 0 16px}
.lines .line{border-bottom:1px solid #ccc;height:18px;margin:8px 0 0 16px}
.ans{margin-top:5px;color:#1a5276;border-left:3px solid #1a5276;padding-left:8px;font-size:11px}
</style></head><body>
<h1>${title}</h1>
<div class="meta">${teacher ? `Hazırlayan: ${teacher} &nbsp;|&nbsp;` : ''}${new Date().toLocaleDateString('tr-TR')}</div>
${qs}
</body></html>`
}

interface Props {
  visible: boolean
  questions: Question[]
  onChange: (qs: Question[]) => void
  onClose: () => void
  onSave: (title: string) => Promise<void>
}

export function ExamSummarySheet({ visible, questions, onChange, onClose, onSave }: Props) {
  const [title, setTitle] = useState('6. Sınıf Matematik Yazılısı')
  const [teacher, setTeacher] = useState('')
  const [includeAnswers, setIncludeAnswers] = useState(false)
  const [saving, setSaving] = useState(false)
  const [printing, setPrinting] = useState(false)

  const grouped = questions.reduce<Record<string, Question[]>>((acc, q) => {
    if (!acc[q.kazanim_code]) acc[q.kazanim_code] = []
    acc[q.kazanim_code].push(q)
    return acc
  }, {})

  const handlePrint = async () => {
    setPrinting(true)
    try {
      const html = buildHtml(title, teacher, questions, includeAnswers)
      const { uri } = await printToFileAsync({ html })
      await shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Sınavı Paylaş' })
    } catch (e) {
      Alert.alert('Hata', String(e))
    } finally {
      setPrinting(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(title)
      Alert.alert('Kaydedildi', 'Sınav başarıyla kaydedildi.')
    } catch (e) {
      Alert.alert('Hata', String(e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white border-b border-gray-100 px-4 py-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">Sınav Özeti</Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-xs text-gray-400">{questions.length} soru</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-600 font-medium">Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {/* PDF ayarları */}
          <View className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 gap-3">
            <Text className="text-sm font-semibold text-gray-700">Sınav Başlığı</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
              value={title}
              onChangeText={setTitle}
            />
            <Text className="text-sm font-semibold text-gray-700">Öğretmen Adı</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900"
              placeholder="Ad Soyad (opsiyonel)"
              value={teacher}
              onChangeText={setTeacher}
            />
            <TouchableOpacity
              onPress={() => setIncludeAnswers(v => !v)}
              className="flex-row items-center gap-3"
            >
              <View className={`w-6 h-6 rounded border-2 items-center justify-center ${includeAnswers ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                {includeAnswers && <Text className="text-white text-xs font-bold">✓</Text>}
              </View>
              <Text className="text-sm text-gray-700">Cevap anahtarı ekle</Text>
            </TouchableOpacity>
          </View>

          {/* Sorular kazanım bazlı */}
          {Object.entries(grouped).map(([code, qs]) => (
            <View key={code} className="bg-white rounded-2xl border border-gray-100 mb-3 overflow-hidden">
              <View className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <Text className="text-xs font-mono font-bold text-blue-600">{code}</Text>
                <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>{qs[0].kazanim_description}</Text>
              </View>
              {qs.map((q, i) => (
                <View key={q.id} className="flex-row items-start gap-2 px-4 py-3 border-b border-gray-50">
                  <Text className="text-xs text-gray-400 w-5 text-right mt-0.5">{i + 1}.</Text>
                  <View className={`rounded px-1.5 py-0.5 ${TYPE_COLOR[q.type]}`}>
                    <Text className="text-xs font-bold">{TYPE_SHORT[q.type]}</Text>
                  </View>
                  <Text className={`text-xs font-medium ${DIFF_COLOR[q.difficulty]}`}>
                    {q.difficulty.charAt(0).toUpperCase()}
                  </Text>
                  <Text className="flex-1 text-xs text-gray-700 leading-relaxed" numberOfLines={2}>{q.text}</Text>
                  <TouchableOpacity onPress={() => onChange(questions.filter(x => x.id !== q.id))}>
                    <Text className="text-gray-300 text-base">✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}

          <View className="h-4" />
        </ScrollView>

        {/* Footer butonlar */}
        <View className="bg-white border-t border-gray-100 px-4 py-4 gap-2">
          <TouchableOpacity
            onPress={handlePrint}
            disabled={printing}
            className="bg-blue-600 rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
          >
            {printing ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">📄  PDF Oluştur & Paylaş</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-gray-100 rounded-2xl py-3.5 items-center flex-row justify-center gap-2"
          >
            {saving ? <ActivityIndicator color="#374151" /> : <Text className="text-gray-700 font-semibold">💾  Sınavı Kaydet</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
