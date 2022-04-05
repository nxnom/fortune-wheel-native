import React, { useEffect } from 'react'
import { Dimensions, Animated, View, StyleProp, ViewStyle } from 'react-native'
import * as d3Shape from 'd3-shape'

import Svg, { G, Text, Path, TextAnchor, TextProps } from 'react-native-svg'

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const { width: screenWidth } = Dimensions.get('screen')

const _angle = new Animated.Value(0)
let currentAngle = 0

const FortuneWheelNative: React.FC<Props> = (props) => {
  const {
    items = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    colors = ['#fefefe', '#000'],
    textColors = ['#000', '#fff'],
    textMargin = 0,
    duration = 3000,
    indicatorPosition = 'top',
    style,
    size = screenWidth,
    dividerWidth = 0,
    innerRadius = 0,
    textStyle = {
      fontSize: 16,
    },
    selectedIndex,
    onFinished = () => null,
    children,
  } = props

  const angleBySegment = 360 / items.length
  const angleOffset = angleBySegment / 2

  useEffect(() => {
    if (typeof selectedIndex !== 'number') return

    if (selectedIndex > items.length) {
      console.error('Index is out of range')
      return
    }

    const play = () => {
      /**
       * calculate the base winning angle
       * this value is the angle of the segment that the wheel will stop
       * this is base degree(0 - 360), additional values will be calculated later
       */
      const winningAngle = 360 - selectedIndex * angleBySegment

      /**
       * this value help us to calculate the angle of currently stopped segment
       * there is a chance {currentAngle} is not divided by 360 evenly
       * that can cause incorrect {winningAngle} values.
       * so, we need to make the {currentAngle} value divided by 360 evenly
       */
      const currentCircleAngle = currentAngle + (360 - (currentAngle % 360))

      /**
       * create more spinning angle base on duration for smooth animation
       */
      const durationAngle = (360 * duration) / 1000

      Animated.timing(_angle, {
        toValue: winningAngle + currentCircleAngle + durationAngle,
        duration: duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinished()
      })
    }

    play()
  }, [selectedIndex])

  useEffect(() => {
    _angle.addListener(({ value }) => {
      currentAngle = value
    })

    return () => {
      _angle.removeAllListeners()
    }
  }, [])

  const WheelBuilder = () => {
    const data = items.map((_) => 1)
    const arcs = d3Shape.pie()(data)
    return arcs.map((arc, index) => {
      const instance = d3Shape
        .arc()
        .padAngle(dividerWidth)
        .outerRadius(size / 2)
        .innerRadius(innerRadius)
      return {
        path: instance(arc as any),
        color: colors[index % colors.length],
        value: items[index],
        centroid: instance.centroid(arc as any),
      }
    })
  }

  return (
    <View
      style={{
        transform: [{ rotate: `${getIndicatorAngle(indicatorPosition)}deg` }],
      }}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            transform: [
              {
                rotate: _angle.interpolate({
                  inputRange: [-360, 0, 360],
                  outputRange: [`-${360}deg`, `0deg`, `${360}deg`],
                }),
              },
            ],
            width: size - 20,
            height: size - 20,
            borderRadius: (size - 20) / 2,
          },
          style,
        ]}
      >
        <AnimatedSvg
          width={size - 40}
          height={size - 40}
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

              if (indicatorPosition === 'top') {
                _y = y - 40 + textMargin * -1
              } else if (indicatorPosition === 'right') {
                _x = x + 30 + textMargin
                _y = y + 5
                textAnchor = 'start'
              } else if (indicatorPosition === 'bottom') {
                _y = y + 50 + textMargin
              } else if (indicatorPosition === 'left') {
                _x = x - 30 + textMargin * -1
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
                      (360 - getIndicatorAngle(indicatorPosition))
                    }
                    origin={`${x}, ${y}`}
                  >
                    <Text
                      x={_x}
                      y={_y}
                      fill={textColors[i % textColors.length]}
                      textAnchor={textAnchor}
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
        {children}
      </Animated.View>
    </View>
  )
}

const getIndicatorAngle = (position: IndicatorPosition) => {
  if (position === 'right') {
    return 90
  } else if (position === 'bottom') {
    return 180
  } else if (position === 'left') {
    return 270
  }

  return 0
}

type IndicatorPosition = 'top' | 'right' | 'left' | 'bottom'

type Props = {
  items?: any[]
  colors?: string[]
  textColors?: string[]
  textMargin?: 0
  duration?: number
  indicatorPosition?: IndicatorPosition
  style?: StyleProp<ViewStyle>
  size?: number
  dividerWidth?: number
  innerRadius?: number
  textStyle?: TextProps
  selectedIndex?: number
  onFinished?: VoidFunction
}

export default FortuneWheelNative
