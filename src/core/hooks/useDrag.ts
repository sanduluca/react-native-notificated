import { useCallback } from 'react'
import {
  Gesture,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  State,
} from 'react-native-gesture-handler'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import type { GestureConfig, DragDirection } from '../../types/gestures'
import { shouldTriggerGesture } from '../gestures/shouldTriggerGesture'

export const useDrag = (config: GestureConfig) => {
  const x = useSharedValue(0)
  const y = useSharedValue(0)
  const directions = getDragDirections(config.direction)

  const resetDrag = useCallback(() => {
    x.value = withSpring(0, { mass: 0.2 })
    y.value = withSpring(0, { mass: 0.2 })
  }, [x, y])

  const dragGestureHandler = Gesture.Pan()
    .onStart((event) => {
      x.value = event.translationX
      y.value = event.translationY
    })
    .onUpdate((event) => {
      x.value = event.translationX + directions.x
      y.value = event.translationY + directions.y
    })
    .onEnd(() => {
      x.value = withSpring(0, { mass: 0.2 })
      y.value = withSpring(0, { mass: 0.2 })
    })

  const dragStateHandler = useCallback(
    (onDragSuccess: () => void, onDragFail: () => void) =>
      (event: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
        const { state } = event
        if (state !== State.END) return event

        const dragTriggered = shouldTriggerGesture(config, {
          distance: [event.translationX, event.translationY],
          velocity: [event.velocityX, event.velocityY],
        })

        if (dragTriggered) onDragSuccess()
        else onDragFail()

        return event
      },
    [config]
  )

  const dragStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }))

  return { dragGestureHandler, dragStateHandler, dragStyles, resetDrag }
}

const getDragDirections = (direction: DragDirection) => {
  switch (direction) {
    case 'full':
      return { x: 1, y: 1 }
    case 'x':
      return { x: 1, y: 0 }
    case 'y':
      return { x: 0, y: 1 }
    case 'none':
      return { x: 0, y: 0 }
    // What should be correct default value? => Platform specific?
    default:
      return { x: 0, y: 0 }
  }
}
