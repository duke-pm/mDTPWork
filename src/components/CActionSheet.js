/**
 ** Name: Custom Actions Sheet
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CActionSheet.js
 **/
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Button, Icon, useTheme, Text} from '@ui-kitten/components';
import {View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
/** COMMON */
import {cStyles} from '~/utils/style';

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderCloseIcon = props => (
  <Icon {...props} name="close-outline" />
);

const RenderCheckIcon = props => (
  <Icon {...props} name="checkmark-outline" />
);

/********************
 ** MAIN COMPONENT **
 ********************/
function CActionSheet(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    actionRef = null,
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
    actionRef.current?.hide();
  };

  const handleConfirm = () => {
    needUpdate = true;
    actionRef.current?.hide();
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
      ref={actionRef}
      containerStyle={[
        cStyles.roundedTopLeft3,
        cStyles.roundedTopRight3,
        {backgroundColor: theme['background-basic-color-1']}
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
              <Text style={cStyles.mt10} category="label">
                {t(headerChooseTitle)}
              </Text>
            )}
          </View>
          <Button
            appearance="ghost"
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
