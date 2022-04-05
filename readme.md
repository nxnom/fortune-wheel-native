# Wheel of Fortune

Fortune Wheel for react native apps

## Installation

```bash
  npm i fortune-wheel-native
  yarn add fortune-wheel-native
```

## Usage

Wheel will spin when `selectedIndex` is updated.

| Property           | Type        | Default             | Desc                                             |
| ------------------ | ----------- | ------------------- | ------------------------------------------------ |
| items?             | `Array`     | [1 - 10]            | Fortune Wheel Items                              |
| selectedIndex?     | `number`    | undefined           | Index of segment when wheel spinning stop        |
| onFinished?        | `Function`  | `-`                 | Trigger when spinning stopped                    |
| colors?            | `Array`     | ['#fefefe', '#000'] | Segment background colors                        |
| textColors?        | `Array`     | ['#000', '#fff']    | Text colors                                      |
| textMargin?        | `Number`    | 0                   | Space between text and center of the segment     |
| duration? _(ms)_   | `Number`    | 3000                | Completion time (ms)                             |
| speed?             | `Number`    | 60                  | Spinning speed(1-100)                            |
| indicatorPosition? | `Enum`      | `bottom`            | Position of indicator(top, right, bottom, left ) |
| size?              | `Number`    | screen width        | Size of wheel                                    |
| dividerWidth?      | `Number`    | 0                   | Divider width between segments                   |
| textStyle?         | `TextStyle` | Default Style       | Text styles                                      |
