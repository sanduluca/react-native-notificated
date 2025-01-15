import { generateNotificationId } from '../utils/uuid'
import type {
  Emmiter,
  Modify,
  Notify,
  Remove,
  UseNotification,
  VariantsMap,
  Variants,
} from '../../types'
import { emitter } from './NotificationEmitter'

export const remove: Remove = (id) => emitter.emit('remove_notification', { id })

export const modify: Modify = (id: string, { params, config }) =>
  emitter.emit('modify_notification', { id, params, config })

export const notify: Notify = (
  notificationType: any,
  titleOrSetup: any,
  descriptionOrSetup?: any,
  setup?: any
) => {
  let setupObj

  if (typeof titleOrSetup === 'string') {
    setupObj = {
      ...(typeof descriptionOrSetup === 'object' ? descriptionOrSetup : setup),
      params: {
        title: titleOrSetup,
        description: typeof descriptionOrSetup === 'string' ? descriptionOrSetup : undefined,
      },
    }
  } else {
    setupObj = titleOrSetup
  }
  const id = generateNotificationId(notificationType.toString())
  emitter.emit('add_notification', {
    notificationType,
    id,
    ...setupObj,
  })
  return {
    id,
  }
}

const NotificationEmitterApi = {
  remove,
  modify,
  notify,
}

export const getNotificationEmmiter = <V extends VariantsMap = Variants>(): Emmiter<V> => {
  return NotificationEmitterApi as unknown as Emmiter<V>
}

export const useNotifications: UseNotification<Variants> = () => NotificationEmitterApi

export default NotificationEmitterApi
