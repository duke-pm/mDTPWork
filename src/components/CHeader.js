/**
 ** Name: CHeader
 ** Author: DTP-Education ZiniSoft Ltd
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
import {fS, IS_ANDROID, IS_IOS, resetRoute} from '~/utils/helper';
import {THEME_DARK} from '~/config/constants';
import {usePrevious} from '~/utils/hook';
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
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {
    style = {},
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

  const prevValueSearch = usePrevious(valueSearch);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      resetRoute(navigation, 'RootTab');
    }
    if (props.onRefresh) {
      props.onRefresh();
    }
  };

  const handleMenu = () => {};

  const handleToogleSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSearch(!isSearch);
    dispatch(Actions.changeIsSearch(!isSearch));
    if (prevValueSearch) {
      if (prevValueSearch !== valueSearch && valueSearch === '' && isSearch) {
        onPressSearch(valueSearch);
      }
    }
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

  /**************
   ** RENDER **
   **************/
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
        {backgroundColor: customColors.header},
        style,
      ]}>
      {isDark && IS_IOS && (
        <BlurView
          style={[cStyles.abs, cStyles.inset0]}
          blurType={'extraDark'}
          reducedTransparencyFallbackColor={colors.BLACK}
        />
      )}
      {isSearch && (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.pb6]}>
          <CInput
            containerStyle={styles.input_search}
            style={styles.input}
            iconLastStyle={styles.input}
            iconLast={'search'}
            iconLastColor={colors.GRAY_700}
            valueColor={customColors.text}
            holder={'approved_assets:search_request'}
            returnKey={'search'}
            value={valueSearch}
            autoFocus
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
                  size={fS(23)}
                />
              </TouchableOpacity>
            )}

            {hasMenu && (
              <TouchableOpacity style={cStyles.itemsStart} onPress={handleMenu}>
                <Icon
                  style={cStyles.p16}
                  name={'menu'}
                  color={colors.WHITE}
                  size={fS(22)}
                />
              </TouchableOpacity>
            )}
            {left}
          </View>

          <View
            style={[
              styles.con_body,
              IS_ANDROID
                ? (left && right) || (!left && !right)
                  ? cStyles.center
                  : cStyles.justifyCenter
                : cStyles.center,
              centerStyle,
            ]}>
            <CText
              styles={'H6 colorWhite ' + (IS_IOS && ' textCenter')}
              label={t(title)}
              customLabel={customTitle}
              numberOfLines={1}
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
                  size={fS(20)}
                />
                {valueSearch !== '' && (
                  <View
                    style={[
                      cStyles.rounded2,
                      cStyles.abs,
                      styles.badge,
                      cStyles.borderAll,
                      isDark && cStyles.borderAllDark,
                      {backgroundColor: customColors.red},
                    ]}
                  />
                )}
              </TouchableOpacity>
            )}

            {hasAddNew && (
              <TouchableOpacity style={cStyles.itemsEnd} onPress={handleAddNew}>
                <Icon
                  style={cStyles.p16}
                  name={'plus'}
                  color={colors.WHITE}
                  size={fS(22)}
                />
              </TouchableOpacity>
            )}

            {right}
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
  input: {height: 40},
  badge: {height: 10, width: 10, top: 16, right: 15},
});

export default CHeader;
