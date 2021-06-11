/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name:
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
import CList from '~/components/CList';
import CAvatar from '~/components/CAvatar';
import CContent from '~/components/CContent';
import CButton from '~/components/CButton';
/* COMMON */
import {Animations} from '~/utils/asset';
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, scalePx} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';

function Watchers(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    taskID = '',
    language = 'vi',
    refreshToken = '',
    navigation = null,
    onClose = () => {},
  } = props;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const authState = useSelector(({auth}) => auth);
  const userName = authState.getIn(['login', 'userName']);

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [follow, setFollow] = useState(false);
  const [watchers, setWatchers] = useState([]);

  /** HANDLE FUNC */
  const handleClose = () => {
    onClose();
  };

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

  /** FUNC */
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

    return setLoading({main: false, send: false});
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:send_follow'),
      type: 'danger',
      icon: 'danger',
    });

    return setLoading({main: false, send: false});
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData(true);
  }, []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskWatcher')) {
        if (projectState.get('successTaskWatcher')) {
          return onPrepareData(true);
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

  /** RENDER */
  return (
    <Modal
      style={cStyles.m0}
      isVisible={props.visible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0}>
      <SafeAreaView
        style={[
          cStyles.flex1,
          {
            backgroundColor: isDark
              ? customColors.header
              : customColors.primary,
          },
        ]}
        edges={['right', 'left', 'top']}>
        {isDark && IS_IOS && (
          <BlurView
            style={[cStyles.abs, cStyles.inset0]}
            blurType={'extraDark'}
            reducedTransparencyFallbackColor={colors.BLACK}
          />
        )}
        <View
          style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
          {/** Header */}
          <CHeader
            centerStyle={cStyles.center}
            left={
              <TouchableOpacity
                style={cStyles.itemsStart}
                onPress={handleClose}>
                <Icon
                  style={cStyles.p16}
                  name={'x'}
                  color={'white'}
                  size={scalePx(3)}
                />
              </TouchableOpacity>
            }
            title={'project_management:title_watcher'}
          />
          {/** Content */}
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
                icon={follow ? null : 'eye'}
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
                  scrollToBottom
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
                            <CText
                              styles={'textMeta'}
                              customLabel={item.timeUpdate}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </CContent>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  con_left: {flex: 0.5},
  con_right: {flex: 0.5},
});

export default Watchers;
