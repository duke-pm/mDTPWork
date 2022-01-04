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
  Icon, Button, Tooltip, Text, OverflowMenu, MenuItem,
} from '@ui-kitten/components';
import {
  TouchableOpacity, View, LayoutAnimation, UIManager,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/** COMPONENTS */
import CSearchBar from './CSearchBar';
/* COMMON */
import Routes from '~/navigator/Routes';
import {Assets} from '~/utils/asset';
import {ThemeContext} from '~/configs/theme-context';
import {colors, cStyles} from '~/utils/style';
import {
  AST_DARK_MODE,
  DARK,
  LIGHT,
} from '~/configs/constants';
import {
  getLocalInfo,
  saveLocalInfo,
  moderateScale,
  IS_ANDROID,
  IS_IOS,
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
const initBGColor1 = 'background-basic-color-1';

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

const RenderBackicon = props => (
  <Icon
    {...props}
    name={IS_IOS
      ? 'arrow-ios-back-outline'
      : 'arrow-back-outline'}
  />
);

const RenderGlobalIcon = (
  theme,
  name,
  size,
  color,
  onPress,
) => (
  <TouchableOpacity style={[cStyles.px10, cStyles.py6]} onPress={onPress}>
    <IoniIcon
      name={name}
      size={size|| initSizeIcon}
      color={color || theme[initColorText]}
    />
  </TouchableOpacity>
);

const RenderTopLeft = (
  t,
  title,
  subtitle,
  onPress,
  logo,
  arrRouteProject,
  arrRouteTask,
  showArrayBack,
  onLongPress,
  handleItemBack,
) => {
  return (
    <View style={[cStyles.row, cStyles.itemsCenter]}>
      {onPress && !arrRouteProject && !arrRouteTask && (
        <TopNavigationAction
          icon={RenderBackicon}
          onPress={onPress}
        />
      )}
      {onPress && arrRouteProject && (
        <OverflowMenu
          anchor={() => (
            <TopNavigationAction
              icon={RenderBackicon}
              onPress={onPress}
              onLongPress={arrRouteProject.length > 1 ? onLongPress : undefined}
            />
          )}
          backdropStyle={styles.con_backdrop}
          visible={showArrayBack}
          onBackdropPress={onLongPress}>
          {arrRouteProject.map((itemB, indexB) => {
            if (indexB === arrRouteProject.length - 1) return null;
            return (
              <MenuItem
                key={itemB.key}
                title={!itemB.params.projectID
                  ? t('project_management:title')
                  : `${t('project_management:project_parent')} #${itemB.params.projectID}`}
                onPress={() => handleItemBack(arrRouteProject.length - indexB - 1)}
              />
            )
          })}
        </OverflowMenu>
      )}
      {onPress && arrRouteTask && (
        <OverflowMenu
          anchor={() => (
            <TopNavigationAction
              icon={RenderBackicon}
              onPress={onPress}
              onLongPress={arrRouteTask.length > 1 ? onLongPress : undefined}
            />
          )}
          backdropStyle={styles.con_backdrop}
          visible={showArrayBack}
          onBackdropPress={onLongPress}>
          {arrRouteTask.map((itemB, indexB) => {
            if (indexB === arrRouteTask.length - 1) return null;
            return (
              <MenuItem
                key={itemB.key}
                title={itemB.params.data.taskID
                  ? `${t('project_management:task_parent')} #${itemB.params.data.taskID}`
                  : `${t('project_management:list_task')} #${itemB.params.data.projectID}`}
                onPress={() => handleItemBack(arrRouteTask.length - indexB - 1)}
              />
            )
          })}
        </OverflowMenu>
      )}
      {logo && (
        <FastImage
          style={styles.img_logo}
          source={Assets.imgLogoSimple}
        />
      )}
      <View>
        <Text category="h5">{t(title)}</Text>
        {subtitle && (
          <Text category="c1" appearance="hint">
            {t(subtitle)}
          </Text>
        )}
      </View>
    </View>
  );
};

const RenderTopRight = (
  type,
  theme,
  iconStyle,
  t,
  onPress,
  onPress2,
  showFilter,
  renderFilter,
) => {
  if (type === 'darkmode') {
    return <Toggle {...onPress}>{t('common:dark_mode')}</Toggle>;
  }
  if (type === 'notification') {
    return RenderGlobalIcon(
      theme,
      'notifications-outline',
      iconStyle.size,
      iconStyle.color,
      onPress);
  }
  if (type === 'search') {
    return RenderGlobalIcon(
      theme,
      'search-outline',
      iconStyle.size,
      iconStyle.color,
      onPress);
  }
  if (type === 'filter') {
    return (
      <View>
        <Tooltip
          style={{backgroundColor: theme[initBGColor1]}}
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
        {RenderGlobalIcon(theme, 'search-outline', iconStyle.size, iconStyle.color, onPress)}
        <View>
          <Tooltip
            style={{backgroundColor: theme[initBGColor1]}}
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
    arrayBackProject = false,
    arrayBackTask = false,
    darkmode = false,
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
  let navigationState = navigation.getState();
  if (arrayBackProject) {
    navigationState = navigationState.routes.filter(f => f.name === 'Project');
  }
  if (arrayBackTask) {
    navigationState = navigationState.routes.filter(f => f.name === 'ProjectDetail');
  }

  /** Use state */
  const darkmodeToggle = useToggleState();
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showArrayBack, setShowArrayBack] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleGoBack = () => {
    onPressCustomBack ? onPressCustomBack() : navigation.goBack();
  };

  const handleGoNotification = () => {
    navigation.navigate(Routes.NOTIFICATION.name);
  };

  const handleItemBack = newIdx => {
    navigation.pop(newIdx);
  };

  const toggleShowSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowSearch(!showSearch);
  };

  const toggleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const toggleShowArrayBack = () => {
    setShowArrayBack(!showArrayBack);
  };

  /************
   ** RENDER **
   ************/
  let leftComponent, rightComponent;
  leftComponent = RenderTopLeft(
    t,
    leftTitle,
    leftSubtitle,
    back && handleGoBack,
    logo,
    arrayBackProject && navigationState,
    arrayBackTask && navigationState,
    showArrayBack,
    toggleShowArrayBack,
    handleItemBack,
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
            <Text
              {...evaProps}
              style={[cStyles.textCenter, titleStyle]}
              category="s1">
              {title !== '' ? t(title) : ''}
            </Text>
          )
        }
        subtitle={
          subtitle
            ? evaProps => (
              <Text
                style={[cStyles.textCenter, subtitleStyle]}
                category="c1"
                appearance="hint">
                {t(subtitle)}
              </Text>
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
