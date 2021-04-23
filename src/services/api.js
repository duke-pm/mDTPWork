/**
 ** Name: Api
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of api.js
 **/
/** COMMON */
import Configs from '~/config';
import JWTServices from './JWTServices';

class Api {
  static get(route) {
    return this.xhr(route, null, 'GET', version);
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT', version);
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST', version);
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE', version);
  }

  static async upload(route, params) {
    let url = JWTServices.URL + JWTServices.prefix + route;
    if (route.search('http') !== -1) {
      url = route;
    }
    let options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: params,
    };

    try {
      let resp = await fetch(url, options);
      let json = resp.json();
      if (resp.ok) {
        return json;
      } else {
        throw null;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  static async xhr(route, params, verb) {
    let url = JWTServices.URL + JWTServices.prefix + route;
    if (route.search('http') !== -1) {
      url = route;
    }
    let headers = Configs.jwtToken
      ? Object.assign({}, Api.headers(), {
        Authorization: `Bearer ${Configs.jwtToken}`,
      })
      : Api.headers();
    let options = {
      method: verb,
      headers: headers,
      body: params ? JSON.stringify(params) : null,
    };

    try {
      console.log('=== ' + route + ' START FETCH ==>');
      let resp = await fetch(url, options);
      let respJSON = await resp.json();
      if (resp.ok) {
        console.log('=== ' + route + ' RESPONSE ==>', respJSON);
        return respJSON;
      } else {
        throw null;
      }
    } catch (e) {
      console.log('=== ' + route + ' ERROR ==>', e);
      return e;
    }
  }
}

export default Api;
