'use strict';
import './popup.css';

const $checkBox = document.querySelector('.checkbox');

$checkBox.addEventListener('click', () => {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    const response = await chrome.tabs.sendMessage(tab.id, {
      greeting: 'hellos',
    });
    // do something with response here, not outside the function
    console.log(response);
  })();
});
