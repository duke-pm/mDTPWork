/**
 ** Name: Languages screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Layout, RadioGroup, Radio, Text} from '@ui-kitten/components';
import {View, Image, StyleSheet} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
import CAlert from '~/components/CAlert';
/* COMMON */
import {cStyles} from '~/utils/style';
import {useTranslation } from 'react-i18next';
import {moderateScale } from '~/utils/helper';
import {Assets} from '~/utils/asset';
/* REDUX */
import * as Actions from '~/redux/actions';

function Languages(props) {
  const {t} = useTranslation();

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
      let fLanguage = language.languages.findIndex(f =>
          f.id == commonState.get('language'));
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
      headerComponent={
        <CTopNavigation title={'languages:title'} back />
      }>
      <Layout style={[cStyles.p16, cStyles.m10]}>
        <Text >{t('languages:holder_choose')}</Text>
        <RadioGroup
          style={cStyles.mt16}
          selectedIndex={language.active}
          onChange={handleChange}>
          {language.languages.map((item, index) => {
            return (
              <Radio key={item.id + '_' + index}>
                {evaProps => (
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <Text {...evaProps}>{t(item.name)}</Text>
                    <Image
                      style={[cStyles.mr16, styles.icon_flag]}
                      source={item.icon}
                      resizeMode="contain"
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

const styles = StyleSheet.create({
  con_flag: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
});

export default Languages;
