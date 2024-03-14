// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage } from '@azure/communication-chat';
import { MessageStatus } from '@internal/acs-ui-common';

/**
 * An extension to {@link @azure/communication-chat#ChatMessage} that stores
 * client-side only metadata for chat messages.
 *
 * TODO: The name has bitrotted. Rename me.
 *
 * @public
 */
export type ChatMessageWithStatus = ChatMessage & {
  clientMessageId?: string;
  status: MessageStatus;
  /* @conditional-compile-remove(data-loss-prevention) */
  policyViolation?: boolean;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  resourceCache?: Record<string, ResourceFetchResult>;
};
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * Result of the Resource downloaded from stateful client
 * @public
 */
export type ResourceFetchResult = {
  sourceUrl?: string;
  error?: Error;
};
