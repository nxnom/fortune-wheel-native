import { useEffect } from 'react'
import { Dimensions, Animated, View } from 'react-native'
import * as d3Shape from 'd3-shape'

import Svg, { G, Text, Path } from 'react-native-svg'

const AnimatedSvg = Animated.createAnimatedComponent(Svg)

const { width: screenWidth } = Dimensions.get('screen')

const _angle = new Animated.Value(0)
let currentAngle = 0

const toCircle = (angle) => angle + (360 - (angle % 360))

const FortuneWheelNative = (props) => {
  let {
    items = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    colors = ['#fefefe', '#000000'],
    textColors = ['#000', '#fff'],
    speed = 60,
    textMargin = 0,
    duration = 5000,
    indicatorPosition = 'top',
    compactMode = false,
    style,
    size = screenWidth,
    dividerWidth = 0,
    textStyle,
    stop,
    onFinished = (v, i) => null,
  } = props

  let wheelInitialDeg = getIndicatorAngle(indicatorPosition)

  if (compactMode) {
    if (indicatorPosition === 'top') {
      wheelInitialDeg = 0
      indicatorPosition = 'right'
    }
    if (indicatorPosition === 'bottom') {
      wheelInitialDeg = 180
      indicatorPosition = 'left'
    }
  }

  const angleBySegment = 360 / items.length
  const angleOffset = angleBySegment / 2

  useEffect(() => {
    console.log('state change')
    if (typeof stop !== 'number') return

    if (stop > items.length) {
      console.error('Index is out of range')
      return
    }

    const play = () => {
      console.log(items[stop])
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
      const currentCircleAngle = toCircle(currentAngle)

      /**
       * create more spinning angle base on duration for smooth animation
       */

      let _speed = speed

      if (speed < 1 || speed > 200) {
        console.error('Speed is out of range,reset to default value(60)')
        _speed = 60
      }

      const durationAngle = toCircle(
        (360 * duration) / (10 * (201 - _speed * 2))
      )

      Animated.timing(_angle, {
        toValue: winningAngle + currentCircleAngle + durationAngle,
        duration: duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) onFinished(items[stop], stop)
      })
    }

    play()
  }, [stop])

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
        path: instance(arc),
        color: colors[index % colors.length],
        value: items[index],
        centroid: instance.centroid(arc),
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
          style,
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
              let textAnchor = 'middle'

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

const getIndicatorAngle = (position) => {
  if (position === 'right') {
    return 90
  } else if (position === 'bottom') {
    return 180
  } else if (position === 'left') {
    return 270
  }

  return 0
}

export default FortuneWheelNative
