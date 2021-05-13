/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: useUpdateEffect.js
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of useUpdateEffect.js
 **/
/* LIBRARY */
import {useEffect, useRef} from 'react';

const useUpdateEffect = (effect, deps) => {
  const isInitialMount = useRef(true);

  useEffect(
    isInitialMount.current
      ? () => {
          isInitialMount.current = false;
        }
      : effect,
    deps,
  );
};

export default useUpdateEffect;
