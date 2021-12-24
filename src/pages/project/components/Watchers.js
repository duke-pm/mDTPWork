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
import {showMessage} from 'react-native-flash-message';
import {
  Avatar, Button, Card, CheckBox, Icon, Layout, Text,
} from '@ui-kitten/components';
import {StyleSheet, View, UIManager, LayoutAnimation} from 'react-native';
import IoniIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CEmpty from '~/components/CEmpty';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {DEFAULT_FORMAT_DATE_7, DEFAULT_FORMAT_DATE_9} from '~/configs/constants';
import {cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID} from '~/utils/helper';
import {Assets} from '~/utils/asset';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const RenderWatchNowIcon = props => (
  <Icon {...props} name="eye-outline" />
);

const RenderUnwatchIcon = props => (
  <Icon {...props} name="eye-off-outline" />
);

function Watchers(props) {
  const {t} = useTranslation();
  const {navigation, taskID = -1} = props;

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
  const [watchers, setWatchers] = useState([]);
  const [watched, setWatched] = useState({
    status: projectState.get('isWatched'),
    email: projectState.get('isReceivedEmail'),
  });

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
  const done = () => setLoading({main: false, send: false});

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

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onPrepareData(), []);

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

  /************
   ** RENDER **
   ************/
  return (
    <Layout>
      <View style={[cStyles.mt16, cStyles.mx16]}>
        <Button
          status={!watched.status ? 'primary' : 'danger'}
          accessoryLeft={!watched.status
            ? RenderWatchNowIcon
            : RenderUnwatchIcon}
          onPress={handleFollow}>
          {t(!watched.status ? 'project_management:you_not_watch' : 'project_management:you_watched')}
        </Button>
        <View style={[cStyles.itemsStart, cStyles.mt16]}>
          {watched.status && (
            <CheckBox
              checked={watched.email}
              onChange={handleGetEmail}>
              {t('project_management:title_get_watcher')}
            </CheckBox>
          )}
        </View>
      </View>

      {!loading.main && (
        <Card
          style={[cStyles.m16]}
          disabled
          header={
            <CText category="s1">{t('project_management:list_watchers')}</CText>
          }>
          {watchers.length > 0
            ?
              watchers.map((item, index) => {
                let time = moment(
                  item.timeUpdate,
                  DEFAULT_FORMAT_DATE_7,
                ).format('HH:mm');
                let date = moment(
                  item.timeUpdate,
                  DEFAULT_FORMAT_DATE_7,
                ).format(DEFAULT_FORMAT_DATE_9);
                return (
                  <View
                    key={index + item.userName}
                    style={[cStyles.row, cStyles.itemsCenter]}>
                    <View>
                      <Avatar source={Assets.iconUser} />
                      {item.isReceiveEmail && (
                        <Layout
                          style={[
                            cStyles.center,
                            cStyles.rounded5,
                            cStyles.abs,
                            styles.con_icon,
                          ]} level="3">
                          <IoniIcon
                            name={Icons.mailTask}
                            color={'green'}
                            size={moderateScale(12)}
                          />
                        </Layout>
                      )}
                    </View>
                    <View
                      style={[
                        cStyles.flex1,
                        cStyles.row,
                        cStyles.itemsCenter,
                        cStyles.justifyBetween,
                        cStyles.ml16,
                        index !== -1 && cStyles.py6,
                      ]}>
                      <View style={styles.con_left}>
                        <Text>
                          {item.fullName}
                          <Text category="c1">
                            {item.userName === userName
                              ? ` (${t('common:its_you')})`
                              : ''}
                          </Text>
                        </Text>
                        <CText category="c1" appearance="hint">{item.userName}</CText>
                      </View>
                      <View
                        style={[
                          cStyles.row,
                          cStyles.itemsCenter,
                          cStyles.justifyEnd,
                          styles.con_right,
                        ]}>
                        <View style={cStyles.itemsEnd}>
                          <CText category="c1" appearance="hint">{date}</CText>
                          <CText category="c1" appearance="hint">{time}</CText>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            :
              <View style={cStyles.center}>
                <CEmpty
                  style={{flex: undefined}}
                  description="project_management:empty_watchers"
                />
              </View>
            }
        </Card>
      )}

      <CLoading show={loading.send} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.65},
  con_right: {flex: 0.35},
  con_icon: {
    height: moderateScale(14),
    width: moderateScale(14),
    right: -moderateScale(4),
    bottom: -moderateScale(4),
  },
});

export default Watchers;
