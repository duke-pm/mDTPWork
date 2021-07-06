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
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CText from '~/components/CText';
import CActionSheet from '~/components/CActionSheet';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {fS, sH} from '~/utils/helper';
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
    task,
    onUpdate,
  } = props;
  let curStatus = task.statusName;

  /** Use redux */
  const dispatch = useDispatch();
  const masterState = useSelector(({masterData}) => masterData);
  const projectState = useSelector(({projectManagement}) => projectManagement);
  const statusMaster = masterState.get('projectStatus');

  /** Use state */
  const [loading, setLoading] = useState(false);
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

  const handleChangeStatus = () => {
    actionSheetStatusRef.current?.hide();
  };

  /************
   ** FUNC **
   ************/
  const onCloseActionSheet = needUpdate => {
    if (needUpdate) {
      if (status.data[status.active].statusID !== task.statusID) {
        let params = {
          TaskID: task.taskID,
          StatusID: status.data[status.active].statusID,
          Percentage: task.percentage,
          Lang: language,
          RefreshToken: refreshToken,
        };
        dispatch(Actions.fetchUpdateTask(params, navigation));
        setLoading(true);
      }
    } else {
      let find = status.data.findIndex(f => f.statusID === task.statusID);
      if (find !== -1) {
        setStatus({...status, active: find});
      }
    }
  };

  const onUpdateActivities = () => {
    let paramsActivities = {
      LineNum: 0,
      TaskID: task.taskID,
      Comments: `* ${t('project_management:status_filter').toUpperCase()} ${t(
        'project_management:holder_change_from',
      )} ${curStatus} ${t('project_management:holder_change_to')} ${
        status.data[status.active].statusName
      }.`,
      Lang: language,
      RefreshToken: refreshToken,
    };
    dispatch(Actions.fetchTaskComment(paramsActivities, navigation));
    curStatus = status.active;
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
    let fStatus = status.data.findIndex(f => f.statusID === task.statusID);
    if (fStatus !== -1) {
      setStatus({...status, active: fStatus});
      curStatus = status.data[fStatus].statusName;
    }
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    onPrepareStatus();
  }, []);

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
            cStyles.mt16,
            cStyles.mx16,
            cStyles.px16,
            cStyles.py10,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.rounded1,
            {backgroundColor: task.colorCode},
            isDark && {backgroundColor: task.colorOpacityCode},
          ]}>
          <CText
            customStyles={[
              cStyles.fontBold,
              {
                color: isDark ? task.colorDarkCode : colors.WHITE,
              },
            ]}
            customLabel={task.statusName.toUpperCase()}
          />
          {loading ? (
            <ActivityIndicator
              color={isDark ? colors.GRAY_200 : colors.WHITE}
            />
          ) : (
            isUpdate && (
              <Icon
                name={'chevron-down'}
                color={isDark ? task.colorDarkCode : colors.WHITE}
                size={fS(23)}
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
          style={styles.con_action}
          itemStyle={{color: customColors.text, fontSize: fS(20)}}
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
  con_action: {width: '100%', height: sH('35%')},
});

export default Status;
