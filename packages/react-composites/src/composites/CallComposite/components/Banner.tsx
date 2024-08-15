// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme, mergeStyles } from '@fluentui/react';
import { _pxToRem } from '@internal/acs-ui-common';

import { IIconProps, Icon, PrimaryButton, Stack, Text, useTheme } from '@fluentui/react';
import React from 'react';
/**
 * Props for {@link Banner}.
 *
 * @public
 */
export interface BannerProps {
  /**
   * Banner strings.
   */
  bannerStrings?: BannerStrings;

  /**
   * Banner icon.
   */
  bannerIconProps?: IIconProps;

  /**
   * Callback called when the primary button inside banner is clicked.
   */
  onClickPrimaryButton?: () => void;
}

/**
 * All strings that may be shown on the UI in the {@link Banner}.
 *
 * @public
 */
export interface BannerStrings {
  /**
   * Banner title.
   */
  title: string;
  /**
   * Banner primary button label.
   */
  primaryButtonLabel: string;
}

/**
 * A component to show notification messages on the UI.
 *
 * @public
 */
export const Banner = (props: BannerProps): JSX.Element => {
  const strings = props.bannerStrings;
  const theme = useTheme();

  return (
    <Stack horizontalAlign="center">
      <Stack data-ui-id="banner" className={containerStyles(theme)}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            <Icon
              className={notificationIconClassName}
              iconName={props.bannerIconProps?.iconName ?? 'ConferenceRoom'}
              {...props.bannerIconProps}
            />
            <Text className={titleTextClassName}>{strings?.title}</Text>
          </Stack>

          <PrimaryButton
            text={strings?.primaryButtonLabel}
            ariaLabel={strings?.primaryButtonLabel}
            onClick={props.onClickPrimaryButton}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

const titleTextClassName = mergeStyles({
  fontWeight: 400,
  fontSize: _pxToRem(14),
  lineHeight: _pxToRem(16),
  alignSelf: 'center'
});

const containerStyles = (theme: Theme): string =>
  mergeStyles({
    boxShadow: theme.effects.elevation8,
    width: '20rem',
    padding: '0.75rem',
    borderRadius: '0.25rem',
    position: 'relative',
    backgroundColor: theme.palette.white
  });

const notificationIconClassName = mergeStyles({
  fontSize: '1.25rem',
  alignSelf: 'center',
  marginRight: '0.5rem',
  svg: {
    width: '1.25rem',
    height: '1.25rem'
  }
});
