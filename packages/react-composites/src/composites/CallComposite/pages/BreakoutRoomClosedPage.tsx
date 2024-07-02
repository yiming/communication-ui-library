// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, mergeStyles } from '@fluentui/react';
import { Announcer, ErrorBar, VideoTile } from '@internal/react-components';
import React, { useEffect, useState } from 'react';
import { AvatarPersonaDataCallback } from '../../common/AvatarPersona';
import { useLocale } from '../../localization';
import { CallArrangement } from '../components/CallArrangement';
import { usePropsFor } from '../hooks/usePropsFor';
import { useSelector } from '../hooks/useSelector';
import { getDisplayName } from '../selectors/baseSelectors';
import { pageContainer } from '../styles/TransferPage.styles';
import { reduceCallControlsForMobile } from '../utils';
import { LobbyPageProps } from './LobbyPage';
// import {
//   BreakoutRoomsNotification,
//   BreakoutRoomsNotificationBarProps
// } from '../components/BreakoutRoomsNotificationBar';

/**
 * @private
 */
export const BreakoutRoomClosedPage = (
  props: LobbyPageProps & {
    /** Callback function that can be used to provide custom data to Persona Icon rendered */
    onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  }
): JSX.Element => {
  const errorBarProps = usePropsFor(ErrorBar);
  const displayName = useSelector(getDisplayName);
  const strings = useLocale().strings.call;

  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);

  // Reduce the controls shown when mobile view is enabled.
  const callControlOptions = props.mobileView
    ? reduceCallControlsForMobile(props.options?.callControls)
    : props.options?.callControls;

  useEffect(() => {
    setAnnouncerString('Breakout room closed');
  }, [strings.transferPageNoticeString]);

  // const [breakoutRoomsNotifications, setBreakoutRoomsNotifications] = useState<BreakoutRoomsNotification[]>([
  //   {
  //     target: 'assignedBreakoutRoomClosed',
  //     messageKey: 'Breakout room closed. Returning to main meeting in 10 seconds.'
  //   }
  // ]);
  // const breakoutRoomsNotificationBarProps: BreakoutRoomsNotificationBarProps = {
  //   breakoutRoomsNotifications: breakoutRoomsNotifications,
  //   onDismissNotification: () => setBreakoutRoomsNotifications([])
  // };

  return (
    <Stack className={mergeStyles(pageContainer)}>
      <Announcer announcementString={announcerString} ariaLive="polite" />
      <CallArrangement
        complianceBannerProps={{ strings }}
        // Ignore errors from before current call. This avoids old errors from showing up when a user re-joins a call.
        errorBarProps={props.options?.errorBar !== false && errorBarProps}
        /* @conditional-compile-remove(notifications) */
        showErrorNotifications={false}
        callControlProps={{
          options: callControlOptions,
          increaseFlyoutItemSize: props.mobileView
        }}
        mobileView={props.mobileView}
        modalLayerHostId={props.modalLayerHostId}
        onRenderGalleryContent={() => <VideoTile displayName={displayName} />}
        dataUiId={'breakout-room-closed-page'}
        updateSidePaneRenderer={props.updateSidePaneRenderer}
        mobileChatTabHeader={props.mobileChatTabHeader}
        latestErrors={props.latestErrors.concat()}
        //breakoutRoomsNotificationBarProps={props.breakoutRoomsNotificationBarProps}
        // breakoutRoomsNotificationBarProps={breakoutRoomsNotificationBarProps}
        onDismissError={props.onDismissError}
      />
    </Stack>
  );
};
