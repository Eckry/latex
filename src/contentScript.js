'use strict';
import katex from 'katex';

const audio = new Audio(
  'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-pmsfx/PM_comcam_smena_symbol_camera_shutter_speed_dial_18_mkh8060_pmsfx_lss_2353.mp3'
);

const $popup = document.createElement('div');
$popup.style.display = 'none';
$popup.classList.add('boxTransparentLATEX');

const $input = document.createElement('input');
$input.classList.add('inputLATEX');

const $equationContainer = document.createElement('div');
$equationContainer.classList.add('equation-containerLATEX');

const $equation = document.createElement('p');
$equation.style.fontSize = '100px';
$equation.classList.add('equationLATEX');

const $footer = document.createElement('footer');
$footer.classList.add('footerLATEX');

const $clean = document.createElement('button');
$clean.innerHTML = `<svg width="32"height="32"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"stroke-linecap="round"stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19 20h-10.5l-4.21 -4.3a1 1 0 0 1 0 -1.41l10 -10a1 1 0 0 1 1.41 0l5 5a1 1 0 0 1 0 1.41l-9.2 9.3" /><path d="M18 13.3l-6.3 -6.3" /></svg>`;
$clean.classList.add('cleanLATEX');

const $copy = document.createElement('button');
$copy.innerHTML = `<svg width="32"height="32"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"stroke-linecap="round"stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z"/><path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1"/></svg>`;
$copy.classList.add('copyLATEX');

const $screenshot = document.createElement('button');
$screenshot.innerHTML = `<svg width="32"height="32"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"stroke-linecap="round"stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /></svg>`;
$screenshot.classList.add('screenshotLATEX');

const $check = document.createElement('span');
$check.classList.add('checkLATEX');

const $close = document.createElement('button');
$close.innerHTML = `<svg width="32" height="32"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"  stroke-linecap="round"stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>`;
$close.classList.add('closeLATEX');

$popup.appendChild($input);
$popup.appendChild($equationContainer);
$equationContainer.appendChild($equation);
$footer.appendChild($close);
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
      audio.play();
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

window.addEventListener('load', async () => {
  const { equation, fontSize } = await chrome.storage.local.get([
    'equation',
    'fontSize',
  ]);

  if (equation) {
    $input.value = equation;
    textEquation = equation;
  }
  if (fontSize) $equation.style.fontSize = fontSize;
  render();
});

function screenshot() {
  takeScreenshot().then((screenshot) => {
    const img = new Image();
    img.src = screenshot;

    img.onload = () => {
      const { left, top, width, height } = $equation.getBoundingClientRect();

      const dpr = 1.25;
      // Desired dimensions for the cropped area (e.g., 100x100 pixels)
      const cropWidth = width * dpr;
      const cropHeight = height * dpr;

      // Calculate the top-left corner of the cropped area (center of the image)
      const start = { x: left * dpr, y: top * dpr };

      // Create a canvas with the size of the cropped area
      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');

      // Draw the cropped area from the image onto the canvas
      ctx.drawImage(
        img,
        start.x,
        start.y, // Source x and y (start from the center of the image)
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
          .then(() => console.log('Image copied to clipboard as PNG'))
          .catch((err) =>
            console.error('Could not copy image to clipboard:', err)
          );
      }, 'image/png');
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
  chrome.storage.local.set({ equation: textEquation });
  chrome.storage.local.set({ fontSize: $equation.style.fontSize });
}

function clean() {
  textEquation = '';
  render();
  $input.value = '';
}

function copy() {
  navigator.clipboard.writeText(textEquation);
}

const displayNonePopup = () => ($popup.style.display = 'none');

function showPopup() {
  $popup.removeEventListener('animationend', displayNonePopup);
  $popup.classList.remove('disappearLATEX');
  $popup.classList.add('appearLATEX');
  $popup.style.display = 'flex';
}

function hidePopup() {
  $popup.addEventListener('animationend', displayNonePopup);
  $popup.classList.replace('appearLATEX', 'disappearLATEX');
}

function togglePopup() {
  const isHidden = $popup.style.display === 'none';
  const isVisible = $popup.style.display === 'flex';

  if (isHidden) {
    showPopup();
  } else if (isVisible) {
    hidePopup();
  }
}

function adjust(n, size) {
  if (n === 0) size -= (size * 5) / 100;
  else if (size < 100) size += (size * 5) / 100;

  $equation.style.fontSize = size + 'px';
  const newWidth = $equation.getBoundingClientRect().width;

  if (newWidth > 1000 && n === 0) return adjust(n, size);
  if (newWidth < 1000 && n === 1 && size < 100) return adjust(n, size);
  return;
}

function updateEquation(e) {
  textEquation = e.target.value;

  const { width } = $equation.getBoundingClientRect();
  let size = parseInt($equation.style.fontSize);

  if (width > 1000) adjust(0, size);
  if (width < 1000) adjust(1, size);

  render();
}

$input.addEventListener('input', updateEquation);
$copy.addEventListener('click', copy);
$equation.addEventListener('click', copy);
$screenshot.addEventListener('click', screenshot);
$clean.addEventListener('click', clean);
$close.addEventListener('click', hidePopup);

chrome.runtime.onMessage.addListener(togglePopup);
