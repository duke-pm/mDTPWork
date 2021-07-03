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
                icon: 'person',
                label: 'Contact Information',
              },
              {
                id: 'step2',
                number: false,
                icon: 'beer',
                label: 'Interests',
              },
              {
                id: 'step3',
                number: false,
                icon: 'aperture',
                label: 'Samples/Adoptions',
              },
              {
                id: 'step4',
                number: false,
                icon: 'checkmark',
                label: 'Other Information',
              },
            ]}
          />
        </CContent>
      }
    />
  );
}

export default SalesVisit;
