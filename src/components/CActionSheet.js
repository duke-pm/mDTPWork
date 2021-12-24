/**
 ** Name: CActionSheet
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CActionSheet.js
 **/
import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Icon, useTheme} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {BlurView} from '@react-native-community/blur';
/** COMPONENTS */
import CText from './CText';
/** COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, moderateScale} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';
import {DARK, LIGHT} from '~/configs/constants';

const RenderCloseIcon = props => (
  <Icon {...props} name="close-outline" />
);

const RenderCheckIcon = props => (
  <Icon {...props} name="checkmark-outline" />
);

function CActionSheet(props) {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const theme = useTheme();
  const {
    customHeader = null,
    headerChoose = false,
    headerChooseTitle = null,
    onConfirm = undefined,
    onClose = undefined,
  } = props;
  let needUpdate = false;

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleClose = () => {
    needUpdate = false;
    props.actionRef.current?.hide();
  };

  const handleConfirm = () => {
    needUpdate = true;
    props.actionRef.current?.hide();
    if (onConfirm) {
      onConfirm(needUpdate);
    }
  };

  /**********
   ** FUNC **
   **********/
  const onOpenAS = () => (needUpdate = false);

  const onCloseAS = () => {
    if (onClose) {
      if (needUpdate) {
        onClose(true);
      } else {
        onClose(false);
      }
    }
  };

  /************
   ** RENDER **
   ************/
  return (
    <ActionSheet
      ref={props.actionRef}
      containerStyle={[
        cStyles.roundedTopLeft3,
        cStyles.roundedTopRight3,
        styles.container,
      ]}
      elevation={5}
      nestedScrollEnabled={true}
      headerAlwaysVisible={true}
      gestureEnabled={false}
      indicatorColor={theme['color-basic-600']}
      onClose={onCloseAS}
      onOpen={onOpenAS}
      CustomHeaderComponent={undefined}
      {...props}>
      <BlurView
        style={[cStyles.abs, cStyles.inset0, cStyles.rounded3]}
        blurAmount={50}
        blurType={themeContext.themeApp === DARK
          ? DARK
          : IS_IOS
            ? 'materialLight'
            : LIGHT
        }
        overlayColor={colors.TRANSPARENT}
        reducedTransparencyFallbackColor="white"
      />
      {headerChoose ? (
        <View
          style={[
            cStyles.px10,
            cStyles.row,
            cStyles.itemsStart,
            cStyles.justifyBetween,
            cStyles.roundedTopLeft3,
            cStyles.roundedTopRight3,
          ]}>
          <Button
            appearance="ghost"
            status="danger"
            accessoryLeft={RenderCloseIcon}
            onPress={handleClose}
          />
          <View style={[cStyles.flexCenter]}>
            {headerChooseTitle && (
              <CText style={cStyles.mt10}>{t(headerChooseTitle)}</CText>
            )}
          </View>
          <Button
            appearance="ghost"
            status="primary"
            accessoryLeft={RenderCheckIcon}
            onPress={handleConfirm}
          />
        </View>
      ) : customHeader ? (
        customHeader
      ) : undefined}
      {props.children}
    </ActionSheet>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.TRANSPARENT},
  indicator: {width: '100%'},
  icon: {height: moderateScale(45), width: moderateScale(45)},
});

CActionSheet.propTypes = {
  actionRef: PropTypes.any,
  customHeader: PropTypes.element,
  headerChoose: PropTypes.bool,
  headerChooseTitle: PropTypes.oneOfType[(PropTypes.string, PropTypes.any)],
  children: PropTypes.element,
  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
};

export default CActionSheet;
