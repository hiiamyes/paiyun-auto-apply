import moment from 'moment';

function goto(tab, url) {
  console.log('goto');
  return new Promise((resolve, reject) => {
    chrome.tabs.update(tab.id, {
      url,
    });
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
      if (tab.id === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    });
  });
}

function click(tab, selector) {
  console.log('click');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'click', selector }, () => {
      resolve();
    });
  });
}
function clickAndWait(tab, selector) {
  console.log('clickAndWait');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'click', selector }, () => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      });
    });
  });
}

function clickAndMuteAndWait(tab, selector) {
  console.log('clickAndMuteAndWait');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'clickAndMute', selector }, () => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      });
    });
  });
}

function wait(tab, selector) {
  console.log('wait');
  return new Promise((resolve, reject) => {
    const intervalID = window.setInterval(() => {
      chrome.tabs.sendMessage(tab.id, { action: 'wait', selector }, (isElementExist) => {
        if (isElementExist) {
          resolve();
          window.clearInterval(intervalID);
        }
      });
    }, 500);
  });
}

function select(tab, selector, value) {
  console.log('select');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'select', selector, value }, () => {
      resolve();
    });
  });
}

function selectAndWait(tab, selector, value) {
  console.log('selectAndWait');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'select', selector, value }, () => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
        if (tabId === tab.id && changeInfo.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      });
    });
  });
}

function insert(tab, selector, value) {
  console.log('insert');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'insert', selector, value }, () => {
      resolve();
    });
  });
}

function check(tab, selector, value) {
  console.log('check');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'check', selector }, () => {
      resolve();
    });
  });
}

function getInnerText(tab, selector) {
  console.log('getInnerText');
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tab.id, { action: 'getInnerText', selector }, (value) => {
      resolve(value);
    });
  });
}

export { goto, click, clickAndWait, clickAndMuteAndWait, wait, select, selectAndWait, insert, check, getInnerText };
