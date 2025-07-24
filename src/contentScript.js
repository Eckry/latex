'use strict';
import katex from 'katex';
import html2canvas from 'html2canvas';
const katexCSS = document.createElement('link');
katexCSS.rel = 'stylesheet';
katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
document.head.appendChild(katexCSS);

const MAIN_BG_COLOR = '#21303C';
const MAIN_FONT_COLOR = '#B4FFB3';
const MAIN_HL_COLOR = '#c4ac25';
const MAIN_HL2_COLOR = '#a0a7d2';

const audio = new Audio(
  'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-pmsfx/PM_comcam_smena_symbol_camera_shutter_speed_dial_18_mkh8060_pmsfx_lss_2353.mp3'
);

const $popup = document.createElement('div');
$popup.style.display = 'none';
$popup.classList.add('boxLATEX');
$popup.style.left = '50px';
$popup.style.top = '50px';
$popup.draggable = true;

const $input = document.createElement('input');
$input.classList.add('inputLATEX');
$input.style.backgroundColor = MAIN_BG_COLOR;
$input.style.color = MAIN_FONT_COLOR;

const $equationContainer = document.createElement('div');
$equationContainer.classList.add('equation-containerLATEX');

const $equation = document.createElement('p');
$equation.style.fontSize = '100px';
$equation.classList.add('equationLATEX');
$equation.style.color = MAIN_FONT_COLOR;

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

const $close = document.createElement('button');
$close.innerHTML = `<svg width="32" height="32"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"  stroke-linecap="round"stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>`;
$close.classList.add('closeLATEX');

const $colorPicker = document.createElement('input');
$colorPicker.type = 'color';
$colorPicker.value = MAIN_BG_COLOR;
$colorPicker.classList.add('color-pickerLATEX');

const $colorPickerFont = document.createElement('input');
$colorPickerFont.type = 'color';
$colorPickerFont.value = MAIN_FONT_COLOR;
$colorPickerFont.classList.add('color-pickerLATEX');

const $colorPickerHL = document.createElement('input');
$colorPickerHL.type = 'color';
$colorPickerHL.value = MAIN_HL_COLOR;
$colorPickerHL.classList.add('color-pickerLATEX');

const $colorPickerHL2 = document.createElement('input');
$colorPickerHL2.type = 'color';
$colorPickerHL2.value = MAIN_HL2_COLOR;
$colorPickerHL2.classList.add('color-pickerLATEX');

$popup.style.backgroundColor = MAIN_BG_COLOR + '74';

$popup.appendChild($input);
$popup.appendChild($equationContainer);
$equationContainer.appendChild($equation);
$footer.appendChild($close);
$footer.appendChild($clean);
$footer.appendChild($copy);
$footer.appendChild($screenshot);
$footer.appendChild($colorPicker);
$footer.appendChild($colorPickerFont);
$footer.appendChild($colorPickerHL);
$footer.appendChild($colorPickerHL2);
$popup.appendChild($footer);

document.body.appendChild($popup);

let bgcolor = $colorPicker.value;
let fontColor = $colorPickerFont.value;
let hlColor = $colorPickerHL.value;
let hl2Color = $colorPickerHL2.value;
let offsetX;
let offsetY;
let initialX;
let initialY;
let initialWidth;
let initialHeight;
let grabbing = false;
let resizing = false;

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
  html2canvas(document.querySelector('.equationLATEX'), {
    backgroundColor: bgcolor,
    scale: 3,
  }).then(async (canvas) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error('Failed to create blob from canvas');
        return;
      }

      const item = new ClipboardItem({ 'image/png': blob });

      try {
        await navigator.clipboard.write([item]);
        audio.play();
        console.log('Image copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy image: ', err);
      }
    }, 'image/png');
  });
}

