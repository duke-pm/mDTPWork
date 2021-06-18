/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Activity of Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {showMessage} from 'react-native-flash-message';
import {isIphoneX} from 'react-native-iphone-x-helper';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Text,
} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CIconButton from '~/components/CIconButton';
import CList from '~/components/CList';
import CAvatar from '~/components/CAvatar';
import CLabel from '~/components/CLabel';
/* COMMON */
import {LAST_COMMENT_TASK, THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, saveLocalInfo, getLocalInfo} from '~/utils/helper';
import {LOCALE_VI, LOCALE_EN} from '~/utils/language/comment';
/** REDUX */
import * as Actions from '~/redux/actions';

const INPUT_NAME = {
  MESSAGE: 'message',
};

const RenderInputMessage = ({
  customColors,
  value = '',
  onSend = () => {},
  handleChangeText = () => {},
}) => {
  return (
    <View
      style={[cStyles.px16, cStyles.mb10, cStyles.row, cStyles.itemsCenter]}>
      <CInput
        name={INPUT_NAME.MESSAGE}
        style={{backgroundColor: customColors.textInput}}
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
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
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

  /************
   ** FUNC **
   ************/
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
    return done();
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

    return done();
  };

  const done = () => {
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

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    onPrepareData(false);
    onUpdateLastComment();
  }, []);

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

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading.main || loading.send}
      title={'project_management:title_activity'}
      header
      hasBack
      iconBack={'x'}
      content={
        <SafeAreaView
          style={[
            cStyles.flex1,
            {backgroundColor: customColors.backgroundActivity},
          ]}
          edges={['bottom', 'left', 'right']}>
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
                    <View style={[cStyles.itemsEnd, cStyles.pb6]}>
                      <View
                        style={[
                          cStyles.roundedBottomLeft2,
                          cStyles.roundedTopLeft2,
                          cStyles.roundedTopRight2,
                          cStyles.p10,
                          cStyles.ml10,
                          {
                            backgroundColor: isDark
                              ? colors.GRAY_860
                              : customColors.green2,
                          },
                        ]}>
                        <CText
                          customStyles={[
                            cStyles.textDate,
                            cStyles.textRight,
                            {color: isDark ? colors.WHITE : colors.BLACK},
                          ]}
                          customLabel={moment(
                            item.timeUpdate,
                            'DD/MM/YYYY - HH:mm',
                          ).format('HH:mm')}
                        />

                        <View style={cStyles.mt10}>
                          <CText
                            customStyles={[
                              cStyles.textRight,
                              {color: isDark ? colors.WHITE : colors.BLACK},
                            ]}
                            customLabel={item.comments}
                          />
                        </View>
                      </View>
                    </View>
                  );
                }

                return (
                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsStart,
                      cStyles.pb16,
                      cStyles.mr16,
                    ]}>
                    <CAvatar size={'small'} label={item.fullName} />
                    <View
                      style={[
                        cStyles.roundedBottomLeft2,
                        cStyles.roundedBottomRight2,
                        cStyles.roundedTopRight2,
                        cStyles.p10,
                        cStyles.ml10,
                        {
                          backgroundColor: isDark
                            ? customColors.cardDisable
                            : colors.GRAY_100,
                        },
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
                          customStyles={[cStyles.textDate, cStyles.textLeft]}
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
          <RenderInputMessage
            customColors={customColors}
            value={valueMessage}
            onSend={onSendMessage}
            handleChangeText={setValueMessage}
          />
        </SafeAreaView>
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  input: {width: '85%'},
});

export default Activity;
