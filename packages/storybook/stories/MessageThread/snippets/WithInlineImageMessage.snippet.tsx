import {
  FluentThemeProvider,
  MessageThread,
  Message,
  ImageOverlay,
  ChatMessage,
  InlineImage
} from '@azure/communication-react';
import { Persona, PersonaSize } from '@fluentui/react';
import React, { useState } from 'react';

export const MessageThreadWithInlineImageExample: () => JSX.Element = () => {
  const [overlayImageItem, setOverlayImageItem] =
    useState<{ imageSrc: string; title: string; titleIcon: JSX.Element; downloadFilename: string }>();

  const onInlineImageClicked = (attachmentId: string, messageId: string): Promise<void> => {
    const filteredMessages = messages?.filter((message) => {
      return message.messageId === messageId;
    });
    if (!filteredMessages || filteredMessages.length <= 0) {
      return Promise.reject(`Message not found with messageId ${messageId}`);
    }
    const chatMessage = filteredMessages[0] as ChatMessage;

    const specificImage = chatMessage.inlineImages?.filter((attachment) => {
      return attachment.id === attachmentId;
    });

    if (!specificImage || specificImage.length <= 0) {
      return Promise.reject(`Attachment not found with id ${attachmentId}`);
    }

    const attachment = specificImage[0];
    const title = 'Image';
    const titleIcon = (
      <Persona text={chatMessage.senderDisplayName} size={PersonaSize.size32} hidePersonaDetails={true} />
    );
    const overlayImage = {
      title,
      titleIcon,
      downloadFilename: attachment.id,
      imageSrc: attachment.url
    };
    setOverlayImageItem(overlayImage);
    return Promise.resolve();
  };

  /* @conditional-compile-remove(image-overlay) */
  const inlineImageOptions = {
    onRenderInlineImage: (
      inlineImage: InlineImage,
      defaultOnRender: (inlineImage: InlineImage) => JSX.Element
    ): JSX.Element => {
      return (
        <span
          onClick={() => onInlineImageClicked(inlineImage.imgAttrs.id || '', inlineImage.messageId)}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onInlineImageClicked(inlineImage.imgAttrs.id || '', inlineImage.messageId);
            }
          }}
        >
          {defaultOnRender(inlineImage)}
        </span>
      );
    }
  };

  const messages: Message[] = [
    {
      messageType: 'chat',
      senderId: 'user3',
      content:
        '<p>How should I design my new house?</p><p><img alt="image" src="images/inlineImageExample1.png" itemscope="png" width="166.5625" height="250" id="SomeImageId1" style="vertical-align:bottom"></p><p><img alt="image" src="images/inlineImageExample2.png" itemscope="png" width="374.53183520599254" height="250" id="SomeImageId2" style="vertical-align:bottom"></p><p>&nbsp;</p>',
      senderDisplayName: 'Miguel Garcia',
      messageId: Math.random().toString(),
      createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
      mine: false,
      attached: false,
      contentType: 'html',
      inlineImages: [
        {
          id: 'SomeImageId1',
          attachmentType: 'inlineImage',
          url: 'images/inlineImageExample1.png',
          previewUrl: 'images/inlineImageExample1.png'
        },
        {
          id: 'SomeImageId2',
          attachmentType: 'inlineImage',
          url: 'images/inlineImageExample2.png',
          previewUrl: 'images/inlineImageExample2.png'
        }
      ]
    },
    {
      messageType: 'chat',
      senderId: 'user2',
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      content: 'Cool, I love the second one!',
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: true,
      attached: false,
      contentType: 'text'
    }
  ];
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={messages} inlineImageOptions={inlineImageOptions} />
      {
        <ImageOverlay
          isOpen={overlayImageItem !== undefined}
          imageSrc={overlayImageItem?.imageSrc || ''}
          title="Image"
          onDismiss={() => {
            setOverlayImageItem(undefined);
          }}
          onDownloadButtonClicked={() => {
            alert('Download button clicked');
          }}
        />
      }
    </FluentThemeProvider>
  );
};
