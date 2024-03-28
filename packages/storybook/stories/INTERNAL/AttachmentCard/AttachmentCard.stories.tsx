// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useTheme } from '@fluentui/react';
import { ArrowDownload24Filled, Open24Filled, Pin24Regular, Share24Regular } from '@fluentui/react-icons';
import { AttachmentMetadata, _AttachmentCard as FileCardComponent } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { FluentV9ThemeProvider } from '../../../../react-components/src/theming/FluentV9ThemeProvider';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';

const AttachmentCardStory = (args): JSX.Element => {
  const theme = useTheme();
  return (
    <FluentV9ThemeProvider v8Theme={theme}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <FileCardComponent attachment={args.attachment} progress={args.progress} menuActions={args.menuActions} />
      </div>
    </FluentV9ThemeProvider>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const AttachmentCard = AttachmentCardStory.bind({});

const file: AttachmentMetadata = {
  extension: 'pdf',
  id: '42839hdwe-dfr2-323fcfwe',
  name: 'SampleFileName.pdf',
  url: 'https://www.bing.com'
};

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-attachmentcard`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Attachment Card`,
  component: FileCardComponent,
  argTypes: {
    isDownload: { control: 'boolean', defaultValue: true },
    attachment: { control: 'object', defaultValue: file },
    progress: { control: 'number', defaultValue: 0.5 },
    // Hiding auto-generated controls
    menuActions: {
      control: 'object',
      defaultValue: [
        {
          name: 'Open',
          icon: <Open24Filled />,
          onClick: () => {
            window.open(file.url);
          }
        },
        {
          name: 'Download',
          icon: <ArrowDownload24Filled />,
          onClick: () => {
            window.alert(`Downloading ${file.name}`);
          }
        },
        {
          name: 'Share',
          icon: <Share24Regular />,
          onClick: () => {
            window.alert(`sharing ${file.name}`);
          }
        },
        {
          name: 'Pin',
          icon: <Pin24Regular />,
          onClick: () => {
            window.alert(`pinning ${file.name}`);
          }
        }
      ]
    }
  }
} as Meta;
