// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, LocalizationProvider } from '@azure/communication-react';
import { Anchor, DocsContainer } from '@storybook/addon-docs';
import type { Preview } from '@storybook/react';
import React from 'react';
import {
  COMPONENT_FOLDER_PREFIX,
  COMPOSITE_FOLDER_PREFIX,
  EXAMPLES_FOLDER_PREFIX,
  CONCEPTS_FOLDER_PREFIX,
  STATEFUL_CLIENT_PREFIX
} from '../stories/constants';
import { THEMES } from '../stories/themes';
import { LOCALES } from '../stories/locales'

export const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    // docs: {
    //   container: props => (
    //     <DocsContainer context={props.context}>
    //       <Anchor storyId={props.context.id} />
    //       {props.children}
    //     </DocsContainer>
    //   ),
    // },
    docs: {
      toc: {
        title: 'Table of Contents',
        headingSelector: 'h2, h3'
      }
    },
    options: {
      storySort: {
        order: [
          'Composites',
          ['Get Started'],
          'Components'
        ]
      }
    }
  }
};

export default preview;

const withThemeProvider = (Story: any, context: any) => {
  const themeName = context.globals.theme as string;
  let theme = THEMES[themeName]?.theme;
  if (context.globals.customTheme) {
    try {
      theme = JSON.parse(context.globals.customTheme);
    } catch (e) {
      console.log('Could not parse the following theme JSON: ' + context.globals.customTheme);
    }
  }

  const rtl = context.globals.rtl as string === 'rtl';

  if (context !== undefined) {
    return (
      <FluentThemeProvider fluentTheme={theme} rtl={rtl}>
        <Story {...context} theme={theme} />
      </FluentThemeProvider>
    );
  }
  else {
    return (
      <Story {...context} />
    );
  }
};

const withLocalization = (Story: any, context: any) => {
  const localeKey = context.globals.locale as string;

  if (context !== undefined) {
    return (
      <LocalizationProvider locale={LOCALES[localeKey].locale} >
        <Story {...context} />
      </LocalizationProvider>
    );
  }
  else {
    return (
      <Story {...context} />
    );
  }
};

const withCenterStory = (Story: any) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // height: '100vh'
    }}>
      <Story />
    </div>
  );
};

export const decorators = [withThemeProvider, withLocalization];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: THEMES.Light.name
  },
  customTheme: {
    name: 'Custom theme',
    description: 'Custom global theme for components',
    defaultValue: ''
  },
  locale: {
    name: 'Locale',
    description: 'Locale for components',
    defaultValue: 'en_US',
  },
  rtl: {
    name: 'RTL',
    description: 'Whether the direction of components is right-to-left or left-to-right',
    defaultValue: 'ltr'
  }
};
