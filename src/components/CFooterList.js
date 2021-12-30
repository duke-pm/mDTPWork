/**
 ** Name: Custom Footer List
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CFooterList.js
 **/
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Spinner} from '@ui-kitten/components';
import {View} from 'react-native';
/* COMPONENTS */
import CText from './CText';
/* COMMON */
import {cStyles} from '~/utils/style';

function CFooterList(props) {
  const {t} = useTranslation();
  
  /************
   ** RENDER **
   ************/
  return (
    <View style={[cStyles.py16, cStyles.itemsCenter]}>
      <Spinner size="small" />
      <CText style={cStyles.mt10} category='c1' appearance="hint">
        {t('common:loading')}
      </CText>
    </View>
  );
}

export default React.memo(CFooterList);
