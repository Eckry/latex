'use strict';
import katex from 'katex';

const $popup = document.createElement('div');
$popup.style.display = 'none';
$popup.classList.add('boxTransparentLATEX');

const $input = document.createElement('input');
$input.classList.add('inputLATEX');

const $equationContainer = document.createElement('div');
$equationContainer.classList.add('equation-containerLATEX');

const $equation = document.createElement('p');
$equation.classList.add('equationLATEX');

const $footer = document.createElement('footer');
$footer.classList.add('footerLATEX');

const $clean = document.createElement('button');
$clean.innerHTML = `<svg width="32" height="32"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round"
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" />
<path d="M18 13.3l-6.3 -6.3" />
</svg>`;
$clean.classList.add('cleanLATEX');

const $copy = document.createElement('button');
$copy.innerHTML = `<svg
width="32"
height="32"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round"
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path
  d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"
/>
<path
  d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"
/>
</svg>`;
$copy.classList.add('copyLATEX');

const $screenshot = document.createElement('button');
$screenshot.innerHTML = `<svg
width="32"
height="32"
viewBox="0 0 24 24"
fill="none"
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round"
>
<path stroke="none" d="M0 0h24v24H0z" fill="none" />
<path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
<path d="M4 16v2a2 2 0 0 0 2 2h2" />
<path d="M16 4h2a2 2 0 0 1 2 2v2" />
<path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
<path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
</svg>`;
$screenshot.classList.add('screenshotLATEX');

const $check = document.createElement('span');
$check.classList.add('checkLATEX');

$popup.appendChild($input);
$popup.appendChild($equationContainer);
$equationContainer.appendChild($equation);
$footer.appendChild($clean);
$footer.appendChild($copy);
$footer.appendChild($screenshot);
$footer.appendChild($check);
$popup.appendChild($footer);

document.body.appendChild($popup);

const colors = {
  highlight: '#c4ac25',
  normal: '#FB2576',
};

const macros = {
  '\\h': `\\color{${colors.highlight}}`,
  '\\e': `\\color{${colors.normal}}`,
};

const regExp = /\s(.)\s/gi;
const replace = (expression) => {
  return ` \\h ${expression[1]} \\e `;
};

/**
 * Takes a screenshot of the current page using a the native browser [`MediaDevices`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) API.
 */
export const takeScreenshot = async (quality = 1.0, type = 'image/png') => {
  return navigator.mediaDevices
    .getDisplayMedia({
      // This is actually supported, but only in Chrome so not yet part of the TS typedefs, so
      // @ts-ignore
      preferCurrentTab: true,
      video: { frameRate: 30 },
    })
    .then((result) => {
      $popup.classList.add('boxLATEX');
      $popup.classList.remove('boxTransparentLATEX');
      $check.classList.add('check-greenLATEX');
      return result;
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
  render();
  chrome.storage.local.get('equation', (items) => {
    if (items.equation) {
      textEquation = items.equation;
      $input.value = textEquation;
      render();
    }
  });
});

function screenshot() {
  takeScreenshot().then((screenshot) => {
    const img = new Image();
    img.src = screenshot;

    img.onload = () => {
      const { left, top, width, height } =
        $equationContainer.getBoundingClientRect();
      const dpr = 1.25;
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
    $popup.classList.add('boxTransparentLATEX');
    $popup.classList.remove('boxLATEX');
    $check.classList.remove('check-greenLATEX');
  });
}

function render() {
  katex.render(textEquation.replace(regExp, replace), $equation, {
    throwOnError: false,
    macros,
    displayMode: true,
  });
}

function copy() {
  navigator.clipboard.writeText(textEquation);
}

$input.addEventListener('input', (e) => {
  textEquation = e.target.value;
  if (e.target.value === '') {
    render();

    chrome.storage.local.set({ equation: textEquation });
    return;
  }
  chrome.storage.local.set({ equation: textEquation });
  render();
});

$copy.addEventListener('click', copy);
$equation.addEventListener('click', copy);
$screenshot.addEventListener('click', screenshot);

$clean.addEventListener('click', () => {
  textEquation = '';
  render();
  $input.value = '';

  chrome.storage.local.set({ equation: '' });
});

chrome.runtime.onMessage.addListener((msgObj) => {
  if ($popup.style.display === 'none') {
    $popup.style.display = 'flex';
  } else {
    $popup.style.display = 'none';
  }
});
