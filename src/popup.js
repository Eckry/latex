'use strict';

import './popup.css';
import katex from 'katex';

const h1 = document.querySelector('h1');
h1.textContent = '';
katex.render('c = \\pm\\sqrt{a^2 + b^2}', h1, { throwOnError: false });
