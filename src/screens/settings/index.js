/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Config settings of App
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Settings.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {StyleSheet} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import TouchID from 'react-native-touch-id';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CActionSheet from '~/components/CActionSheet';
import CList from '~/components/CList';
import CGroupInfo from '~/components/CGroupInfo';
import ListItem from '~/screens/account/components/ListItem';
/* COMMON */
import {Assets} from '~/utils/asset';
import {LANGUAGE, BIOMETRICS, THEME_DARK} from '~/config/constants';
import {moderateScale, getLocalInfo, saveLocalInfo, sH} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All refs use in this screen */
const asLangRef = createRef();
const SETTINGS = [
  {
    id: 'language',
    label: 'settings:language',
    icon: 'globe-outline',
    iconColor: colors.PINK,
    isChooseLang: true,
    data: [
      {
        value: 'vi',
        label: 'settings:vi',
        icon: Assets.iconVietnamFlag,
      },
      {
        value: 'en',
        label: 'settings:en',
        icon: Assets.iconEnglandFlag,
      },
    ],
    onPress: asLangRef,
  },
  {
    id: 'biometrics',
    label: 'settings:biometrics',
    description: 'settings:holder_biometrics',
    icon: 'finger-print-outline',
    iconColor: colors.GRAY_800,
    iconFaceID: isIphoneX(),
    isToggle: true,
    onPress: null,
  },
  // {
  //   id: 'dardMode',
  //   label: 'settings:dard_mode',
  //   icon: 'contrast-outline',
  //   nextRoute: 'SingleChoose',
  //   isChooseDarkMode: true,
  //   data: [
  //     {
  //       value: 'dark_mode_system',
  //       label: 'settings:dard_mode_system',
  //     },
  //     {
  //       value: 'dark_mode_on',
  //       label: 'settings:dard_mode_on',
  //     },
  //     {
  //       value: 'dark_mode_off',
  //       label: 'settings:dard_mode_off',
  //     },
  //   ],
  //   onPress: asDarkModeRef,
  // },
];

function Settings(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;

  /** Use redux */
  const dispatch = useDispatch();

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [initSettings, setInitSettings] = useState(SETTINGS);
  const [valueSettings, setValueSettings] = useState({
    activeLanguage: 0,
    activeBiometric: false,
    valueBiometric: false,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangeLanguage = index => {
    if (initSettings[index].value) {
      if (
        initSettings[index].data[valueSettings.activeLanguage].value !==
        initSettings[index].value
      ) {
        let tmp = [...initSettings];
        tmp[index].value =
          initSettings[index].data[valueSettings.activeLanguage];
        setInitSettings(tmp);

        onChangeGlobal(index, tmp[index].value);
      }
    } else {
      let tmp = [...initSettings];
      tmp[index].value = initSettings[index].data[valueSettings.activeLanguage];
      setInitSettings(tmp);

      onChangeGlobal(index, tmp[index].value);
    }
    asLangRef.current?.hide();
  };
 
  /**********
   ** FUNC **
   **********/
  const onPrepareData = async () => {
    TouchID.isSupported()
      .then(async biometryType => {
        let isBio = await getLocalInfo(BIOMETRICS);
        let tmp = {
          ...valueSettings,
          activeBiometric: true,
          valueBiometric: isBio === '1',
        };
        if (biometryType === 'FaceID') {
          setValueSettings(tmp);
        } else if (biometryType === 'TouchID') {
          setValueSettings(tmp);
        } else if (biometryType === true) {
          setValueSettings(tmp);
        }
      })
      .catch(e => {
        console.log('[LOG] === Error Biometrics ===> ', e);
      });

    let languageLocal = await getLocalInfo(LANGUAGE);
    if (languageLocal) {
      let tmp = [...initSettings];
      tmp[0].value = languageLocal;
      setInitSettings(tmp);

      let find = initSettings[0].data.findIndex(
        f => f.value === languageLocal.value,
      );
      setValueSettings({...valueSettings, activeLanguage: find});
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onChangeLanguage = index => {
    setValueSettings({...valueSettings, activeLanguage: index});
  };

  const onChangeGlobal = async (index, data) => {
    if (index === 0) {
      setLoading(true);
      dispatch(Actions.changeLanguage(data.value));
      await saveLocalInfo({key: LANGUAGE, value: data});
      setTimeout(() => setLoading(false), 2000);
    }
  };

  const onCheckBiometrics = async () => {
    let newValue = !valueSettings.valueBiometric;
    setValueSettings({...valueSettings, valueBiometric: newValue});
    setLoading(true);
    await saveLocalInfo({key: BIOMETRICS, value: newValue ? '1' : '0'});
    setLoading(false);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onPrepareData();
  }, []);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading}
      content={
        <CContent>
          <CGroupInfo
            contentStyle={cStyles.p0}
            content={
              <CList
                contentStyle={cStyles.px0}
                data={initSettings}
                item={({item, index}) => {
                  return (
                    <ListItem
                    isDark={isDark}
                      customColors={customColors}
                      index={index}
                      data={item}
                      dataActiveLang={
                        initSettings[0].data[valueSettings.activeLanguage]
                      }
                      dataToggle={index === 1 ? valueSettings : null}
                      onToggle={onCheckBiometrics}
                    />
                  );
                }}
                scrollEnabled={false}
              />
            }
          />

          <CActionSheet
            actionRef={asLangRef}
            headerChoose
            onConfirm={() => handleChangeLanguage(0)}>
            <Picker
              style={styles.con_action}
              itemStyle={{color: customColors.text, fontSize: moderateScale(20)}}
              selectedValue={valueSettings.activeLanguage}
              onValueChange={onChangeLanguage}>
              {initSettings[0].data.map((value, i) => (
                <Picker.Item
                  label={t(value.label)}
                  value={i}
                  key={value.value}
                />
              ))}
            </Picker>
          </CActionSheet>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_action: {width: '100%', height: sH('25%')},
});

export default Settings;
