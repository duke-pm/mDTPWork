/**
 ** Name: Dashboard
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, { useState, useEffect } from 'react';
import {
  View
} from 'react-native';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CButton from '~/components/CButton';

function Dashboard(props) {

  const [loading, setLoading] = useState(true);

  /** LIFE CYCLE */
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading}
      content={
        <CContent>
        </CContent>
      }
    />
  )
};

export default Dashboard;
