/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Custom top navigation
 ** Author: IT-Team
 ** CreateAt: 2021
 ** Description: Description of CTopNavigation.js
 **/
import PropTypes from 'prop-types';
import React, {useContext, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  TopNavigation,
  TopNavigationAction,
  Toggle,
  useTheme,
  Icon,
} from '@ui-kitten/components';
import {
  TouchableOpacity,
  View,
  LayoutAnimation,
  UIManager,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CSearchBar from './CSearchBar';
import CText from './CText';
/* COMMON */
import Routes from '~/navigator/Routes';
import {ThemeContext} from '~/configs/theme-context';
import {cStyles} from '~/utils/style';
import {
  getLocalInfo,
  IS_ANDROID,
  moderateScale,
  saveLocalInfo,
} from '~/utils/helper';
import {AST_DARK_MODE, DARK, LIGHT} from '~/configs/constants';
import {Assets} from '~/utils/asset';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/*********************
 ** OTHER COMPONENT **
 *********************/
const BackIcon = (theme, iconStyle, iconBack) => (
  <IoniIcon
    name={iconBack || 'arrow-back'}
    color={iconStyle.color || theme['text-basic-color']}
    size={moderateScale(20)}
  />
);

const RenderTopLeft = (
  theme,
  iconStyle,
  t,
  title,
  subtitle,
  onPress,
  iconBack,
  logo,
) => {
  return (
    <View style={[cStyles.row, cStyles.itemsCenter]}>
      {onPress && (
        <TopNavigationAction
          icon={BackIcon(theme, iconStyle, iconBack)}
          onPress={onPress}
        />
      )}
      {logo && (
        <FastImage style={styles.img_logo} source={Assets.imgLogoSimple} />
      )}
      <View>
        <CText category="h4">{t(title)}</CText>
        {subtitle && (
          <CText category="c1" appearance={'hint'}>
            {t(subtitle)}
          </CText>
        )}
      </View>
    </View>
  );
};

const RenderTopRight = (type, theme, iconStyle, t, onPress, onPress2) => {
  if (type === 'darkmode') {
    return <Toggle {...onPress}>{t('common:dark_mode')}</Toggle>;
  }
  if (type === 'search') {
    return (
      <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
        <IoniIcon
          name={'search-outline'}
          size={iconStyle.size || moderateScale(20)}
          color={iconStyle.color || theme['text-basic-color']}
        />
      </TouchableOpacity>
    );
  }
  if (type === 'add') {
    return (
      <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
        <IoniIcon
          name={'add-outline'}
          size={iconStyle.size || moderateScale(20)}
          color={iconStyle.color || theme['text-basic-color']}
        />
      </TouchableOpacity>
    );
  }
  if (type === 'searchAdd') {
    return (
      <View style={[cStyles.row, cStyles.itemsCenter]}>
        <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
          <IoniIcon
            name={'search-outline'}
            size={iconStyle.size || moderateScale(20)}
            color={iconStyle.color || theme['text-basic-color']}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[cStyles.px10, cStyles.py6]}
          onPress={onPress2}>
          <IoniIcon
            name={'add-outline'}
            size={iconStyle.size || moderateScale(20)}
            color={iconStyle.color || theme['text-basic-color']}
          />
        </TouchableOpacity>
      </View>
    );
  }
  if (type === 'notification') {
    return (
      <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
        <IoniIcon
          name={'notifications-outline'}
          size={iconStyle.size || moderateScale(20)}
          color={iconStyle.color || theme['text-basic-color']}
        />
      </TouchableOpacity>
    );
  }
  return null;
};

/********************
 ** MAIN COMPONENT **
 ********************/
