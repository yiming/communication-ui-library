// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rooms) */
import { ChoiceGroup, IChoiceGroupOption, PrimaryButton, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(rooms) */
import React, { useEffect, useState } from 'react';

/* @conditional-compile-remove(rooms) */
import { ParticipantRole } from '@azure/communication-calling';
/* @conditional-compile-remove(rooms) */
import { callOptionsGroupStyles } from '../styles/HomeScreen.styles';
/* @conditional-compile-remove(rooms) */
import { addUserToRoom, listParticipants, removeUserFromRoom } from '../utils/AppUtils';
/* @conditional-compile-remove(rooms) */
import { useTheme } from '@azure/communication-react';

/* @conditional-compile-remove(rooms) */
export interface ManageRoomProps {
  userId: string;
  roomId: string;
  currentRole?: string;
  afterUpdate?: () => void;
}

/* @conditional-compile-remove(rooms) */
export const ManageRoom = (props: ManageRoomProps): JSX.Element => {
  const roomRoleOptions: IChoiceGroupOption[] = [
    { key: 'Consumer', text: 'Consumer' },
    { key: 'Presenter', text: 'Presenter' },
    { key: 'Attendee', text: 'Attendee' }
  ];

  const roomRoleOptionsIndex = roomRoleOptions.findIndex((choiceGroupOption: IChoiceGroupOption) => {
    return choiceGroupOption.text === props.currentRole;
  });

  const [chosenRoomsRoleOption, setRoomsRoleOption] = useState<IChoiceGroupOption>(
    roomRoleOptions[roomRoleOptionsIndex] ?? roomRoleOptions[0]
  );

  const roomsRoleGroupLabel = `Your current role is ${props.currentRole}`;

  const theme = useTheme();

  const [_, setRoomParticipants] = useState<string>();
  useEffect(() => {
    (async () => {
      const participants = await listParticipants(props.roomId);
      setRoomParticipants(JSON.stringify(participants));
    })();
  }, []);

  return (
    <Stack tokens={{ childrenGap: '0.5rem' }}>
      <ChoiceGroup
        styles={callOptionsGroupStyles}
        label={roomsRoleGroupLabel}
        defaultSelectedKey={props.currentRole}
        options={roomRoleOptions}
        onChange={(_, option) => option && setRoomsRoleOption(option)}
      />
      <PrimaryButton
        disabled={props.currentRole === chosenRoomsRoleOption.text}
        text={`Update your role to ${chosenRoomsRoleOption.text}`}
        onClick={async () => {
          if (props.userId && props.roomId) {
            const res = await addUserToRoom(props.userId, props.roomId, chosenRoomsRoleOption.text as ParticipantRole);
            if (res.ok) {
              props.afterUpdate?.();
            }
          }
        }}
      />
      <PrimaryButton
        styles={{
          root: {
            // Suppress border around the dark-red button.
            border: 'none',
            background: '#a42e43'
          },
          rootHovered: {
            // Suppress border around the dark-red button.
            border: 'none',
            background: '#a42e43'
          },
          rootFocused: {
            '@media (forced-colors: active)': {
              background: 'highlight',
              color: 'highlightText',
              borderColor: theme.palette.black,
              borderRadius: 'unset',
              outline: `3px solid ${theme.palette.black}`
            }
          }
        }}
        text={`Remove your invite to this room`}
        onClick={async () => {
          if (props.userId && props.roomId) {
            const res = await removeUserFromRoom(props.userId, props.roomId);
            if (res.ok) {
              props.afterUpdate?.();
            }
          }
        }}
      />
      <Text variant="small">* This functionality is from a custom button and is not included in the CallComposite</Text>
    </Stack>
  );
};
