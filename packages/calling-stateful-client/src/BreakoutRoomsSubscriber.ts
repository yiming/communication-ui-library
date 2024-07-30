// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(breakout-rooms) */
import {
  BreakoutRoom,
  BreakoutRoomsCallFeature,
  BreakoutRoomsEventData,
  BreakoutRoomsSettings,
  Call,
  TeamsCall
} from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { CallContext } from './CallContext';
/* @conditional-compile-remove(breakout-rooms) */
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(breakout-rooms) */
import { NotificationTarget } from './CallClientState';

/* @conditional-compile-remove(breakout-rooms) */
/**
 * @private
 */
export class BreakoutRoomsSubscriber {
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _breakoutRoomsFeature: BreakoutRoomsCallFeature;

  constructor(callIdRef: CallIdRef, context: CallContext, breakoutRoomsFeature: BreakoutRoomsCallFeature) {
    this._callIdRef = callIdRef;
    this._context = context;
    this._breakoutRoomsFeature = breakoutRoomsFeature;

    this.subscribe();
  }

  public unsubscribe = (): void => {};

  private subscribe(): void {
    this._breakoutRoomsFeature.on('breakoutRoomsUpdated', this.onBreakoutRoomsUpdated);
  }

  private onBreakoutRoomsUpdated = (eventData: BreakoutRoomsEventData): void => {
    if (!eventData.data) {
      return;
    }

    if (eventData.type === 'assignedBreakoutRooms') {
      this.onAssignedBreakoutRoomUpdated(eventData.data);
    } else if (eventData.type === 'join') {
      this.onBreakoutRoomsJoined(eventData.data);
    } else if (eventData.type === 'breakoutRoomsSettings') {
      this.onBreakoutRoomSettingsUpdated(eventData.data);
    }
  };

  private onAssignedBreakoutRoomUpdated = (breakoutRoom: BreakoutRoom): void => {
    const callState = this._context.getState().calls[this._callIdRef.callId];
    const currentAssignedBreakoutRoom = callState?.breakoutRooms?.assignedBreakoutRoom;
    const originalCallState = callState.breakoutRooms?.breakoutRoomOriginCallId
      ? this._context.getState().calls[callState.breakoutRooms?.breakoutRoomOriginCallId]
      : undefined;
    if (originalCallState?.breakoutRooms?.assignedBreakoutRoom?.call && breakoutRoom.state === 'open') {
      this._context.setLatestNotification('assignedBreakoutRoomChanged', {
        target: 'assignedBreakoutRoomChanged',
        timestamp: new Date(Date.now())
      });
    } else if (
      breakoutRoom.state === 'open' &&
      (currentAssignedBreakoutRoom?.state === 'closed' || currentAssignedBreakoutRoom === undefined)
    ) {
      const target: NotificationTarget =
        breakoutRoom.autoMoveParticipantToBreakoutRoom === false
          ? 'assignedBreakoutRoomOpenedPromptJoin'
          : 'assignedBreakoutRoomOpened';
      this._context.setLatestNotification(target, {
        target,
        timestamp: new Date(Date.now())
      });
    } else if (breakoutRoom.state === 'closed' && currentAssignedBreakoutRoom?.state === 'closed') {
      this._context.deleteLatestNotification('assignedBreakoutRoomOpened');
      this._context.deleteLatestNotification('assignedBreakoutRoomOpenedPromptJoin');
      this._context.deleteLatestNotification('assignedBreakoutRoomChanged');
    }
    this._context.setAssignedBreakoutRoom(this._callIdRef.callId, breakoutRoom);
  };

  private onBreakoutRoomsJoined = (call: Call | TeamsCall): void => {
    this._context.setBreakoutRoomOriginCallId(this._callIdRef.callId, call.id);
    this._context.deleteLatestNotification('assignedBreakoutRoomOpened');
    this._context.deleteLatestNotification('assignedBreakoutRoomOpenedPromptJoin');
    this._context.deleteLatestNotification('assignedBreakoutRoomChanged');
  };

  private onBreakoutRoomSettingsUpdated = (breakoutRoomSettings: BreakoutRoomsSettings): void => {
    this._context.setBreakoutRoomSettings(this._callIdRef.callId, breakoutRoomSettings);
  };
}
