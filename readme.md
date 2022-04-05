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

| Property           | Type                    | Default             | Desc                                                                                          |
| ------------------ | ----------------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| items?             | `Array`                 | [1 - 10]            | Fortune Wheel Items                                                                           |
| stop?              | `number`                | undefined           | Index of segment when wheel spinning stop                                                     |
| onFinished?        | `Function(value,index)` | `-`                 | Call back to trigger when spinning stopped                                                    |
| colors?            | `Array`                 | ['#fefefe', '#000'] | Background color for each segment                                                             |
| textColors?        | `Array`                 | ['#000', '#fff']    | Text color for each segment                                                                   |
| textMargin?        | `Number`                | 0                   | Margin between text and center of the segment                                                 |
| duration? _(ms)_   | `Number`                | 5000                | Completion time (ms)                                                                          |
| speed?             | `Number`                | 60                  | Spinning speed(1-100)                                                                         |
| indicatorPosition? | `Enum`                  | `bottom`            | Position of indicator(top, right, bottom, left )                                              |
| size?              | `Number`                | screen width        | Size of wheel                                                                                 |
| dividerWidth?      | `Number`                | 0                   | Divider width between segments                                                                |
| textStyle?         | `TextStyle`             | none                | Text styles                                                                                   |
| compactMode?       | `Boolean`               | false               | Compact mode for each segment, `indicatorPosition` : "left" and "right" are auto compact mode |

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

## Contributing

Contributions are always welcome!
