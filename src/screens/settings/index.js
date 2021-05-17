/**
 ** Name: Config settings of App
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Settings.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import Picker from '@gregfrench/react-native-wheel-picker';
var PickerItem = Picker.Item;
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import CButton from '~/components/CButton';
import CText from '~/components/CText';
import CList from '~/components/CList';
import ListItem from '~/screens/account/components/ListItem';
import Assets from '~/utils/asset/Assets';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {getLocalInfo, saveLocalInfo, sH} from '~/utils/helper';
import {LANGUAGE} from '~/config/constants';
/* REDUX */
import * as Actions from '~/redux/actions';

const actionSheetLangRef = createRef();

const SETTINGS = [
  {
    id: 'language',
    label: 'settings:language',
    icon: 'globe',
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
    id: 'theme',
    label: 'settings:theme',
    icon: 'edit-3',
    isChooseTheme: true,
    value: false,
  },
];

function Settings(props) {
  const {t} = useTranslation();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [initSettings, setInitSettings] = useState(SETTINGS);
  const [languages, setLanguages] = useState({
    data: SETTINGS[0].data,
    active: 0,
  });

  /** HANDLE FUNC */
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

  const handleToggleTheme = value => {
    let tmp = [...initSettings];
    tmp[1].value = value;
    setInitSettings(tmp);
  };

  /** FUNC */
  const onPrepareData = async () => {
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

  useEffect(() => {
    onPrepareData();
  }, []);

  /** RENDER */
  return (
    <CContainer
      loading={loading}
      title={'settings:title'}
      header
      hasBack
      content={
        <CContent scroll>
          <CList
            data={initSettings}
            item={({item, index}) => {
              return (
                <ListItem
                  index={index}
                  data={item}
                  dataLength={initSettings.length}
                  dataActive={item.value}
                  onToggle={item.isChooseTheme ? handleToggleTheme : null}
                />
              );
            }}
          />

          <ActionSheet
            ref={actionSheetLangRef}
            headerAlwaysVisible={true}
            elevation={2}
            indicatorColor={colors.PRIMARY}
            CustomHeaderComponent={
              <View
                style={[
                  cStyles.pt16,
                  cStyles.px16,
                  cStyles.row,
                  cStyles.itemsCenter,
                  cStyles.justifyBetween,
                ]}>
                <CText
                  styles={'textMeta'}
                  label={'settings:holder_change_language'}
                />
                <CButton
                  label={'common:choose_language'}
                  onPress={() => handleChange(0)}
                />
              </View>
            }>
            <Picker
              style={styles.con_action}
              lineColor={colors.BLACK} //to set top and bottom line color (Without gradients)
              lineGradientColorFrom="#008000" //to set top and bottom starting gradient line color
              lineGradientColorTo="#FF5733" //to set top and bottom ending gradient
              itemStyle={cStyles.H3}
              selectedValue={languages.active}
              onValueChange={onChangeLanguage}>
              {languages.data.map((value, i) => (
                <PickerItem label={t(value.label)} value={i} key={i} />
              ))}
            </Picker>
          </ActionSheet>
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_action: {width: '100%', height: sH('25%')},
});

export default Settings;