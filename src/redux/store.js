/**
 ** Name: Stores
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Stores.js
 **/
/** LIBRARY */
import {composeWithDevTools} from "redux-devtools-extension";
import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
/* REDUX */
import rootReducer from "./reducers";

const composeEnhancers =
  process.env.NODE_ENV === "development"
    ? composeWithDevTools({realtime: true})
    : compose;

const createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk))(
  createStore,
);
const store = createStoreWithMiddleware(rootReducer);

export default store;
