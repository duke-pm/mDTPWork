/**
 ** Name: Language.js
 ** Author: 
 ** CreatedAt: 2021
 ** Description: Description of Language.js
 **/
/* LIBRARY */
import * as types from '../actions/types';

const initialState = {
  data: 'vi_VN',
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case types.CHANGE_LANGUAGE:
      return {
        ...state,
        data: action.language,
      };

    default:
      return state;
  }
}
