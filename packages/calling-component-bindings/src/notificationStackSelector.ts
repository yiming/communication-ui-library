// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(notifications) */
import {
  CallingBaseSelectorProps,
  getDeviceManager,
  getDiagnostics,
  getLatestErrors,
  getEnvironmentInfo
} from './baseSelectors';
/* @conditional-compile-remove(notifications) */
import { getTeamsMeetingConference } from './baseSelectors';
/* @conditional-compile-remove(notifications) */
import { ActiveNotification, NotificationType } from '@internal/react-components';
/* @conditional-compile-remove(notifications) */
import { createSelector } from 'reselect';
/* @conditional-compile-remove(notifications) */
import { CallClientState, CallErrors, CallErrorTarget } from '@internal/calling-stateful-client';
/* @conditional-compile-remove(notifications) */
import { DiagnosticQuality } from '@azure/communication-calling';
/* @conditional-compile-remove(notifications) */
/**
 * Selector type for {@link Notification} component.
 *
 * @public
 */
export type NotificationStackSelector = (
  state: CallClientState,
  props: CallingBaseSelectorProps
) => {
  activeErrorMessages: ActiveNotification[];
  activeNotifications: ActiveNotification[];
};
/* @conditional-compile-remove(notifications) */
/**
 * Select the active errors from the state for the `Notification` component.
 *
 * Invariants:
 *   - `ErrorType` is never repeated in the returned errors.
 *   - Errors are returned in a fixed order by `ErrorType`.
 *
 * @public
 */
