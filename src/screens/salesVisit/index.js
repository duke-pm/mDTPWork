/**
 ** Name: Sales visit screen
 ** Author: DTP-Education
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

function SalesVisit(props) {
  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={false}
      content={
        <CContent scrollEnabled={false}>
          <StepForm
            items={[
              {
                key: 'step1',
                number: false,
                icon: 'person',
                title: 'Contact Information',
              },
              {
                key: 'step2',
                number: false,
                icon: 'beer',
                title: 'Interests',
              },
              {
                key: 'step3',
                number: false,
                icon: 'aperture',
                title: 'Samples/Adoptions',
              },
              {
                key: 'step4',
                number: false,
                icon: 'checkmark',
                title: 'Other Information',
              },
            ]}
          />
        </CContent>
      }
    />
  );
}

export default SalesVisit;
