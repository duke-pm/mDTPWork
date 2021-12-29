/**
 ** Name: Appearance screen
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of index.js
 **/
import React, {useState, useEffect, useContext} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {
  useTheme, Divider, CheckBox, Toggle, Layout, Text,
} from '@ui-kitten/components';
import {StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CTopNavigation from '~/components/CTopNavigation';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {ThemeContext} from '~/configs/theme-context';
import {
  getLocalInfo,
  saveLocalInfo,
  moderateScale,
  IS_ANDROID,
} from '~/utils/helper';
import {
  AST_DARK_MODE,
  AST_SETTINGS,
  DARK,
  LIGHT,
} from '~/configs/constants';
import {usePrevious} from '~/utils/hook';
/* REDUX */
import * as Actions from '~/redux/actions';

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

  return { checked, onChange: onCheckedChange };
};

const useAutoToggleState = (initialState = false) => {

   /** Use state */
  const [checked, setChecked] = useState(initialState);
  return { checked, onChange: setChecked };
};

const RenderHolderAppearance = ({
  theme = {},
  label = 'appearance:light_mode',
  disabled = false,
  typeAppearance = LIGHT,
  curAppearance = LIGHT,
  onChange = () => null,
}) => {
  return (
    <View style={cStyles.itemsCenter}>
      <View
        style={[
          cStyles.rounded1,
          cStyles.borderAll,
          cStyles.p4,
          curAppearance === typeAppearance && styles.active,
        ]}>
        <View
          style={[
            cStyles.rounded1,
            cStyles.itemsEnd,
            styles.con_group,
            typeAppearance === LIGHT
              ? styles.con_group_light
              : styles.con_group_dark,
          ]}>
          <View
            style={[
              cStyles.roundedTopRight1,
              cStyles.roundedTopLeft1,
              cStyles.fullWidth,
              styles.con_group_header,
              typeAppearance === LIGHT
                ? styles.con_group_light
                : styles.con_group_dark,
              {borderBottomColor: theme['color-basic-500']},
            ]}
          />
          <View
            style={[
              cStyles.rounded1,
              cStyles.mx10,
              cStyles.mt10,
              styles.con_view_1,
            ]}
          />
          <View
            style={[
              cStyles.rounded1,
              cStyles.mx10,
              cStyles.mt6,
              styles.con_view_2,
            ]}
          />
          <View
            style={[
              cStyles.rounded10,
              cStyles.mx10,
              cStyles.mt6,
              styles.con_view_3,
              {backgroundColor: theme['color-basic-500']},
            ]}
          />
        </View>
      </View>

      <CheckBox
        style={cStyles.mt20}
        checked={curAppearance === typeAppearance}
        onChange={nextChecked =>
          disabled ? null : onChange(typeAppearance)}>
        {label}
      </CheckBox>
    </View>
  )
};

function Appearance(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const systemTheme = useColorScheme();
  let prevTheme = usePrevious(themeContext.themeApp);

  /** Use redux */
  const dispatch = useDispatch();

  /** Use state */
  const darkmodeToggle = useToggleState();
  const darkmodeAutoToggle = useAutoToggleState();
  const [appearance, setAppearance] = useState(themeContext.themeApp);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeAppearance = async newTheme => {
    darkmodeToggle.onChange();
    setAppearance(newTheme);
    dispatch(Actions.changeTheme(newTheme));

    /** Save to async storage */
    await saveLocalInfo({
      key: AST_DARK_MODE,
      value: newTheme,
    });
  };

  /**********
   ** FUNC **
   **********/
  const onChangeSystemTheme = () => {
    if (!darkmodeAutoToggle.checked) {
      onSaveSettings({theme: 'system'});
      darkmodeAutoToggle.onChange(true);
    } else {
      onSaveSettings({theme: 'custom'});
      darkmodeAutoToggle.onChange(false);
    }
  };

  const onCheckSystemTheme = async () => {
    let astSettings = await getLocalInfo(AST_SETTINGS);
    if (astSettings) {
      astSettings = JSON.parse(astSettings);
      if (astSettings.theme === 'system') {
        darkmodeAutoToggle.onChange(true);
      }
    } 
  };

  const onSaveSettings = async ({theme}) => {
    let astSettings = await getLocalInfo(AST_SETTINGS);
    if (!astSettings) {
      astSettings = {...astSettings, theme};
    } else {
      astSettings = JSON.parse(astSettings);
      astSettings.theme = theme;
    }
    await saveLocalInfo({key: AST_SETTINGS, value: JSON.stringify(astSettings)});
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onCheckSystemTheme();
  }, []);

  useEffect(() => {
    if (themeContext.themeApp !== prevTheme) {
      IS_ANDROID &&
        StatusBar.setBackgroundColor(theme['background-basic-color-3'], true);
    }
  }, [
    prevTheme,
    themeContext.themeApp,
  ]);

  useEffect(() => {
    if (darkmodeAutoToggle.checked) {
      if (themeContext.themeApp !== systemTheme) {
        handleChangeAppearance(systemTheme);
        onSaveSettings({theme: 'system'});
      }
    }
  }, [
    darkmodeAutoToggle.checked,
    themeContext.themeApp,
    systemTheme,
    handleChangeAppearance,
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      safeArea={['top']}
      headerComponent={<CTopNavigation title={'appearance:title'} back />}>
      <Layout>
        <Layout
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.p16,
            cStyles.m16,
            cStyles.rounded1,
          ]}>
          <RenderHolderAppearance
            theme={theme}
            label={t('appearance:light_mode')}
            disabled={appearance === LIGHT || darkmodeAutoToggle.checked}
            typeAppearance={LIGHT}
            curAppearance={appearance}
            onChange={handleChangeAppearance} />
          <RenderHolderAppearance
            theme={theme}
            label={t('appearance:dark_mode')}
            disabled={appearance === DARK || darkmodeAutoToggle.checked}
            typeAppearance={DARK}
            curAppearance={appearance}
            onChange={handleChangeAppearance} />
        </Layout>
        <Divider />
        <Layout
          style={[
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.mx12,
            cStyles.py8,
          ]}>
          <View>
            <Text>{t('appearance:auto_change_appearance')}</Text>
            <Text style={cStyles.mt5} category="c1" appearance="hint">
              {t('appearance:holder_auto_change_appearance')}
            </Text>
          </View>
          <Toggle
            checked={darkmodeAutoToggle.checked}
            onChange={onChangeSystemTheme}
          />
        </Layout>
        <Divider />
      </Layout>
    </CContainer>
  );
}

const styles = StyleSheet.create({
  active: {
    borderColor: colors.PRIMARY
  },
  con_group: {
    height: moderateScale(200),
    width: moderateScale(130)
  },
  con_group_light: {
    backgroundColor: 'white',
  },
  con_group_dark: {
    backgroundColor: colors.PRIMARY_DARK,
  },
  con_group_header: {
    height: moderateScale(40),
    borderBottomWidth: 1,
  },
  con_view_1: {
    height: moderateScale(40), 
    width: '50%',
    backgroundColor: colors.PRIMARY,
  },
  con_view_2: {
    height: moderateScale(40), 
    width: '70%',
    backgroundColor: colors.PRIMARY,
  },
  con_view_3: {
    height: moderateScale(40), 
    width: '30%',
  },
});

export default Appearance;
