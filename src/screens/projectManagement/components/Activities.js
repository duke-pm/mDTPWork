/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Activity of Task
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {showMessage} from 'react-native-flash-message';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import moment from 'moment';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CFooter from '~/components/CFooter';
import CText from '~/components/CText';
import CLoading from '~/components/CLoading';
import CInput from '~/components/CInput';
import CIconButton from '~/components/CIconButton';
import CList from '~/components/CList';
import CAvatar from '~/components/CAvatar';
import CContent from '~/components/CContent';
/* COMMON */
import {THEME_DARK, LAST_COMMENT_TASK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, scalePx, saveLocalInfo, getLocalInfo} from '~/utils/helper';
import {usePrevious} from '~/utils/hook';
/** REDUX */
import * as Actions from '~/redux/actions';

const LOCALE_VI = {
  weekdays: 'Chủ nhật_Thứ hai_Thứ ba_Thứ tư_Thứ năm_Thứ sáu_Thứ bảy'.split('_'),
  weekdaysShort: 'CN_Thứ 2_Thứ 3_Thứ 4_Thứ 5_Thứ 6_Thứ 7'.split('_'),
  weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysParseExact: true,
};
const LOCALE_EN = {
  weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split(
    '_',
  ),
  weekdaysShort: 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
  weekdaysMin: 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
  weekdaysParseExact: true,
};
const INPUT_NAME = {
  MESSAGE: 'message',
};

const RenderInputMessage = ({
  value = '',
  onSend = () => {},
  handleChangeText = () => {},
}) => {
  return (
    <View style={[cStyles.px16, cStyles.row, cStyles.itemsCenter]}>
      <CInput
        name={INPUT_NAME.MESSAGE}
        containerStyle={styles.input}
        styleFocus={styles.input_focus}
        holder={'project_management:holder_input_your_comment'}
        value={value}
        keyboard={'default'}
        returnKey={'send'}
        onChangeInput={onSend}
        onChangeValue={handleChangeText}
      />
      <View style={[cStyles.flexCenter, cStyles.pt10]}>
        <CIconButton
          disabled={value === ''}
          iconName={'send'}
          iconColor={value === '' ? colors.GRAY_500 : colors.SECONDARY}
          onPress={onSend}
        />
      </View>
    </View>
  );
};

