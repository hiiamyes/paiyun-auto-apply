chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'click':
      document.querySelector(request.selector).click();
      sendResponse();
      break;
    case 'clickAndMute':
      document.querySelector(request.selector).click = '';
      document.querySelector(request.selector).click();
      sendResponse();
      break;
    case 'select': {
      const element = document.querySelector(request.selector);
      element.value = request.value;
      if ('createEvent' in document) {
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('change', false, true);
        element.dispatchEvent(evt);
      } else {
        element.fireEvent('onchange');
      }
      sendResponse();
      break;
    }
    case 'goto':
      window.location = request.url;
      sendResponse();
      break;
    case 'wait':
      sendResponse(document.querySelector(request.selector) !== null);
      break;
    case 'insert':
      document.querySelector(request.selector).value = request.value;
      sendResponse();
      break;
    case 'check':
      document.querySelector(request.selector).checked = true;
      sendResponse();
      break;
    case 'getInnerText':
      sendResponse(document.querySelector(request.selector).innerText);
      break;
    default:
      break;
  }
});
