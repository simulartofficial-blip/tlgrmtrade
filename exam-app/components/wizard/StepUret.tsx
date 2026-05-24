import { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import Slider from '@react-native-community/slider'
import { Kazanim, Question, QuestionType, DifficultyLevel, YaziliBicimi } from '@/types'
import { supabase } from '@/lib/supabase/client'

const BICIM_TIPLERI: Record<YaziliBicimi, QuestionType[]> = {
  test: ['multiple_choice'],
  klasik: ['open_ended', 'true_false', 'fill_blank'],
  karma: ['multiple_choice', 'open_ended', 'true_false', 'fill_blank'],
}

const TYPE_INFO: { value: QuestionType; label: string; emoji: string }[] = [
  { value: 'multiple_choice', label: 'Çoktan Seçmeli', emoji: '🔘' },
  { value: 'open_ended', label: 'Açık Uçlu', emoji: '✏️' },
  { value: 'true_false', label: 'Doğru / Yanlış', emoji: '✅' },
  { value: 'fill_blank', label: 'Boşluk Doldurma', emoji: '📝' },
]

const DIFF_COLOR: Record<DifficultyLevel, string> = {
  kolay: 'border-green-500 bg-green-50',
  orta: 'border-yellow-500 bg-yellow-50',
  zor: 'border-red-500 bg-red-50',
}
const DIFF_TEXT: Record<DifficultyLevel, string> = {
  kolay: 'text-green-700',
  orta: 'text-yellow-700',
  zor: 'text-red-700',
}

interface Props {
  kazanim: Kazanim
  yaziliBicimi: YaziliBicimi
  onGenerated: (questions: Question[]) => void
}

export function StepUret({ kazanim, yaziliBicimi, onGenerated }: Props) {
  const allowed = BICIM_TIPLERI[yaziliBicimi]
  const [types, setTypes] = useState<QuestionType[]>([allowed[0]])
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('orta')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)

  const toggleType = (t: QuestionType) => {
    if (!allowed.includes(t)) return
    setTypes(prev => prev.includes(t)
      ? prev.length > 1 ? prev.filter(x => x !== t) : prev
      : [...prev, t]
    )
  }

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('generate-questions', {
        body: {
          topic: kazanim.topic,
          grade: kazanim.grade,
          subject: kazanim.subject,
          difficulty,
          question_types: types,
          count,
          kazanim_code: kazanim.code,
          kazanim_description: kazanim.description,
        },
      })
      if (error) throw error
      onGenerated(data.questions)
    } catch (err) {
      Alert.alert('Hata', String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Kazanım */}
      <View className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
        <Text className="text-xs font-mono font-bold text-blue-600 mb-1">{kazanim.code}</Text>
        <Text className="text-sm text-blue-800 leading-relaxed">{kazanim.description}</Text>
      </View>

      {/* Soru tipleri */}
      <Text className="text-sm font-semibold text-gray-700 mb-3">Soru Tipi</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {TYPE_INFO.map(({ value, label, emoji }) => {
          const isAllowed = allowed.includes(value)
          const selected = types.includes(value)
          return (
            <TouchableOpacity
              key={value}
              onPress={() => toggleType(value)}
              disabled={!isAllowed}
              className={`flex-row items-center gap-2 rounded-xl border-2 px-3 py-2 ${
                !isAllowed ? 'border-gray-100 bg-gray-50 opacity-40'
                : selected ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white'
              }`}
            >
              <Text>{emoji}</Text>
              <Text className={`text-sm font-medium ${selected && isAllowed ? 'text-blue-700' : 'text-gray-600'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Zorluk */}
      <Text className="text-sm font-semibold text-gray-700 mb-3">Zorluk Seviyesi</Text>
      <View className="flex-row gap-2 mb-6">
        {(['kolay', 'orta', 'zor'] as DifficultyLevel[]).map(d => (
          <TouchableOpacity
            key={d}
            onPress={() => setDifficulty(d)}
            className={`flex-1 rounded-xl border-2 py-3 items-center ${difficulty === d ? DIFF_COLOR[d] : 'border-gray-200 bg-white'}`}
          >
            <Text className={`text-sm font-semibold ${difficulty === d ? DIFF_TEXT[d] : 'text-gray-500'}`}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Soru sayısı */}
      <Text className="text-sm font-semibold text-gray-700 mb-1">
        Soru Sayısı: <Text className="text-blue-600">{count}</Text>
      </Text>
      <Slider
        minimumValue={1}
        maximumValue={20}
        step={1}
        value={count}
        onValueChange={setCount}
        minimumTrackTintColor="#2563eb"
        maximumTrackTintColor="#e5e7eb"
        thumbTintColor="#2563eb"
        className="mb-6"
      />

      {/* Üret butonu */}
      <TouchableOpacity
        onPress={handleGenerate}
        disabled={loading}
        className="bg-blue-600 rounded-2xl py-4 items-center flex-row justify-center gap-2"
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-base">✨  {count} Soru Üret</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  )
}
