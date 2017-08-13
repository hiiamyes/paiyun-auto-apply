import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import rootReducer from './reducers';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(ReduxThunk, promiseMiddleware()))
      : compose(
        applyMiddleware(ReduxThunk, promiseMiddleware(), createLogger()),
        window.devToolsExtension ? window.devToolsExtension() : f => f,
      ),
  );

  return store;
}
