'use strict';

import './popup.css';
import katex from 'katex';

const $equation = document.querySelector('.equation');
const $copy = document.querySelector('.copy');
const $input = document.querySelector('input');

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

function copy() {
  navigator.clipboard.writeText(textEquation);
}

$input.addEventListener('input', (e) => {
  textEquation = e.target.value;
  if (e.target.value === '') {
    katex.render('Equation...', $equation, { throwOnError: false });
    return;
  }
  chrome.storage.local.set({ equation: textEquation });
  katex.render(textEquation, $equation, { throwOnError: false });
});

$copy.addEventListener('click', copy);
$equation.addEventListener('click', copy);
