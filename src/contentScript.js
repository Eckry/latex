'use strict';
import katex from 'katex';
import html2canvas from 'html2canvas';
const katexCSS = document.createElement('link');
katexCSS.rel = 'stylesheet';
katexCSS.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
document.head.appendChild(katexCSS);

const MAIN_FONT_COLOR = '#B4FFB3';
const MAIN_BG_COLOR = '#21303C';
const MAIN_HL_COLOR = '#c4ac25';
const MAIN_HL2_COLOR = '#a0a7d2';
const fontSizeLimit = 150;

const audio = new Audio(
  'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-pmsfx/PM_comcam_smena_symbol_camera_shutter_speed_dial_18_mkh8060_pmsfx_lss_2353.mp3'
);

fetch(chrome.runtime.getURL('test.html'))
  .then(res => res.text())
  .then(html =>{
  let transparency = 1;
  let bgcolor = MAIN_BG_COLOR;
  let fontColor = MAIN_FONT_COLOR;
  let hlColor = MAIN_HL_COLOR;
  let hl2Color = MAIN_HL2_COLOR;
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
  document.body.insertAdjacentHTML("beforeend", html)
  const $popup = document.querySelector('.boxLATEX');
  $popup.classList.add('boxLATEX');
  $popup.style.display = 'none';
  $popup.style.left = '50px';
  $popup.style.top = '50px';
  $popup.style.width = '500px';
  $popup.style.height = '500px';
  $popup.draggable = true;
  $popup.style.backgroundColor = bgcolor + (transparency ? '74' : "");
  const $input = document.querySelector('.inputLATEX');
  $input.style.color = fontColor;
  $input.value = textEquation;
  const $clean = document.querySelector('.cleanLATEX');
  const $copy = document.querySelector('.copyLATEX');
  const $screenshot = document.querySelector('.screenshotLATEX');
  const $fontSizeUp = document.querySelector('.font-size-upLATEX');
  const $fontSizeDown = document.querySelector('.font-size-downLATEX');
  const $close = document.querySelector('.closeLATEX');
  const $transparency = document.querySelector('.transparencyLATEX');
  const $equation = document.querySelector('.equationLATEX');
  $equation.style.fontSize = `${fontSize}px`;
  $equation.style.color = fontColor;
  const $fontSize = document.querySelector('.font-size-inputLATEX');
  $fontSize.value = fontSize;
  const $colorPicker = document.querySelector('.color-picker-bgLATEX');
  $colorPicker.value = bgcolor;
  const $colorPickerFont = document.querySelector('.color-picker-fontLATEX');
  $colorPickerFont.value = fontColor;
  const $colorPickerHL = document.querySelector('.color-picker-hlLATEX');
  $colorPickerHL.value = hlColor;
  const $colorPickerHL2 = document.querySelector('.color-picker-hl2LATEX');
  $colorPickerHL2.value = hl2Color;

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
      $popup.style.backgroundColor = bgcolor + (transparency ? '74' : "");
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


  function updateEquation(e) {
    textEquation = e.target.value;

    render();
  }

  function changeBackgroundColor(e) {
    bgcolor = e.target.value;
    $popup.style.backgroundColor = bgcolor + (transparency ? '74' : "");
    chrome.storage.local.set({ bgcolor });
  }

  function changeFontColor(e) {
    fontColor = e.target.value;
    console.log("xd")
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
    $fontSize.value = fontSize;
    $equation.style.fontSize = `${fontSize}px`;
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
  $input.addEventListener('input', updateEquation);
  $fontSize.addEventListener('input', readFontSize);
  $fontSizeUp.addEventListener('click', decreaseFontSize);
  $fontSizeDown.addEventListener('click', increaseFontSize);
  $copy.addEventListener('click', copy);
  $screenshot.addEventListener('click', screenshot);
  $clean.addEventListener('click', clean);
  $close.addEventListener('click', hidePopup);
  $colorPicker.addEventListener('input', changeBackgroundColor);
  $colorPickerFont.addEventListener('input', changeFontColor);
  $colorPickerHL.addEventListener('input', changeHLColor);
  $colorPickerHL2.addEventListener('input', changeHL2Color);
  $transparency.addEventListener('click', toggleTransparency);
  function togglePopup() {
    const isHidden = $popup.style.display === 'none';
    const isVisible = $popup.style.display === 'flex';

    if (isHidden) {
      showPopup();
    } else if (isVisible) {
      hidePopup();
    }
  }

  chrome.runtime.onMessage.addListener(togglePopup);
})

