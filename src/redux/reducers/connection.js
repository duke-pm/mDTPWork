/**
 ** Name: Connection.js
 ** Author:
 ** CreatedAt: 2021
 ** Description: Description of Connection.js
**/
/* LIBRARY */
import * as types from '../actions/types';

const initialState = {
  connection: false
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.UPDATE_CONNECTION_STATUS:
      return {
        ...state,
        connection: action.connection
      };

    default:
      return state
  }
}