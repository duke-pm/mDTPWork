/**
 ** Name: Intro screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Intro.js
 **/
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Text, Layout, ViewPager, Button, useTheme} from '@ui-kitten/components';
import {
  StyleSheet, StatusBar, LayoutAnimation, UIManager, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
/* COMMON */
import Routes from '~/navigator/Routes';
import Assets from '~/utils/asset/Assets';
import {IS_ANDROID, moderateScale, sW, resetRoute} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/*********************
 ** OTHER COMPONENT **  
 *********************/
const RenderPageIntro = (t, image, title, caption) => (
  <View style={cStyles.itemsCenter}>
    <View style={[cStyles.itemsCenter, styles.con_layout]}>
      <FastImage
        style={[cStyles.mt40, styles.img_intro]}
        source={image}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={[cStyles.textCenter, cStyles.mt36]} category="s1">{t(title)}</Text>
      <Text style={[cStyles.textCenter, cStyles.mt24]}>{t(caption)}</Text>
    </View>
  </View>
);

/********************
 ** MAIN COMPONENT **  
 ********************/
function Intro(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {navigation} = props;

  /** Use state */
  const [pageIndex, setPageIndex] = useState(0);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangePage = newIndex => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPageIndex(newIndex);
  };

  const handleGoLogin = () => {
    resetRoute(navigation, Routes.LOGIN_IN.name);
  };
  
  /**********
   ** FUNC **
   **********/

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer safeArea={['top', 'bottom']}>
      <Layout style={cStyles.flex1} level='1'>
        {/** Header */}
        <CTopNavigation
          customRightComponent={
            <Button
              appearance='ghost'
              onPress={handleGoLogin}>
              {t('common:skip')}
            </Button>
          }
        />

        {/** Content */}
        <ViewPager
          selectedIndex={pageIndex}
          onSelect={handleChangePage}>
          {RenderPageIntro(t, Assets.imgIntro1, 'intro:intro_1_title', 'intro:intro_1_content')}
          {RenderPageIntro(t, Assets.imgIntro2, 'intro:intro_2_title', 'intro:intro_2_content')}
          {RenderPageIntro(t, Assets.imgIntro3,'intro:intro_3_title','intro:intro_3_content')}
        </ViewPager>

        {/** Dot paging */}
        <Layout style={[cStyles.flex1, cStyles.itemsCenter, cStyles.justifyEnd]}>
          <Layout style={[cStyles.row, cStyles.itemsCenter, cStyles.mb24]}>
            <View style={[
              cStyles.mx6,
              cStyles.rounded1,
              styles.con_page_unactive,
              pageIndex === 0 && styles.con_page_active]}
            />
            <View style={[
              cStyles.mx6,
              cStyles.rounded1,
              styles.con_page_unactive,
              pageIndex === 1 && styles.con_page_active]}
            />
            <View style={[
              cStyles.mx6,
              cStyles.rounded1,
              styles.con_page_unactive,
              pageIndex === 2 && styles.con_page_active]}
            />
          </Layout>
        </Layout>
      </Layout>
    </CContainer>
  )
}

const styles = StyleSheet.create({
  con_layout: {
    width: sW('70%'),
  },
  img_intro: {
    height: sW('50%'),
    width: sW('50%'),
  },
  con_page_unactive: {
    height: moderateScale(4),
    width: moderateScale(10),
    backgroundColor: colors.TERTIARY,
  },
  con_page_active: {
    height: moderateScale(4),
    width: moderateScale(20),
    backgroundColor: colors.PRIMARY,
  },
  btn_main: {
    width: sW('28%'),
  }
});

export default Intro;
