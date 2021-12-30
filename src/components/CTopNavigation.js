/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Custom Top Navigation
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CTopNavigation.js
 **/
import PropTypes from 'prop-types';
import React, {useContext, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {
  TopNavigation, TopNavigationAction, Toggle, useTheme,
  Icon, Button, Tooltip,
} from '@ui-kitten/components';
import {
  TouchableOpacity, View, LayoutAnimation, UIManager,
  StyleSheet,
  StatusBar,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CSearchBar from './CSearchBar';
import CText from './CText';
/* COMMON */
import Routes from '~/navigator/Routes';
import {Assets} from '~/utils/asset';
import {ThemeContext} from '~/configs/theme-context';
import {colors, cStyles} from '~/utils/style';
import {AST_DARK_MODE, DARK, LIGHT} from '~/configs/constants';
import {
  getLocalInfo, IS_ANDROID, moderateScale, saveLocalInfo, SCREEN_HEIGHT, sH,
} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
const initSizeIcon = moderateScale(20);
const initColorText = 'text-basic-color';
const initColorDanger = 'color-danger-500';
const initBorder = 'border-basic-color-3';

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderFilterIcon = (theme, toggleFilter) => (
  <Button
    appearance="ghost"
    status="basic"
    accessoryLeft={propsL =>
      <Icon {...propsL}
        style={[propsL.style, cStyles.mx0]}
        name="options-2-outline"
        fill={theme[initColorText]}
      />
    }
    onPress={toggleFilter}
  />
);

const BackIcon = (theme, iconStyle, iconBack) => (
  <IoniIcon
    name={iconBack || 'arrow-back'}
    color={iconStyle.color || theme[initColorText]}
    size={initSizeIcon}
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
          <CText category="c1" appearance="hint">
            {t(subtitle)}
          </CText>
        )}
      </View>
    </View>
  );
};

const RenderTopRight = (type, theme, iconStyle, t, onPress, onPress2, showFilter, renderFilter) => {
  if (type === 'darkmode') {
    return <Toggle {...onPress}>{t('common:dark_mode')}</Toggle>;
  }
  if (type === 'search') {
    return (
      <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
        <IoniIcon
          name={'search-outline'}
          size={iconStyle.size || initSizeIcon}
          color={iconStyle.color || theme[initColorText]}
        />
      </TouchableOpacity>
    );
  }
  if (type === 'filter') {
    return (
      <View>
        <Tooltip
          style={{backgroundColor: theme['background-basic-color-1']}}
          backdropStyle={styles.con_backdrop}
          visible={showFilter}
          anchor={() => RenderFilterIcon(theme, onPress2)}
          onBackdropPress={onPress2}>
          {propsC => renderFilter(propsC, onPress2)}
        </Tooltip>
        <View
          style={[
            cStyles.abs,
            cStyles.rounded2,
            styles.con_alert_filter,
            {backgroundColor: theme[initColorDanger]}]}
          />
      </View>
    );
  }
  if (type === 'searchFilter') {
    return (
      <View style={[cStyles.row, cStyles.itemsCenter]}>
        <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
          <IoniIcon
            name={'search-outline'}
            size={iconStyle.size || initSizeIcon}
            color={iconStyle.color || theme[initColorText]}
          />
        </TouchableOpacity>
        <View>
          <Tooltip
            style={{backgroundColor: theme['background-basic-color-1']}}
            backdropStyle={[cStyles.abs, cStyles.inset0, styles.con_backdrop]}
            visible={showFilter}
            anchor={() => RenderFilterIcon(theme, onPress2)}
            onBackdropPress={onPress2}>
            {propsC => renderFilter(propsC, onPress2)}
          </Tooltip>
          <View
            style={[
              cStyles.abs,
              cStyles.rounded2,
              styles.con_alert_filter,
              {backgroundColor: theme[initColorDanger]}]}
            />
        </View>
      </View>
    );
  }
  if (type === 'notification') {
    return (
      <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
        <IoniIcon
          name={'notifications-outline'}
          size={iconStyle.size || initSizeIcon}
          color={iconStyle.color || theme[initColorText]}
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
    saveLocalInfo({
      key: AST_DARK_MODE,
      value: isChecked ? DARK : LIGHT,
    });
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

/********************
 ** MAIN COMPONENT **
 ********************/
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
    loading = false,
    logo = false,
    borderBottom = false,
    translution = false,
    notification = false,
    filter = false,
    search = false,
    searchFilter = false,
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
    onPressCustomBack = null,
    onSearch = () => null,

    renderFilter = null,
  } = props;

  /** Use state */
  const darkmodeToggle = useToggleState();
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

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

  const toggleShowFilter = () => {
    setShowFilter(!showFilter);
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
  if (filter) {
    rightComponent = RenderTopRight(
      'filter',
      theme,
      iconStyle,
      t,
      null,
      toggleShowFilter,
      showFilter,
      renderFilter,
    );
  }
  if (searchFilter) {
    rightComponent = RenderTopRight(
      'searchFilter',
      theme,
      iconStyle,
      t,
      toggleShowSearch,
      toggleShowFilter,
      showFilter,
      renderFilter,
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
            borderBottom && {borderBottomColor: theme[initBorder]},
          style,
        ]}
        title={evaProps =>
          customTitle || (
            <CText
              {...evaProps}
              style={[cStyles.textCenter, titleStyle]}
              category="s1">
              {title !== '' ? t(title) : ''}
            </CText>
          )
        }
        subtitle={
          subtitle
            ? evaProps => (
              <CText
                style={[cStyles.textCenter, subtitleStyle]}
                category="c1"
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
          <CSearchBar loading={loading} autoFocus onSearch={onSearch} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  img_logo: {
    height: moderateScale(50),
    width: moderateScale(50),
  },
  con_alert_filter: {
    height: moderateScale(10),
    width: moderateScale(10),
    top: moderateScale(10),
    right: moderateScale(5),
  },
  con_backdrop: {
    backgroundColor: colors.BACKGROUND_MODAL,
  },
});

CTopNavigation.propTypes = {
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  subtitleStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  loading: PropTypes.bool,
  logo: PropTypes.bool,
  borderBottom: PropTypes.bool,
  translution: PropTypes.bool,
  notification: PropTypes.bool,
  filter: PropTypes.bool,
  search: PropTypes.bool,
  searchFilter: PropTypes.bool,
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

  onPressCustomBack: PropTypes.func,
  onSearch: PropTypes.func,

  renderFilter: PropTypes.element,
};

export default CTopNavigation;
