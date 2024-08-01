// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo } from 'react';
import { SendBox, SendBoxStylesProps } from '@internal/react-components';
import { usePropsFor } from '../ChatComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { Suspense } from 'react';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { _ErrorBoundary, RichTextSendBoxProps, RichTextEditorOptions } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadataInProgress, MessageOptions } from '@internal/acs-ui-common';

/* @conditional-compile-remove(rich-text-editor-composite-support) */
/**
 * Wrapper for RichTextSendBox component to allow us to use usePropsFor with richTextSendBox with lazy loading
 */
const RichTextSendBoxWrapper = React.lazy(() =>
  import('./RichTextSendBoxWrapper').then((module) => ({ default: module.RichTextSendBoxWrapper }))
);

/**
 * @private
 * Use this function to load RoosterJS dependencies early in the lifecycle.
 * It should be the same import as used for lazy loading.
 *
/* @conditional-compile-remove(rich-text-editor-composite-support)
 */
export const loadRichTextSendBox = (): Promise<{
  default: React.ComponentType<RichTextSendBoxProps>;
}> => import('./RichTextSendBoxWrapper').then((module) => ({ default: module.RichTextSendBoxWrapper }));

/* @conditional-compile-remove(rich-text-editor) */
/**
 * Options for the rich text editor send box configuration.
 *
 * @internal
 */
export interface RichTextSendBoxOptions extends RichTextEditorOptions {
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback to handle an inline image that's inserted in the rich text editor.
   * When not provided, pasting images into rich text editor will be disabled.
   * @param imageAttributes - attributes of the image such as id, src, style, etc.
   *        It also contains the image file name which can be accessed through imageAttributes['data-image-file-name']
   */
  onInsertInlineImage?: (imageAttributes: Record<string, string>) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional callback invoked after inline image is removed from the UI.
   * @param imageAttributes - attributes of the image such as id, src, style, etc.
   *        It also contains the image file name which can be accessed through imageAttributes['data-image-file-name']
   */
  onRemoveInlineImage?: (imageAttributes: Record<string, string>) => void;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  /**
   * Optional Array of type {@link AttachmentMetadataInProgress}
   * to provide progress and error info for inline images inserted in the RichTextSendBox.
   */
  inlineImagesWithProgress?: AttachmentMetadataInProgress[];
}
/**
 * @private
 */
export type SendBoxPickerProps = {
  styles?: SendBoxStylesProps;
  autoFocus?: 'sendBoxTextField';
  onSendMessage: (
    content: string,
    /* @conditional-compile-remove(file-sharing-acs) */ options?: MessageOptions
  ) => Promise<void>;
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  richTextEditorOptions?: RichTextSendBoxOptions;
  /* @conditional-compile-remove(file-sharing-acs) */
  attachments?: AttachmentMetadataInProgress[];
  /* @conditional-compile-remove(file-sharing-acs) */
  onCancelAttachmentUpload?: (attachmentId: string) => void;
};

/**
 * @private
 */
export const SendBoxPicker = (props: SendBoxPickerProps): JSX.Element => {
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const { richTextEditorOptions } = props;
  /* @conditional-compile-remove(rich-text-editor-image-upload) */
  const { onPaste, onInsertInlineImage, inlineImagesWithProgress, onRemoveInlineImage } = richTextEditorOptions || {};

  const sendBoxProps = usePropsFor(SendBox);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const isRichTextEditorEnabled = useMemo(() => {
    return richTextEditorOptions !== undefined;
  }, [richTextEditorOptions]);

  const sendBox = useMemo(() => <SendBox {...sendBoxProps} {...props} />, [props, sendBoxProps]);

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  if (isRichTextEditorEnabled) {
    return (
      <_ErrorBoundary fallback={sendBox}>
        <Suspense fallback={sendBox}>
          <RichTextSendBoxWrapper
            {...props}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onPaste={onPaste}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onInsertInlineImage={onInsertInlineImage}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            inlineImagesWithProgress={inlineImagesWithProgress}
            /* @conditional-compile-remove(rich-text-editor-image-upload) */
            onRemoveInlineImage={onRemoveInlineImage}
          />
        </Suspense>
      </_ErrorBoundary>
    );
  }
  return sendBox;
};
