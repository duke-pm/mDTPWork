/**
 ** Name: useTimeout.js
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of useTimeout.js
 **/
/* LIBRARY */
import {useEffect, useRef} from 'react';

function useTimeout(callback, delay) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay && callback && typeof callback === 'function') {
      let timer = setTimeout(callbackRef.current, delay || 0);
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [callback, delay]);
}

export default useTimeout;
