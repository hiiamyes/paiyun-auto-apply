# Setting-Page

## Getting Started

First install packages:

```
brew install yarn
yarn
```

Once packages are installed, update config in [firebaseConfig.template.js](https://github.com/hiiamyes/paiyun-auto-apply/blob/master/setting-page/src/configs/firebaseConfig.template.js).

```
const config = {
  apiKey: '',
  authDomain: '<firebase-project-name>.firebaseapp.com',
  databaseURL: 'https://<firebase-project-name>.firebaseio.com',
  storageBucket: '<firebase-project-name>.appspot.com',
};
```

Rename the firebase config file.

`mv src/configs/firebaseConfig.template.js src/configs/firebaseConfig.js`

Then, Run the project.

`yarn start`