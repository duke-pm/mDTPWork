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
import {isIphoneX} from 'react-native-iphone-x-helper';
import {Alert, StyleSheet} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import TouchID from 'react-native-touch-id';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CActionSheet from '~/components/CActionSheet';
import CList from '~/components/CList';
import ListItem from '~/screens/account/components/ListItem';
/* COMMON */
import {Assets} from '~/utils/asset';
import {LANGUAGE, BIOMETRICS} from '~/config/constants';
import {fS, getLocalInfo, removeLocalInfo, saveLocalInfo, sH} from '~/utils/helper';
import {cStyles} from '~/utils/style';
/* REDUX */
import * as Actions from '~/redux/actions';
import CGroupInfo from '~/components/CGroupInfo';

/** All refs use in this screen */
const actionSheetLangRef = createRef();
const SETTINGS = [
  {
    id: 'language',
    label: 'settings:language',
    icon: 'globe-outline',
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
    onPress: actionSheetLangRef,
  },
  {
    id: 'biometrics',
    label: 'settings:biometrics',
    description: 'settings:holder_biometrics',
    icon: 'finger-print',
    iconFaceID: isIphoneX(),
    isToggle: true,
    onPress: null,
  },
];

function Settings(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();

  /** Use redux */
  const dispatch = useDispatch();

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [initSettings, setInitSettings] = useState(SETTINGS);
  const [languages, setLanguages] = useState({
    data: SETTINGS[0].data,
    active: 0,
  });
  const [biometric, setBiometric] = useState({
    active: false,
    value: false,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChange = index => {
    if (initSettings[index].value) {
      if (
        initSettings[index].data[languages.active].value !==
        initSettings[index].value
      ) {
        let tmp = [...initSettings];
        tmp[index].value = initSettings[index].data[languages.active];
        setInitSettings(tmp);

        onChangeGlobal(index, tmp[index].value);
      }
    } else {
      let tmp = [...initSettings];
      tmp[index].value = initSettings[index].data[languages.active];
      setInitSettings(tmp);

      onChangeGlobal(index, tmp[index].value);
    }
    actionSheetLangRef.current?.hide();
  };

  /**********
   ** FUNC **
   **********/
  const onPrepareData = async () => {
    TouchID.isSupported()
      .then(async biometryType => {
        let isBio = await getLocalInfo(BIOMETRICS);
        console.log('[LOG] === biometryType ===> ', biometryType);
        if (biometryType === 'FaceID') {
          setBiometric({
            active: true,
            value: isBio === '1',
          });
        } else if (biometryType === 'TouchID') {
          setBiometric({
            active: true,
            value: isBio === '1',
          });
        } else if (biometryType === true) {
          setBiometric({
            active: true,
            value: isBio === '1',
          });
        }
      })
      .catch(e => {
        console.log('[LOG] === Error ===> ', e);
      });

    let languageLocal = await getLocalInfo(LANGUAGE);
    if (languageLocal) {
      let tmp = [...initSettings];
      tmp[0].value = languageLocal;
      setInitSettings(tmp);

      let find = initSettings[0].data.findIndex(
        f => f.value === languageLocal.value,
      );
      setLanguages({...languages, active: find});
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onChangeLanguage = index => {
    setLanguages({...languages, active: index});
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
    let newValue = !biometric.value;
    setBiometric({...biometric, value: newValue});
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
                      customColors={customColors}
                      index={index}
                      data={item}
                      dataActive={languages.data[languages.active]}
                      dataToggle={index === 1 ? biometric : null}
                      onToggle={onCheckBiometrics}
                    />
                  );
                }}
                scrollEnabled={false}
              />
            }
          />

          <CActionSheet
            actionRef={actionSheetLangRef}
            headerChoose
            onConfirm={() => handleChange(0)}>
            <Picker
              style={styles.con_action}
              itemStyle={{color: customColors.text, fontSize: fS(20)}}
              selectedValue={languages.active}
              onValueChange={onChangeLanguage}>
              {languages.data.map((value, i) => (
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
