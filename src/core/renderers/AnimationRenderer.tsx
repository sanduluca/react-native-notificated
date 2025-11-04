import React, { ReactNode } from 'react'
import Animated from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Platform, View } from 'react-native'
import type { NotificationState } from '../hooks/useNotificationsStates'
import type { AnimationAPI } from '../hooks/useAnimationAPI'
import { styles } from '../utils/styles'
import { Constants } from '../config'

type Props = {
  children: ReactNode
  state: Pick<NotificationState, 'notificationEvent' | 'panHandlerRef' | 'longPressHandlerRef'>
  animationAPI: Pick<
    AnimationAPI,
    'animatedStyles' | 'cancelTransitionAnimation' | 'revokeTransitionAnimation'
  >
}

export const AnimationRenderer = ({ children, animationAPI, state }: Props) => {
  const longPressGesture = Gesture.LongPress()
    .minDuration(800)
    .maxDistance(Constants.maxLongPressDragDistance)
    .simultaneousWithExternalGesture(state.panHandlerRef)
    .onEnd(animationAPI.revokeTransitionAnimation)
    .onStart(animationAPI.cancelTransitionAnimation)
  if (state?.longPressHandlerRef) {
    longPressGesture.withRef(state.longPressHandlerRef)
  }
  return (
    <Animated.View
      style={animationAPI.animatedStyles}
      needsOffscreenAlphaCompositing={Platform.OS === 'android'}>
      {state.notificationEvent && (
        <GestureDetector gesture={longPressGesture}>
          <View style={styles.boxWrapper}>{children}</View>
        </GestureDetector>
      )}
    </Animated.View>
  )
}
