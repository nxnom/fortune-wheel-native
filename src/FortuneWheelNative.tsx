import React, { useEffect, useRef } from 'react'
import { Dimensions, Animated, View } from 'react-native'
import * as d3Shape from 'd3-shape'

import Svg, { G, Text, Path, TextAnchor, TextProps } from 'react-native-svg'

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const { width: screenWidth } = Dimensions.get('screen')

const toCircle = (angle: number = 0) => angle + (360 - (angle % 360))

/**
 * Learn More:
 *
 * - [Documentation](https://www.npmjs.com/package/fortune-wheel-native)
 * 
 * @example
 *  import React, { useState } from 'react'
    import { View, Button } from 'react-native'
    import FortuneWheelNative from 'fortune-wheel-native'

    const MyScreen = () => {
      const [stop, setStop] = useState()

      const play = () => {
        const random = Math.floor(Math.random() * 10)
        setStop(random)
      }

      //    If you have components to spin along side with the fortune wheel. Wrap your components inside `FortuneWheelNative`

      //    <FortuneWheelNative>
      //        <YourComponent /> // this component will also spin
      //    </FortuneWheelNative>
      return (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FortuneWheelNative onFinished={(_, __) => setStop(null)} stop={stop} />
          <Button title='Spin The Wheel' onPress={play} color='#970302' />
        </View>
      )
    }

    export default MyScreen
 */
const FortuneWheelNative: React.FC<Props> = (props) => {
  let {
    data: items = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    backgroundColors = ['#fefefe', '#000'],
    textColors = ['#000', '#fff'],
    textDistance = 0,
    duration = 5000,
    knobPosition = 'bottom',
    size = screenWidth,
    innerRadius,
    dividerWidth = 0,
    speed = 60,
    textStyle,
    stop,
    compactMode = false,
    onFinished,
  } = props

  const angleBySegment = 360 / items.length
  const angleOffset = angleBySegment / 2

  let wheelInitialDeg = getKnobAngle(knobPosition)

  if (compactMode) {
    if (knobPosition === 'top') {
      wheelInitialDeg = 0
      knobPosition = 'right'
    }
    if (knobPosition === 'bottom') {
      wheelInitialDeg = 180
      knobPosition = 'left'
    }
  }

  const controller = useRef(new Animated.Value(0)).current
  const currentAngle = useRef(0)

  useEffect(() => {
    if (typeof stop !== 'number') return

    if (stop > items.length) {
      console.error('Index is out of range')
      return
    }

    const play = () => {
      /**
       * calculate the base winning angle
       * this value is the angle of the segment that the wheel will stop
       * this is base degree(0 - 360), additional values will be calculated later
       */
      const winningAngle = 360 - stop * angleBySegment

      /**
       * this value help us to calculate the angle of currently stopped segment
       * there is a chance {currentAngle} is not divided by 360 evenly
       * that can cause incorrect {winningAngle} values.
       * so, we need to make the {currentAngle} value divided by 360 evenly
       */
      const currentCircleAngle = toCircle(currentAngle.current)

      let _speed = speed

      if (speed < 1 || speed > 200) {
        console.error(
          'Speed must be between(1 - 100),reset to default value(60)'
        )
        _speed = 60
      }

      /**
       * create more spinning angle base on duration and speed for smooth animation
       */
      const speedAngle = toCircle((360 * duration) / (10 * (201 - _speed * 2)))

      Animated.timing(controller, {
        toValue: winningAngle + currentCircleAngle + speedAngle,
        duration: duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && onFinished) onFinished(items[stop], stop)
      })
    }

    play()
  }, [stop])

  useEffect(() => {
    controller.addListener(({ value }) => {
      currentAngle.current = value
    })

    return () => {
      controller.removeAllListeners()
    }
  }, [])

  const WheelBuilder = () => {
    const data = items.map((_) => 1)
    const arcs = d3Shape.pie()(data)
    return arcs.map((arc, index) => {
      const instance = d3Shape
        .arc()
        .padAngle(dividerWidth / 100)
        .outerRadius(size / 2)
        .innerRadius(innerRadius || dividerWidth)
      return {
        path: instance(arc as any),
        color: backgroundColors[index % backgroundColors.length],
        value: items[index],
        centroid: instance.centroid(arc as any),
      }
    })
  }

  return (
    <View
      style={{
        transform: [{ rotate: `${wheelInitialDeg}deg` }],
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: controller.interpolate({
                  inputRange: [-360, 0, 360],
                  outputRange: [`-${360}deg`, '0deg', `${360}deg`],
                }),
              },
            ],
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <AnimatedSvg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: [{ rotate: `-${angleOffset}deg` }] }}
        >
          <G y={size / 2} x={size / 2}>
            {WheelBuilder().map((arc, i) => {
              const [x, y] = arc.centroid
              const number = arc.value.toString()

              let _y = y
              let _x = x
              let textAnchor: TextAnchor = 'middle'

              if (knobPosition === 'top') {
                _y = y - 40 + textDistance * -1
              } else if (knobPosition === 'right') {
                _x = x + 30 + textDistance
                _y = y + 5
                textAnchor = 'start'
              } else if (knobPosition === 'bottom') {
                _y = y + 50 + textDistance
              } else if (knobPosition === 'left') {
                _x = x - 30 + textDistance * -1
                _y = y + 5
                textAnchor = 'end'
              }

              return (
                <G key={`arc-${i}`}>
                  <Path d={arc.path} strokeWidth={2} fill={arc.color} />
                  <G
                    rotation={
                      (i * 360) / items.length +
                      angleOffset +
                      (360 - getKnobAngle(knobPosition))
                    }
                    origin={`${x}, ${y}`}
                  >
                    <Text
                      x={_x}
                      y={_y}
                      fill={textColors[i % textColors.length]}
                      textAnchor={textAnchor}
                      fontSize={16}
                      {...textStyle}
                    >
                      {number}
                    </Text>
                  </G>
                </G>
              )
            })}
          </G>
        </AnimatedSvg>
        {props.children}
      </Animated.View>
    </View>
  )
}

const getKnobAngle = (position: knobPosition) => {
  if (position === 'right') {
    return 90
  } else if (position === 'bottom') {
    return 180
  } else if (position === 'left') {
    return 270
  }

  return 0
}

type knobPosition = 'top' | 'right' | 'left' | 'bottom'

type Props = {
  /** Array of items to be displayed in the wheel */
  data?: any[]
  /** Index of items where the wheel will stop */
  stop?: number
  /** Background Colors for each segment */
  backgroundColors?: string[]
  /** Text Colors for each segment */
  textColors?: string[]
  /** Margin between text and center of the segment */
  textDistance?: 0
  /** Distance of the option texts from the center of the roulette */
  duration?: number
  /** Position of the indicator */
  knobPosition?: knobPosition
  /** Size of the wheel */
  size?: number
  /** Inner Radius of the wheel */
  innerRadius?: number
  /** Space between segments */
  dividerWidth?: number
  /** Speed of the animation */
  speed?: number
  /** Compact mode for each segment, knobPosition - left and right are auto compact mode */
  compactMode?: boolean
  /** Style of the text */
  textStyle?: TextProps
  /** Callback function that trigger when animation finished */
  onFinished?: (value: any, index: number) => void
}

export default FortuneWheelNative
