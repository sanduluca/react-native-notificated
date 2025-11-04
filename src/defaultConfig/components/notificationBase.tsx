import React from 'react'
import { Image, Text, View } from 'react-native'
import {
  constShadow,
  getContainerStyles,
  getDescriptionStyle,
  getLeftAccentStyle,
  getTitleStyle,
} from '../stylesUtils'
import { styles } from '../styles'
import type { MergedNotificationStyleConfig, NotificationOwnProps } from '../types'
import { Pressable } from 'react-native-gesture-handler'
import { useNotificationController } from '../../'

export const NotificationBase = (props: NotificationOwnProps & MergedNotificationStyleConfig) => {
  const containerStyles = getContainerStyles({ ...props })
  const titleStyle = getTitleStyle({ ...props })
  const descriptionStyle = getDescriptionStyle({ ...props })
  const accentStyle = getLeftAccentStyle(props.accentColor)
  const rightIconSource =
    props.theme === 'regular'
      ? require('../../assets/images/close-regularMode.png')
      : require('../../assets/images/close-darkMode.png')
  const { remove } = useNotificationController()

  const renderLeftIcon = () =>
    typeof props.leftIconSource === 'object' ? (
      props.leftIconSource
    ) : (
      <Image source={props.leftIconSource!} style={{ ...styles.icon, ...props?.imageStyle }} />
    )

  const renderRightIcon = () =>
    !props.hideCloseButton && (
      <Pressable
        onPress={() => {
          remove()
        }}>
        <Image source={rightIconSource} style={styles.icon} />
      </Pressable>
    )

  const renderTitle = () => <Text style={titleStyle}>{props.title}</Text>
  const renderDescription = () =>
    !!props.description && (
      <Text style={descriptionStyle} numberOfLines={props.multiline ?? 1}>
        {props.description}
      </Text>
    )

  return (
    <View style={constShadow(props.theme, props.borderRadius)}>
      <Pressable onPress={() => props.onPress?.()}>
        <View style={containerStyles}>
          {props.borderType === 'accent' && <View style={accentStyle} />}
          <View style={styles.content}>
            {props.defaultIconType !== 'no-icon' ? renderLeftIcon() : null}
            <View style={styles.textWrapper}>
              {renderTitle()}
              {renderDescription()}
            </View>
            {renderRightIcon()}
          </View>
        </View>
      </Pressable>
    </View>
  )
}
