/**
 ** Name: CContentSubMenu
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContentSubMenu.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
/* COMPONENTS */
import CContent from './CContent';
import CItem from '~/components/CItem';
import CText from '~/components/CText';
/* COMMON */
import {cStyles} from '~/utils/style';
import {moderateScale, sW} from '~/utils/helper';

function CContentSubMenu(props) {
  const {
    loading = false,
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
    <CContent padder contentStyle={cStyles.pt0}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.mt6,
        ]}>
        <View style={styles.description_left}>
          <CText styles={'textHeadline'} label={title} />
          <CText styles={'textCaption1 mt6'} label={holder} />
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

      {!loading && (
        <View
          style={[
            cStyles.row,
            cStyles.itemscenter,
            cStyles.justifyStart,
            cStyles.flexWrap,
          ]}>
          {routes.map((item, index) => {
            if (item.isAccess) {
              return (
                <CItem
                  key={index.toString()}
                  itemStyle={styles.item}
                  index={index}
                  data={item}
                  colors={colorsItem[index].colors}
                  bgColor={colorsItem[index].bgColor}
                  onPress={onPressItem}
                />
              );
            }
            return null;
          })}
        </View>
      )}
    </CContent>
  );
}

const styles = StyleSheet.create({
  item: {width: sW('30%')},
  image_anim_type: {
    height: moderateScale(140),
    width: moderateScale(140),
  },
  description_left: {flex: 0.6},
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
