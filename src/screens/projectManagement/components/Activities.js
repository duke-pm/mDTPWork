/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Activity of Task
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Activity.js
 **/
import React, {createRef, useState, useEffect, useLayoutEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {showMessage} from 'react-native-flash-message';
import {ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper';
import {
  StyleSheet,
  View,
  Keyboard,
  Text,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  TouchableOpacity,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CContainer from '~/components/CContainer';
import CText from '~/components/CText';
import CInput from '~/components/CInput';
import CIconButton from '~/components/CIconButton';
import CList from '~/components/CList';
import CAvatar from '~/components/CAvatar';
import CIconHeader from '~/components/CIconHeader';
import CSearchBar from '~/components/CSearchBar';
/* COMMON */
import {LAST_COMMENT_TASK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {
  saveLocalInfo,
  getLocalInfo,
  IS_IOS,
  moderateScale,
  IS_ANDROID,
} from '~/utils/helper';
import {LOCALE_VI, LOCALE_EN} from '~/utils/language/comment';
/** REDUX */
import * as Actions from '~/redux/actions';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
let listRef = createRef();
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
      style={[
        ifIphoneX(cStyles.pb24, cStyles.pb6),
        cStyles.fullWidth,
        {
          backgroundColor: customColors.background,
        },
      ]}>
      <View style={[cStyles.px16, cStyles.row, cStyles.itemsCenter]}>
        <CInput
          name={INPUT_NAME.MESSAGE}
          style={{
            backgroundColor: customColors.listItem,
            color: customColors.text,
          }}
          containerStyle={styles.input}
          styleFocus={styles.input_focus}
          holder={'project_management:holder_input_your_comment'}
          value={value}
          onBlur={() => Keyboard.dismiss()}
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
    </View>
  );
};

function Activity(props) {
  const {t} = useTranslation();
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
  const [showSearch, setShowSearch] = useState(false);
  const [dataSearch, setDataSearch] = useState({
    data: [],
    active: 0,
  });
  const [valueMessage, setValueMessage] = useState('');
  const [messages, setMessages] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setDataSearch({data: [], active: 0});
    setShowSearch(false);
  };

  const handleSearch = value => {
    let dataPos = [],
      i,
      j;
    for (i = 0; i < messages.length; i++) {
      for (j = 0; j < messages[i].data.length; j++) {
        if (
          messages[i].data[j].comments
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
        ) {
          dataPos.push({section: i, item: j + 1});
        }
      }
    }
    if (dataPos.length > 0) {
      setDataSearch({data: dataPos, active: 0});
      listRef.scrollToLocation({
        animated: true,
        viewPosition: 0,
        itemIndex: dataPos[0].item,
        sectionIndex: dataPos[0].section,
      });
    }
  };

  const handleDownSearch = () => {
    listRef.scrollToLocation({
      animated: true,
      viewPosition: 0,
      itemIndex: dataSearch.data[dataSearch.active - 1].item,
      sectionIndex: dataSearch.data[dataSearch.active - 1].section,
    });
    setDataSearch({...dataSearch, active: dataSearch.active - 1});
  };

  const handleUpSearch = () => {
    listRef.scrollToLocation({
      animated: true,
      viewPosition: 0,
      itemIndex: dataSearch.data[dataSearch.active + 1].item,
      sectionIndex: dataSearch.data[dataSearch.active + 1].section,
    });
    setDataSearch({...dataSearch, active: dataSearch.active + 1});
  };

  /************
   ** FUNC **
   ************/
  const onPrepareData = async isUpdate => {
    let array = [];
    let activities = projectState.get('activities');
    if (!isUpdate) {
      let item = null,
        date = null,
        find = null,
        tmp = null;
      for (item of activities) {
        date = moment(item.timeUpdate, 'DD/MM/YYYY - HH:mm').format(
          'dddd - DD/MM/YYYY',
        );
        find = array.findIndex(f => f.title === date);
        if (find !== -1) {
          if (tmp && tmp.userName === item.userName) {
            item.showAvatar = false;
          } else {
            item.showAvatar = true;
          }
          array[find].data.unshift(item);
        } else {
          item.showAvatar = true;
          array.unshift({
            title: date,
            data: [item],
          });
        }
        tmp = item;
      }
    } else {
      array = [...messages];
      let lastCmt = activities[activities.length - 1];
      let date = moment(lastCmt.timeUpdate, 'DD/MM/YYYY - HH:mm').format(
        'dddd - DD/MM/YYYY',
      );
      let find = array.findIndex(f => f.title === date);
      if (find !== -1) {
        array[0].data.unshift(lastCmt);
      } else {
        array.unshift({
          title: date,
          data: [lastCmt],
        });
      }
    }
    setMessages(array);
    return done();
  };

  const onSendMessage = () => {
    if (valueMessage.trim() !== '') {
      setLoading({...loading, send: true});
      Keyboard.dismiss();
      setValueMessage('');
      let params = {
        LineNum: 0,
        TaskID: taskID,
        Comments: valueMessage.trim(),
        Lang: language,
        RefreshToken: refreshToken,
      };
      return dispatch(Actions.fetchTaskComment(params, navigation));
    }
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
    onUpdateLastComment();
    onPrepareData(false);
  }, []);

  useEffect(() => {
    if (loading.send) {
      if (!projectState.get('submittingTaskComment')) {
        if (projectState.get('successTaskComment')) {
          onUpdateLastComment();
          return onPrepareData(true);
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CIconHeader
          icons={[
            {
              show: true,
              showRedDot: false,
              icon: 'search',
              onPress: handleOpenSearch,
            },
          ]}
        />
      ),
    });
  }, [navigation]);

  /**************
   ** RENDER **
   **************/
  return (
    <CContainer
      loading={loading.main || loading.send}
      content={
        <View
          style={[
            cStyles.flex1,
            {backgroundColor: customColors.backgroundActivity},
          ]}>
          {showSearch && (
            <View
              style={[
                cStyles.itemsCenter,
                cStyles.borderBottom,
                dataSearch.data.length === 0 && cStyles.pb10,
                dataSearch.data.length > 0 && {height: moderateScale(110)},
              ]}>
              <CSearchBar
                containerStyle={IS_ANDROID ? cStyles.mx20 : {}}
                isVisible={showSearch}
                onSearch={handleSearch}
                onClose={handleCloseSearch}
              />

              {dataSearch.data.length > 0 ? (
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt6]}>
                  <TouchableOpacity
                    disabled={
                      dataSearch.data.length < 2 || dataSearch.active === 0
                    }
                    onPress={handleDownSearch}>
                    <Icon
                      style={cStyles.p10}
                      name={'chevron-down-circle-outline'}
                      size={moderateScale(20)}
                      color={customColors.icon}
                    />
                  </TouchableOpacity>

                  <Text style={[cStyles.textMeta, {color: customColors.text}]}>
                    {dataSearch.active + 1}/{dataSearch.data.length}
                  </Text>

                  <TouchableOpacity
                    disabled={
                      dataSearch.data.length < 2 ||
                      dataSearch.active === dataSearch.data.length - 1
                    }
                    onPress={handleUpSearch}>
                    <Icon
                      style={cStyles.p10}
                      name={'chevron-up-circle-outline'}
                      size={moderateScale(20)}
                      color={customColors.icon}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[cStyles.center, cStyles.my10]}>
                  <CText styles={'textMeta'} label={'common:empty_info'} />
                </View>
              )}
            </View>
          )}
          <KeyboardAvoidingView
            style={cStyles.flex1}
            behavior={IS_IOS ? 'padding' : undefined}
            keyboardVerticalOffset={
              isIphoneX()
                ? moderateScale(68)
                : DeviceInfo.isTablet()
                ? moderateScale(46)
                : moderateScale(58)
            }>
            <CList
              viewRef={ref => (listRef = ref)}
              contentStyle={[messages.length === 0 && cStyles.mt60]}
              customColors={customColors}
              sectionList={true}
              inverted={messages.length > 0}
              textEmpty={t('project_management:empty_comment')}
              data={messages}
              item={({item, index}) => {
                if (item.userName === userName) {
                  return (
                    <View style={[cStyles.itemsEnd, cStyles.pb6]}>
                      <View
                        style={[
                          cStyles.roundedTopLeft3,
                          cStyles.roundedTopRight3,
                          cStyles.roundedBottomLeft3,
                          cStyles.p10,
                          cStyles.ml10,
                          {
                            backgroundColor: IS_ANDROID
                              ? colors.STATUS_SCHEDULE_OPACITY
                              : colors.STATUS_NEW_OPACITY,
                          },
                        ]}>
                        <CText
                          customStyles={cStyles.textRight}
                          customLabel={item.comments}
                        />
                        <CText
                          customStyles={[
                            cStyles.textDate,
                            cStyles.textRight,
                            cStyles.mt6,
                          ]}
                          customLabel={`${moment(
                            item.timeUpdate,
                            'DD/MM/YYYY - HH:mm',
                          ).format('HH:mm')}`}
                        />
                      </View>
                    </View>
                  );
                }
                return (
                  <View
                    style={[
                      cStyles.row,
                      cStyles.itemsStart,
                      cStyles.pb6,
                      cStyles.mr32,
                      item.showAvatar && cStyles.mt10,
                    ]}>
                    {item.showAvatar ? (
                      <View style={styles.container_chat}>
                        <CAvatar size={'small'} label={item.fullName} />
                        <Text
                          style={[
                            cStyles.textDate,
                            cStyles.textLeft,
                            cStyles.mt10,
                            {
                              color: customColors.text,
                            },
                          ]}>
                          {`${moment(
                            item.timeUpdate,
                            'DD/MM/YYYY - HH:mm',
                          ).format('HH:mm')}`}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.container_chat}>
                        <Text
                          style={[
                            cStyles.textDate,
                            cStyles.textLeft,
                            cStyles.mt10,
                            {color: customColors.text},
                          ]}>
                          {`${moment(
                            item.timeUpdate,
                            'DD/MM/YYYY - HH:mm',
                          ).format('HH:mm')}`}
                        </Text>
                      </View>
                    )}
                    <View>
                      {item.showAvatar && (
                        <View style={[cStyles.ml10, cStyles.mb6]}>
                          <Text
                            style={[
                              cStyles.textSubTitle,
                              {color: customColors.primary},
                            ]}>
                            {item.fullName}
                          </Text>
                        </View>
                      )}
                      <View
                        style={[
                          cStyles.roundedTopRight3,
                          cStyles.roundedBottomRight3,
                          cStyles.roundedBottomLeft3,
                          cStyles.p10,
                          cStyles.ml10,
                          {backgroundColor: colors.STATUS_CLOSE_OPACITY},
                        ]}>
                        <CText
                          customStyles={[cStyles.textDefault]}
                          customLabel={item.comments}
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
            <RenderInputMessage
              customColors={customColors}
              value={valueMessage}
              onSend={onSendMessage}
              handleChangeText={setValueMessage}
            />
          </KeyboardAvoidingView>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.WHITE},
  input: {width: '85%'},
  container_chat: {
    height: moderateScale(32),
    width: moderateScale(32),
  },
});

export default Activity;
