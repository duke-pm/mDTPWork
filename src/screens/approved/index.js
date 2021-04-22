/**
 ** Name: Approved page
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Approved.js
 **/
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
/* COMMON */
import Routes from '~/navigation/Routes';
/* REDUX */


function Approved(props) {

  const [loading, setLoading] = useState(true);

  /** HANDLE FUNC */
  const handleAddNew = () => {
    props.navigation.navigate(Routes.MAIN.ADD_APPROVED.name);
  };

  /** LIFE CYCLE */
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading}
      header
      hasAddNew
      title={'approved:title'}
      onPressAddNew={handleAddNew}
      content={
        <CContent>

        </CContent>
      }
    />
  );
};

export default Approved;
