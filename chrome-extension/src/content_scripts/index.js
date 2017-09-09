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
    case 'waitForValue':
      sendResponse(document.querySelector(request.selector).innerText !== '');
      break;
    case 'waitForDisappear':
      sendResponse(document.querySelector(request.selector) === null);
      break;
    case 'waitForNodeAdded':
      console.log(
        document.querySelectorAll('#ContentPlaceHolder1_lblSchedule a').length,
        request.iNode,
      );
      sendResponse(
        document.querySelectorAll('#ContentPlaceHolder1_lblSchedule a').length ===
          request.iNode + 1,
      );
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

// const rootdiv = document.createElement('div');
// rootdiv.id = 'root';
// document.body.appendChild(rootdiv);

// import React from 'react';
// import { render } from 'react-dom';

// render(
//   <div style={{ position: 'fixed', right: 0, bottom: 0 }}>
//     <button
//       onClick={() => {
//         window.location =
//           'https://npm.cpami.gov.tw/apply_1_2.aspx?unit=e6dd4652-2d37-4346-8f5d-6e538353e0c2';
//       }}
//     >
//       click me
//     </button>
//   </div>,
//   document.getElementById('root'),
// );