function Activity(props) {
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
  if (language === 'vi') {
    moment.locale('vi', LOCALE_VI);
  } else {
    moment.locale('en', LOCALE_EN);
  }

  /** Use state */
  const [loading, setLoading] = useState({
    main: true,
    send: false,
  });
  const [valueMessage, setValueMessage] = useState('');
  const [messages, setMessages] = useState([]);

  let prevVisible = usePrevious(props.visible);

  /** HANDLE FUNC */
  const handleClose = () => {
    onClose();
  };

  /** FUNC */
  const onPrepareData = async isUpdate => {
    let array = [];
    let activities = projectState.get('activities');
    if (!isUpdate) {
      let item = null,
        date = null,
        find = null;
      for (item of activities) {
        date = moment(item.timeUpdate, 'DD/MM/YYYY - HH:mm').format(
          'dddd - DD/MM/YYYY',
        );
        find = array.findIndex(f => f.title === date);
        if (find !== -1) {
          array[find].data.push(item);
        } else {
          array.push({
            title: date,
            data: [item],
          });
        }
      }
    } else {
      array = [...messages];
      let lastCmt = activities[activities.length - 1];
      let date = moment(lastCmt.timeUpdate, 'DD/MM/YYYY - HH:mm').format(
        'dddd - DD/MM/YYYY',
      );
      let find = array.findIndex(f => f.title === date);
      if (find !== -1) {
        array[array.length - 1].data.push(lastCmt);
      } else {
        array.push({
          title: date,
          data: [lastCmt],
        });
      }
    }
    setMessages(array);
    return setLoading({main: false, send: false});
  };

  const onSendMessage = () => {
    setLoading({...loading, send: true});
    Keyboard.dismiss();
    setValueMessage('');
    let params = {
      LineNum: 0,
      TaskID: taskID,
      Comments: valueMessage,
      Lang: language,
      RefreshToken: refreshToken,
    };
    return dispatch(Actions.fetchTaskComment(params, navigation));
  };

  const onError = () => {
    showMessage({
      message: t('common:app_name'),
      description: t('error:send_comment'),
      type: 'danger',
      icon: 'danger',
    });

    return setLoading({main: false, send: false});
  };

  const onUpdateLastComment = async () => {
    let activities = projectState.get('activities');
    if (activities.length > 0) {
      let tmpLastComment = await getLocalInfo(LAST_COMMENT_TASK);
      if (!tmpLastComment) {
        tmpLastComment = [
          {
            taskID,
            value: activities[activities.length - 1].rowNum,
          },
        ];
        await saveLocalInfo({key: LAST_COMMENT_TASK, value: tmpLastComment});
      } else {
        let find = tmpLastComment.findIndex(f => f.taskID === taskID);
        if (find !== -1) {
          tmpLastComment[find].value = activities[activities.length - 1].rowNum;
        } else {
          tmpLastComment.push({
            taskID,
            value: activities[activities.length - 1].rowNum,
          });
        }
        await saveLocalInfo({key: LAST_COMMENT_TASK, value: tmpLastComment});
      }
    }
  };

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData(false);
  }, []);

  useEffect(() => {
    if (!prevVisible && props.visible) {
      onUpdateLastComment();
    }
  }, [props.visible, prevVisible]);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskComment')) {
        if (projectState.get('successTaskComment')) {
          onPrepareData(true);
          return onUpdateLastComment();
        }

        if (projectState.get('errorTaskComment')) {
          return onError();
        }
      }
    }
  }, [
    loading.send,
    projectState.get('submittingTaskComment'),
    projectState.get('successTaskComment'),
    projectState.get('errorTaskComment'),
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
            title={'project_management:title_activity'}
          />

          {/** Content */}
          <CContent>
            {!loading.main && (
              <CList
                contentStyle={cStyles.pt16}
                customColors={customColors}
                scrollToTop={false}
                scrollToBottom
                sectionList
                textEmpty={t('project_management:empty_comment')}
                data={messages}
                item={({item, index}) => {
                  if (item.userName === userName) {
                    return (
                      <View style={[cStyles.itemsEnd, cStyles.pb16]}>
                        <View
                          style={[
                            cStyles.roundedBottomLeft2,
                            cStyles.roundedTopLeft2,
                            cStyles.roundedTopRight2,
                            cStyles.p10,
                            cStyles.ml10,
                            {backgroundColor: customColors.primary},
                          ]}>
                          <CText
                            styles={'textMeta textRight colorWhite'}
                            customLabel={moment(
                              item.timeUpdate,
                              'DD/MM/YYYY - HH:mm',
                            ).format('HH:mm')}
                          />

                          <View style={cStyles.mt10}>
                            <CText
                              styles={'textRight colorWhite'}
                              customLabel={item.comments}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  }

                  return (
                    <View
                      style={[cStyles.row, cStyles.itemsStart, cStyles.pb16]}>
                      <CAvatar
                        size={'small'}
                        label={item.fullName}
                        customColors={customColors}
                      />
                      <View
                        style={[
                          cStyles.roundedBottomLeft2,
                          cStyles.roundedBottomRight2,
                          cStyles.roundedTopRight2,
                          cStyles.p10,
                          cStyles.ml10,
                          {backgroundColor: customColors.cardDisable},
                        ]}>
                        <View style={[cStyles.row, cStyles.itemsEnd]}>
                          <Text
                            style={[
                              cStyles.textTitle,
                              {color: customColors.primary},
                            ]}>
                            {item.fullName + ', '}
                          </Text>

                          <CText
                            styles={'textMeta'}
                            customLabel={moment(
                              item.timeUpdate,
                              'DD/MM/YYYY - HH:mm',
                            ).format('HH:mm')}
                          />
                        </View>

                        <View style={cStyles.mt10}>
                          <CText customLabel={item.comments} />
                        </View>
                      </View>
                    </View>
                  );
                }}
              />
            )}
          </CContent>
        </View>

        {/** Footer input message */}
        <KeyboardAvoidingView behavior={IS_IOS ? 'padding' : 'height'}>
          <CFooter
            content={
              <RenderInputMessage
                value={valueMessage}
                onSend={onSendMessage}
                handleChangeText={setValueMessage}
              />
            }
          />
        </KeyboardAvoidingView>

        <CLoading
          customColors={customColors}
          visible={loading.main || loading.send}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: cStyles.toolbarHeight,
    top: 0,
    left: 0,
    right: 0,
  },
  row_header: {height: 50},
  input_focus: {
    borderColor: colors.SECONDARY,
  },
  input: {width: '85%'},
  con_left: {flex: 0.5},
  con_right: {flex: 0.5},
});

export default Activity;
