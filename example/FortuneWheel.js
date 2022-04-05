import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, Button } from 'react-native'
import FortuneWheelNative from './FortuneWheelNative'

const { width: screenWidth } = Dimensions.get('screen')

const FortuneWheel = () => {
  const [rewardIndex, setRewardIndex] = useState()
  const [message, setMessage] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)

  const colors = [
    '#8A083F',
    '#408AD1',
    '#C18900',
    '#DC4446',
    '#D7D5C7',
    '#871640',
    '#1A5096',
    '#CC7B05',
    '#BF2B2D',
    '#BEBAAD',
    '#269271',
    '#9D1D4D',
    '#2361AC',
    '#F1A805',
    '#EB514F',
    '#DDDDDC',
  ]

  const length = 16

  const textColors = Array.from({ length }).map((_, i) => {
    if (i === 4 || i === 9 || i === 15) {
      return 'black'
    }
    return 'white'
  })

  const play = () => {
    const random = Math.floor(Math.random() * length)

    setMessage('')
    setIsSpinning(true)
    setRewardIndex((_) => random)
  }

  const onFinished = (value, _) => {
    setRewardIndex(undefined)
    setMessage(`Congratulation! You won ${value}.`)
    setIsSpinning(false)
  }
  return (
    <View style={styles.container}>
      <View style={styles.fortuneWheel}>
        <View style={styles.wheelContainer}>
          <FortuneWheelNative
            items={Array.from({ length }).map((_, i) => `${i + 1}00$`)}
            size={screenWidth * 0.78}
            stop={rewardIndex}
            indicatorPosition='top'
            textMargin={-screenWidth * 0.03}
            compactMode
            colors={colors}
            textColors={textColors}
            textStyle={{
              fontSize: 13,
              fontWeight: 'bold',
            }}
            onFinished={onFinished}
          />
          <View style={styles.centerCircle} />
        </View>

        <View
          style={{ width: screenWidth * 0.8, alignItems: 'center' }}
          pointerEvents='none' // if you want to use button on the wheel eg. play button on the center circle
        >
          <Image
            style={styles.frame}
            source={require('./assets/frame.png')}
            resizeMode='contain'
          />
        </View>
      </View>
      <Text style={styles.message}>{message}</Text>
      <Button
        title='Try your luck with wheel of fortune'
        onPress={play}
        color='#970302'
        disabled={isSpinning}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1D1C1C',
  },
  fortuneWheel: {
    width: screenWidth,
    aspectRatio: 0.8078, // aspect ratio of the frame image
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  wheelContainer: {
    position: 'absolute',
    aspectRatio: 1,
    top: screenWidth * 0.14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#970302',
  },
  message: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF87',
  },
  frame: {
    height: '100%',
    width: '100%',
  },
})

export default FortuneWheel
