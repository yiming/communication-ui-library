// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack } from '@fluentui/react';
import {
  BrowserPermissionDenied as BrowserPermissionDeniedComponent,
  BrowserPermissionDeniedIOS as BrowserPermissionDeniedIOSComponent,
  _DrawerSurface
} from '@internal/react-components';
import { Canvas, Description, Heading, Props, Subheading, Title } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { useLocale } from '../../../../../react-components/src/localization';
import { SingleLineBetaBanner } from '../../../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { BrowserPemissionDeniedAndroidDrawer } from './snippets/BrowserPermissionDeniedAndroidDrawer.snippet';
import { BrowserPermissionDeniedDrawer } from './snippets/BrowserPermissionDeniedDrawer.snippet';
import { BrowserPermissionDeniedIOSDrawer } from './snippets/BrowserPermissionDeniedIOSDrawer.snippet';
import { BrowserPermissionDeniedModal } from './snippets/BrowserPermissionDeniedModal.snippet';

const BrowserPermissionDeniedStory = (): JSX.Element => {
  const locale = useLocale().strings.BrowserPermissionDenied;
  return (
    <Stack>
      <BrowserPermissionDeniedComponent
        onTroubleshootingClick={function (): void {
          alert('you clicked the help text');
        }}
        onTryAgainClick={() => {
          alert('you clicked the try again button');
        }}
        strings={locale}
      />
    </Stack>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const BrowserPermissionDenied = BrowserPermissionDeniedStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-browser-permission-denied`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/CallReadiness/Browser Permission Denied`,
  component: BrowserPermissionDeniedComponent,
  args: {}
} as Meta;
