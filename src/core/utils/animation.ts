import type { AnimationCallback } from 'react-native-reanimated'
import { scheduleOnRN } from 'react-native-worklets'

export const withAnimationCallbackJSThread = (
  finishedAnimationCallback?: () => void,
  notFinishedAnimationCallback?: () => void
): AnimationCallback => {
  const fcb = () => finishedAnimationCallback?.()
  const nfcb = () => notFinishedAnimationCallback?.()

  return (finished) => {
    'worklet'

    if (finished) {
      scheduleOnRN(fcb)
    } else {
      scheduleOnRN(nfcb)
    }
  }
}
