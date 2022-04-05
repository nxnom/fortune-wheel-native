import React, { useEffect } from 'react'
import { Dimensions, Animated, View } from 'react-native'
import * as d3Shape from 'd3-shape'

import Svg, { G, Text, Path, TextAnchor, TextProps } from 'react-native-svg'

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const { width: screenWidth } = Dimensions.get('screen')

const toCircle = (angle: number = 0) => angle + (360 - (angle % 360))

const _angle = new Animated.Value(0)
let currentAngle = 0

/**
 * @description
 * This component is a native implementation of FortuneWheel component
 *
 * Learn More:
 *
 * - [NPM](https://www.npmjs.com/package/fortune-wheel-native)
 *
 *
 * Props:
 *
 * @param items - array of items to be displayed in the wheel
 * @param colors - array of colors to be used for each segment
 * @param textColors - array of colors to be used for each segment text
 * @param textMargin - margin between text and center of the segment
 * @param duration - duration of the animation
 * @param indicatorPosition - position of the indicator
 * @param size - size of the component
 * @param dividerWidth - width of the divider between segments
 * @param speed - speed of the animation
 * @param textStyle - style of the text
 * @param selectedIndex - index of the selected item
 * @param onFinished - callback function to be called when animation is finished
 * @returns JSX.Element
 *
 * @example
 * import FortuneWheelNative from 'fortune-wheel-native'
 *
 * const MyScreen = () => {
 *     return (
 *           <FortuneWheelNative
 *             items={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
 *             colors={['#fefefe', '#000']}
 *             textColors={['#000', '#fff']}
 *             textMargin={0}
 *             duration={5000}
 *             indicatorPosition='bottom'
 *             size={300}
 *             dividerWidth={0}
 *             speed={60}
 *             textStyle={{ fontSize: 16 }}
 *             selectedIndex={3}
 *             onFinished={() => console.log('finished')}
 *          />
 *     )
 * }
 *
 * export default MyScreen
 *
 */
const FortuneWheelNative: React.FC<Props> = (props) => {
  const {
    items = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    colors = ['#fefefe', '#000'],
    textColors = ['#000', '#fff'],
    textMargin = 0,
    duration = 5000,
    indicatorPosition = 'bottom',
    size = screenWidth,
    dividerWidth = 0,
    speed = 60,
    textStyle,
    selectedIndex,
    onFinished = () => null,
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
      const currentCircleAngle = toCircle(currentAngle)

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

      Animated.timing(_angle, {
        toValue: winningAngle + currentCircleAngle + speedAngle,
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
        .padAngle(dividerWidth / 100)
        .outerRadius(size / 2)
        .innerRadius(0)
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
  size?: number
  dividerWidth?: number
  speed?: number
  textStyle?: TextProps
  selectedIndex?: number
  onFinished?: VoidFunction
}

export default FortuneWheelNative
