/**
 ** Name: CHeader
 ** Author: ZiniSoft Ltd
 ** CreateAt: 2021
 ** Description: Description of CHeader.js
 **/
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/Feather';
/** COMPONENTS */
import CText from './CText';
import CInput from './CInput';
/** COMMON */
import {cStyles, colors} from '~/utils/style';
import {IS_ANDROID, IS_IOS, scalePx} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function CHeader(props) {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isDark = useColorScheme() === 'dark';
  const {customColors} = useTheme();
  const {
    centerStyle = {},
    hasBack = false,
    hasMenu = false,
    hasSearch = false,
    hasAddNew = false,
    title = '',
    customTitle = null,
    subTitle = null,
    customSubTitle = null,
    left = null,
    right = null,
    iconBack = null,

    onPressAddNew = () => {},
    onPressSearch = () => {},
  } = props;

  /** Use redux */
  const dispatch = useDispatch();

  /** Use state */
  const [isSearch, setIsSearch] = useState(false);
  const [valueSearch, setValueSearch] = useState('');

  /** HANDLE FUNC */
  const handleBack = () => {
    navigation.goBack();
  };

  const handleMenu = () => {};

  const handleToogleSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearch(!isSearch);
    dispatch(Actions.changeIsSearch(!isSearch));
  };

  const handleAddNew = () => {
    onPressAddNew();
  };

  const handleSearch = () => {
    onPressSearch(valueSearch);
    handleToogleSearch();
  };

  const handleChangeValue = value => {
    setValueSearch(value);
  };

  /** RENDER */
  return (
    <View
      style={[
        cStyles.shadowHeader,
        cStyles.row,
        cStyles.center,
        cStyles.top0,
        cStyles.insetX0,
        styles.container,
        isSearch && cStyles.px16,
        {backgroundColor: isDark ? customColors.header : customColors.primary},
      ]}>
      {isDark && IS_IOS && (
        <BlurView
          style={[cStyles.abs, cStyles.inset0]}
          blurType={'extraDark'}
          reducedTransparencyFallbackColor={colors.BLACK}
        />
      )}
      {isSearch && (
        <View
          style={[cStyles.row, cStyles.itemsCenter, IS_ANDROID && cStyles.pb6]}>
          <CInput
            containerStyle={styles.input_search}
            iconLast={'search'}
            iconLastColor={colors.GRAY_700}
            valueColor={customColors.text}
            holder={'approved_assets:search_request'}
            returnKey={'search'}
            value={valueSearch}
            onChangeValue={handleChangeValue}
            onChangeInput={handleSearch}
            onPressIconLast={handleSearch}
          />
          <CText
            styles={'colorWhite pl16 pt6'}
            label={'common:close'}
            onPress={handleToogleSearch}
          />
        </View>
      )}

      {!isSearch && (
        <>
          <View
            style={[
              cStyles.row,
              cStyles.justifystart,
              cStyles.itemsCenter,
              styles.con_left,
            ]}>
            {hasBack && (
              <TouchableOpacity style={cStyles.itemsStart} onPress={handleBack}>
                <Icon
                  style={cStyles.p16}
                  name={
                    iconBack || (IS_ANDROID ? 'arrow-left' : 'chevron-left')
                  }
                  color={colors.WHITE}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            )}

            {hasMenu && (
              <TouchableOpacity style={cStyles.itemsStart} onPress={handleMenu}>
                <Icon
                  style={cStyles.p16}
                  name={'menu'}
                  color={colors.WHITE}
                  size={scalePx(4)}
                />
              </TouchableOpacity>
            )}
            {left && left}
          </View>

          <View
            style={[
              styles.con_body,
              IS_ANDROID && (hasBack || hasMenu || left || right)
                ? cStyles.justifyCenter
                : cStyles.center,
              centerStyle,
            ]}>
            <CText
              styles={'H6 colorWhite'}
              label={t(title)}
              customLabel={customTitle}
            />
            {subTitle && (
              <CText
                customStyles={[
                  cStyles.textMeta,
                  cStyles.colorWhite,
                  cStyles.fontRegular,
                ]}
                label={t(subTitle)}
                customLabel={customSubTitle}
              />
            )}
          </View>

          <View
            style={[
              cStyles.flex1,
              cStyles.row,
              cStyles.justifyEnd,
              cStyles.itemsCenter,
              styles.con_right,
            ]}>
            {hasSearch && (
              <TouchableOpacity
                style={cStyles.itemsEnd}
                onPress={handleToogleSearch}>
                <Icon
                  style={cStyles.p16}
                  name={'search'}
                  color={colors.WHITE}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            )}

            {hasAddNew && (
              <TouchableOpacity style={cStyles.itemsEnd} onPress={handleAddNew}>
                <Icon
                  style={cStyles.p16}
                  name={'file-plus'}
                  color={colors.WHITE}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            )}

            {right && right}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {height: cStyles.toolbarHeight},
  con_left: {flex: 0.2},
  con_body: {flex: 0.6},
  con_right: {flex: 0.2},
  input_search: {width: '85%'},
});

export default CHeader;
