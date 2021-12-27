/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Percentage
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Percentage.js
 **/
import PropTypes from 'prop-types';
import React, {createRef, useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {Button, Input, useTheme, Text, Icon} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
/* COMMON */
import {Commons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {alert, moderateScale} from '~/utils/helper';
import {ThemeContext} from '~/configs/theme-context';
/** REDUX */
import * as Actions from '~/redux/actions';

/** All ref */
let percentRef = createRef();

const RenderCloseIcon = props => (
  <Icon {...props} name="close-outline" />
);

const RenderCheckIcon = props => (
  <Icon {...props} name="checkmark-outline" />
);

const RenderEditIcon = props => (
  <Icon {...props} name="edit-outline" />
);

function Percentage(props) {
  const {t} = useTranslation();
  const themeContext = useContext(ThemeContext);
  const theme = useTheme();
  const {
    disabled = false,
    navigation = {},
    language = 'vi',
    refreshToken = '',
    onStartUpdate = () => null,
    onEndUpdate = () => null,
  } = props;
  let curStatus = props.task.statusName;
  let curPercent = props.task.percentage;

  /** Use redux */
  const dispatch = useDispatch();
  const projectState = useSelector(({projectManagement}) => projectManagement);

  /** Use state */
  const [submitComment, setSubmitComment] = useState(false);
  const [percent, setPercent] = useState({
    visible: false,
    value: 0,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleChangePercent = () => {
    if (percent.visible) {
      if (percent.value < 0 || percent.value > 100) {
        alert(t, 'project_management:warning_input_percent', () =>
          percentRef.focus(),
        );
      } else if (Number(percent.value) === 100) {
        alert(t, 'project_management:confirm_change_to_100', () =>
          onFetchPercent(true),
        );
      } else {
        if (Number(percent.value) === props.task.percentage) {
          return setPercent({...percent, visible: !percent.visible});
        }
        onFetchPercent(false);
      }
    } else {
      return setPercent({...percent, visible: !percent.visible});
    }
  };

  const onFetchPercent = isFinished => {
    onStartUpdate();
    let params = {
      TaskID: props.task.taskID,
      StatusID: isFinished
      ? Commons.STATUS_TASK["5"]["value"]
      : props.task.statusID,
      Percentage: percent.value,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchUpdateTask(params, navigation));
  };

  const onUpdateActivities = () => {
    let taskDetail = projectState.get('taskDetail');
    let comment = '';
    if (taskDetail.percentage === 100) {
      comment = `* ${t('project_management:status_filter').toUpperCase()} ${t(
        'project_management:holder_change_from',
      )} ${curStatus} ${t('project_management:holder_change_to')} ${
        taskDetail.statusName
      }.\n* ${t('project_management:holder_task_percentage').toUpperCase()} ${t(
        'project_management:holder_change_from',
      )} ${curPercent} ${t('project_management:holder_change_to')} ${
        taskDetail.percentage
      }.`;
    } else {
      comment = `* ${t(
        'project_management:holder_task_percentage',
      ).toUpperCase()} ${t(
        'project_management:holder_change_from',
      )} ${curPercent} ${t('project_management:holder_change_to')} ${
        taskDetail.percentage
      }.`;
    }

    let paramsActivities = {
      LineNum: 0,
      TaskID: props.task.taskID,
      Comments: comment,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskComment(paramsActivities, navigation));
    setSubmitComment(false);
    curPercent = taskDetail.percentage;
  };

  const handleClosePercent = () => {
    setPercent({visible: !percent.visible, value: props.task.percentage});
  };

  /**********
   ** FUNC **
   **********/
  const onChangePercent = value => {
    setPercent({...percent, value: Number(value) + ''});
  };

  const onNotification = isSuccess => {
    let des = isSuccess
      ? 'success:change_percent'
      : projectState.get('errorHelperTaskUpdate');
    let type = isSuccess ? 'success' : 'danger';
    if (!isSuccess) {
      setPercent({...percent, value: props.task.percentage});
    }
    onEndUpdate(isSuccess);
    return showMessage({
      message: t(isSuccess ? 'success:title' : 'error:title'),
      description: isSuccess ? t(des) : des,
      type,
      icon: type,
    });
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    setPercent({...percent, value: props.task.percentage});
  }, [props.task.percentage]);

  useEffect(() => {
    if (percent.visible) {
      percentRef.focus();
    }
  }, [percent.visible]);

  useEffect(() => {
    if (!projectState.get('submittingTaskUpdate')) {
      if (projectState.get('successTaskUpdate')) {
        dispatch(Actions.resetAllProject());
        if (!submitComment) {
          setSubmitComment(true);
          onUpdateActivities();
        }
        return onNotification(true);
      }

      if (projectState.get('errorTaskUpdate')) {
        return onNotification(false);
      }
    }
  }, [
    submitComment,
    Actions.resetAllProject,
    projectState.get('submittingTaskUpdate'),
    projectState.get('successTaskUpdate'),
    projectState.get('errorTaskUpdate'),
  ]);
  
  /************
   ** RENDER **
   ************/
  const isDisable =
    props.task.statusID == Commons.STATUS_TASK["5"]["value"] ||
    props.task.statusID == Commons.STATUS_TASK["6"]["value"] ||
    props.task.statusID == Commons.STATUS_TASK["7"]["value"];
  return (
    <View style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
      {!percent.visible ? (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
          <View
            style={[
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.ml3,
              cStyles.mr5,
              cStyles.flex1,
            ]}>
            <View
              style={[
                cStyles.flex1,
                cStyles.justifyCenter,
                cStyles.rounded1,
                cStyles.borderAll,
                styles.percent_active,
                {borderColor: 'grey'}
              ]}
            />
            <View
              style={[
                cStyles.abs,
                cStyles.roundedTopLeft5,
                cStyles.roundedBottomLeft5,
                cStyles.itemsEnd,
                cStyles.justifyCenter,
                styles.percent_body,
                percent.value === 100 && cStyles.roundedTopRight5,
                percent.value === 100 && cStyles.roundedBottomRight5,
                {
                  width: `${percent.value}%`,
                  backgroundColor:
                    !props.task.isUpdated || isDisable
                      ? theme['text-hint-color']
                      : theme['color-primary-500'],
                },
              ]}>
              {percent.value > 35 && (
                <Text category="c1" status="control" style={cStyles.mr5}>{`${percent.value}%`}</Text>
              )}
            </View>
            <View
              style={[
                cStyles.abs,
                cStyles.right0,
                cStyles.roundedTopRight5,
                cStyles.roundedBottomRight5,
                cStyles.itemsStart,
                cStyles.justifyCenter,
                styles.con_percent,
                {width: `${100 - percent.value}%`},
                percent.value === 0 && cStyles.roundedTopLeft5,
                percent.value === 0 && cStyles.roundedBottomLeft5,
              ]}>
              {percent.value <= 35 && (
                <Text
                  category="c1"
                  style={[
                    cStyles.textCenter,
                    cStyles.ml5,
                    {
                      color:
                        !props.task.isUpdated || isDisable
                        ? theme['text-hint-color']
                        : theme['color-primary-500']
                    }]
                  }>
                  {`${percent.value}%`}</Text>
              )}
            </View>
          </View>
          {props.task.isUpdated && !isDisable && 
            <Button
              style={cStyles.ml5}
              size="tiny"
              disabled={disabled}
              accessoryLeft={RenderEditIcon}
              onPress={handleChangePercent} />
            }
        </View>
      ) : (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
          <View
            style={[
              cStyles.flex1,
              cStyles.px4,
              cStyles.rounded1,
              cStyles.justifyCenter,
              styles.percent_input,
            ]}>
            <Input
              ref={ref => (percentRef = ref)}
              autoFocus
              selectTextOnFocus
              blurOnSubmit
              placeholder={t('project_management:holder_task_percentage')}
              value={percent.value + ''}
              keyboardAppearance={themeContext.themeApp}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              onChangeText={onChangePercent}
              onSubmitEditing={handleChangePercent}
            />
          </View>
          <Button
            style={cStyles.mx5}
            size="tiny"
            status="success"
            accessoryLeft={RenderCheckIcon}
            onPress={handleChangePercent}
          />
          <Button
            size="tiny"
            status="danger"
            accessoryLeft={RenderCloseIcon}
            onPress={handleClosePercent}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  percent_active: {height: moderateScale(16)},
  percent_body: {height: moderateScale(16)},
  percent_input: {width: '40%', height: moderateScale(45)},
  con_percent: {height: moderateScale(16)},
});

Percentage.propTypes = {
  disabled: PropTypes.bool,
  task: PropTypes.object,
  navigation: PropTypes.object,
  language: PropTypes.string,
  refreshToken: PropTypes.string,
  onStartUpdate: PropTypes.func,
  onEndUpdate: PropTypes.func,
};

export default Percentage;