const useToggleState = (initialState = false) => {
  const themeContext = useContext(ThemeContext);

  /** Use state */
  const [checked, setChecked] = useState(initialState);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const onCheckedChange = isChecked => {
    themeContext.toggleTheme();
    setChecked(isChecked);
    /** Save to async storage */
    saveLocalInfo({key: AST_DARK_MODE, value: isChecked ? DARK : LIGHT});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(async () => {
    let astDarkMode = await getLocalInfo(AST_DARK_MODE);
    if (astDarkMode && astDarkMode === DARK && !checked) {
      setChecked(true);
    }
  }, []);

  return {checked, onChange: onCheckedChange};
};

function CTopNavigation(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation();
  const {
    containerStyle = {},
    style = {},
    titleStyle = {},
    subtitleStyle = {},
    iconStyle = {},
    logo = false,
    borderBottom = false,
    translution = false,
    notification = false,
    add = false,
    search = false,
    searchAdd = false,
    back = false,
    darkmode = false,
    iconBack = null,
    title = '',
    subtitle = '',
    leftTitle = null,
    leftSubtitle = null,
    alignment = 'center',
    customTitle = null,
    customLeftComponent = null,
    customRightComponent = null,
    onPressAdd = () => null,
    onPressCustomBack = null,
  } = props;

  /** Use state */
  const darkmodeToggle = useToggleState();
  const [showSearch, setShowSearch] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleGoBack = () => {
    onPressCustomBack ? onPressCustomBack() : navigation.goBack();
  };

  const handleGoNotification = () => {
    navigation.navigate(Routes.NOTIFICATION.name);
  };

  const toggleShowSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearch(!showSearch);
  };

  /************
   ** RENDER **
   ************/
  let leftComponent, rightComponent;
  leftComponent = RenderTopLeft(
    theme,
    iconStyle,
    t,
    leftTitle,
    leftSubtitle,
    back && handleGoBack,
    iconBack,
    logo,
  );

  if (darkmode) {
    rightComponent = RenderTopRight(
      'darkmode',
      theme,
      iconStyle,
      t,
      darkmodeToggle,
    );
  }
  if (search) {
    rightComponent = RenderTopRight(
      'search',
      theme,
      iconStyle,
      t,
      toggleShowSearch,
    );
  }
  if (add) {
    rightComponent = RenderTopRight('add', theme, iconStyle, t, onPressAdd);
  }
  if (searchAdd) {
    rightComponent = RenderTopRight(
      'searchAdd',
      theme,
      iconStyle,
      t,
      toggleShowSearch,
      onPressAdd,
    );
  }
  if (notification) {
    rightComponent = RenderTopRight(
      'notification',
      theme,
      iconStyle,
      t,
      handleGoNotification,
    );
  }
  if (customLeftComponent) {
    leftComponent = customLeftComponent;
  }
  if (customRightComponent) {
    rightComponent = customRightComponent;
  }
  return (
    <View
      style={[
        cStyles.fullWidth,
        translution && cStyles.abs,
        translution && cStyles.top0,
        containerStyle,
      ]}>
      <TopNavigation
        style={[
          !showSearch && borderBottom && cStyles.borderBottom,
          !showSearch &&
            borderBottom && {borderColor: theme['border-basic-color-3']},
          style,
        ]}
        title={evaProps =>
          customTitle || (
            <CText
              {...evaProps}
              style={[cStyles.textCenter, titleStyle]}
              category={'s1'}>
              {title !== '' ? t(title) : ''}
            </CText>
          )
        }
        subtitle={
          subtitle
            ? evaProps => (
                <CText
                  style={[cStyles.textCenter, subtitleStyle]}
                  category={'c1'}
                  appearance="hint">
                  {t(subtitle)}
                </CText>
              )
            : undefined
        }
        alignment={alignment}
        accessoryLeft={leftComponent}
        accessoryRight={rightComponent}
      />
      {showSearch && (
        <View style={[cStyles.mx16, cStyles.mb16]}>
          <CSearchBar autoFocus />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  img_logo: {height: moderateScale(50), width: moderateScale(50)},
});

CTopNavigation.propTypes = {
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  subtitleStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  logo: PropTypes.bool,
  borderBottom: PropTypes.bool,
  translution: PropTypes.bool,
  notification: PropTypes.bool,
  add: PropTypes.bool,
  search: PropTypes.bool,
  searchAdd: PropTypes.bool,
  back: PropTypes.bool,
  darkmode: PropTypes.bool,
  iconBack: PropTypes.any,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  leftTitle: PropTypes.string,
  leftSubtitle: PropTypes.string,
  alignment: PropTypes.oneOf(['center', 'start']),
  customTitle: PropTypes.element,
  customLeftComponent: PropTypes.element,
  customRightComponent: PropTypes.element,
  onPressAdd: PropTypes.func,
  onPressCustomBack: PropTypes.func,
};

export default CTopNavigation;
