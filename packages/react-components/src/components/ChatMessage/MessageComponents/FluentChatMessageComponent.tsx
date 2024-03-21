// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { _formatString } from '@internal/acs-ui-common';
import React, { useCallback, useMemo } from 'react';
import { MessageProps, _ChatMessageProps } from '../../MessageThread';
import {
  gutterWithAvatar,
  gutterWithHiddenAvatar,
  useChatMessageRenderStyles
} from '../../styles/MessageThread.styles';
import { IPersona, PersonaSize, mergeStyles, Persona } from '@fluentui/react';
import { mergeClasses } from '@fluentui/react-components';
import { createStyleFromV8Style } from '../../styles/v8StyleShim';
import { ChatMessage as FluentChatMessage } from '@fluentui-contrib/react-chat';
import { getFluentUIAttachedValue } from '../../utils/ChatMessageComponentUtils';
import { ChatMessageComponentWrapperProps } from '../ChatMessageComponentWrapper';
/* @conditional-compile-remove(data-loss-prevention) */
import { BlockedMessage } from '../../../types/ChatMessage';
import { ChatMessage } from '../../../types/ChatMessage';
import { ChatMessageComponentAsMessageBubble } from './ChatMessageComponentAsMessageBubble';

/**
 * Props for {@link FluentChatMessageComponentWrapper}
 *
 * @private
 */
export type FluentChatMessageComponentWrapperProps = ChatMessageComponentWrapperProps & {
  message: ChatMessage | /* @conditional-compile-remove(data-loss-prevention) */ BlockedMessage;
};

/**
 * The component for rendering a chat message using Fluent UI components
 * and handling default and custom renderers.
 * This component handles rendering for chat message body, avatar and message status.
 * The chat message body, avatar and message status should be shown for both default and custom renderers.
 *
 * @private
 */
