// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(call-readiness) */ /* @conditional-compile-remove(unsupported-browser) */
import { Stack } from '@fluentui/react';
import {
  ArrowClockwise16Regular,
  CallEnd20Filled,
  Checkmark20Regular,
  CheckmarkCircle16Regular,
  Circle16Regular,
  Delete20Regular,
  Dismiss20Regular,
  Dismiss16Regular,
  Edit20Regular,
  ErrorCircle16Regular,
  Eye16Regular,
  MicOff16Filled,
  MicOff16Regular,
  MicOff20Filled,
  Mic16Filled,
  Mic20Filled,
  Mic20Regular,
  MoreHorizontal20Filled,
  MoreHorizontal20Regular,
  People20Filled,
  Settings20Filled,
  Send20Filled,
  Send20Regular,
  ShareScreenStart20Filled,
  ShareScreenStop20Filled,
  Speaker220Regular,
  Video16Filled,
  Video20Filled,
  Video20Regular,
  VideoOff20Filled,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  WifiWarning20Filled,
  SpeakerMute16Filled,
  MicProhibited16Filled,
  VideoProhibited16Filled,
  Pin16Filled,
  Pin16Regular,
  PinOff16Regular,
  ScaleFit20Regular,
  ScaleFill20Regular
} from '@fluentui/react-icons';
/* @conditional-compile-remove(rich-text-editor) */
import {
  TextBold20Regular,
  TextItalic20Regular,
  TextUnderlineCharacterU20Regular,
  TextBulletList20Regular,
  TextNumberListLtr20Regular,
  TextIndentDecrease20Regular,
  TextIndentIncrease20Regular,
  DividerTall24Regular,
  TextEditStyle20Regular,
  TextEditStyle20Filled
} from '@fluentui/react-icons';
/* @conditional-compile-remove(reaction) */
import { Emoji20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(end-of-call-survey) */
import { Star28Regular, Star28Filled } from '@fluentui/react-icons';
import {
  HandRight20Filled,
  HandRightOff20Filled,
  HandRight20Regular,
  HandRightOff20Regular
} from '@fluentui/react-icons';
/* @conditional-compile-remove(close-captions) */
import {
  ClosedCaption20Regular,
  ClosedCaptionOff20Regular,
  Settings20Regular,
  PersonVoice20Regular,
  Translate20Regular
} from '@fluentui/react-icons';
/* @conditional-compile-remove(call-readiness) */
import { Important20Filled } from '@fluentui/react-icons';

import { VideoBackgroundEffect20Filled, VideoBackgroundEffect20Regular } from '@fluentui/react-icons';

import { Backspace20Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(call-readiness) */
import { Sparkle20Filled, VideoProhibited20Filled, MicProhibited20Filled } from '@fluentui/react-icons';

/* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
import { ArrowDownload16Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(PSTN-calls) */
import { CallPause20Regular, CallPause20Filled, Play20Regular } from '@fluentui/react-icons';
import { People20Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(data-loss-prevention) */
import { Prohibited16Regular } from '@fluentui/react-icons';

/* @conditional-compile-remove(unsupported-browser) */
import { Warning20Filled } from '@fluentui/react-icons';

/* @conditional-compile-remove(spotlight) */
import { VideoPersonStar20Filled, VideoPersonStarOff20Filled } from '@fluentui/react-icons';

import { _pxToRem } from '@internal/acs-ui-common';

import React from 'react';
import { useTheme } from './FluentThemeProvider';
/* @conditional-compile-remove(call-readiness) */
import { sitePermissionIconBackgroundStyle, scaledIconStyles } from './icons.styles';

/**
 * Icons used by the React components exported from this library.
 *
 * @remark See {@link CompositeIcons} for icons used by composites only.
 *
 * @public
 */
export type ComponentIcons = Record<keyof typeof DEFAULT_COMPONENT_ICONS, JSX.Element>;

const WifiWarning16Filled = (): JSX.Element => (
  // All ErrorBar icons are 16px x 16px (when 1rem = 16 px).
  // There is no 16px version of this icon in the fluent icon package, so scale the larger
  // one down to required size.
  <div className={mergeStyles({ transform: 'scale(0.8)' })}>
    <WifiWarning20Filled />
  </div>
);

const MoreHorizontal18Regular = (): JSX.Element => (
  // MoreHorizontal icons are 16px x 16px or 20px x 20px so scaling to get desired size
  <div className={mergeStyles({ transform: 'scale(0.9)' })}>
    <MoreHorizontal20Regular />
  </div>
);

/* @conditional-compile-remove(call-readiness) */
const SitePermissionMic20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Mic20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionCamera20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Video20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionsMicDenied20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <MicProhibited20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionsCameraDenied20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <VideoProhibited20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const SitePermissionSparkle20Filled = (): JSX.Element => (
  <div className={mergeStyles({ transform: 'scale(2)' })}>
    <Sparkle20Filled />
  </div>
);

/* @conditional-compile-remove(unsupported-browser) */
const UnsupportedEnvironmentWarning = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack
      horizontalAlign={'center'}
      styles={{
        root: {
          width: _pxToRem(84),
          borderRadius: '100%',
          background: theme.palette.themeLighterAlt,
          padding: '2rem',
          margin: 'auto'
        }
      }}
    >
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Warning20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(call-readiness) */
const BrowserPermissionDenied20Filled = (): JSX.Element => {
  const theme = useTheme();
  return (
    <Stack horizontalAlign={'center'} styles={sitePermissionIconBackgroundStyle(theme)}>
      <div className={mergeStyles(scaledIconStyles(theme))}>
        <Important20Filled />
      </div>
    </Stack>
  );
};

/* @conditional-compile-remove(data-loss-prevention) */
const DataLossPreventionProhibited16Regular = (): JSX.Element => {
  return <Prohibited16Regular />;
};

const GalleryLeftButton = (): JSX.Element => {
  const rtl = useTheme().rtl;
  return rtl ? <ChevronRight20Regular /> : <ChevronLeft20Regular />;
};

const GalleryRightButton = (): JSX.Element => {
  const rtl = useTheme().rtl;
  return rtl ? <ChevronLeft20Regular /> : <ChevronRight20Regular />;
};

const ControlButtonRaiseHandIcon = (): JSX.Element => {
  /* @conditional-compile-remove(reaction) */
  return <HandRight20Regular />;
  return <HandRight20Filled />;
};

const ControlButtonLowerHandIcon = (): JSX.Element => {
  /* @conditional-compile-remove(reaction) */
  return <HandRightOff20Regular />;
  return <HandRightOff20Filled />;
};

/**
 * The default set of icons that are available to use in the UI components.
 *
 * @remark Icons used only in the composites are available in {@link DEFAULT_COMPOSITE_ICONS}.
 *
 * @public
 */
export const DEFAULT_COMPONENT_ICONS = {
  ChatMessageOptions: <MoreHorizontal18Regular />,
  ControlButtonCameraOff: <VideoOff20Filled />,
  ControlButtonCameraOn: <Video20Filled />,
  ControlButtonEndCall: <CallEnd20Filled />,
  ControlButtonMicOff: <MicOff20Filled />,
  ControlButtonMicOn: <Mic20Filled />,
  ControlButtonOptions: <Settings20Filled />,
  ControlButtonParticipants: <People20Filled />,
  ControlButtonParticipantsContextualMenuItem: <People20Regular />,
  ControlButtonScreenShareStart: <ShareScreenStart20Filled />,
  ControlButtonScreenShareStop: <ShareScreenStop20Filled />,
  ControlButtonRaiseHand: <ControlButtonRaiseHandIcon />,
  ControlButtonLowerHand: <ControlButtonLowerHandIcon />,
  RaiseHandContextualMenuItem: <HandRight20Regular />,
  LowerHandContextualMenuItem: <HandRightOff20Regular />,
  /* @conditional-compile-remove(reaction) */
  ReactionButtonIcon: <Emoji20Regular />,
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  CancelFileUpload: <Dismiss16Regular />,
  /* @conditional-compile-remove(attachment-download) @conditional-compile-remove(attachment-upload) */
  DownloadFile: <ArrowDownload16Regular />,
  /* @conditional-compile-remove(data-loss-prevention) */
  DataLossPreventionProhibited: <DataLossPreventionProhibited16Regular />,
  EditBoxCancel: <Dismiss20Regular />,
  EditBoxSubmit: <Checkmark20Regular />,
  ErrorBarCallCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallCameraAlreadyInUse: <VideoProhibited16Filled />,
  ErrorBarCallLocalVideoFreeze: <WifiWarning16Filled />,
  ErrorBarCallMacOsCameraAccessDenied: <VideoProhibited16Filled />,
  ErrorBarCallMacOsMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneAccessDenied: <MicProhibited16Filled />,
  ErrorBarCallMicrophoneMutedBySystem: <MicOff16Filled />,
  ErrorBarCallMicrophoneUnmutedBySystem: <Mic16Filled />,
  ErrorBarCallNetworkQualityLow: <WifiWarning16Filled />,
  ErrorBarCallNoMicrophoneFound: <MicProhibited16Filled />,
  ErrorBarCallNoSpeakerFound: <SpeakerMute16Filled />,
  ErrorBarClear: <Dismiss16Regular />,
  ErrorBarCallVideoRecoveredBySystem: <Video16Filled />,
  ErrorBarCallVideoStoppedBySystem: <VideoProhibited16Filled />,
  HorizontalGalleryLeftButton: <GalleryLeftButton />,
  HorizontalGalleryRightButton: <GalleryRightButton />,
  MessageDelivered: <CheckmarkCircle16Regular />,
  MessageEdit: <Edit20Regular />,
  MessageFailed: <ErrorCircle16Regular />,
  MessageRemove: <Delete20Regular />,
  MessageResend: <ArrowClockwise16Regular />,
  MessageSeen: <Eye16Regular />,
  MessageSending: <Circle16Regular />,
  OptionsCamera: <Video20Regular />,
  OptionsMic: <Mic20Regular />,
  OptionsSpeaker: <Speaker220Regular />,
  ParticipantItemMicOff: <MicOff16Regular />,
  ParticipantItemOptions: <></>,
  ParticipantItemOptionsHovered: <MoreHorizontal20Filled />,
  ParticipantItemScreenShareStart: <ShareScreenStart20Filled />,
  /* @conditional-compile-remove(spotlight) */
  ParticipantItemSpotlighted: <VideoPersonStar20Filled />,
  /* @conditional-compile-remove(PSTN-calls) */
  HoldCallContextualMenuItem: <CallPause20Regular />,
  /* @conditional-compile-remove(PSTN-calls) */
  HoldCallButton: <CallPause20Filled />,
  /* @conditional-compile-remove(PSTN-calls) */
  ResumeCall: <Play20Regular />,
  SendBoxSend: <Send20Regular />,
  SendBoxSendHovered: <Send20Filled />,
  VideoTileMicOff: <MicOff16Filled />,
  DialpadBackspace: <Backspace20Regular />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionsSparkle: <SitePermissionSparkle20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionCamera: <SitePermissionCamera20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionMic: <SitePermissionMic20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionCameraDenied: <SitePermissionsCameraDenied20Filled />,
  /* @conditional-compile-remove(call-readiness) */
  SitePermissionMicDenied: <SitePermissionsMicDenied20Filled />,
  /* @conditional-compile-remove(unsupported-browser) */
  UnsupportedEnvironmentWarning: <UnsupportedEnvironmentWarning />,
  /* @conditional-compile-remove(call-readiness) */
  BrowserPermissionDeniedError: <BrowserPermissionDenied20Filled />,
  VideoTilePinned: <Pin16Filled />,
  VideoTileMoreOptions: <MoreHorizontal20Filled />,
  VideoTileScaleFit: <ScaleFit20Regular />,
  VideoTileScaleFill: <ScaleFill20Regular />,
  PinParticipant: <Pin16Regular />,
  UnpinParticipant: <PinOff16Regular />,
  SplitButtonPrimaryActionCameraOn: <Video20Filled />,
  SplitButtonPrimaryActionCameraOff: <VideoOff20Filled />,
  SplitButtonPrimaryActionMicUnmuted: <Mic20Filled />,
  SplitButtonPrimaryActionMicMuted: <MicOff20Filled />,
  VerticalGalleryLeftButton: <GalleryLeftButton />,
  VerticalGalleryRightButton: <GalleryRightButton />,

  ControlButtonVideoEffectsOption: <VideoBackgroundEffect20Regular />,

  ConfigurationScreenVideoEffectsButton: <VideoBackgroundEffect20Filled />,
  /* @conditional-compile-remove(close-captions) */
  CaptionsIcon: <ClosedCaption20Regular />,
  /* @conditional-compile-remove(close-captions) */
  CaptionsOffIcon: <ClosedCaptionOff20Regular />,
  /* @conditional-compile-remove(close-captions) */
  CaptionsSettingsIcon: <Settings20Regular />,
  /* @conditional-compile-remove(close-captions) */
  ChangeSpokenLanguageIcon: <PersonVoice20Regular />,
  /* @conditional-compile-remove(close-captions) */
  ChangeCaptionLanguageIcon: <Translate20Regular />,
  ContextMenuCameraIcon: <Video20Regular />,
  ContextMenuMicIcon: <Mic20Regular />,
  ContextMenuSpeakerIcon: <Speaker220Regular />,
  /* @conditional-compile-remove(end-of-call-survey) */
  SurveyStarIcon: <Star28Regular />,
  /* @conditional-compile-remove(end-of-call-survey) */
  SurveyStarIconFilled: <Star28Filled />,
  /* @conditional-compile-remove(spotlight) */
  StartSpotlightContextualMenuItem: <VideoPersonStar20Filled />,
  /* @conditional-compile-remove(spotlight) */
  StopSpotlightContextualMenuItem: <VideoPersonStarOff20Filled />,
  /* @conditional-compile-remove(spotlight) */
  VideoTileSpotlighted: <VideoPersonStar20Filled style={{ height: '16px', width: '16px' }} />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextBoldButtonIcon: <TextBold20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextItalicButtonIcon: <TextItalic20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextUnderlineButtonIcon: <TextUnderlineCharacterU20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextBulletListButtonIcon: <TextBulletList20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextNumberListButtonIcon: <TextNumberListLtr20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextIndentDecreaseButtonIcon: <TextIndentDecrease20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextIndentIncreaseButtonIcon: <TextIndentIncrease20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextDividerIcon: <DividerTall24Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextEditorButtonIcon: <TextEditStyle20Regular />,
  /* @conditional-compile-remove(rich-text-editor) */
  RichTextEditorButtonIconFilled: <TextEditStyle20Filled />
};
