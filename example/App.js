import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import MyScreen from './FortuneWheel'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <MyScreen />
      <StatusBar style='auto' />
    </View>
  )
}
