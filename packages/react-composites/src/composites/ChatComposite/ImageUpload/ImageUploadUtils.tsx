// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentUpload, AttachmentUploadActionType, AttachmentUploadTask } from '../file-sharing/AttachmentUpload';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { SEND_BOX_UPLOADS_KEY_VALUE } from '../../common/constants';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ChatAdapter } from '../adapter/ChatAdapter';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { Dispatch } from 'react';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ImageActions } from './ImageUploadReducer';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { nanoid } from 'nanoid';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ChatCompositeStrings } from '../Strings';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const MAX_INLINE_IMAGE_UPLOAD_SIZE_MB = 20;

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const fetchBlobData = async (
  resource: string | URL | Request,
  options: { timeout?: number; headers?: Headers; abortController: AbortController }
): Promise<Response> => {
  // default timeout is 30 seconds
  const { timeout = 30000, abortController } = options;

  const id = setTimeout(() => {
    abortController.abort();
  }, timeout);

  const response = await fetch(resource, {
    ...options,
    signal: abortController.signal
  });
  clearTimeout(id);
  return response;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
export const getInlineImageData = async (image: string): Promise<Blob | undefined> => {
  if (image.startsWith('blob') || image.startsWith('http')) {
    try {
      const res = await fetchBlobData(image, { abortController: new AbortController() });
      const blobImage = await res.blob();
      return blobImage;
    } catch (error) {
      console.error('Error fetching image data', error);
      return;
    }
  }
  return;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const removeImageTags = (event: { content: DocumentFragment }): void => {
  event.content.querySelectorAll('img').forEach((image) => {
    // If the image is the only child of its parent, remove all the parents of this img element.
    let parentNode: HTMLElement | null = image.parentElement;
    let currentNode: HTMLElement = image;
    while (parentNode?.childNodes.length === 1) {
      currentNode = parentNode;
      parentNode = parentNode.parentElement;
    }
    currentNode?.remove();
  });
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getEditBoxMessagesImageUploadsInProgress = (
  editBoxInlineImageUploads: Record<string, AttachmentUpload[]> | undefined
): Record<string, AttachmentMetadataInProgress[]> | undefined => {
  if (!editBoxInlineImageUploads) {
    return;
  }
  const messageIds = Object.keys(editBoxInlineImageUploads || {});
  const messagesImageUploadsInProgress: Record<string, AttachmentMetadataInProgress[]> = {};
  messageIds.map((messageId) => {
    const messageUploads = editBoxInlineImageUploads[messageId].map((upload) => {
      return upload.metadata;
    });
    messagesImageUploadsInProgress[messageId] = messageUploads;
  });
  return messagesImageUploadsInProgress;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getSendBoxImageUploadsInProgress = (
  sendBoxInlineImageUploads: Record<string, AttachmentUpload[]> | undefined
): AttachmentMetadataInProgress[] | undefined => {
  if (!sendBoxInlineImageUploads) {
    return;
  }
  return sendBoxInlineImageUploads[SEND_BOX_UPLOADS_KEY_VALUE]?.map((upload) => upload.metadata);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const inlineImageUploadHandler = async (
  uploadTasks: AttachmentUpload[],
  adapter: ChatAdapter,
  strings: ChatCompositeStrings
): Promise<void> => {
  for (const task of uploadTasks) {
    const uploadTask = task as AttachmentUploadTask;
    const image: Blob | undefined = uploadTask.image;
    if (!image) {
      uploadTask.notifyUploadFailed(strings.uploadImageDataNotProvided);
      continue;
    }
    if (image && image.size > MAX_INLINE_IMAGE_UPLOAD_SIZE_MB * 1024 * 1024) {
      uploadTask.notifyUploadFailed(
        strings.uploadImageIsTooLarge.replace('{maxImageSize}', `${MAX_INLINE_IMAGE_UPLOAD_SIZE_MB}`)
      );
      continue;
    }

    const SUPPORTED_FILES: Array<string> = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'];
    const imageExtension = task.metadata?.name.split('.').pop() ?? '';
    if (!SUPPORTED_FILES.includes(imageExtension)) {
      uploadTask.notifyUploadFailed(
        strings.uploadImageExtensionIsNotAllowed.replace('{imageExtension}', imageExtension)
      );
      continue;
    }

    try {
      const response = await adapter.uploadImage(image, task.metadata?.name);
      uploadTask.notifyUploadCompleted(response.id, task.metadata.url || '');
    } catch (error) {
      console.error(error);
      uploadTask.notifyUploadFailed(strings.uploadImageFailed);
    }
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const generateUploadTask = async (
  image: string,
  fileName: string,
  messageId: string,
  inlineImageUploadActionHandler: Dispatch<ImageActions>
): Promise<AttachmentUpload | undefined> => {
  const imageData = await getInlineImageData(image);
  if (!imageData) {
    return;
  }
  const taskId = nanoid();
  const uploadTask: AttachmentUpload = {
    image: imageData,
    taskId,
    metadata: {
      id: taskId,
      name: fileName,
      url: image,
      progress: 0
    },
    notifyUploadProgressChanged: (value: number) => {
      inlineImageUploadActionHandler({
        type: AttachmentUploadActionType.Progress,
        taskId,
        progress: value,
        messageId
      });
    },
    notifyUploadCompleted: (id: string, url: string) => {
      inlineImageUploadActionHandler({
        type: AttachmentUploadActionType.Completed,
        taskId,
        id,
        url,
        messageId
      });
    },
    notifyUploadFailed: (message: string) => {
      inlineImageUploadActionHandler({ type: AttachmentUploadActionType.Failed, taskId, message, messageId });
      // remove the failed upload task when error banner is auto dismissed after 10 seconds
      // so the banner won't be shown again on UI re-rendering.
      setTimeout(() => {
        inlineImageUploadActionHandler({ type: AttachmentUploadActionType.Remove, id: taskId, messageId });
      }, 10 * 1000);
    }
  };
  return uploadTask;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const onUploadInlineImageForEditBox = async (
  image: string,
  fileName: string,
  messageId: string,
  adapter: ChatAdapter,
  handleEditBoxInlineImageUploadAction: Dispatch<ImageActions>,
  chatCompositeStrings: ChatCompositeStrings
): Promise<void> => {
  const uploadTask: AttachmentUpload | undefined = await generateUploadTask(
    image,
    fileName,
    messageId,
    handleEditBoxInlineImageUploadAction
  );
  if (!uploadTask) {
    return;
  }

  handleEditBoxInlineImageUploadAction({
    type: AttachmentUploadActionType.Set,
    newUploads: [uploadTask],
    messageId
  });
  inlineImageUploadHandler([uploadTask], adapter, chatCompositeStrings);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const onUploadInlineImageForSendBox = async (
  image: string,
  fileName: string,
  adapter: ChatAdapter,
  handleSendBoxInlineImageUploadAction: Dispatch<ImageActions>,
  chatCompositeStrings: ChatCompositeStrings
): Promise<void> => {
  const uploadTask: AttachmentUpload | undefined = await generateUploadTask(
    image,
    fileName,
    SEND_BOX_UPLOADS_KEY_VALUE,
    handleSendBoxInlineImageUploadAction
  );

  if (!uploadTask) {
    return;
  }

  handleSendBoxInlineImageUploadAction({
    type: AttachmentUploadActionType.Set,
    newUploads: [uploadTask],
    messageId: SEND_BOX_UPLOADS_KEY_VALUE
  });
  inlineImageUploadHandler([uploadTask], adapter, chatCompositeStrings);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const cancelInlineImageUpload = (
  imageId: string,
  imageUpload: AttachmentUpload | undefined,
  messageId: string,
  inlineImageUploadActionHandler: Dispatch<ImageActions>,
  adapter: ChatAdapter
): void => {
  if (!imageUpload || !imageUpload?.metadata.id) {
    return;
  }

  inlineImageUploadActionHandler({
    type: AttachmentUploadActionType.Remove,
    id: imageUpload?.metadata.id,
    messageId
  });
  // TODO: remove local blob
  if (imageUpload?.metadata.progress === 1) {
    try {
      adapter.deleteImage(imageId);
    } catch (error) {
      console.error(error);
    }
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const onCancelInlineImageUploadHandlerForEditBox = (
  imageId: string,
  messageId: string,
  editBoxInlineImageUploads: Record<string, AttachmentUpload[]> | undefined,
  adapter: ChatAdapter,
  handleEditBoxInlineImageUploadAction: Dispatch<ImageActions>
): void => {
  if (!editBoxInlineImageUploads) {
    return;
  }
  const imageUpload = editBoxInlineImageUploads[messageId].find((upload) => upload.metadata.id === imageId);

  cancelInlineImageUpload(imageId, imageUpload, messageId, handleEditBoxInlineImageUploadAction, adapter);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const onCancelInlineImageUploadHandlerForSendBox = (
  imageId: string,
  sendBoxInlineImageUploads: Record<string, AttachmentUpload[]> | undefined,
  adapter: ChatAdapter,
  handleSendBoxInlineImageUploadAction: Dispatch<ImageActions>
): void => {
  if (!sendBoxInlineImageUploads) {
    return;
  }
  const imageUpload = sendBoxInlineImageUploads[SEND_BOX_UPLOADS_KEY_VALUE].find(
    (upload) => upload.metadata.id === imageId
  );

  cancelInlineImageUpload(
    imageId,
    imageUpload,
    SEND_BOX_UPLOADS_KEY_VALUE,
    handleSendBoxInlineImageUploadAction,
    adapter
  );
};
