// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(image-overlay) */
import React from 'react';
/* @conditional-compile-remove(image-overlay) */
import { ImageOverlay } from './ImageOverlay';
/* @conditional-compile-remove(image-overlay) */
import { render, screen } from '@testing-library/react';
/* @conditional-compile-remove(image-overlay) */
import { registerIcons } from '@fluentui/react';

describe('ImageOverlay default layout tests', () => {
  /* @conditional-compile-remove(image-overlay) */
  beforeAll(() => {
    registerIcons({
      icons: {
        cancel: <></>,
        download: <></>
      }
    });
  });
  test('Empty Mock Test', () => {
    expect(true).toBe(true);
  });

  /* @conditional-compile-remove(image-overlay) */
  const titleIconTestId1 = 'titleIconTestId1';
  /* @conditional-compile-remove(image-overlay) */
  const imageInfo = {
    imageSrc: 'images/inlineImageExample1.png',
    downloadFilename: 'downloadFilename',
    altText: 'altText',
    title: 'title',
    titleIcon: <div data-testid={titleIconTestId1}></div>
  };

  /* @conditional-compile-remove(image-overlay) */
  const renderImageOverlayComponent = (
    imageSrc?: string,
    title?: string,
    titleIcon?: JSX.Element,
    onDismiss?: () => void,
    onDownloadButtonClicked?: () => void,
    onError?: () => void
  ): HTMLElement => {
    const { container } = render(
      <ImageOverlay
        imageSrc={imageSrc || imageInfo.imageSrc}
        title={title || imageInfo.title}
        titleIcon={titleIcon || imageInfo.titleIcon}
        altText="altText"
        onDismiss={onDismiss || jest.fn()}
        onDownloadButtonClicked={onDownloadButtonClicked || jest.fn()}
        onError={onError || jest.fn()}
        isOpen={true}
      />
    );
    return container;
  };
  /* @conditional-compile-remove(image-overlay) */
  test('Show image overlay with required props', async () => {
    renderImageOverlayComponent();
    const image: HTMLImageElement = await screen.findByRole('img', { name: 'image-overlay-main-image' });
    const title: HTMLElement = await screen.findByText(imageInfo.title);
    const titleIcon: HTMLElement = await screen.findByTestId(titleIconTestId1);
    expect(image.src).toContain(imageInfo.imageSrc);
    expect(image.alt).toBe(imageInfo.altText);

    expect(title).toBeTruthy();
    expect(titleIcon).toBeTruthy();
  });

  /* @conditional-compile-remove(image-overlay) */
  test('It should call the onDismiss handler when the close icon is clicked', async () => {
    const onDismissHandler = jest.fn();
    renderImageOverlayComponent(undefined, undefined, undefined, onDismissHandler);
    const buttons = await screen.findAllByRole('button', { name: 'Close' });
    expect(buttons.length).toBe(1);
    const closeButton: HTMLElement = buttons[0];
    closeButton.click();
    expect(onDismissHandler).toBeCalledTimes(1);
  });

  /* @conditional-compile-remove(image-overlay) */
  test('It should call the onDownloadButtonClicked handler when the download icon is clicked', async () => {
    const onDownloadButtonClicked = jest.fn();
    renderImageOverlayComponent(undefined, undefined, undefined, undefined, onDownloadButtonClicked);
    const buttons = await screen.findAllByRole('button', { name: 'Download' });
    expect(buttons.length).toBe(2);
    const downloadButton: HTMLElement = buttons[0];
    downloadButton.click();
    expect(onDownloadButtonClicked).toBeCalledTimes(1);
    expect(onDownloadButtonClicked).toBeCalledWith(imageInfo.imageSrc);
  });
});