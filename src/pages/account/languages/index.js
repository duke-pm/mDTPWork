/**
 ** Name: Languages screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useRef, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, RadioGroup, Radio } from '@ui-kitten/components';
import {View, Image} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CAlert from '~/components/CAlert';
import CText from '~/components/CText';
/* COMMON */
import { cStyles } from '~/utils/style';
import { useTranslation } from 'react-i18next';
import { moderateScale } from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';
import { Assets } from '~/utils/asset';

function Languages(props) {
  const {t} = useTranslation();
  const {navigation} = props;

  /** Use redux */
  const dispatch = useDispatch();
  const commonState = useSelector(({common}) => common);
  
  /** Use state */
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState({
    active: 0,
    languages: [
      {id : 'vi', icon: Assets.iconVietnamFlag, name: 'languages:vietnamese'},
      {id : 'en', icon: Assets.iconEnglishFlag, name: 'languages:english'},
    ],
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChange = idxLang => {
    setLoading(true);
    setLanguage({...language, active: idxLang});
    dispatch(Actions.changeLanguage(language.languages[idxLang].id));
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  /**********
   ** FUNC **
   **********/

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (commonState.get('language') !== language.languages[0].id) {
      let fLanguage = language.languages.findIndex(f => f.id == commonState.get('language'));
      if (fLanguage !== -1) {
        setLanguage({...language, active: fLanguage});
      }
    }
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={<CTopNavigation title={'languages:title'} back />}>
      <Layout style={cStyles.p16} >
        <CText >{t('languages:holder_choose')}</CText>
        <RadioGroup style={cStyles.mt16} selectedIndex={language.active} onChange={handleChange}>
          {language.languages.map((item, index) => {
            return (
              <Radio key={item.id + '_' + index}>
                {evaProps => (
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <CText {...evaProps}>{t(item.name)}</CText>
                    <Image
                      style={[cStyles.mr16, {height: moderateScale(20), width: moderateScale(20)}]}
                      resizeMode={'contain'}
                      source={item.icon}
                    />
                  </View>
                )}
              </Radio>
            )
          })}
        </RadioGroup>
        <CAlert show={loading} label={t('languages:loading')} />
      </Layout>
    </CContainer>
  );
}

export default Languages;
