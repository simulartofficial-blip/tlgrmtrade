import { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase/client'
import { saveExam } from '@/lib/supabase/exams'
import { Question, Kazanim, YaziliBicimi } from '@/types'
import { getTopics, getKazanimsByTopic } from '@/lib/kazanimlar/mat6'
import { WizardCard } from '@/components/wizard/WizardCard'
import { StepUret } from '@/components/wizard/StepUret'
import { ExamSummarySheet } from '@/components/wizard/ExamSummarySheet'

type Step = 'sinif' | 'ders' | 'bicim' | 'konu' | 'kazanim' | 'uret'

const BICIMLER: { value: YaziliBicimi; label: string; emoji: string; subtitle: string }[] = [
  { value: 'test', label: 'Test', emoji: '🔘', subtitle: 'Yalnızca çoktan seçmeli' },
  { value: 'klasik', label: 'Klasik Yazılı', emoji: '✏️', subtitle: 'Açık uçlu, D/Y, boşluk doldurma' },
  { value: 'karma', label: 'Karma', emoji: '📋', subtitle: 'Tüm soru tipleri bir arada' },
]

const TOPIC_EMOJIS: Record<string, string> = {
  'Doğal Sayılar': '🔢', 'Kesirler': '½', 'Ondalık Gösterim': '📊',
  'Yüzdeler': '%', 'Tam Sayılar': '±', 'Oran ve Orantı': '⚖️',
  'Cebir': '🔣', 'Geometri': '📐', 'Veri İşleme': '📈',
}

export default function WizardScreen() {
  const [step, setStep] = useState<Step>('sinif')
  const [sinif, setSinif] = useState<number | null>(null)
  const [ders, setDers] = useState<string | null>(null)
  const [bicim, setBicim] = useState<YaziliBicimi | null>(null)
  const [konu, setKonu] = useState<string | null>(null)
  const [kazanim, setKazanim] = useState<Kazanim | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [lastAdded, setLastAdded] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  const STEP_TITLES: Record<Step, string> = {
    sinif: 'Sınıf Seçin', ders: 'Ders Seçin', bicim: 'Yazılı Biçimi',
    konu: 'Konu Seçin', kazanim: 'Kazanım Seçin', uret: 'Soru Üret',
  }

  const PREV: Record<Step, Step> = {
    sinif: 'sinif', ders: 'sinif', bicim: 'ders', konu: 'bicim', kazanim: 'konu', uret: 'kazanim',
  }

  const goBack = () => {
    setLastAdded(0)
    setStep(PREV[step])
  }

  const handleGenerated = (qs: Question[]) => {
    setQuestions(prev => [...prev, ...qs])
    setLastAdded(qs.length)
    setKazanim(null)
    setStep('kazanim')
  }

  const handleSave = async (title: string) => {
    await saveExam({ title, topic: konu ?? 'Karma', difficulty: 'orta', yazili_bicimi: bicim ?? 'karma', questions })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/(auth)/login')
  }

  const breadcrumb = [
    sinif ? `${sinif}. Sınıf` : null,
    ders,
    bicim ? BICIMLER.find(b => b.value === bicim)?.label : null,
    konu,
  ].filter(Boolean).join(' › ')

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-100 px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          {step !== 'sinif' && (
            <TouchableOpacity onPress={goBack} className="mr-1">
              <Text className="text-blue-600 text-lg">‹</Text>
            </TouchableOpacity>
          )}
          <Text className="text-lg font-bold text-gray-900">📚 SınavAI</Text>
        </View>
        <View className="flex-row items-center gap-3">
          {questions.length > 0 && (
            <TouchableOpacity onPress={() => setShowSummary(true)} className="bg-blue-600 rounded-full px-3 py-1.5">
              <Text className="text-white text-xs font-bold">{questions.length} Soru</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSignOut}>
            <Text className="text-gray-400 text-sm">Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
        {/* Başlık */}
        <Text className="text-xl font-bold text-gray-900 mb-1">{STEP_TITLES[step]}</Text>
        {breadcrumb ? <Text className="text-xs text-gray-400 mb-5">{breadcrumb}</Text> : <View className="mb-5" />}

        {/* Kazanım eklendi bildirimi */}
        {lastAdded > 0 && step === 'kazanim' && (
          <View className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4 flex-row items-center gap-2">
            <Text className="text-green-600 text-lg">✅</Text>
            <Text className="text-green-700 text-sm font-medium">{lastAdded} soru eklendi. Başka kazanım seçebilirsiniz.</Text>
          </View>
        )}

        {/* SINIF */}
        {step === 'sinif' && (
          <View>
            {[5, 6, 7, 8].map(s => (
              <WizardCard
                key={s}
                emoji={s === 6 ? '6️⃣' : `${s}`}
                title={`${s}. Sınıf`}
                subtitle={s !== 6 ? 'Yakında' : undefined}
                disabled={s !== 6}
                onPress={() => { setSinif(s); setStep('ders') }}
              />
            ))}
          </View>
        )}

        {/* DERS */}
        {step === 'ders' && (
          <View>
            {[
              { emoji: '📐', label: 'Matematik', available: true },
              { emoji: '📖', label: 'Türkçe', available: false },
              { emoji: '🔬', label: 'Fen Bilimleri', available: false },
              { emoji: '🌍', label: 'Sosyal Bilgiler', available: false },
            ].map(d => (
              <WizardCard
                key={d.label}
                emoji={d.emoji}
                title={d.label}
                subtitle={!d.available ? 'Yakında' : undefined}
                disabled={!d.available}
                onPress={() => { setDers(d.label); setStep('bicim') }}
              />
            ))}
          </View>
        )}

        {/* BİÇİM */}
        {step === 'bicim' && (
          <View>
            {BICIMLER.map(b => (
              <WizardCard
                key={b.value}
                emoji={b.emoji}
                title={b.label}
                subtitle={b.subtitle}
                onPress={() => { setBicim(b.value); setStep('konu') }}
              />
            ))}
          </View>
        )}

        {/* KONU */}
        {step === 'konu' && (
          <View>
            {getTopics().map(topic => (
              <WizardCard
                key={topic}
                emoji={TOPIC_EMOJIS[topic] ?? '📚'}
                title={topic}
                onPress={() => { setKonu(topic); setStep('kazanim') }}
              />
            ))}
          </View>
        )}

        {/* KAZANIM */}
        {step === 'kazanim' && konu && (
          <View>
            {getKazanimsByTopic(konu).map(k => (
              <TouchableOpacity
                key={k.id}
                onPress={() => { setKazanim(k); setStep('uret') }}
                className="bg-white rounded-2xl border-2 border-gray-200 p-4 mb-3 active:border-blue-400 active:bg-blue-50"
              >
                <Text className="text-xs font-mono font-bold text-blue-600 mb-1">{k.code}</Text>
                <Text className="text-sm text-gray-700 leading-relaxed">{k.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ÜRET */}
        {step === 'uret' && kazanim && bicim && (
          <StepUret kazanim={kazanim} yaziliBicimi={bicim} onGenerated={handleGenerated} />
        )}

        <View className="h-8" />
      </ScrollView>

      {/* Sınav özeti sheet */}
      <ExamSummarySheet
        visible={showSummary}
        questions={questions}
        onClose={() => setShowSummary(false)}
        onChange={setQuestions}
        onSave={handleSave}
      />
    </SafeAreaView>
  )
}
