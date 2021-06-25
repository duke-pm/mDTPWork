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
import StepForm from './components/StepForm';
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
          <StepForm
            items={[
              {
                id: 'step1',
                number: false,
                icon: 'user',
              },
              {
                id: 'step2',
                number: false,
                icon: 'activity',
              },
              {
                id: 'step3',
                number: false,
                icon: 'aperture',
              },
              {
                id: 'step4',
                number: false,
                icon: 'check',
              },
            ]}
          />
        </CContent>
      }
    />
  );
}

export default SalesVisit;