export const FluentChatMessageComponent = (props: FluentChatMessageComponentWrapperProps): JSX.Element => {
  const {
    message,
    styles,
    shouldOverlapAvatarAndMessage,
    onRenderMessage,
    onRenderAvatar,
    /* @conditional-compile-remove(date-time-customization) */
    onDisplayDateTimeString,
    inlineImageOptions,
    /* @conditional-compile-remove(file-sharing) */
    fileDownloadHandler,
    userId,
    /* @conditional-compile-remove(file-sharing) */
    onRenderFileDownloads,
    /* @conditional-compile-remove(mention) */
    mentionOptions
  } = props;
  const chatMessageRenderStyles = useChatMessageRenderStyles();

  const onRenderFileDownloadsMemo = useMemo(() => {
    /* @conditional-compile-remove(file-sharing) */
    return onRenderFileDownloads;
    return undefined;
  }, [/* @conditional-compile-remove(file-sharing) */ onRenderFileDownloads]);

  // To rerender the defaultChatMessageRenderer if app running across days(every new day chat time stamp
  // needs to be regenerated), the dependency on "new Date().toDateString()"" is added.
  const defaultChatMessageRenderer = useCallback(
    (messageProps: MessageProps) => {
      if (
        messageProps.message.messageType === 'chat' ||
        /* @conditional-compile-remove(data-loss-prevention) */ messageProps.message.messageType === 'blocked'
      ) {
        return (
          <ChatMessageComponentAsMessageBubble
            {...messageProps}
            /* @conditional-compile-remove(file-sharing) */
            onRenderFileDownloads={onRenderFileDownloadsMemo}
            /* @conditional-compile-remove(file-sharing) */
            strings={messageProps.strings}
            message={messageProps.message}
            userId={userId}
            shouldOverlapAvatarAndMessage={shouldOverlapAvatarAndMessage}
            /* @conditional-compile-remove(date-time-customization) */
            onDisplayDateTimeString={onDisplayDateTimeString}
            inlineImageOptions={inlineImageOptions}
            /* @conditional-compile-remove(file-sharing) */
            fileDownloadHandler={fileDownloadHandler}
            /* @conditional-compile-remove(mention) */
            mentionDisplayOptions={mentionOptions?.displayOptions}
          />
        );
      }
      return <></>;
    },
    [
      onRenderFileDownloadsMemo,
      shouldOverlapAvatarAndMessage,
      userId,
      /* @conditional-compile-remove(date-time-customization) */
      onDisplayDateTimeString,
      inlineImageOptions,
      /* @conditional-compile-remove(file-sharing) */
      fileDownloadHandler,
      /* @conditional-compile-remove(mention) */
      mentionOptions,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      new Date().toDateString()
    ]
  );

  const messageRenderer = useCallback(
    (messageProps: MessageProps) => {
      return onRenderMessage === undefined
        ? defaultChatMessageRenderer({ ...messageProps })
        : onRenderMessage(messageProps, defaultChatMessageRenderer);
    },
    [defaultChatMessageRenderer, onRenderMessage]
  );

  const shouldShowAvatar = useMemo(() => {
    return message.attached === 'top' || message.attached === false;
  }, [message.attached]);

  const attached = useMemo(() => {
    return getFluentUIAttachedValue(message.attached);
  }, [message.attached]);

  const messageRootProps = useMemo(() => {
    return { className: mergeClasses(chatMessageRenderStyles.rootMessage, chatMessageRenderStyles.rootCommon) };
  }, [chatMessageRenderStyles.rootCommon, chatMessageRenderStyles.rootMessage]);

  const messageBodyProps = useMemo(() => {
    return {
      // chatItemMessageContainer used in className and style prop as style prop can't handle CSS selectors
      className: mergeClasses(
        chatMessageRenderStyles.bodyCommon,
        !shouldShowAvatar ? chatMessageRenderStyles.bodyWithoutAvatar : chatMessageRenderStyles.bodyWithAvatar,
        shouldOverlapAvatarAndMessage ? chatMessageRenderStyles.avatarOverlap : chatMessageRenderStyles.avatarNoOverlap,
        mergeStyles(styles?.chatItemMessageContainer)
      ),
      style:
        styles?.chatItemMessageContainer !== undefined ? createStyleFromV8Style(styles?.chatItemMessageContainer) : {},
      // make body not focusable to remove repetitions from narrators.
      // inner components are already focusable
      tabIndex: -1,
      role: 'none'
    };
  }, [
    chatMessageRenderStyles.avatarNoOverlap,
    chatMessageRenderStyles.avatarOverlap,
    chatMessageRenderStyles.bodyCommon,
    chatMessageRenderStyles.bodyWithAvatar,
    chatMessageRenderStyles.bodyWithoutAvatar,
    shouldOverlapAvatarAndMessage,
    shouldShowAvatar,
    styles?.chatItemMessageContainer
  ]);

  const avatar = useMemo(() => {
    const chatAvatarStyle = shouldShowAvatar ? gutterWithAvatar : gutterWithHiddenAvatar;
    const personaOptions: IPersona = {
      hidePersonaDetails: true,
      size: PersonaSize.size32,
      text: message.senderDisplayName,
      showOverflowTooltip: false
    };
    return (
      <div className={mergeStyles(chatAvatarStyle)}>
        {onRenderAvatar ? onRenderAvatar?.(message.senderId, personaOptions) : <Persona {...personaOptions} />}
      </div>
    );
  }, [message.senderDisplayName, message.senderId, onRenderAvatar, shouldShowAvatar]);

  // Fluent UI message components are used here as for default message renderer,
  // timestamp and author name should be shown but they aren't shown for custom renderer.
  // More investigations are needed to check if this can be simplified with states.
  // Avatar should be shown for both custom and default renderers.
  return (
    <FluentChatMessage attached={attached} root={messageRootProps} body={messageBodyProps} avatar={avatar}>
      {messageRenderer({ ...props })}
    </FluentChatMessage>
  );
};
