import { useEffect, useState, useCallback } from 'react'
import { View, Text, FlatList, TouchableOpacity, SafeAreaView, RefreshControl, Alert, ActivityIndicator } from 'react-native'
import { useFocusEffect } from 'expo-router'
import { listExams, deleteExam } from '@/lib/supabase/exams'
import { Exam } from '@/types'

const DIFF_BADGE: Record<string, string> = {
  kolay: 'bg-green-100 text-green-700',
  orta: 'bg-yellow-100 text-yellow-700',
  zor: 'bg-red-100 text-red-700',
}

const BICIM_EMOJI: Record<string, string> = { test: '🔘', klasik: '✏️', karma: '📋' }

export default function ExamsScreen() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    try { setExams(await listExams()) } finally { setLoading(false); setRefreshing(false) }
  }

  useFocusEffect(useCallback(() => { setLoading(true); load() }, []))

  const handleDelete = (id: string) => {
    Alert.alert('Sınavı Sil', 'Bu sınavı silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await deleteExam(id)
          setExams(prev => prev.filter(e => e.id !== id))
        },
      },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-100 px-4 py-4">
        <Text className="text-xl font-bold text-gray-900">Sınavlarım</Text>
        <Text className="text-sm text-gray-500 mt-0.5">{exams.length} sınav kaydedildi</Text>
      </View>

      {exams.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <Text className="text-5xl">📭</Text>
          <Text className="text-gray-500 font-medium">Henüz sınav oluşturmadınız</Text>
          <Text className="text-gray-400 text-sm">Sınav Oluştur sekmesinden başlayın</Text>
        </View>
      ) : (
        <FlatList
          data={exams}
          keyExtractor={e => e.id}
          contentContainerClassName="p-4 gap-3"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} />}
          renderItem={({ item }) => (
            <View className="bg-white rounded-2xl border border-gray-100 p-4">
              <View className="flex-row items-start justify-between gap-2 mb-3">
                <Text className="flex-1 font-semibold text-gray-900" numberOfLines={2}>{item.title}</Text>
                <View className="flex-row items-center gap-1.5">
                  <Text>{BICIM_EMOJI[item.yazili_bicimi] ?? '📋'}</Text>
                  <View className={`rounded-full px-2 py-0.5 ${DIFF_BADGE[item.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
                    <Text className="text-xs font-medium">{item.difficulty}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-2 mb-3">
                <View className="bg-gray-100 rounded-full px-2.5 py-1">
                  <Text className="text-xs text-gray-600">{item.topic}</Text>
                </View>
                <View className="bg-gray-100 rounded-full px-2.5 py-1">
                  <Text className="text-xs text-gray-600">{item.questions?.length ?? 0} soru</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleDateString('tr-TR')}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text className="text-red-400 text-sm">Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}
