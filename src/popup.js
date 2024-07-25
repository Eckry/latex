'use strict';

import './popup.css';
import katex from 'katex';

const $equation = document.querySelector('.equation');
const $copy = document.querySelector('.copy');
const $input = document.querySelector('input');

let textEquation = '';

$input.addEventListener('input', (e) => {
  textEquation = e.target.value;
  katex.render(textEquation, $equation, { throwOnError: false });
});

$copy.addEventListener('click', () => {
  navigator.clipboard.writeText(textEquation);
});
