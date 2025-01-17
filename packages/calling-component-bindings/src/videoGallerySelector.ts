// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallClientState, RemoteParticipantState } from '@internal/calling-stateful-client';
import { VideoGalleryRemoteParticipant, VideoGalleryLocalParticipant } from '@internal/react-components';
import { createSelector } from 'reselect';
import {
  CallingBaseSelectorProps,
  getDisplayName,
  getDominantSpeakers,
  getIdentifier,
  getIsMuted,
  getIsScreenSharingOn,
  getLocalVideoStreams,
  getRole,
  getScreenShareRemoteParticipant
} from './baseSelectors';
/* @conditional-compile-remove(hide-attendee-name) */
import { isHideAttendeeNamesEnabled } from './baseSelectors';
import { getOptimalVideoCount } from './baseSelectors';
import { _updateUserDisplayNames } from './utils/callUtils';
import { checkIsSpeaking } from './utils/SelectorUtils';
import {
  _videoGalleryRemoteParticipantsMemo,
  _dominantSpeakersWithFlatId,
  convertRemoteParticipantToVideoGalleryRemoteParticipant,
  memoizeLocalParticipant
} from './utils/videoGalleryUtils';
import { memoizeSpotlightedParticipantIds } from './utils/videoGalleryUtils';
import { getLocalParticipantRaisedHand } from './baseSelectors';
import { getLocalParticipantReactionState } from './baseSelectors';
import { memoizedConvertToVideoTileReaction } from './utils/participantListSelectorUtils';
import { getRemoteParticipantsExcludingConsumers } from './getRemoteParticipantsExcludingConsumers';
import { getSpotlightCallFeature, getCapabilities } from './baseSelectors';

/**
 * Selector type for {@link VideoGallery} component.
 *
 * @public
 */
export type VideoGallerySelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  screenShareParticipant?: VideoGalleryRemoteParticipant;
  localParticipant: VideoGalleryLocalParticipant;
  remoteParticipants: VideoGalleryRemoteParticipant[];
  dominantSpeakers?: string[];
  optimalVideoCount?: number;
  spotlightedParticipants?: string[];
  maxParticipantsToSpotlight?: number;
};

/**
 * Provides data attributes to {@link VideoGallery} component.
 * @public
 */
export const videoGallerySelector: VideoGallerySelector = createSelector(
  [
    getScreenShareRemoteParticipant,
    getRemoteParticipantsExcludingConsumers,
    getLocalVideoStreams,
    getIsMuted,
    getIsScreenSharingOn,
    getDisplayName,
    getIdentifier,
    getDominantSpeakers,
    getOptimalVideoCount,
    getRole,
    getLocalParticipantRaisedHand,
    /* @conditional-compile-remove(hide-attendee-name) */
    isHideAttendeeNamesEnabled,
    getLocalParticipantReactionState,
    getSpotlightCallFeature,
    getCapabilities
  ],
  (
    screenShareRemoteParticipantId,
    remoteParticipants,
    localVideoStreams,
    isMuted,
    isScreenSharingOn,
    displayName: string | undefined,
    identifier: string,
    dominantSpeakers,
    optimalVideoCount,
    role,
    raisedHand,
    /* @conditional-compile-remove(hide-attendee-name) */
    isHideAttendeeNamesEnabled,
    localParticipantReaction,
    spotlightCallFeature,
    capabilities
  ) => {
    const screenShareRemoteParticipant =
      screenShareRemoteParticipantId && remoteParticipants
        ? remoteParticipants[screenShareRemoteParticipantId]
        : undefined;
    const localVideoStream = localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
    const localScreenSharingStream = localVideoStreams?.find((i) => i.mediaStreamType === 'ScreenSharing');
    const dominantSpeakerIds = _dominantSpeakersWithFlatId(dominantSpeakers);
    const dominantSpeakersMap: Record<string, number> = {};
    dominantSpeakerIds?.forEach((speaker, idx) => (dominantSpeakersMap[speaker] = idx));
    const noRemoteParticipants: RemoteParticipantState[] = [];
    const localParticipantReactionState = memoizedConvertToVideoTileReaction(localParticipantReaction);
    const spotlightedParticipantIds = memoizeSpotlightedParticipantIds(spotlightCallFeature?.spotlightedParticipants);

    return {
      screenShareParticipant: screenShareRemoteParticipant
        ? convertRemoteParticipantToVideoGalleryRemoteParticipant(
            toFlatCommunicationIdentifier(screenShareRemoteParticipant.identifier),
            screenShareRemoteParticipant.isMuted,
            checkIsSpeaking(screenShareRemoteParticipant),
            screenShareRemoteParticipant.videoStreams,
            screenShareRemoteParticipant.state,
            screenShareRemoteParticipant.displayName,
            screenShareRemoteParticipant.raisedHand,
            screenShareRemoteParticipant.contentSharingStream,
            undefined,
            screenShareRemoteParticipant.spotlight
          )
        : undefined,
      localParticipant: memoizeLocalParticipant(
        identifier,
        displayName,
        isMuted,
        isScreenSharingOn,
        localVideoStream,
        localScreenSharingStream,
        role,
        raisedHand,
        localParticipantReactionState,
        spotlightCallFeature?.localParticipantSpotlight,
        capabilities
      ),
      remoteParticipants: _videoGalleryRemoteParticipantsMemo(
        updateUserDisplayNamesTrampoline(remoteParticipants ? Object.values(remoteParticipants) : noRemoteParticipants),
        /* @conditional-compile-remove(hide-attendee-name) */
        isHideAttendeeNamesEnabled,
        /* @conditional-compile-remove(hide-attendee-name) */
        role
      ),
      dominantSpeakers: dominantSpeakerIds,
      maxRemoteVideoStreams: optimalVideoCount,
      spotlightedParticipants: spotlightedParticipantIds,
      maxParticipantsToSpotlight: spotlightCallFeature?.maxParticipantsToSpotlight
    };
  }
);

const updateUserDisplayNamesTrampoline = (remoteParticipants: RemoteParticipantState[]): RemoteParticipantState[] => {
  /* @conditional-compile-remove(PSTN-calls) */
  return _updateUserDisplayNames(remoteParticipants);
  return remoteParticipants;
};
