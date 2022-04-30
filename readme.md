# fortune-wheel-native

Fortune Wheel for react native apps

## Screenshots

![App Screenshot](https://raw.githubusercontent.com/ebrain-dev/fortune-wheel-native/master/images/fortunewheel.gif)

View this source code in [Here](https://github.com/ebrain-dev/fortune-wheel-native/tree/master/example). or View Project in [Expo](https://expo.dev/@ebrain/fortune-wheel-native-example)

## Installation

```bash
  npm i fortune-wheel-native
  # or
  yarn add fortune-wheel-native
```

## Properties

Wheel will spin when `stop` state change.

**Important Note**

_If you want to spin multiple time reset the `stop` state when `onFinished` is trigger ._

| Property          | Type                    | Default             | Desc                                                                                                                                |
| ----------------- | ----------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| data?             | `Array`                 | [1 - 10]            | Fortune Wheel data                                                                                                                  |
| stop?             | `number`                | undefined           | Index of segment when wheel spinning stop                                                                                           |
| onFinished?       | `Function(value,index)` | `-`                 | Call back to trigger when spinning stopped                                                                                          |
| backgroundColors? | `Array`                 | ['#fefefe', '#000'] | Background color for each segment                                                                                                   |
| textColors?       | `Array`                 | ['#000', '#fff']    | Text color for each segment                                                                                                         |
| textDistance?     | `Number`                | 0                   | Distance between text and center of the segment                                                                                     |
| duration? _(ms)_  | `Number`                | 5000                | Completion time (ms)                                                                                                                |
| speed?            | `Number`                | 60                  | Spinning speed(1-100)                                                                                                               |
| knobPosition?     | `Enum`                  | `bottom`            | Position of knob(top, right, bottom, left )                                                                                         |
| size?             | `Number`                | screen width        | Size of wheel                                                                                                                       |
| innerRadius?      | Number                  | dividerWidth        | Inner Radius of the wheel                                                                                                           |
| dividerWidth?     | `Number`                | 0                   | Divider width between segments                                                                                                      |
| textStyle?        | `TextStyle`             | none                | Text styles                                                                                                                         |
| compactMode?      | `Boolean`               | false               | When 'true', sets the texts perpendicular to the roulette's radial lines, `knobPosition` : "left" and "right" are auto compact mode |

## Basic Usage

```javascript
import React, { useState } from 'react'
import { View, Button } from 'react-native'
import FortuneWheelNative from 'fortune-wheel-native'

const MyScreen = () => {
  const [stop, setStop] = useState()

  const play = () => {
    const random = Math.floor(Math.random() * 10)
    setStop(random)
  }

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
```

### Example

If you have components to spin along side with the fortune wheel. Wrap your components inside `FortuneWheelNative`

```javascript
<FortuneWheelNative>
  <YourComponent /> // this will also spin
</FortuneWheelNative>
```
