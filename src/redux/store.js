/**
 ** Name: 
 ** Author: 
 ** CreateAt: 
 ** Description: 
**/
/* LIBRARY */
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
/* REDUCERS */
import rootReducer from './reducers';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ === true });
const createStoreWithMiddleware = applyMiddleware(thunk, loggerMiddleware)(createStore);
const Store = createStoreWithMiddleware(rootReducer);

export default Store;