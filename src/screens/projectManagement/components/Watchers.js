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
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import {isIphoneX} from 'react-native-iphone-x-helper';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CCheckbox from '~/components/CCheckbox';
import CAvatar from '~/components/CAvatar';
import CContent from '~/components/CContent';
import CButton from '~/components/CButton';
import CCard from '~/components/CCard';
import CLabel from '~/components/CLabel';
import CIcon from '~/components/CIcon';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Icons from '~/config/Icons';
import {THEME_DARK} from '~/config/constants';
import {cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function Watchers(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {route, navigation} = props;
  const taskID = route.params?.data?.taskID || -1;
  const onRefresh = route.params?.onRefresh || false;

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
  const [needRefresh, setNeedRefresh] = useState(false);
  const [watched, setWatched] = useState({
    status: projectState.get('isWatched'),
    email: projectState.get('isReceivedEmail'),
  });
  const [watchers, setWatchers] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFollow = () => {
    let params = {
      TaskID: taskID,
      IsWatched: !watched.status,
      IsReceiveEmail: true,
      Lang: language,
      RefreshToken: refreshToken,
      UserName: userName,
    };
    dispatch(Actions.fetchTaskWatcher(params, navigation));
    setLoading({...loading, send: true});
    setWatched({
      status: !watched.status,
      email: true,
    });
    if (!needRefresh) {
      setNeedRefresh(true);
    }
  };

  const handleGetEmail = () => {
    let params = {
      TaskID: taskID,
      IsWatched: watched.status,
      IsReceiveEmail: !watched.email,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskWatcher(params, navigation));
    setLoading({...loading, send: true});
    setWatched({
      status: watched.status,
      email: !watched.email,
    });
  };

  /**********
   ** FUNC **
   **********/
  const onPrepareData = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    /** Set list watchers */
    let tmpWatchers = projectState.get('watchers');
    setWatchers(tmpWatchers);
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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskWatcher')) {
        if (projectState.get('successTaskWatcher')) {
          return onPrepareData();
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
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('dismiss', e => {
      if (needRefresh && onRefresh) {
        onRefresh(watched.status);
      }
    });
    return unsubscribe;
  }, [navigation, needRefresh]);

  /************
   ** RENDER **
   ************/
  return (
    <CContainer
      loading={loading.main}
      content={
        <CContent>
          <View style={[cStyles.mt16, cStyles.mx16]}>
            <CButton
              block
              variant={isDark ? 'outlined' : 'contained'}
              color={!watched.status ? customColors.green : customColors.red}
              label={
                !watched.status
                  ? 'project_management:you_not_watch'
                  : 'project_management:you_watched'
              }
              icon={
                watched.status ? Icons.eyeOff : loading.send ? null : Icons.eye
              }
              onPress={handleFollow}
            />
            <View style={cStyles.itemsStart}>
              {watched.status && (
                <CCheckbox
                  textStyle={[cStyles.textCaption1, {color: customColors.text}]}
                  labelRight={'project_management:title_get_watcher'}
                  value={watched.email}
                  onChange={handleGetEmail}
                />
              )}
            </View>
          </View>

          {!loading.main && (
            <CCard
              style={[
                cStyles.mx16,
                !watched.status && cStyles.mt16,
                !isIphoneX() && cStyles.mb16,
              ]}
              label={'project_management:list_watchers'}
              content={
                <View>
                  {watchers.length > 0 ? (
                    <ScrollView
                      scrollEnabled={false}
                      showsVerticalScrollIndicator={false}
                      nestedScrollEnabled={true}>
                      {watchers.map((item, index) => {
                        let time = moment(
                          item.timeUpdate,
                          'DD/MM/YYYY - HH:mm',
                        ).format('HH:mm');
                        let date = moment(
                          item.timeUpdate,
                          'DD/MM/YYYY - HH:mm',
                        ).format('DD/MM/YYYY');
                        return (
                          <View
                            key={index + item.userName}
                            style={[cStyles.row, cStyles.itemsCenter]}>
                            <View>
                              <CAvatar size={'small'} label={item.fullName} />
                              {item.isReceiveEmail && (
                                <View
                                  style={[
                                    cStyles.center,
                                    cStyles.rounded5,
                                    cStyles.abs,
                                    {backgroundColor: customColors.card},
                                    styles.con_icon,
                                  ]}>
                                  <CIcon
                                    name={Icons.mail}
                                    color={'green'}
                                    size={'minium'}
                                  />
                                </View>
                              )}
                            </View>
                            <View
                              style={[
                                cStyles.flex1,
                                cStyles.row,
                                cStyles.itemsCenter,
                                cStyles.justifyBetween,
                                cStyles.ml10,
                                index !== watchers.length - 1 &&
                                  cStyles.borderBottom,
                                index !== watchers.length - 1 &&
                                  isDark &&
                                  cStyles.borderBottomDark,
                                index !== -1 && cStyles.py6,
                              ]}>
                              <View style={styles.con_left}>
                                <Text
                                  style={[
                                    cStyles.textBody,
                                    {color: customColors.text},
                                  ]}>
                                  {item.fullName}
                                  <Text
                                    style={[
                                      cStyles.textCaption1,
                                      {color: customColors.text},
                                    ]}>
                                    {item.userName === userName
                                      ? ` (${t('common:its_you')})`
                                      : ''}
                                  </Text>
                                </Text>
                              </View>
                              <View
                                style={[cStyles.itemsEnd, styles.con_right]}>
                                <CText
                                  styles={'textCaption1'}
                                  customLabel={date}
                                />
                                <CText
                                  styles={'textCaption1'}
                                  customLabel={time}
                                />
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </ScrollView>
                  ) : (
                    <CLabel label={'project_management:empty_watchers'} />
                  )}
                  {loading.send && (
                    <CActivityIndicator style={[cStyles.abs, cStyles.inset0]} />
                  )}
                </View>
              }
            />
          )}
        </CContent>
      }
    />
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.6},
  con_right: {flex: 0.4},
  con_icon: {
    height: moderateScale(14),
    width: moderateScale(14),
    right: -moderateScale(4),
    bottom: -moderateScale(4),
  },
});

export default Watchers;
