/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Watchers of Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Watchers.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, View, Text} from 'react-native';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CList from '~/components/CList';
import CAvatar from '~/components/CAvatar';
import CContent from '~/components/CContent';
import CButton from '~/components/CButton';
import CLabel from '~/components/CLabel';
/* COMMON */
import {Animations} from '~/utils/asset';
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
/** REDUX */
import * as Actions from '~/redux/actions';

function Watchers(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const taskID = route.params.data.taskID;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const commonState = useSelector(({common}) => common);
  const authState = useSelector(({auth}) => auth);
  const userName = authState.getIn(['login', 'userName']);
  const refreshToken = authState.getIn(['login', 'refreshToken']);
  const language = commonState.get('language');

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [follow, setFollow] = useState(false);
  const [watchers, setWatchers] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFollow = () => {
    if (!follow) {
      setLoading({...loading, send: true});
      let params = {
        LineNum: 0,
        TaskID: taskID,
        Lang: language,
        RefreshToken: refreshToken,
      };
      return dispatch(Actions.fetchTaskWatcher(params, navigation));
    }
  };

  /************
   ** FUNC **
   ************/
  const onPrepareData = needCheck => {
    /** Set list watchers */
    let tmpWatchers = projectState.get('watchers');
    setWatchers(tmpWatchers);

    /** Check is following */
    if (needCheck && userName) {
      let find = tmpWatchers.find(f => f.userName === userName);
      if (find) {
        setFollow(true);
      }
    }

    return done();
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:send_follow'),
      type: 'danger',
      icon: 'danger',
    });

    return done();
  };

  const done = () => {
    return setLoading({main: false, send: false});
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    onPrepareData(true);
  }, []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskWatcher')) {
        if (projectState.get('successTaskWatcher')) {
          setFollow(true);
          return onPrepareData(false);
        }

        if (projectState.get('errorTaskWatcher')) {
          return onError();
        }
      }
    }
  }, [
    loading.send,
    projectState.get('submittingTaskWatcher'),
    projectState.get('successTaskWatcher'),
    projectState.get('errorTaskWatcher'),
    setFollow,
  ]);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading.main || loading.send}
      title={'project_management:title_watcher'}
      header
      hasBack
      iconBack={'x'}
      content={
        <CContent>
          <View style={[cStyles.mt16, cStyles.mx16]}>
            <CButton
              block
              loading={loading.send}
              disabled={loading.main || loading.send}
              variant={'outlined'}
              color={!follow ? colors.SECONDARY : customColors.green}
              label={
                !follow
                  ? 'project_management:you_not_watch'
                  : 'project_management:you_watched'
              }
              icon={follow ? null : loading.send ? null : 'eye'}
              animationIcon={follow ? Animations.approved : null}
              onPress={handleFollow}
            />
          </View>

          {!loading.main && (
            <View style={[cStyles.flex1, cStyles.mt10]}>
              <CText
                styles={'textMeta ml16 mt16'}
                label={'project_management:list_watchers'}
              />
              <CList
                textEmpty={'project_management:empty_watchers'}
                data={watchers}
                item={({item, index}) => {
                  return (
                    <View style={[cStyles.row, cStyles.itemsCenter]}>
                      <CAvatar
                        size={'small'}
                        label={item.fullName}
                        customColors={customColors}
                      />
                      <View
                        style={[
                          cStyles.flex1,
                          cStyles.row,
                          cStyles.itemsCenter,
                          cStyles.justifyBetween,
                          cStyles.ml10,
                          cStyles.py16,
                          cStyles.borderBottom,
                          isDark && cStyles.borderBottomDark,
                        ]}>
                        <View style={styles.con_left}>
                          <Text
                            style={[
                              cStyles.textTitle,
                              {color: customColors.primary},
                            ]}>
                            {item.fullName}
                            <Text style={cStyles.textMeta}>
                              {item.userName === userName
                                ? `  (${t('common:its_you')})`
                                : ''}
                            </Text>
                          </Text>
                        </View>
                        <View style={[cStyles.itemsEnd, styles.con_right]}>
                          <CLabel customLabel={item.timeUpdate} />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.5},
  con_right: {flex: 0.5},
});

export default Watchers;
