/**
 ** Name: Reminder
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Reminder.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {
  View,
  Linking,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CDateTimePicker from '~/components/CDateTimePicker';
import CAlert from '~/components/CAlert';
import {RowInfoBasic} from '../detail/Task';
/* COMMON */
import Icons from '~/config/Icons';
import Configs from '~/config';
import {
  IS_IOS,
  IS_ANDROID,
  moderateScale,
  alert,
  getLocalInfo,
  saveLocalInfo,
} from '~/utils/helper';
import {cStyles} from '~/utils/style';
import {DTP_CALENDAR} from '~/config/constants';
import CActivityIndicator from '~/components/CActivityIndicator';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const formatShowDate = 'DD/MM/YYYY HH:mm';
const formatDateTime = 'YYYY-MM-DD HH:mm';
const formatDataDateTime = 'YYYY-MM-DDTHH:mm:ss';
const formatAlertDateTime = IS_IOS
  ? 'YYYY-MM-DDTHH:mm:00.000Z'
  : 'YYYY-MM-DDTHH:mm:ss.sss[Z]';
const CustomLayoutAnimated = {
  duration: 500,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 1,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7,
  },
};
const dataAndroidAlarms = [
  {
    value: 5,
    label: 'project_management:five_minutes',
  },
  {
    value: 10,
    label: 'project_management:ten_minutes',
  },
  {
    value: 15,
    label: 'project_management:fifteen_minutes',
  },
  {
    value: 30,
    label: 'project_management:thirty_minutes',
  },
  {
    value: 60,
    label: 'project_management:sixty_minutes',
  },
  {
    value: 1440,
    label: 'project_management:one_day',
  },
  {
    value: 10080,
    label: 'project_management:one_week',
  },
];

