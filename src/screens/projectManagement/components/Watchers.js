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
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CCheckbox from '~/components/CCheckbox';
import CAvatar from '~/components/CAvatar';
import CContent from '~/components/CContent';
import CButton from '~/components/CButton';
import CCard from '~/components/CCard';
import CLabel from '~/components/CLabel';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {cStyles} from '~/utils/style';
import {IS_ANDROID} from '~/utils/helper';
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
  const [getEmail, setGetEmail] = useState(true);
  const [watchers, setWatchers] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFollow = () => {
    let varWatch = projectState.get('isWatched') ? 0 : 1;
    let params = {
      TaskID: taskID,
      IsWatched: varWatch,
      IsReceiveEmail: 1,
      Lang: language,
      RefreshToken: refreshToken,
      UserName: userName,
    };
    dispatch(Actions.fetchTaskWatcher(params, navigation));
    if (!needRefresh) {
      setNeedRefresh(true);
    }
    return setLoading({...loading, send: true});
  };

  const handleGetEmail = () => {
    let isWatched = projectState.get('isWatched');
    let params = {
      TaskID: taskID,
      IsWatched: isWatched ? 1 : 0,
      IsReceiveEmail: getEmail ? 0 : 1,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskWatcher(params, navigation));
    return setLoading({...loading, send: true});
  };

  /************
   ** FUNC **
   ************/
  const onPrepareData = () => {
    /** Set list watchers */
    let tmpWatchers = projectState.get('watchers');
    setWatchers(tmpWatchers);

    /** Check get email */
    if (tmpWatchers.length > 0) {
      let find = tmpWatchers.find(f => f.userName === userName);
      if (find) {
        setGetEmail(find.isReceiveEmail);
      } else {
        setGetEmail(true);
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
    onPrepareData();
  }, []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskWatcher')) {
        if (projectState.get('successTaskWatcher')) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          return onPrepareData();
        }

        if (projectState.get('errorTaskWatcher')) {
          return onError();
        }
      }
    }
  }, [
    loading.send,
    needRefresh,
    projectState.get('submittingTaskWatcher'),
    projectState.get('successTaskWatcher'),
    projectState.get('errorTaskWatcher'),
  ]);

  /**************
   ** RENDER **
   **************/
  let isWatched = projectState.get('isWatched');
  return (
    <CContainer
      loading={loading.main || loading.send}
      title={'project_management:title_watcher'}
      header
      hasBack
      iconBack={'x'}
      onRefresh={needRefresh ? onRefresh : null}
      content={
        <CContent scroll>
          <View style={[cStyles.mt16, cStyles.mx16]}>
            <CButton
              block
              variant={'outlined'}
              color={!isWatched ? customColors.green : customColors.red}
              label={
                !isWatched
                  ? 'project_management:you_not_watch'
                  : 'project_management:you_watched'
              }
              icon={isWatched ? 'eye-off' : loading.send ? null : 'eye'}
              onPress={handleFollow}
            />
            <View style={cStyles.itemsStart}>
              {isWatched && (
                <CCheckbox
                  textStyle={[cStyles.textMeta, {color: customColors.text}]}
                  labelRight={'project_management:title_get_watcher'}
                  value={getEmail}
                  onChange={handleGetEmail}
                />
              )}
            </View>
          </View>

          {!loading.main && (
            <CCard
              style={[
                cStyles.mx16,
                !isWatched && cStyles.mt16,
                !isIphoneX() && cStyles.mb16,
              ]}
              containerStyle={[cStyles.rounded2, cStyles.fullHeight]}
              label={'project_management:list_watchers'}
              content={
                watchers.length > 0 ? (
                  <ScrollView
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}>
                    {watchers.map((item, index) => {
                      let isLast = index === watchers.length - 1;
                      return (
                        <View
                          key={index + item.userName}
                          style={[cStyles.row, cStyles.itemsCenter]}>
                          <CAvatar size={'small'} label={item.fullName} />
                          <View
                            style={[
                              cStyles.flex1,
                              cStyles.row,
                              cStyles.itemsCenter,
                              cStyles.justifyBetween,
                              cStyles.ml10,
                              cStyles.py16,
                              !isLast && cStyles.borderBottom,
                              !isLast && isDark && cStyles.borderBottomDark,
                            ]}>
                            <View style={styles.con_left}>
                              <Text
                                style={
                                  (cStyles.textDefault,
                                  {color: customColors.text})
                                }>
                                {item.fullName}
                                <Text
                                  style={
                                    (cStyles.textMeta,
                                    {color: customColors.text})
                                  }>
                                  {item.userName === userName
                                    ? ` (${t('common:its_you')})`
                                    : ''}
                                </Text>
                              </Text>
                            </View>
                            <View style={[cStyles.itemsEnd, styles.con_right]}>
                              <CText
                                styles={'textDate'}
                                customLabel={item.timeUpdate}
                              />
                            </View>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <CLabel label={'project_management:empty_watchers'} />
                )
              }
            />
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
