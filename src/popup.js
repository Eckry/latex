'use strict';

import './popup.css';
import katex from 'katex';

const $equation = document.querySelector('.equation');
const $copy = document.querySelector('.copy');
const $input = document.querySelector('input');
const $clean = document.querySelector('.clean');
const $screenshot = document.querySelector('.screenshot');

/**
 * Takes a screenshot of the current page using a the native browser [`MediaDevices`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) API.
 */
export const takeScreenshot = async (quality = 0.7, type = 'image/jpeg') => {
  return navigator.mediaDevices
    .getDisplayMedia({
      // This is actually supported, but only in Chrome so not yet part of the TS typedefs, so
      // @ts-ignore
      preferCurrentTab: true,
      video: { frameRate: 30 },
    })
    .then(waitForFocus) // We can only proceed if our tab is in focus.
    .then(async (result) => {
      // So we mount the screen capture to a video element...
      const video = createVideoElementToCaptureFrames(result);

      // ...which needs to be in the DOM but invisible so we can capture it.
      document.body.appendChild(video);

      // Now, we need to wait a bit to capture the right moment...
      // Hide this modal...

      // Play camera click sound, because why not

      // Wait for the video feed...
      await sleep();

      // Paint the video frame on a canvas...
      const canvas = paintVideoFrameOnCanvas(video);

      // Set the data URL in state
      const screenshot = canvas.toDataURL(type, quality);

      // Stop sharing screen.
      stopCapture(video);

      // Clean up
      canvas.remove();

      return screenshot;
    });
};

export const createVideoElementToCaptureFrames = (mediaStream) => {
  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.srcObject = mediaStream;
  video.setAttribute(
    'style',
    'position:fixed;top:0;left:0;pointer-events:none;visibility:hidden;'
  );

  return video;
};

export const paintVideoFrameOnCanvas = (video) => {
  // Get the video settings
  // @ts-ignore because getTracks is very much valid in modern browsers
  const videoTrackSettings = video.srcObject?.getTracks()[0].getSettings();

  // Create a canvas with the video's size and draw the video frame on it
  const canvas = document.createElement('canvas');
  canvas.width = videoTrackSettings?.width ?? 0;
  canvas.height = videoTrackSettings?.height ?? 0;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(video, 0, 0);

  return canvas;
};

export const sleep = (timeoutInMs = 300) =>
  new Promise((r) => {
    setTimeout(r, timeoutInMs);
  });

export const stopCapture = (video) => {
  // @ts-ignore because getTracks is very much valid in modern browsers
  const tracks = video.srcObject?.getTracks();
  tracks?.forEach((track) => track.stop());

  // This is the only way to clean up a video stream in the browser so...
  // eslint-disable-next-line no-param-reassign
  video.srcObject = null;
  video.remove();
};

export const waitForFocus = async (result) => {
  await sleep();
  if (document.hasFocus()) {
    return result;
  }
  return waitForFocus(result);
};

let textEquation = '';

window.addEventListener('load', () => {
  katex.render('Equation...', $equation, { throwOnError: false });
  chrome.storage.local.get('equation', (items) => {
    if (items.equation) {
      textEquation = items.equation;
      $input.value = textEquation;
      katex.render(textEquation, $equation, { throwOnError: false });
    }
  });
});

function screenshot() {
  takeScreenshot().then((screenshot) => {
    const img = new Image();
    img.src = screenshot;

    img.onload = () => {
      const { left, top, width, height } = $equation.getBoundingClientRect();
      const dpr = window.devicePixelRatio;

      // Desired dimensions for the cropped area (e.g., 100x100 pixels)
      const cropWidth = width * dpr;
      const cropHeight = height * dpr;

      // Calculate the top-left corner of the cropped area (center of the image)
      const startX = left * dpr;
      const startY = top * dpr;

      // Create a canvas with the size of the cropped area
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');

      // Draw the cropped area from the image onto the canvas
      ctx.drawImage(
        img,
        startX,
        startY, // Source x and y (start from the center of the image)
        cropWidth,
        cropHeight, // Source width and height (size of the cropped area)
        0,
        0, // Destination x and y on the canvas
        cropWidth,
        cropHeight // Destination width and height on the canvas
      );

      canvas.toBlob((blob) => {
        navigator.clipboard
          .write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ])
          .then(() => {
            console.log('Image copied to clipboard as PNG');
          })
          .catch((err) => {
            console.error('Could not copy image to clipboard:', err);
          });
      }, 'image/png'); // Ensure the image is saved as PNG
    };

    img.onerror = (err) => {
      console.error('Image load error:', err);
    };
  });
}

function copy() {
  navigator.clipboard.writeText(textEquation);
}

$input.addEventListener('input', (e) => {
  textEquation = e.target.value;
  if (e.target.value === '') {
    katex.render('Equation...', $equation, { throwOnError: false });
    chrome.storage.local.set({ equation: textEquation });
    return;
  }
  chrome.storage.local.set({ equation: textEquation });
  katex.render(textEquation, $equation, { throwOnError: false });
});

$copy.addEventListener('click', copy);
$equation.addEventListener('click', copy);
$screenshot.addEventListener('click', screenshot);

$clean.addEventListener('click', () => {
  textEquation = '';
  katex.render('Equation...', $equation, { throwOnError: false });
  $input.value = '';

  chrome.storage.local.set({ equation: '' });
});
