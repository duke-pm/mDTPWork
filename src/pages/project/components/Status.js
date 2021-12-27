/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Status
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Status.js
 **/
import PropTypes from 'prop-types';
import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {Button, useTheme} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
/* COMPONENTS */
import CActionSheet from '~/components/CActionSheet';
/* COMMON */
import {Commons} from '~/utils/common';
import {cStyles} from '~/utils/style';
import {alert, moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All ref */
const asStatusRef = createRef();

function Status(props) {
  const {t} = useTranslation();
  const theme = useTheme();
  const {
    disabled = false,
    isUpdate = false,
    language = 'vi',
    refreshToken = '',
    navigation = {},
    onStartUpdate = () => null,
    onEndUpdate = () => null,
  } = props;
  let curStatus = props.task.statusName;
  let curPercent = props.task.percentage;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const statusMaster = masterState.get('projectStatus');

  /** Use state */
  const [submitComment, setSubmitComment] = useState(false);
  const [isEdit, setIsEdit] = useState(true);
  const [status, setStatus] = useState({
    data: statusMaster,
    active: 0,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleShowChangeStatus = () => asStatusRef.current?.show();

  const handleChangeStatus = needUpdate => {
    if (
      status.data[status.active].statusID === Commons.STATUS_TASK["5"]["value"]
    ) {
      return alert(t, 'project_management:confirm_change_to_finished', () =>
        onCloseActionSheet(needUpdate, true),
      );
    } else {
      return onCloseActionSheet(needUpdate, false);
    }
  };

  /**********
   ** FUNC **
   **********/
  const onCloseActionSheet = (needUpdate, isFinished) => {
    if (needUpdate) {
      if (status.data[status.active].statusID !== props.task.statusID) {
        onStartUpdate();
        let params = {
          TaskID: props.task.taskID,
          StatusID: status.data[status.active].statusID,
          Percentage: isFinished ? 100 : props.task.percentage,
          Lang: language,
          RefreshToken: refreshToken,
        };
        dispatch(Actions.fetchUpdateTask(params, navigation));
      }
    } else {
      let find = status.data.findIndex(f => f.statusID === props.task.statusID);
      if (find !== -1) {
        setStatus({...status, active: find});
      }
    }
  };

  const onUpdateActivities = () => {
    let taskDetail = projectState.get('taskDetail');
    let comment = '';
    if (taskDetail.statusID === Commons.STATUS_TASK["5"]["value"]) {
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
      comment = `* ${t('project_management:status_filter').toUpperCase()} ${t(
        'project_management:holder_change_from',
      )} ${curStatus} ${t('project_management:holder_change_to')} ${
        taskDetail.statusName
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
    curStatus = taskDetail.statusName;
    if (taskDetail.statusID === Commons.STATUS_TASK["7"]["value"]) {
      setIsEdit(false);
    }
  };

  const onChangeStatus = index => {
    setStatus({...status, active: index});
  };

  const onNotification = isSuccess => {
    let des = isSuccess
      ? 'success:change_status'
      : projectState.get('errorHelperTaskUpdate');
    let type = isSuccess ? 'success' : 'danger';
    onEndUpdate(isSuccess);
    return showMessage({
      message: t(isSuccess ? 'success:title' : 'error:title'),
      description: isSuccess ? t(des) : des,
      type,
      icon: type,
    });
  };

  const onPrepareStatus = () => {
    let tmpStatus = status.data.findIndex(
      f => f.statusID === props.task.statusID,
    );
    if (tmpStatus !== -1) {
      setStatus({...status, active: tmpStatus});
      curStatus = status.data[tmpStatus].statusName;
      if (status.data[tmpStatus].statusID === Commons.STATUS_TASK["7"]["value"]) {
        setIsEdit(false);
      }
    }
  };

  const onCheckStatus = () => {
    dispatch(Actions.resetAllProject());
    let taskDetail = projectState.get('taskDetail');
    if (taskDetail.statusID === Commons.STATUS_TASK["7"]["value"]) {
      setIsEdit(false);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onCheckStatus(), []);

  useEffect(() => onPrepareStatus(), [props.task.statusID]);

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
        onPrepareStatus();
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
  return (
    <View>
      <Button
        disabled={disabled}
        status={Commons.STATUS_TASK[props.task.statusID + '']['color']}
        onPress={(isUpdate && isEdit)
          ? handleShowChangeStatus
          : undefined
        }>
        {props.task.statusName}
      </Button>

      <CActionSheet
        actionRef={asStatusRef}
        headerChoose
        onConfirm={handleChangeStatus}
        onClose={onCloseActionSheet}>
        <Picker
          style={[cStyles.justifyCenter, styles.con_action]}
          itemStyle={{
            fontSize: moderateScale(21),
            color: theme['text-basic-color'],
          }}
          selectedValue={status.active}
          onValueChange={onChangeStatus}>
          {status.data.map((value, i) => (
            <Picker.Item
              key={value.statusID}
              label={value.statusName}
              value={i}
            />
          ))}
        </Picker>
      </CActionSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  con_action: {width: '100%', height: moderateScale(200)},
});

Status.propTypes = {
  disabled: PropTypes.bool,
  isUpdate: PropTypes.bool,
  language: PropTypes.string,
  refreshToken: PropTypes.string,
  navigation: PropTypes.object,
  task: PropTypes.object,
  onStartUpdate: PropTypes.func,
  onEndUpdate: PropTypes.func,
};

export default Status;