'use strict';

import './popup.css';
import katex from 'katex';

const $equation = document.querySelector('p');
const $input = document.querySelector('input');

$input.addEventListener('input', (e) => {
  katex.render(e.target.value, $equation, { throwOnError: false });
});