function Reminder(props) {
  const {task, t, isDark, customColors} = props;
  const notes = t('project_management:note_update_task');
  const notes_2 = t('project_management:note_update_task_2');

  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [dataAlarmAndroid, setDataAlarmAndroid] = useState([]);
  const [alarmsAndroid, setAlarmsAndroid] = useState([]);
  const [pickerDate, setPickerDate] = useState({
    start: moment(task.startDate, formatDataDateTime).format(formatDateTime),
    end: moment(task.endDate, formatDataDateTime).format(formatDateTime),
  });
  const [reminder, setReminder] = useState({
    calendar: null,
    event: null,
    data: null,
  });

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleToggleReminder = () => {
    LayoutAnimation.configureNext(CustomLayoutAnimated);
    setShowReminder(!showReminder);
  };

  const handleUpdateEvent = async () => {
    let notesResult = '',
      url = '';
    if (__DEV__) {
      url =
        Configs.prefixesDev[IS_IOS ? 1 : 0] +
        (IS_ANDROID ? '/' : '') +
        Configs.routePath.TaskDetail.split(':')[0] +
        task.taskID;
    } else {
      url =
        Configs.prefixesProd[IS_IOS ? 1 : 0] +
        (IS_ANDROID ? '/' : '') +
        Configs.routePath.TaskDetail.split(':')[0] +
        task.taskID;
    }
    notesResult = notes + url + notes_2;
    try {
      let title = t('project_management:title_update_task') + task.taskID;
      let dataEvent = {
        calendarId: reminder.calendar,
        title,
        startDate: moment(task.startDate, formatDataDateTime).format(
          formatAlertDateTime,
        ),
        endDate: moment(pickerDate.end).format(formatAlertDateTime),
        notes: notesResult,
        description: notesResult,
        url,
        allDay: false,
      };
      if (reminder.event) {
        dataEvent.id = reminder.event;
      }
      if (IS_IOS) {
        dataEvent.alarms = [
          {date: moment(pickerDate.start).format(formatAlertDateTime)},
          {date: moment(pickerDate.end).format(formatAlertDateTime)},
        ];
      } else {
        dataEvent.alarms = [];
        let item;
        for (item of alarmsAndroid) {
          dataEvent.alarms.push({
            date: moment.duration(item.value, 'minutes').asMinutes(),
          });
        }
        setDataAlarmAndroid(alarmsAndroid);
      }
      let newEventID = await RNCalendarEvents.saveEvent(title, dataEvent);
      await onSaveLocal(reminder.calendar, task.taskID, newEventID);
      setReminder({...reminder, event: newEventID, data: dataEvent});
      handleToggleReminder();
    } catch (e) {
      console.log('[LOG] === error create event ===> ', e);
    }
  };

  const handleChangeAlarmAndroid = (alarmChoose, action) => {
    let tmp = [...alarmsAndroid],
      idx = tmp.findIndex(f => f.value === alarmChoose.value);
    if (!action) {
      tmp.splice(idx, 1);
    } else {
      tmp.push(alarmChoose);
    }
    setAlarmsAndroid(tmp);
  };

  /**********
   ** FUNC **
   **********/
  const onTogglePicker = () => setShowPicker(!showPicker);
  const onToggleAlert = () => setShowAlert(!showAlert);

  const onRequestPermission = async () => {
    await RNCalendarEvents.requestPermissions();
    onCheckPermission();
  };

  const onCheckPermission = async () => {
    let permission = await RNCalendarEvents.checkPermissions();
    if (permission === 'authorized') {
      onCheckLocalRemind();
    } else if (permission === 'denied') {
      alert(
        t,
        'You need request Calendar permission to Grant in Settings',
        () => Linking.openURL('app-settings:'),
      );
    } else {
      onRequestPermission();
    }
  };

  const onCheckLocalRemind = async () => {
    if (!reminder.calendar) {
      let dtpCalendar = await getLocalInfo(DTP_CALENDAR);
      if (dtpCalendar) {
        let find = dtpCalendar.events.find(f => f.task === task.taskID);
        if (find) {
          if (find.id) {
            let event = await RNCalendarEvents.findEventById(find.id);
            if (event && event.alarms.length > 0) {
              if (IS_IOS) {
                let tmp = event.alarms[0].date;
                if (
                  moment(event.alarms[0].date).format(formatAlertDateTime) ===
                  moment(pickerDate.end).format(formatAlertDateTime)
                ) {
                  tmp = event.alarms[1].date;
                }
                setPickerDate({
                  ...pickerDate,
                  start: moment(tmp, formatAlertDateTime).format(
                    formatDateTime,
                  ),
                });
              } else {
                let tmpAlarmsAndroid = [],
                  item,
                  minute,
                  findAlarm;
                for (item of event.alarms) {
                  minute = moment(item.date, formatAlertDateTime).minutes();
                  findAlarm = dataAndroidAlarms.find(f => f.value == minute);
                  if (findAlarm) {
                    tmpAlarmsAndroid.push(findAlarm);
                  }
                }
                setDataAlarmAndroid(tmpAlarmsAndroid);
                setAlarmsAndroid(tmpAlarmsAndroid);
              }
              setReminder({
                calendar: dtpCalendar.calendar,
                event: find.id,
                data: event,
              });
              onDone();
            } else {
              setReminder({
                ...reminder,
                calendar: dtpCalendar.calendar,
              });
            }
          } else {
            setReminder({
              ...reminder,
              calendar: dtpCalendar.calendar,
            });
            onDone();
          }
        } else {
          await onSaveLocal(dtpCalendar.calendar, task.taskID, null);
          setReminder({...reminder, calendar: dtpCalendar.calendar});
          onDone();
        }
      } else {
        let calendars = await RNCalendarEvents.findCalendars();
        if (calendars.length > 0) {
          let findCalendar = null;
          if (IS_IOS) {
            findCalendar = calendars.find(f => f.title === 'DTP Work');
          } else {
            findCalendar = calendars.find(f => f.isPrimary === true);
          }
          if (!findCalendar) {
            dtpCalendar = {
              title: 'DTP Work',
              color: 'red',
              entityType: 'event',
            };
            if (IS_ANDROID) {
              dtpCalendar.name = 'DTP Work';
              dtpCalendar.accessLevel = 'override';
              dtpCalendar.ownerAccount = 'OWNER_ACCOUNT';
              dtpCalendar.source = {
                name: IS_IOS ? calendars[0].source : findCalendar.source,
                type: IS_IOS ? calendars[0].type : findCalendar.type,
              };
            }
            try {
              let idCalendar = await RNCalendarEvents.saveCalendar(dtpCalendar);
              setReminder({...reminder, calendar: idCalendar});
              await onSaveLocal(idCalendar, task.taskID, null);
              onDone();
            } catch (e) {
              console.log('[LOG] === error create calendar ===> ', e);
              onDone();
            }
          } else {
            setReminder({...reminder, calendar: findCalendar.id});
            await onSaveLocal(findCalendar.id, task.taskID, null);
            onDone();
          }
        }
      }
    } else {
      onDone();
    }
  };

  const onDone = () => {
    setLoading(false);
  };

  const onSaveLocal = async (calendarID, taskID, eventID) => {
    let checkLocal = await getLocalInfo(DTP_CALENDAR);
    if (checkLocal) {
      let findEvent = checkLocal.events.findIndex(f => f.task === taskID);
      if (findEvent !== -1) {
        checkLocal.events[findEvent].id = eventID;
      } else {
        checkLocal.events.push({task: taskID, id: eventID});
      }
    } else {
      checkLocal = {
        calendar: calendarID,
        events: [{task: taskID, id: eventID}],
      };
    }
    await saveLocalInfo({
      key: DTP_CALENDAR,
      value: checkLocal,
    });
  };

  const onChangeDateRequest = newDate => {
    if (newDate) {
      setPickerDate({
        ...pickerDate,
        start: moment(newDate).format(formatDateTime),
      });
    }
    onTogglePicker();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    onCheckPermission();
  }, []);

  /************
   ** RENDER **
   ************/
  const dateTime = {
    maximun: new Date(
      moment(pickerDate.end).year(),
      moment(pickerDate.end).month(),
      moment(pickerDate.end).date(),
      moment(pickerDate.end).hours(),
      moment(pickerDate.end).minutes(),
    ),
    value: new Date(
      moment(pickerDate.start).year(),
      moment(pickerDate.start).month(),
      moment(pickerDate.start).date(),
      moment(pickerDate.start).hours(),
      moment(pickerDate.start).minutes(),
    ),
  };
  if (loading) {
    return <CActivityIndicator />;
  }
  console.log('[LOG] === RENDER ===> ', dataAlarmAndroid);
  return (
    <>
      <RowInfoBasic
        isDark={isDark}
        left={<CText label={'project_management:reminder_task'} />}
        right={
          IS_IOS ? (
            <View>
              <CText
                style={[
                  cStyles.textRight,
                  cStyles.textBody,
                  {color: customColors.text},
                ]}
                customLabel={
                  !reminder.data
                    ? t('project_management:none_reminder')
                    : moment(
                        reminder.data.alarms[1].date,
                        formatAlertDateTime,
                      ).format(formatShowDate)
                }
              />
              {reminder.data && (
                <CText
                  style={[
                    cStyles.textRight,
                    cStyles.textBody,
                    {color: customColors.text},
                  ]}
                  customLabel={
                    !reminder.data
                      ? t('project_management:none_reminder')
                      : moment(
                          reminder.data.alarms[0].date,
                          formatAlertDateTime,
                        ).format(formatShowDate)
                  }
                />
              )}
            </View>
          ) : (
            <View>
              {dataAlarmAndroid.length === 0 && (
                <CText
                  style={[
                    cStyles.textRight,
                    cStyles.textBody,
                    {color: customColors.text},
                  ]}
                  customLabel={t('project_management:none_reminder')}
                />
              )}
              {dataAlarmAndroid.length > 0 &&
                dataAlarmAndroid.map(item => {
                  return <CText label={item.label} />;
                })}
            </View>
          )
        }
        iconOnPress={
          <Icon
            style={cStyles.pl10}
            name={Icons.alarm}
            size={moderateScale(18)}
            color={customColors.red}
          />
        }
        onPress={!showReminder ? handleToggleReminder : null}
      />

      {showReminder && (
        <View
          style={[
            cStyles.flex1,
            cStyles.rounded1,
            cStyles.px10,
            cStyles.pb16,
            {backgroundColor: customColors.textInput},
          ]}>
          <View
            style={[
              cStyles.pt16,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
            ]}>
            <TouchableOpacity
              style={cStyles.p10}
              onPress={handleToggleReminder}>
              <Icon
                name={Icons.close}
                size={moderateScale(21)}
                color={customColors.red}
              />
            </TouchableOpacity>
            <TouchableOpacity style={cStyles.p10} onPress={handleUpdateEvent}>
              <Icon
                name={Icons.doubleCheck}
                size={moderateScale(21)}
                color={customColors.primary}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              cStyles.py10,
              cStyles.row,
              cStyles.itemsCenter,
              cStyles.justifyBetween,
            ]}>
            <CText label={'project_management:date_time_alert'} />
            <TouchableOpacity onPress={IS_IOS ? onTogglePicker : onToggleAlert}>
              {IS_IOS && (
                <CText
                  customLabel={moment(pickerDate.start).format(formatShowDate)}
                />
              )}
              {IS_ANDROID &&
                alarmsAndroid.length > 0 &&
                alarmsAndroid.map(item => {
                  return <CText label={item.label} />;
                })}
              {IS_ANDROID && (
                <CText
                  customStyles={[
                    cStyles.mt10,
                    cStyles.textCaption1,
                    cStyles.textUnderline,
                    {color: customColors.primary},
                  ]}
                  label={'common:reset'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CAlert
        show={showAlert}
        title={t('project_management:title_choose_alarms')}
        customContent={
          <View style={cStyles.p16}>
            {dataAndroidAlarms.map(item => {
              let isChoose = alarmsAndroid.find(f => f.value === item.value);
              return (
                <TouchableOpacity
                  onPress={() =>
                    handleChangeAlarmAndroid(item, isChoose ? false : true)
                  }>
                  <View
                    style={[cStyles.row, cStyles.itemsCenter, cStyles.py10]}>
                    <View style={cStyles.px16}>
                      {isChoose ? (
                        <Icon
                          name={Icons.dot}
                          size={moderateScale(18)}
                          color={customColors.primary}
                        />
                      ) : (
                        <Icon
                          name={Icons.circle}
                          size={moderateScale(18)}
                          color={customColors.icon}
                        />
                      )}
                    </View>
                    <CText label={item.label} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        }
        onOK={onToggleAlert}
      />

      {/** Date Picker */}
      <CDateTimePicker
        show={showPicker}
        date={dateTime.value}
        minimumDate={new Date()}
        maximumDate={dateTime.maximun}
        mode={'datetime'}
        onChangeDate={onChangeDateRequest}
      />
    </>
  );
}

export default Reminder;
