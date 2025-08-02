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
const fontSizeLimit = 150;

const audio = new Audio(
  'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-pmsfx/PM_comcam_smena_symbol_camera_shutter_speed_dial_18_mkh8060_pmsfx_lss_2353.mp3'
);

const $popup = document.createElement('div');
$popup.style.display = 'none';
$popup.classList.add('boxLATEX');
$popup.style.left = '50px';
$popup.style.top = '50px';
$popup.style.width = '500px';
$popup.style.height = '500px';
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

const $fontSizeContainer = document.createElement('div');
$fontSizeContainer.classList.add('font-size-containerLATEX');

const $fontSizeUp = document.createElement('button');
$fontSizeUp.classList.add('font-size-upLATEX');

const $fontSizeDown = document.createElement('button');
$fontSizeDown.classList.add('font-size-upLATEX');

const $fontSize = document.createElement('input');
$fontSize.value = 100;
$fontSize.classList.add('font-size-inputLATEX');

const $close = document.createElement('button');
$close.innerHTML = `<svg width="32" height="32"viewBox="0 0 24 24"fill="none"stroke="currentColor"stroke-width="2"  stroke-linecap="round"stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" /><path d="M9 12h12l-3 -3" /><path d="M18 15l3 -3" /></svg>`;
$close.classList.add('closeLATEX');

const $transparency = document.createElement('button');
$transparency.classList.add('transparencyLATEX');

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
$footer.appendChild($transparency);
$footer.appendChild($fontSizeContainer);
$footer.appendChild($colorPicker);
$footer.appendChild($colorPickerFont);
$footer.appendChild($colorPickerHL);
$footer.appendChild($colorPickerHL2);
$popup.appendChild($footer);
$fontSizeContainer.appendChild($fontSizeDown);
$fontSizeContainer.appendChild($fontSize);
$fontSizeContainer.appendChild($fontSizeUp);

document.body.appendChild($popup);

let transparency = 1;
let bgcolor = $colorPicker.value;
let fontColor = $colorPickerFont.value;
let hlColor = $colorPickerHL.value;
let hl2Color = $colorPickerHL2.value;
let offsetX;
let offsetY;
let initialX;
let initialY;
let initialWidth = 500;
let initialHeight = 500;
let grabbing = false;
let resizing = false;
let fontSize = 100;

let textEquation = '';

