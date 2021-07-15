/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Status
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Status.js
 **/
import React, {createRef, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {showMessage} from 'react-native-flash-message';
import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
import CActionSheet from '~/components/CActionSheet';
import CActivityIndicator from '~/components/CActivityIndicator';
/* COMMON */
import Icons from '~/config/Icons';
import Commons from '~/utils/common/Commons';
import {colors, cStyles} from '~/utils/style';
import {alert, moderateScale} from '~/utils/helper';
/* REDUX */
import * as Actions from '~/redux/actions';

/** All refs use in this screen */
const actionSheetStatusRef = createRef();

function Status(props) {
  const {t} = useTranslation();
  const {
    disabled,
    isUpdate,
    isDark,
    customColors,
    language,
    refreshToken,
    navigation,
    onUpdate,
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
  const handleShowChangeStatus = () => {
    actionSheetStatusRef.current?.show();
  };

  const handleChangeStatus = needUpdate => {
    if (
      status.data[status.active].statusID === Commons.STATUS_TASK.CLOSED.value
    ) {
      alert(t, 'project_management:confirm_change_to_finished', () =>
        onCloseActionSheet(needUpdate, true),
      );
    } else {
      onCloseActionSheet(needUpdate, false);
    }
  };

  /************
   ** FUNC **
   ************/
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
    if (isSuccess) {
      onUpdate();
    }
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

  /******************
   ** LIFE CYCLE **
   ******************/
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

  /**************
   ** RENDER **
   **************/
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
            cStyles.py16,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.rounded2,
            {backgroundColor: props.task.colorCode},
            isDark && {backgroundColor: props.task.colorOpacityCode},
          ]}>
          <CText
            customStyles={[
              cStyles.textTitle,
              {color: isDark ? props.task.colorDarkCode : colors.WHITE},
            ]}
            customLabel={props.task.statusName.toUpperCase()}
          />
          {loading ? (
            <CActivityIndicator />
          ) : (
            isEdit &&
            isUpdate && (
              <Icon
                name={Icons.down}
                color={isDark ? props.task.colorDarkCode : colors.WHITE}
                size={moderateScale(21)}
              />
            )
          )}
        </View>
      </TouchableOpacity>

      <CActionSheet
        actionRef={actionSheetStatusRef}
        headerChoose
        onConfirm={handleChangeStatus}
        onClose={onCloseActionSheet}>
        <Picker
          style={[cStyles.justifyCenter, styles.con_action]}
          itemStyle={{color: customColors.text, fontSize: moderateScale(20)}}
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

export default Status;
