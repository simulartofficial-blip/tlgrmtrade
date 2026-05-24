import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#e5e7eb' },
      tabBarActiveTintColor: '#2563eb',
      tabBarInactiveTintColor: '#9ca3af',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sınav Oluştur',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✏️</Text>,
        }}
      />
      <Tabs.Screen
        name="exams"
        options={{
          title: 'Sınavlarım',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
        }}
      />
    </Tabs>
  )
}
