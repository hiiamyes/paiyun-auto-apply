import cancel from './cancel';
import inquiry from './inquiry';
import apply from './apply';
import firebaseConfig from '../../configs/firebaseConfig';

firebase.initializeApp(firebaseConfig);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { action, application, user, applicationNumber } = request;
  switch (action) {
    case 'apply': {
      chrome.tabs.getSelected((tab) => {
        try {
          apply(tab, user, application);
        } catch (err) {
          console.log('apply err: ', err);
        }
      });
      break;
    }
    case 'cancel': {
      chrome.tabs.getSelected((tab) => {
        try {
          cancel(tab, user, applicationNumber);
        } catch (err) {
          console.log('cancel err: ', err);
        }
      });
      break;
    }
    case 'inquiry': {
      chrome.tabs.getSelected((tab) => {
        try {
          inquiry(tab, user, applicationNumber);
        } catch (err) {
          console.log('cancel err: ', err);
        }
      });
      break;
    }
    default: {
      break;
    }
  }
});
