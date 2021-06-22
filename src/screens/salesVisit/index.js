/**
 ** Name: Sales visit screen
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of SalesVisit.js
 **/
import React from 'react';
import {View} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
/* COMMON */
import {cStyles} from '~/utils/style';
/* REDUX */


function SalesVisit(props) {

  return (
    <CContainer
      loading={false}
      title={'sales_visit:title'}
      header
      hasBack
      content={
        <CContent>

        </CContent>
      }
    />
  );
};

export default SalesVisit;
