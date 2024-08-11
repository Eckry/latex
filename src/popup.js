'use strict';
import './popup.css';

const $checkBox = document.querySelector('.checkboxLATEX');

$checkBox.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });

  //Send message to activate real popup
  await chrome.tabs.sendMessage(tab.id, {});
});
