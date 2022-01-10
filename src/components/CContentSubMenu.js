/**
 ** Name: Custom Content SubMenu
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContentSubMenu.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Card, Layout, Spinner, Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import * as Animatable from "react-native-animatable";
/* COMPONENTS */
import CItem from '~/components/CItem';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale} from '~/utils/helper';

const MyContent = Animatable.createAnimatableComponent(Layout);

function CContentSubMenu(props) {
  const {t} = useTranslation();
  const {
    loading = false,
    contentRef = null,
    animTypeImage = '',
    routes = [],
    title = '',
    holder = '',
    colorsItem = [],
    onPressItem = () => null,
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <Layout style={cStyles.flex1} level="2">
      <Card
        style={cStyles.m10}
        appearance="filled"
        disabled
        header={<Text category="h6">{t(title).toUpperCase()}</Text>}>
        <View style={[
          cStyles.row,
          cStyles.itemsStart,
          cStyles.justifyBetween,
        ]}>
          <View style={styles.description_left}>
            <Text style={cStyles.mt5}>{t(holder)}</Text>
          </View>
          <View style={styles.description_right}>
            <LottieView
              style={styles.image_anim_type}
              source={animTypeImage}
              autoPlay
              loop
            />
          </View>
        </View>
      </Card>

      <MyContent
        ref={contentRef}
        style={[
          cStyles.flex1,
          cStyles.roundedTopLeft8,
          cStyles.roundedTopRight8,
          cStyles.shadowListItem,
        ]}>
        <View
          style={[
            cStyles.row,
            cStyles.justifyEvenly,
            cStyles.flexWrap,
            cStyles.pt16,
            styles.list_item,
          ]}>
          {loading && (
            <View style={cStyles.center}>
              <View style={cStyles.mt16}>
                <Spinner />
              </View>
            </View>
          )}
          
          {!loading && routes.map((itemS, indexS) => {
            if (itemS.isAccess) {
              const timeAnim = (indexS + 1) * 150;
              return (
                <Animatable.View
                  key={indexS + '_sub_menu_' + indexS}
                  animation="fadeInUp"
                  duration={timeAnim}>
                  <CItem
                    index={indexS}
                    data={itemS}
                    colors={colorsItem[indexS].colors}
                    bgColor={colorsItem[indexS].bgColor}
                    onPress={onPressItem}
                  />
                </Animatable.View>
              );
            }
            return null;
          })}
        </View>
      </MyContent>
    </Layout>
  );
}

const styles = StyleSheet.create({
  list_item: {flex: 0.5},
  image_anim_type: {
    height: moderateScale(120),
    width: moderateScale(120),
  },
  description_left: {flex: 0.5},
  description_right: {flex: 0.4},
});

CContentSubMenu.propTypes = {
  loading: PropTypes.bool,
  animTypeImage: PropTypes.string,
  routes: PropTypes.array,
  title: PropTypes.string,
  holder: PropTypes.string,
  colorsItem: PropTypes.array,
  onPressItem: PropTypes.func,
};

export default React.memo(CContentSubMenu);
