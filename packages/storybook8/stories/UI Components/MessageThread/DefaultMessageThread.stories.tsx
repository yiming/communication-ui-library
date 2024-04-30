// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage, FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';

import { GetHistoryChatMessages } from './snippets/placeholdermessages';

const DefaultMessageThreadExample: () => JSX.Element = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(GetHistoryChatMessages());

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={messages}
        onUpdateMessage={async (id, content, options) => {
          const metadata = options?.metadata;
          const updated = messages.map((m) =>
            m.messageId === id
              ? { ...m, metadata, failureReason: 'Failed to edit', status: 'failed' as MessageStatus }
              : m
          );
          setMessages(updated);
          return Promise.reject('Failed to update');
        }}
        onCancelEditMessage={(id) => {
          const updated = messages.map((m) =>
            m.messageId === id ? { ...m, failureReason: undefined, status: undefined } : m
          );
          setMessages(updated);
        }}
      />
    </FluentThemeProvider>
  );
};

type Story = StoryObj<typeof meta>;
export const MessageThreadStory: Story = {
  render: DefaultMessageThreadExample
};

const meta: Meta<typeof DefaultMessageThreadExample> = {
  component: MessageThread
};

export default meta;