export const notificationStackSelector: NotificationStackSelector = createSelector(
  [
    getLatestErrors,
    getDiagnostics,
    getDeviceManager,
    getEnvironmentInfo,
    /* @conditional-compile-remove(teams-meeting-conference) */ getTeamsMeetingConference
  ],
  (
    latestErrors: CallErrors,
    diagnostics,
    deviceManager,
    environmentInfo,
    /* @conditional-compile-remove(teams-meeting-conference) */ meetingConference
  ): { activeErrorMessages: ActiveNotification[]; activeNotifications: ActiveNotification[] } => {
    // The order in which the errors are returned is significant: The `Notification` shows errors on the UI in that order.
    // There are several options for the ordering:
    //   - Sorted by when the errors happened (latest first / oldest first).
    //   - Stable sort by error type.
    //
    // We chose to stable sort by error type: We intend to show only a small number of errors on the UI and we do not
    // have timestamps for errors.
    const activeErrorMessages: ActiveNotification[] = [];

    const isSafari = (): boolean => {
      /* @conditional-compile-remove(calling-environment-info) */
      return environmentInfo?.environment.browser === 'safari';
      return /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
    };

    const isMacOS = (): boolean => {
      /* @conditional-compile-remove(calling-environment-info) */
      return environmentInfo?.environment.platform === 'mac';
      return false;
    };

    // Errors reported via diagnostics are more reliable than from API method failures, so process those first.
    let isTeamsMeetingWithPhones = false;
    /* @conditional-compile-remove(teams-meeting-conference) */
    if (meetingConference && meetingConference.length > 0) {
      isTeamsMeetingWithPhones = true;
    }
    if (
      diagnostics?.network.latest.networkReceiveQuality?.value === DiagnosticQuality.Bad ||
      diagnostics?.network.latest.networkReceiveQuality?.value === DiagnosticQuality.Poor
    ) {
      if (isTeamsMeetingWithPhones) {
        activeErrorMessages.push({ type: 'teamsMeetingCallNetworkQualityLow' });
      } else {
        activeErrorMessages.push({ type: 'callNetworkQualityLow' });
      }
    }
    if (diagnostics?.media.latest.noSpeakerDevicesEnumerated?.value === true) {
      activeErrorMessages.push({ type: 'callNoSpeakerFound' });
    }
    if (diagnostics?.media.latest.noMicrophoneDevicesEnumerated?.value === true) {
      activeErrorMessages.push({ type: 'callNoMicrophoneFound' });
    }
    if (deviceManager.deviceAccess?.audio === false && isSafari()) {
      activeErrorMessages.push({ type: 'callMicrophoneAccessDeniedSafari' });
    }
    if (deviceManager.deviceAccess?.audio === false && !isSafari()) {
      activeErrorMessages.push({ type: 'callMicrophoneAccessDenied' });
    }

    if (diagnostics?.media.latest.microphonePermissionDenied?.value === true && isMacOS()) {
      activeErrorMessages.push({ type: 'callMacOsMicrophoneAccessDenied' });
    } else if (diagnostics?.media.latest.microphonePermissionDenied?.value === true) {
      activeErrorMessages.push({ type: 'callMicrophoneAccessDenied' });
    }

    const microphoneMuteUnexpectedlyDiagnostic =
      diagnostics?.media.latest.microphoneMuteUnexpectedly || diagnostics?.media.latest.microphoneNotFunctioning;
    if (microphoneMuteUnexpectedlyDiagnostic) {
      if (microphoneMuteUnexpectedlyDiagnostic.value === DiagnosticQuality.Bad) {
        // Inform the user that microphone stopped working and inform them to start microphone again
        activeErrorMessages.push({ type: 'callMicrophoneMutedBySystem' });
      } else if (microphoneMuteUnexpectedlyDiagnostic.value === DiagnosticQuality.Good) {
        // Inform the user that microphone recovered
        activeErrorMessages.push({ type: 'callMicrophoneUnmutedBySystem' });
      }
    }

    const cameraStoppedUnexpectedlyDiagnostic = diagnostics?.media.latest.cameraStoppedUnexpectedly;
    if (cameraStoppedUnexpectedlyDiagnostic) {
      if (cameraStoppedUnexpectedlyDiagnostic.value === DiagnosticQuality.Bad) {
        // Inform the user that camera stopped working and inform them to start video again
        activeErrorMessages.push({ type: 'callVideoStoppedBySystem' });
      } else if (cameraStoppedUnexpectedlyDiagnostic.value === DiagnosticQuality.Good) {
        // Inform the user that camera recovered
        activeErrorMessages.push({ type: 'callVideoRecoveredBySystem' });
      }
    }
    if (deviceManager.deviceAccess?.video === false && isSafari()) {
      activeErrorMessages.push({ type: 'callCameraAccessDeniedSafari' });
    } else if (deviceManager.deviceAccess?.video === false) {
      activeErrorMessages.push({ type: 'callCameraAccessDenied' });
    } else {
      if (diagnostics?.media.latest.cameraFreeze?.value === true) {
        activeErrorMessages.push({ type: 'cameraFrozenForRemoteParticipants' });
      }
    }

    /**
     * show the Mac specific strings if the platform is detected as mac
     */
    if (diagnostics?.media.latest.cameraPermissionDenied?.value === true && isMacOS()) {
      activeErrorMessages.push({ type: 'callMacOsCameraAccessDenied' });
    }

    /**
     * This UFD only works on mac still so we should only see it fire on mac.
     */
    if (diagnostics?.media.latest.screenshareRecordingDisabled?.value === true && isMacOS()) {
      activeErrorMessages.push({ type: 'callMacOsScreenShareAccessDenied' });
    } else if (diagnostics?.media.latest.screenshareRecordingDisabled?.value === true) {
      activeErrorMessages.push({ type: 'startScreenShareGeneric' });
    }

    // Prefer to show errors with privacy implications.
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.stopVideo', 'stopVideoGeneric');
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.mute', 'muteGeneric');
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.stopScreenSharing', 'stopScreenShareGeneric');

    if (
      latestErrors['Call.startVideo']?.message === 'Call.startVideo: Video operation failure SourceUnavailableError'
    ) {
      appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.startVideo', 'callCameraAlreadyInUse');
    } else if (
      latestErrors['Call.startVideo']?.message === 'Call.startVideo: Video operation failure permissionDeniedError'
    ) {
      appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.startVideo', 'callCameraAccessDenied');
    } else {
      appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.startVideo', 'startVideoGeneric');
    }

    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.unmute', 'unmuteGeneric');

    /* @conditional-compile-remove(soft-mute) */
    appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'Call.mutedByOthers', 'mutedByRemoteParticipant');

    appendActiveErrorIfDefined(
      activeErrorMessages,
      latestErrors,
      'VideoEffectsFeature.startEffects',
      'unableToStartVideoEffect'
    );

    if (latestErrors['CallAgent.join']?.message === 'CallAgent.join: Invalid meeting link') {
      appendActiveErrorIfDefined(
        activeErrorMessages,
        latestErrors,
        'CallAgent.join',
        'failedToJoinCallInvalidMeetingLink'
      );
    } else {
      appendActiveErrorIfDefined(activeErrorMessages, latestErrors, 'CallAgent.join', 'failedToJoinCallGeneric');
    }

    if (
      latestErrors['Call.feature']?.message.match(
        /Call\.feature: startSpotlight failed\. \d+ is the max number of participants that can be Spotlighted/g
      )
    ) {
      appendActiveErrorIfDefined(
        activeErrorMessages,
        latestErrors,
        'Call.feature',
        'startSpotlightWhileMaxParticipantsAreSpotlighted'
      );
    }

    //below is for active notifications
    const activeNotifications: ActiveNotification[] = [];
    if (diagnostics?.media.latest.speakingWhileMicrophoneIsMuted?.value) {
      activeNotifications.push({ type: 'speakingWhileMuted', timestamp: new Date(Date.now()), autoDismiss: true });
    }
    return { activeErrorMessages: activeErrorMessages, activeNotifications: activeNotifications };
  }
);
/* @conditional-compile-remove(notifications) */
const appendActiveErrorIfDefined = (
  activeErrorMessages: ActiveNotification[],
  latestErrors: CallErrors,
  target: CallErrorTarget,
  activeErrorType: NotificationType
): void => {
  if (latestErrors[target] === undefined) {
    return;
  }
  activeErrorMessages.push({
    type: activeErrorType,
    timestamp: latestErrors[target].timestamp
  });
};
