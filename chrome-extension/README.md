# Chrome-Extension

## Getting Started

First install packages:

```
brew install yarn
yarn
```

Once packages are installed, follow [Firebase Auth w/ Google Sign-In in Chrome Extensions](https://github.com/firebase/quickstart-js/tree/master/auth/chromextension#firebase-auth-w-google-sign-in-in-chrome-extensions) and update corresponding variables in [firebaseConfig.template.js](https://github.com/hiiamyes/paiyun-auto-apply/blob/master/setting-page/src/configs/firebaseConfig.template.js)

```
const config = {
  apiKey: '',
  authDomain: '<firebase-project-name>.firebaseapp.com',
  databaseURL: 'https://<firebase-project-name>.firebaseio.com',
  storageBucket: '<firebase-project-name>.appspot.com',
};
```

and [manifest.template.js](https://github.com/hiiamyes/paiyun-auto-apply/blob/master/setting-page/manifest.template.js)

```
"oauth2": {
    "client_id": "<YOUR_CLIENT_ID>",
  },
  "key": "<YOUR_EXTENSION_PUBLIC_KEY>",
```

to connect chrome extension with Firebase. ( It's a bit hard to config, if there is any problem, you can just connect me. )

Then, rename the firebase config file and manifest.

```
mv configs/firebaseConfig.template.js configs/firebaseConfig.js
mv manifest.template.js manifest.json
```

Run the project

`yarn start`

Load the extension

[https://developer.chrome.com/extensions/getstarted#unpacked]()