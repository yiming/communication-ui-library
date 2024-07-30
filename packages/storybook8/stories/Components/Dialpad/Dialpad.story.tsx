// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Dialpad as DialpadComponent, useTheme } from '@azure/communication-react';
import { mergeStyles } from '@fluentui/react';
import MobileDetect from 'mobile-detect';
import React from 'react';

const DialpadStory = (): JSX.Element => {
  const isIOS = (): boolean =>
    /iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isMobile = !!new MobileDetect(window.navigator.userAgent).mobile() || isIOS();
  const theme = useTheme();

  return (
    <div
      className={mergeStyles({
        background: theme.palette.neutralLighterAlt,
        padding: '2em',
        width: '75%',
        height: '75%'
      })}
    >
      <DialpadComponent longPressTrigger={isMobile ? 'touch' : 'mouseAndTouch'} />
    </div>
  );
};

export const Dialpad = DialpadStory.bind({});
