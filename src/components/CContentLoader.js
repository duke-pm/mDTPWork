/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: CContentLoader
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CContentLoader.js
 **/
import React, {useState, useEffect} from 'react';
import {UIManager, LayoutAnimation, View} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, SCREEN_WIDTH} from '~/utils/helper';

const arrLoader = [0, 1, 2, 3, 4, 5, 6, 7];

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CContentLoader(props) {
  const {
    horizontal = false,
    visible = false,
    type = 'normal',
    customColors = {},
  } = props;

  /** Use states */
  const [show, setShow] = useState(visible);

  /**********
   ** FUNC **
   **********/
  const onShowContentLoader = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShow(visible);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onShowContentLoader();
  }, [visible]);

  /************
   ** RENDER **
   ************/
  if (!show) {
    return null;
  }
  return (
    <View style={[cStyles.flex1, cStyles.px16]}>
      {arrLoader.map(itemLoader => {
        return (
          <View
            key={itemLoader.toString()}
            style={[
              cStyles.rounded1,
              cStyles.my10,
              cStyles.px16,
              {backgroundColor: customColors.cardDisable},
            ]}>
            {!horizontal && type === 'normal' && (
              <ContentLoader
                speed={1}
                width={'100%'}
                height={110}
                backgroundColor={customColors.cardHolder}
                foregroundColor={colors.WHITE}
                {...props}>
                <Rect x="0" y="10" rx="10" ry="10" width="100%" height="10" />
                <Rect x="0" y="30" rx="10" ry="10" width="50%" height="10" />
                <Rect x="0" y="50" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="70" rx="10" ry="10" width="45%" height="10" />
                <Rect
                  x={SCREEN_WIDTH / 2}
                  y="70"
                  rx="10"
                  ry="10"
                  width="45%"
                  height="10"
                />
                <Rect x="0" y="90" rx="10" ry="10" width="35%" height="10" />
                <Rect
                  x={SCREEN_WIDTH / 2}
                  y="90"
                  rx="10"
                  ry="10"
                  width="35%"
                  height="10"
                />
              </ContentLoader>
            )}

            {!horizontal && type === 'block' && (
              <ContentLoader
                speed={1}
                width={'100%'}
                height={250}
                backgroundColor={customColors.cardHolder}
                foregroundColor={colors.WHITE}
                {...props}>
                <Rect x="0" y="10" rx="10" ry="10" width="100%" height="10" />
                <Rect x="0" y="30" rx="10" ry="10" width="50%" height="10" />
                <Rect x="0" y="50" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="70" rx="10" ry="10" width="45%" height="10" />
                <Rect
                  x={SCREEN_WIDTH / 2}
                  y="70"
                  rx="10"
                  ry="10"
                  width="45%"
                  height="10"
                />
                <Rect x="0" y="90" rx="10" ry="10" width="35%" height="10" />
                <Rect
                  x={SCREEN_WIDTH / 2}
                  y="90"
                  rx="10"
                  ry="10"
                  width="35%"
                  height="10"
                />
                <Rect x="0" y="110" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="130" rx="10" ry="10" width="100%" height="10" />
                <Rect x="0" y="150" rx="10" ry="10" width="50%" height="10" />
                <Rect x="0" y="170" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="190" rx="10" ry="10" width="100%" height="50" />
              </ContentLoader>
            )}

            {horizontal && type === 'table' && (
              <ContentLoader
                speed={1}
                width={'100%'}
                height={1000}
                backgroundColor={customColors.cardHolder}
                foregroundColor={colors.WHITE}
                {...props}>
                <Rect x="0" y="10" rx="10" ry="10" width="100%" height="40" />
                <Rect x="0" y="55" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="60" rx="10" ry="10" width="100%" height="40" />
                <Rect x="0" y="105" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="110" rx="10" ry="10" width="100%" height="40" />
                <Rect x="0" y="155" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="160" rx="10" ry="10" width="100%" height="40" />
                <Rect x="0" y="205" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="210" rx="10" ry="10" width="100%" height="40" />
                <Rect x="0" y="255" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="260" rx="10" ry="10" width="100%" height="40" />
                <Rect x="0" y="305" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="310" rx="10" ry="10" width="100%" height="40" />
                <Rect x="0" y="355" rx="0" ry="0" width="100%" height="2" />
                <Rect x="0" y="360" rx="10" ry="10" width="100%" height="40" />
              </ContentLoader>
            )}
          </View>
        );
      })}
    </View>
  );
}

export default CContentLoader;