window.addEventListener('load', async () => {
  const {
    equation,
    fontSize: fS,
    bgcolor: bg,
    fontColor: fC,
    hlColor: hC,
    hl2Color: h2C,
  } = await chrome.storage.local.get([
    'equation',
    'fontSize',
    'bgcolor',
    'fontColor',
    'hlColor',
    'hl2Color',
  ]);

  if (equation) {
    $input.value = equation;
    textEquation = equation;
  }
  if (fS) {
    $equation.style.fontSize = `${fS}px`;
    fontSize = fS;
    $fontSize.value = fS;
  }

  if (bg) {
    bgcolor = bg;
    $colorPicker.value = bg;
    $popup.style.backgroundColor = bgcolor + '74';
    $input.style.backgroundColor = bgcolor;
  }

  if (fC) {
    fontColor = fC;
    $colorPickerFont.value = fC;
    $input.style.color = fontColor;
    $equation.style.color = fontColor;
  }

  if (hC) {
    hlColor = hC;
    $colorPickerHL.value = hC;
  }

  if (h2C) {
    hl2Color = h2C;
    $colorPickerHL2.value = h2C;
  }
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
  const $katexElementsToHighlight = document.querySelectorAll(
    '.katex .mathnormal, .katex .mclose, .katex .mopen, .katex .mrel, .katex .mtight, .katex .mbin, .katex .op-symbol, .katex .frac-line'
  );

  const $katexElementsToHide = document.querySelectorAll(
    '.katex .hide-tail, .katex .mord, .katex .vlist-r, .katex .vlist-t, .katex .vlist-t2'
  );
  $katexElementsToHide.forEach((element) => {
    element.style.zIndex = -1;
  });
  $katexElementsToHighlight.forEach((element) => {
    element.style.pointerEvents = 'auto';
    element.style.zIndex = 1000000;
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

function updateEquation(e) {
  textEquation = e.target.value;

  render();
}

function changeBackgroundColor(e) {
  bgcolor = e.target.value;
  $popup.style.backgroundColor = bgcolor + '74';
  $input.style.backgroundColor = bgcolor;
  chrome.storage.local.set({ bgcolor });
}

function changeFontColor(e) {
  fontColor = e.target.value;
  $input.style.color = fontColor;
  $equation.style.color = fontColor;
  chrome.storage.local.set({ fontColor });
}

function changeHLColor(e) {
  hlColor = e.target.value;
  chrome.storage.local.set({ hlColor });
}

function changeHL2Color(e) {
  hl2Color = e.target.value;
  chrome.storage.local.set({ hl2Color });
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
  var img = new Image();
  img.src =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  e.dataTransfer.setDragImage(img, 0, 0);
});

$popup.addEventListener('dragover', (e) => {
  e.preventDefault();

  if (resizing) {
    const { left, top } = $popup.style;
    const leftNum = parseFloat(left.slice(0, left.length - 2));
    const topNum = parseFloat(top.slice(0, left.length - 2));
    const { clientX, clientY } = e;
    const newWidth = clientX - initialX + initialWidth;
    const newHeight = clientY - initialY + initialHeight;
    if (newWidth + leftNum <= window.innerWidth)
      $popup.style.width = `${newWidth}px`;
    if (newHeight + topNum <= window.innerHeight)
      $popup.style.height = `${newHeight}px`;
  }

  if (grabbing) {
    const { clientX, clientY } = e;
    const newLeft = clientX - offsetX;
    const newTop = clientY - offsetY;
    if (newLeft >= 0 && newLeft + initialWidth <= window.innerWidth)
      $popup.style.left = `${newLeft}px`;
    if (newTop >= 0 && newTop + initialHeight <= window.innerHeight)
      $popup.style.top = `${newTop}px`;
  }
});

$popup.addEventListener('dragend', (e) => {
  e.preventDefault();
  const lastWidth = $popup.style.width
  const lastHeight = $popup.style.height
  initialWidth = parseFloat(lastWidth.slice(0, $popup.style.width.length - 2));
  initialHeight = parseFloat(lastHeight.slice(0, $popup.style.height.length - 2));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Control' && !resizing) {
    if (grabbing) {
      $popup.style.cursor = 'crosshair';
    } else $popup.style.cursor = 'grab';
    grabbing = !grabbing;
  }

  if (e.key === 'Shift' && !grabbing) {
    if (resizing) {
      $popup.style.cursor = 'crosshair';
    } else $popup.style.cursor = 'se-resize';
    resizing = !resizing;
  }
});

function readFontSize() {
  const fontSizeInput = $fontSize.value;
  if (isNaN(Number(fontSizeInput))) {
    $fontSize.value = `${fontSize}`;
    return;
  }
  let fontSizeNumber = Number(fontSizeInput);
  if (fontSizeNumber >= fontSizeLimit) {
    fontSizeNumber = fontSizeLimit;
    $fontSize.value = fontSizeLimit;
  }
  fontSize = fontSizeNumber;
  $equation.style.fontSize = `${fontSizeNumber}px`;
  chrome.storage.local.set({ fontSize: fontSizeNumber });
}

function increaseFontSize() {
  if (fontSize >= 150) return;
  fontSize++;
  $fontSize.value = fontSize;
  $equation.style.fontSize = `${fontSize}px`;
  chrome.storage.local.set({ fontSize: fontSize });
}

function decreaseFontSize() {
  if (fontSize < 0) return;
  fontSize--;
  $fontSize.value = fontSize;
  $equation.style.fontSize = `${fontSize}px`;
  chrome.storage.local.set({ fontSize: fontSize });
}



function toggleTransparency() {
  if(transparency) {
    $popup.style.backgroundColor = bgcolor;
  } else {
    $popup.style.backgroundColor = bgcolor + '74';
  }
  $transparency.classList.toggle('transparency-activeLATEX');
  transparency = !transparency;
}

$input.addEventListener('input', updateEquation);
$fontSize.addEventListener('input', readFontSize);
$fontSizeUp.addEventListener('click', increaseFontSize);
$fontSizeDown.addEventListener('click', decreaseFontSize);
$copy.addEventListener('click', copy);
$screenshot.addEventListener('click', screenshot);
$clean.addEventListener('click', clean);
$close.addEventListener('click', hidePopup);
$colorPicker.addEventListener('input', changeBackgroundColor);
$colorPickerFont.addEventListener('input', changeFontColor);
$colorPickerHL.addEventListener('input', changeHLColor);
$colorPickerHL2.addEventListener('input', changeHL2Color);
$transparency.addEventListener('click', toggleTransparency);

chrome.runtime.onMessage.addListener(togglePopup);
