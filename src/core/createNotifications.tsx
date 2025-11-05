import React, { ReactNode } from 'react'
import { InAppNotificationsConfig } from '../defaultConfig/defaultConfig'

import { getNotificationEmmiter } from './services/NotificationEmitterApi'
import type { CreateNotificationsReturnType, NotificationsConfig, VariantsMap } from '../types'
import { NotificationsRenderer } from './renderers/NotificationsRenderer'
import { NotificationContext } from './hooks/useNotificationConfig'
import type { DefaultVariants } from '../defaultConfig/types'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export const createNotifications = <V extends VariantsMap = DefaultVariants>(
  config?: Partial<NotificationsConfig<V>>
): CreateNotificationsReturnType<V> => {
  const emitter = getNotificationEmmiter<V>()
  const CustomVariantsTypeHelper = {} as V

  const NotificationsProvider = ({ children = null }: { children?: ReactNode }) => {
    return (
      <GestureHandlerRootView>
        <NotificationContext.Provider value={{ ...InAppNotificationsConfig, ...config }}>
          {children}
          <NotificationsRenderer />
        </NotificationContext.Provider>
      </GestureHandlerRootView>
    )
  }

  const ModalNotificationsProvider = ({
    children = null,
    notificationTopPosition,
  }: {
    children?: ReactNode
    notificationTopPosition?: number
  }) => {
    return (
      <GestureHandlerRootView>
        <NotificationContext.Provider value={{ ...InAppNotificationsConfig, ...config }}>
          {children}
          <NotificationsRenderer
            isModalProvider={true}
            notificationTopPosition={notificationTopPosition}
          />
        </NotificationContext.Provider>
      </GestureHandlerRootView>
    )
  }

  const useNotifications = () => emitter

  return {
    useNotifications,
    NotificationsProvider,
    CustomVariantsTypeHelper,
    ModalNotificationsProvider,
    ...emitter,
  }
}
