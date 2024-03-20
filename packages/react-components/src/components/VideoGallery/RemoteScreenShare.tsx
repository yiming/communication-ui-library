// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Spinner, SpinnerSize, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { useLocale } from '../../localization';
import { VideoTile } from '../VideoTile';
import { CreateVideoStreamViewResult, VideoStreamOptions } from '../../types';
/* @conditional-compile-remove(reaction) */
import { ReactionResources, VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../../types';
import { loadingStyle } from './styles/RemoteScreenShare.styles';
import { _formatString } from '@internal/acs-ui-common';
/* @conditional-compile-remove(reaction) */
import { MeetingReactionOverlay } from '../MeetingReactionOverlay';

/**
 * A memoized version of VideoTile for rendering the remote screen share stream. React.memo is used for a performance
 * boost by memoizing the same rendered component to avoid rerendering this when the parent component rerenders.
 * https://reactjs.org/docs/react-api.html#reactmemo
 */
export const RemoteScreenShare = React.memo(
  (props: {
    userId: string;
    displayName?: string;
    onCreateRemoteStreamView?: (
      userId: string,
      options?: VideoStreamOptions
    ) => Promise<void | CreateVideoStreamViewResult>;
    onDisposeRemoteStreamView?: (userId: string) => Promise<void>;
    isAvailable?: boolean;
    isReceiving?: boolean;
    isMuted?: boolean;
    isSpeaking?: boolean;
    renderElement?: JSX.Element | null;
    participantVideoScalingMode?: VideoStreamOptions;
    /* @conditional-compile-remove(reaction) */
    reactionResources?: ReactionResources;
    /* @conditional-compile-remove(reaction) */
    localParticipant?: VideoGalleryLocalParticipant;
    /* @conditional-compile-remove(reaction) */
    remoteParticipants?: VideoGalleryRemoteParticipant[];
    /* @conditional-compile-remove(ppt-live) */
    isPPTLive?: boolean;
  }) => {
    const {
      userId,
      displayName,
      isMuted,
      renderElement,
      onCreateRemoteStreamView,
      onDisposeRemoteStreamView,
      participantVideoScalingMode,
      /* @conditional-compile-remove(reaction) */
      reactionResources,
      /* @conditional-compile-remove(reaction) */
      localParticipant,
      /* @conditional-compile-remove(reaction) */
      remoteParticipants,
      /* @conditional-compile-remove(ppt-live) */
      isPPTLive
    } = props;
    const locale = useLocale();

    if (!renderElement) {
      /**
       * TODO: We need to pass in the scaling mode of the screen share participant to this function because when we
       * call this it will recreate both streams (video and screen share) and we need to make sure that the scaling
       * mode is the same as before we started the screen share.
       *
       * We should deprecate the current function and replace it with a
       * createRemoteScreenShareStreamView and createRemoteVideoStreamView.
       */
      onCreateRemoteStreamView && onCreateRemoteStreamView(userId, participantVideoScalingMode);
    }

    useEffect(() => {
      return () => {
        // TODO: Isolate disposing behaviors for screenShare and videoStream
        onDisposeRemoteStreamView && onDisposeRemoteStreamView(userId);
      };
    }, [onDisposeRemoteStreamView, userId]);

    const loadingMessage = displayName
      ? _formatString(locale.strings.videoGallery.screenShareLoadingMessage, {
          participant: displayName
        })
      : '';
    /* @conditional-compile-remove(ppt-live) */
    if (isPPTLive) {
      return (
        <VideoTile
          renderElement={renderElement}
          onRenderPlaceholder={() => <LoadingSpinner loadingMessage={loadingMessage} />}
        />
      );
    }

    return (
      <VideoTile
        displayName={displayName}
        isMuted={isMuted}
        renderElement={renderElement}
        onRenderPlaceholder={() => <LoadingSpinner loadingMessage={loadingMessage} />}
        /* @conditional-compile-remove(reaction) */
        reactionOverlay={
          <MeetingReactionOverlay
            reactionResources={reactionResources!}
            localParticipant={localParticipant}
            remoteParticipants={remoteParticipants}
            overlayMode="screen-share"
          />
        }
      />
    );
  }
);

const LoadingSpinner = (props: { loadingMessage: string }): JSX.Element => {
  return (
    <Stack verticalAlign="center" className={loadingStyle}>
      <Spinner label={props.loadingMessage} size={SpinnerSize.xSmall} aria-live={'assertive'} />
    </Stack>
  );
};
