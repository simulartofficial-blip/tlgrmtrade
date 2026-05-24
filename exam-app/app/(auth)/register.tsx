import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase/client'

export default function RegisterScreen() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', school: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleRegister = async () => {
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name, school: form.school } },
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    router.replace('/(tabs)')
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-gray-50">
      <ScrollView contentContainerClassName="justify-center px-6 py-12">
        <View className="items-center mb-10">
          <Text className="text-4xl mb-2">📚</Text>
          <Text className="text-2xl font-bold text-gray-900">SınavAI</Text>
          <Text className="text-gray-500 mt-1">Ücretsiz hesap oluşturun</Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 gap-4">
          {[
            { label: 'Ad Soyad', key: 'full_name', placeholder: 'Ahmet Yılmaz' },
            { label: 'Okul', key: 'school', placeholder: 'Atatürk Ortaokulu' },
            { label: 'E-posta', key: 'email', placeholder: 'ornek@okul.k12.tr' },
            { label: 'Şifre', key: 'password', placeholder: 'En az 8 karakter' },
          ].map(({ label, key, placeholder }) => (
            <View key={key}>
              <Text className="text-sm font-medium text-gray-700 mb-1.5">{label}</Text>
              <TextInput
                className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
                placeholder={placeholder}
                value={form[key as keyof typeof form]}
                onChangeText={set(key as keyof typeof form)}
                keyboardType={key === 'email' ? 'email-address' : 'default'}
                autoCapitalize={key === 'email' || key === 'password' ? 'none' : 'words'}
                secureTextEntry={key === 'password'}
              />
            </View>
          ))}

          {error ? <Text className="text-red-500 text-sm">{error}</Text> : null}

          <TouchableOpacity
            onPress={handleRegister}
            disabled={loading}
            className="bg-blue-600 rounded-xl py-3.5 items-center mt-1"
          >
            <Text className="text-white font-semibold text-base">
              {loading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.back()} className="mt-6 items-center">
          <Text className="text-gray-500">
            Zaten hesabınız var mı? <Text className="text-blue-600 font-medium">Giriş yapın</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
