/**
 ** Name: Master actions
 ** Author: DTP-Education
 ** CreatedAt: 2021
 ** Description: Description of masterData.js
 **/
/* COMMON */
import Services from "~/services";
/** REDUX */
import * as types from "./types";
import * as Actions from "~/redux/actions";

export const resetStatusMasterData = () => ({
  type: types.RESET_STATUS_MASTER_DATA,
});

export const getError = error => ({
  type: types.ERROR_FETCH_MASTER_DATA,
  payload: error,
});

export const changeMasterData = data => ({
  type: types.CHANGE_MASTER_ALL,
  payload: data,
});

export const fetchMasterData = (params, navigation) => {
  return dispatch => {
    dispatch({
      type: types.START_FETCH_MASTER_DATA,
    });

    Services.master
      .get(params)
      .then(res => {
        if (!res.isError) {
          return dispatch(changeMasterData(res.data));
        } else {
          return dispatch(getError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(getError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params.RefreshToken,
            Lang: params.Lang,
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchMasterData(params),
              navigation,
            ),
          );
        }
      });
  };
};

export const fetchAssetByUser = (params, navigation) => {
  return dispatch => {
    dispatch({
      type: types.START_FETCH_ASSET_BY_USER,
    });

    Services.master
      .getAssetsByUser(params)
      .then(res => {
        if (!res.isError) {
          let tmp = {assetByUser: res.data};
          return dispatch(changeMasterData(tmp));
        } else {
          return dispatch(getError(res.errorMessage));
        }
      })
      .catch(error => {
        dispatch(getError(error));
        if (error.message && error.message.search("Authorization") !== -1) {
          let tmp = {
            RefreshToken: params.RefreshToken,
            Lang: params.Lang,
          };
          return dispatch(
            Actions.fetchRefreshToken(
              tmp,
              () => fetchMasterData(params),
              navigation,
            ),
          );
        }
      });
  };
};
