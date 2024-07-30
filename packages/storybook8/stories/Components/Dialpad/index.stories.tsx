// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Meta } from '@storybook/react';
import { Dialpad as DialpadComponent } from '@azure/communication-react';
import { hiddenControl } from '../../controlsUtils';
import { DialerExample } from './snippets/DialpadDialer.snippet';
import { CustomDialpadExample } from './snippets/CustomDialpad.snippet';
import { DialpadExample } from './snippets/Dialpad.snippet';

export { Dialpad } from './Dialpad.story';

export const DialerExampleDocsOnly = {
  render: DialerExample
};

export const CustomDialpadExampleDocsOnly = {
  render: CustomDialpadExample
};

export const DialpadExampleDocsOnly = {
  render: DialpadExample
};

export default {
  title: 'Components/Dialpad',
  component: DialpadComponent,
  argTypes: {
    strings: hiddenControl,
    onSendDtmfTone: hiddenControl,
    onClickDialpadButton: hiddenControl,
    textFieldValue: hiddenControl,
    onChange: hiddenControl,
    showDeleteButton: hiddenControl,
    longPressTrigger: hiddenControl,
    styles: hiddenControl,
    disableDtmfPlayback: hiddenControl,
    dialpadMode: hiddenControl,
    dtmfAudioContext: hiddenControl
  }
} as Meta;
