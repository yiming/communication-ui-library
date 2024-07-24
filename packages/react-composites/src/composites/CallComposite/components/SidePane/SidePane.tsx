// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useMemo } from 'react';
import { Stack } from '@fluentui/react';
import {
  containerContextStyles,
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../../../common/styles/ParticipantContainer.styles';
import { availableSpaceStyles, sidePaneStyles, sidePaneTokens } from '../../../common/styles/Pane.styles';
import { SidePaneRenderer, useSidePaneContext } from './SidePaneProvider';
import { PeopleAndChatHeader } from '../../../common/TabHeader';
import { hiddenStyles } from '../../../common/styles/Pane.styles';

/** @private */
export interface SidePaneProps {
  updateSidePaneRenderer: (renderer: SidePaneRenderer | undefined) => void;
  mobileView?: boolean;
  maxWidth?: string;
  minWidth?: string;

  // legacy arguments to be removed in breaking change
  disablePeopleButton?: boolean;
  disableChatButton?: boolean;
  onChatButtonClicked?: () => void;
  onPeopleButtonClicked?: () => void;
}

/** @private */
export const SidePane = (props: SidePaneProps): JSX.Element => {
  const { sidePaneRenderer, overrideSidePane } = useSidePaneContext();
  const renderingHiddenOverrideContent =
    overrideSidePane?.renderer.contentRenderer &&
    overrideSidePane.persistRenderingWhenClosed &&
    !overrideSidePane.isActive;
  const renderingOnlyHiddenContent = renderingHiddenOverrideContent && !sidePaneRenderer;

  const widthConstrainedStyles = useMemo(
    () => sidePaneStyles(props.maxWidth, props.minWidth),
    [props.maxWidth, props.minWidth]
  );
  const paneStyles = renderingOnlyHiddenContent
    ? hiddenStyles
    : props.mobileView
      ? availableSpaceStyles
      : widthConstrainedStyles;

  const Header =
    (overrideSidePane?.isActive ? overrideSidePane.renderer.headerRenderer : sidePaneRenderer?.headerRenderer) ??
    EmptyElement;

  /**
   * Legacy code to support old behavior of showing chat and people tab headers on mobile side pane.
   * To be removed in breaking change.
   */
  const overrideSidePaneId = overrideSidePane?.isActive ? overrideSidePane.renderer.id : undefined;
  const { updateSidePaneRenderer } = props;
  const closePane = useCallback(() => {
    updateSidePaneRenderer(undefined);
  }, [updateSidePaneRenderer]);

  const LegacyHeader = useMemo((): JSX.Element => {
    return (
      <PeopleAndChatHeader
        onClose={overrideSidePaneId === 'chat' ? props.onChatButtonClicked ?? noop : closePane}
        activeTab={sidePaneRenderer?.id === 'people' ? 'people' : 'chat'}
        // legacy arguments to be removed in breaking change:
        disablePeopleButton={props.disablePeopleButton}
        disableChatButton={props.disableChatButton}
        onPeopleButtonClicked={sidePaneRenderer?.id === 'people' ? noop : props.onPeopleButtonClicked}
        onChatButtonClicked={overrideSidePaneId === 'chat' ? noop : props.onChatButtonClicked}
      />
    );
  }, [
    overrideSidePaneId,
    props.onChatButtonClicked,
    props.onPeopleButtonClicked,
    props.disablePeopleButton,
    props.disableChatButton,
    sidePaneRenderer?.id,
    closePane
  ]);

  const HeaderToRender =
    props.mobileView && (overrideSidePaneId === 'chat' || sidePaneRenderer?.id === 'people') ? LegacyHeader : Header();

  const ContentRender = overrideSidePane?.isActive ? undefined : sidePaneRenderer?.contentRenderer;
  const OverrideContentRender =
    overrideSidePane?.isActive || overrideSidePane?.persistRenderingWhenClosed
      ? overrideSidePane.renderer.contentRenderer
      : undefined;

  if (!ContentRender && !OverrideContentRender) {
    return <EmptyElement />;
  }

  return (
    <Stack verticalFill grow styles={paneStyles} data-ui-id="SidePane" tokens={props.mobileView ? {} : sidePaneTokens}>
      {HeaderToRender}
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack verticalFill styles={scrollableContainer} key="asdf1">
          {ContentRender && (
            <Stack.Item verticalFill styles={scrollableContainerContents} key="asdf2">
              <Stack styles={containerContextStyles} key="asdf3">
                {ContentRender?.()}
              </Stack>
            </Stack.Item>
          )}
          {OverrideContentRender && (
            <Stack.Item
              verticalFill
              styles={
                !overrideSidePane?.isActive && overrideSidePane?.persistRenderingWhenClosed
                  ? hiddenStyles
                  : scrollableContainerContents
              }
            >
              <Stack styles={containerContextStyles}>{OverrideContentRender?.()}</Stack>
            </Stack.Item>
          )}
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};
const EmptyElement = (): JSX.Element => <></>;
