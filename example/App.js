import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import FortuneWheel from './FortuneWheel'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <FortuneWheel />
      <StatusBar style='auto' />
    </View>
  )
}
