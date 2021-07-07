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
/* REDUX */

function SalesVisit(props) {

  return (
    <CContainer
      loading={false}
      content={
        <View style={cStyles.flex1}>
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
        </View>
      }
    />
  );
}

export default SalesVisit;
