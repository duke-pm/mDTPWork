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
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
/* COMPONENTS */
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CActionSheet from '~/components/CActionSheet';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import {Commons, Icons} from '~/utils/common';
import {colors, cStyles} from '~/utils/style';
import {alert, moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All refs use in this screen */
const asStatusRef = createRef();

function Status(props) {
  const {t} = useTranslation();
  const {
    disabled = false,
    isUpdate = false,
    isDark = false,
    customColors = {},
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
  const [loading, setLoading] = useState(false);
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
      status.data[status.active].statusID === Commons.STATUS_TASK.CLOSED.value
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
        let params = {
          TaskID: props.task.taskID,
          StatusID: status.data[status.active].statusID,
          Percentage: isFinished ? 100 : props.task.percentage,
          Lang: language,
          RefreshToken: refreshToken,
        };
        dispatch(Actions.fetchUpdateTask(params, navigation));
        setLoading(true);
        onStartUpdate();
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
    if (taskDetail.statusID === Commons.STATUS_TASK.CLOSED.value) {
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
    curStatus = taskDetail.statusName;
    if (taskDetail.statusID === Commons.STATUS_TASK.REJECTED.value) {
      setIsEdit(false);
    }
    return;
  };

  const onChangeStatus = index => {
    setStatus({...status, active: index});
  };

  const onPrepareUpdate = isSuccess => {
    let des = isSuccess
      ? 'success:change_status'
      : projectState.get('errorHelperTaskUpdate');
    let type = isSuccess ? 'success' : 'danger';
    onEndUpdate(isSuccess);
    setLoading(false);
    return showMessage({
      message: t('common:app_name'),
      description: isSuccess ? t(des) : des,
      type,
      icon: type,
    });
  };

  const onPrepareStatus = () => {
    let moderateScaletatus = status.data.findIndex(
      f => f.statusID === props.task.statusID,
    );
    if (moderateScaletatus !== -1) {
      setStatus({...status, active: moderateScaletatus});
      curStatus = status.data[moderateScaletatus].statusName;
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onPrepareStatus();
  }, [props.task.statusID]);

  useEffect(() => {
    if (loading) {
      if (!projectState.get('submittingTaskUpdate')) {
        if (projectState.get('successTaskUpdate')) {
          onUpdateActivities();
          return onPrepareUpdate(true);
        }

        if (projectState.get('errorTaskUpdate')) {
          onPrepareStatus();
          return onPrepareUpdate(false);
        }
      }
    }
  }, [
    loading,
    projectState.get('submittingTaskUpdate'),
    projectState.get('successTaskUpdate'),
    projectState.get('errorTaskUpdate'),
  ]);

  /************
   ** RENDER **
   ************/
  return (
    <View>
      <TouchableOpacity
        disabled={!isUpdate || disabled}
        onPress={handleShowChangeStatus}>
        <View
          style={[
            cStyles.mt10,
            cStyles.mx16,
            cStyles.px16,
            cStyles.py12,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.rounded1,
            {backgroundColor: props.task.colorCode},
            isDark && {backgroundColor: props.task.colorOpacityCode},
          ]}>
          <CText
            customStyles={[
              cStyles.textHeadline,
              {color: isDark ? props.task.colorDarkCode : colors.WHITE},
            ]}
            customLabel={props.task.statusName.toUpperCase()}
          />
          {loading ? (
            <CActivityIndicator color={colors.WHITE} />
          ) : (
            isEdit &&
            isUpdate && (
              <CIcon
                name={Icons.down}
                customColor={isDark ? props.task.colorDarkCode : colors.WHITE}
                size={'medium'}
              />
            )
          )}
        </View>
      </TouchableOpacity>

      <CActionSheet
        actionRef={asStatusRef}
        headerChoose
        onConfirm={handleChangeStatus}
        onClose={onCloseActionSheet}>
        <Picker
          style={[cStyles.justifyCenter, styles.con_action]}
          itemStyle={{
            fontSize: moderateScale(21),
            color: customColors.text,
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
  isDark: PropTypes.bool,
  customColors: PropTypes.object,
  language: PropTypes.string,
  refreshToken: PropTypes.string,
  navigation: PropTypes.object,
  task: PropTypes.object,
  onStartUpdate: PropTypes.func,
  onEndUpdate: PropTypes.func,
};

export default Status;