function render() {
  $equation.innerHTML = '';
  katex.render(textEquation, $equation, {
    throwOnError: false,
    displayMode: true,
  });
  chrome.storage.local.set({ equation: textEquation });
  chrome.storage.local.set({ fontSize: $equation.style.fontSize });
  const $katexElements = document.querySelectorAll(
    '.mathnormal, .mclose, .mopen, .mrel, .mtight, .mbin, .msupsub'
  );
  $katexElements.forEach((element) => {
    element.addEventListener('click', () => {
      element.style.color = hlColor;
    });
    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      element.style.color = hl2Color;
    });
    element.style.cursor = 'pointer';
  });
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
  const containerWidth = $equationContainer.getBoundingClientRect().width - 100;

  if (newWidth > containerWidth && n === 0) return adjust(n, size);
  if (newWidth < containerWidth - 50 && n === 1 && size < 100)
    return adjust(n, size);
  return;
}

function updateEquation(e) {
  textEquation = e.target.value;

  const { width } = $equation.getBoundingClientRect();
  let size = parseInt($equation.style.fontSize);

  const containerWidth = $equationContainer.getBoundingClientRect().width - 100;

  if (width > containerWidth) adjust(0, size);
  if (width < containerWidth - 50) adjust(1, size);

  render();
}

function changeBackgroundColor(e) {
  bgcolor = e.target.value;
  $popup.style.backgroundColor = bgcolor + '74';
  $input.style.backgroundColor = bgcolor;
  $input.style.color = fontColor;
}

function changeFontColor(e) {
  fontColor = e.target.value;
  $input.style.color = fontColor;
  $equation.style.color = fontColor;
}

function changeHLColor(e) {
  hlColor = e.target.value;
}

function changeHL2Color(e) {
  hl2Color = e.target.value;
}

$popup.addEventListener('dragstart', (e) => {
  if (document.activeElement === $input || (!grabbing && !resizing)) {
    e.preventDefault();
    return;
  }
  const rect = $popup.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  initialX = e.clientX;
  initialY = e.clientY;
  initialHeight = rect.height;
  initialWidth = rect.width;
  var img = new Image();
  img.src =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  e.dataTransfer.setDragImage(img, 0, 0);
});

$popup.addEventListener('dragover', (e) => {
  e.preventDefault();

  if (resizing) {
    const { clientX, clientY } = e;
    $popup.style.width = `${clientX - initialX + initialWidth}px`;
    $popup.style.height = `${clientY - initialY + initialHeight}px`;
    const { width } = $equation.getBoundingClientRect();
    let size = parseInt($equation.style.fontSize);

    const containerWidth =
      $equationContainer.getBoundingClientRect().width - 100;
    if (width > containerWidth) adjust(0, size);
    if (width < containerWidth - 50) adjust(1, size);
  }

  if (grabbing) {
    const { clientX, clientY } = e;
    $popup.style.left = `${clientX - offsetX}px`;
    $popup.style.top = `${clientY - offsetY}px`;
  }
});

$popup.addEventListener('dragend', (e) => {
  e.preventDefault();
});

document.addEventListener('keydown', (e) => {
  if (grabbing || resizing) return;
  if (e.key === 'Control') {
    $popup.style.cursor = 'grab';
    grabbing = true;
  }

  if (e.key === 'Alt') {
    $popup.style.cursor = 'se-resize';
    resizing = true;
  }
});

document.addEventListener('keyup', (e) => {
  $popup.style.cursor = 'crosshair';
  if (e.key === 'Control') grabbing = false;
  if (e.key === 'Alt') resizing = false;
});

$input.addEventListener('input', updateEquation);
$copy.addEventListener('click', copy);
$screenshot.addEventListener('click', screenshot);
$clean.addEventListener('click', clean);
$close.addEventListener('click', hidePopup);
$colorPicker.addEventListener('input', changeBackgroundColor);
$colorPickerFont.addEventListener('input', changeFontColor);
$colorPickerHL.addEventListener('input', changeHLColor);
$colorPickerHL2.addEventListener('input', changeHL2Color);

chrome.runtime.onMessage.addListener(togglePopup);
