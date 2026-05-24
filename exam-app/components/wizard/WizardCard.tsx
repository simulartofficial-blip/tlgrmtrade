import { TouchableOpacity, View, Text } from 'react-native'

interface Props {
  emoji: string
  title: string
  subtitle?: string
  onPress: () => void
  disabled?: boolean
  badge?: string
}

export function WizardCard({ emoji, title, subtitle, onPress, disabled, badge }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`bg-white rounded-2xl border-2 p-5 flex-row items-center gap-4 mb-3 ${
        disabled ? 'border-gray-100 opacity-40' : 'border-gray-200 active:border-blue-400 active:bg-blue-50'
      }`}
    >
      <Text className="text-3xl">{emoji}</Text>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{title}</Text>
        {subtitle ? <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text> : null}
      </View>
      {badge ? (
        <View className="bg-gray-100 rounded-full px-2 py-0.5">
          <Text className="text-xs text-gray-500">{badge}</Text>
        </View>
      ) : (
        <Text className="text-gray-300 text-lg">›</Text>
      )}
    </TouchableOpacity>
  )
}
