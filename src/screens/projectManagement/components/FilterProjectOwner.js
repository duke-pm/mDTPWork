/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: FilterProject
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Switch,
  UIManager,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Feather';
import {BlurView} from '@react-native-community/blur';
import moment from 'moment';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CDateTimePicker from '~/components/CDateTimePicker';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, scalePx} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';
import CRowLabel from '~/components/CRowLabel';

const RowUser = (
  isDark,
  customColors,
  value,
  label,
  active,
  onPress,
  isBorder = true,
) => {
  const handleChange = () => {
    onPress(value);
  };

  return (
    <TouchableOpacity onPress={handleChange}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          cStyles.justifyBetween,
          cStyles.pl16,
          styles.row_header,
          isBorder && isDark && cStyles.borderBottomDark,
          isBorder && !isDark && cStyles.borderBottom,
          {backgroundColor: customColors.card},
        ]}>
        <CText customLabel={label} />
        <View style={cStyles.pr16}>
          {active && (
            <Icon name={'check'} color={customColors.icon} size={scalePx(3)} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function FilterProject(props) {
  const {owners, show, onCallback = () => {}} = props;
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  /** Use State */
  const [data, setData] = useState({
    users: owners,
    active: [],
  });

  /** HANDLE FUNC */
  const handleClose = () => {};

  const handleOK = () => {
    onCallback();
  };

  /** FUNC */
  const onChangeOwner = (owner) => {
    let find = data.active.indexOf(owner);
    let newActive = [...data.active];
    if (find === -1) {
      newActive.push(owner);
    } else {
      newActive.splice(find, 1);
    }
    setData({...data, active: newActive});
  };

  /** RENDER */
  return (
    <Modal
      style={cStyles.m0}
      isVisible={show}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}>
      <SafeAreaView
        style={[
          cStyles.flex1,
          {
            backgroundColor: isDark
              ? customColors.header
              : customColors.primary,
          },
        ]}
        edges={['right', 'left', 'top']}>
        {isDark && IS_IOS && (
          <BlurView
            style={[cStyles.abs, cStyles.inset0]}
            blurType={'extraDark'}
            reducedTransparencyFallbackColor={colors.BLACK}
          />
        )}
        <View
          style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
          {/** Header of filter */}
          <CHeader
            centerStyle={cStyles.center}
            left={
              <TouchableOpacity
                style={[cStyles.itemsStart, cStyles.pl16]}
                onPress={handleClose}>
                <CText styles={'colorWhite'} label={'common:cancel'} />
              </TouchableOpacity>
            }
            right={
              <TouchableOpacity
                style={[cStyles.itemsEnd, cStyles.pr16]}
                onPress={handleOK}>
                <CText styles={'colorWhite'} label={'common:ok'} />
              </TouchableOpacity>
            }
            title={'project_management:filter'}
          />

          {/** Content of filter */}
          <ScrollView>
            {/** Assigned */}
            <CRowLabel label={t('project_management:owener')} />
            {data.users.map((item, index) => {
              let find = data.active.indexOf(item.value);
              return RowUser(
                isDark,
                customColors,
                item.value,
                item.label,
                find !== -1,
                onChangeOwner,
              );
            })}
            <View
              style={[
                cStyles.px16,
                cStyles.pl16,
                cStyles.pb10,
                cStyles.justifyEnd,
                styles.row_header,
              ]}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: cStyles.toolbarHeight,
    top: 0,
    left: 0,
    right: 0,
  },
  header_left: {flex: 0.2},
  header_body: {flex: 0.6},
  header_right: {flex: 0.2},
  row_header: {height: 50},
  text_date: {flex: 0.3},
  input_date: {flex: 0.7},
});

export default FilterProject;
