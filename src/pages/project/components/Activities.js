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
import {showMessage} from 'react-native-flash-message';
import {ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper';
import {
  StyleSheet,
  View,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  SectionList,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {
  AST_LAST_COMMENT_TASK,
  DEFAULT_FORMAT_DATE_7,
  DEFAULT_FORMAT_DATE_8,
} from '~/configs/constants';
import {
  saveLocalInfo,
  getLocalInfo,
  moderateScale,
  IS_IOS,
  IS_ANDROID,
} from '~/utils/helper';
/** REDUX */
import * as Actions from '~/redux/actions';
import {useTheme, Button, Input, Icon, Layout, Text, Divider} from '@ui-kitten/components';
import CEmpty from '~/components/CEmpty';
import CAvatar from '~/components/CAvatar';
import { Assets } from '~/utils/asset';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All ref */
let listRef = createRef();

/** All init */
const INPUT_NAME = {MESSAGE: 'message'};

const RenderSendIcon = props => (
  <Icon {...props} name="paper-plane-outline" />
);

const RenderInputMessage = ({
    loading = false,
    trans = {},
    value = '',
    onSend = () => {},
    handleChangeText = () => {},
  }) => {
    return (
      <Layout
        style={[
          ifIphoneX(cStyles.pb24, cStyles.pb6),
          cStyles.fullWidth,,
        ]}
        level="3">
        <View
          style={[
            cStyles.px16,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.mt5,
          ]}>
          <Input
            style={[cStyles.flex1, cStyles.mr5]}
            testID={INPUT_NAME.MESSAGE}
            placeholder={trans('project_management:holder_input_your_comment')}
            value={value}
            blurOnSubmit={false}
            editable={!loading}
            multiline
            onBlur={Keyboard.dismiss}
            onChangeText={handleChangeText}
          />
          <Button
            size="small"
            disabled={value === '' || loading}
            accessoryLeft={RenderSendIcon}
            onPress={onSend}
          />
        </View>
      </Layout>
    );
};

function Activity(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {taskID, navigation} = props;

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
  const [showSearch, setShowSearch] = useState(false);
  const [dataSearch, setDataSearch] = useState({
    data: [],
    active: 0,
  });
  const [valueMessage, setValueMessage] = useState('');
  const [messages, setMessages] = useState([]);

  let arrayRef = [];

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleOpenSearch = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
      arrayRef[dataPos[0].section].item[dataPos[0].item - 1].ref.rubberBand(
        1000,
      );
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
    arrayRef[dataSearch.data[dataSearch.active - 1].section].item[
      dataSearch.data[dataSearch.active - 1].item - 1
    ].ref.pulse(1000);
  };

  const handleUpSearch = () => {
    listRef.scrollToLocation({
      animated: true,
      viewPosition: 0,
      itemIndex: dataSearch.data[dataSearch.active + 1].item,
      sectionIndex: dataSearch.data[dataSearch.active + 1].section,
    });
    setDataSearch({...dataSearch, active: dataSearch.active + 1});
    arrayRef[dataSearch.data[dataSearch.active + 1].section].item[
      dataSearch.data[dataSearch.active + 1].item - 1
    ].ref.pulse(1000);
  };

  /**********
   ** FUNC **
   **********/
  const done = () => setLoading({main: false, send: false});

  const onPrepareData = async isUpdate => {
    let array = [];
    let activities = projectState.get('activities');
    if (!isUpdate) {
      let item = null,
        date = null,
        find = null,
        tmp = null;
      for (item of activities) {
        date = moment(item.timeUpdate, DEFAULT_FORMAT_DATE_7).format(
          DEFAULT_FORMAT_DATE_8,
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
      let date = moment(lastCmt.timeUpdate, DEFAULT_FORMAT_DATE_7).format(
        DEFAULT_FORMAT_DATE_8,
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

  const onUpdateLastComment = async () => {
    let activities = projectState.get('activities');
    if (activities.length > 0) {
      let tmpLastComment = await getLocalInfo(AST_LAST_COMMENT_TASK);
      if (!tmpLastComment) {
        tmpLastComment = [
          {
            taskID,
            value: activities[activities.length - 1].rowNum,
          },
        ];
        await saveLocalInfo({key: AST_LAST_COMMENT_TASK, value: tmpLastComment});
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
        await saveLocalInfo({key: AST_LAST_COMMENT_TASK, value: tmpLastComment});
      }
    }
  };

  const onCheckRef = (index, ref) => {
    if (index === 0 && arrayRef.length !== 0) {
      arrayRef.push({
        section: arrayRef.length,
        item: [{idx: index, ref}],
      });
    } else if (arrayRef.length === 0) {
      arrayRef.push({
        section: arrayRef.length,
        item: [{idx: index, ref}],
      });
    } else {
      arrayRef[arrayRef.length - 1].item.push({idx: index, ref});
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
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

  // useLayoutEffect(() => {
  //   if (messages.length > 0) {
  //     navigation.setOptions({
  //       headerRight: () => (
  //         <CIconHeader
  //           icons={[
  //             {
  //               show: true,
  //               showRedDot: false,
  //               icon: 'search',
  //               onPress: handleOpenSearch,
  //             },
  //           ]}
  //         />
  //       ),
  //     });
  //   }
  // }, [navigation, messages.length]);

  /************
   ** RENDER **
   ************/
  return (
    <Layout style={cStyles.flex1}>
      {showSearch && (
        <View
          style={[
            cStyles.itemsCenter,
            cStyles.borderBottom,
            dataSearch.data.length === 0 && cStyles.pb10,
            dataSearch.data.length > 0 && styles.con_search,
          ]}>
          <CSearchBar loading={loading.main} autoFocus onSearch={handleSearch} />

          {dataSearch.data.length > 0 ? (
            <View style={[cStyles.row, cStyles.itemsCenter]}>
              <Button
                size="tiny"
                disabled={
                  dataSearch.data.length < 2 || dataSearch.active === 0
                }
                accessoryLeft={RenderDownIcon}
                onPress={handleDownSearch}
              />

              <CText category="c1">
                {dataSearch.active + 1}/{dataSearch.data.length}
              </CText>

              <Button
                size="tiny"
                disabled={
                  dataSearch.data.length < 2 ||
                  dataSearch.active === dataSearch.data.length - 1
                }
                accessoryLeft={RenderDownIcon}
                onPress={handleUpSearch}
              />
            </View>
          ) : (
            <View style={[cStyles.center, cStyles.my10]}>
              <CText category="c1">{t('common:empty_info')}</CText>
            </View>
          )}
        </View>
      )}
      <KeyboardAvoidingView
        style={cStyles.flex1}
        behavior={IS_IOS ? 'padding' : undefined}
        keyboardVerticalOffset={ifIphoneX(230, 200)}>
        {!loading.main && (
          <SectionList
            viewRef={ref => (listRef = ref)}
            style={cStyles.flex1}
            contentContainerStyle={[cStyles.py16, cStyles.flexGrow]}
            inverted={messages.length > 0}
            sections={messages}
            renderSectionFooter={({section: {title}}) => {
              return (
                <View style={[cStyles.row, cStyles.itemsCenter, cStyles.center, cStyles.py16]}>
                  <CText category="c2" appearance="hint">{title.toUpperCase()}</CText>
                </View>
              )
            }}
            renderItem={info => {
              if (info.item.userName === userName) {
                return (
                  <View
                    style={[
                      cStyles.itemsEnd,
                      cStyles.ml16,
                      cStyles.mt2,
                      cStyles.pr16,
                    ]}>
                    <Animatable.View
                      ref={ref => onCheckRef(info.index, ref)}
                      style={[
                        cStyles.rounded1,
                        cStyles.p10,
                        {backgroundColor: theme['color-primary-500']},
                      ]}>
                      <CText style={cStyles.textRight} category="p2" status="control" maxLines={1000}>
                        {info.item.comments}
                      </CText>
                      <Text style={[cStyles.textRight, cStyles.mt5]} category="c2" status="control">
                        {`${info.item.timeUpdate.split(' - ')[1]}`}
                      </Text>
                    </Animatable.View>
                  </View>
                );
              }
              return (
                <View
                  style={[
                    cStyles.row,
                    cStyles.mt2,
                    cStyles.pr16,
                    cStyles.pl10,
                  ]}>
                  {info.item.showAvatar && (
                    <View style={[cStyles.itemsCenter, styles.container_chat]}>
                      <CAvatar size={'small'} source={Assets.iconUser} />
                    </View>
                  )}
                  {!info.item.showAvatar && (
                    <View style={styles.container_chat} />
                  )}
                  <View style={cStyles.flex1}>
                    {info.item.showAvatar && (
                      <View style={cStyles.my6}>
                        <Text
                          category="c1"
                          appearance="hint">
                          {info.item.fullName}
                        </Text>
                      </View>
                    )}
                    <Animatable.View
                      ref={ref => onCheckRef(info.index, ref)}
                      style={[
                        cStyles.row,
                        cStyles.rounded1,
                        cStyles.p10,
                        {backgroundColor: theme['background-basic-color-3']},
                      ]}>
                      <View style={{flex: 0.85}}>
                        <CText category="p2" maxLines={1000}>{info.item.comments}</CText>
                      </View>
                      <View style={{flex: 0.15}}>
                        <Text style={cStyles.textRight} category="c2" appearance="hint">
                          {`${info.item.timeUpdate.split('-')[1]}`}
                        </Text>
                      </View>
                    </Animatable.View>
                  </View>
                </View>
              );
            }}
            extraData={messages}
            keyExtractor={(item, index) => item.userName + '_' + index}
            ListEmptyComponent={
              <View style={cStyles.center}>
                <CEmpty
                  style={{flex: undefined}}
                  description="project_management:empty_comment"
                />
              </View>
            }
          />
        )}
        
        {!showSearch && (
          <RenderInputMessage
            loading={loading.send}
            trans={t}
            value={valueMessage}
            onSend={onSendMessage}
            handleChangeText={setValueMessage}
          />
        )}
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  con_search: {height: moderateScale(110)},
  input_focus: {borderColor: colors.PRIMARY},
  input: {width: '85%'},
  container_chat: {flex: 0.15},
  container_cmt: {flex: 0.85},
  con_me: {backgroundColor: colors.BLUE},
});

export default Activity;
