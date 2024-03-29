/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Reminder
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Reminder.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {
  View,
  Linking,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
import CDateTimePicker from '~/components/CDateTimePicker';
import CActivityIndicator from '~/components/CActivityIndicator';
import CAlert from '~/components/CAlert';
import CIcon from '~/components/CIcon';
import {RowInfoBasic} from '../detail/Task';
/* COMMON */
import Configs from '~/config';
import Icons from '~/utils/common/Icons';
import {DTP_CALENDAR, DEFAULT_FORMAT_DATE_4} from '~/config/constants';
import {cStyles} from '~/utils/style';
import {
  IS_IOS,
  IS_ANDROID,
  alert,
  getLocalInfo,
  saveLocalInfo,
} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const FORMAT_SHOW_DATE = 'DD/MM/YYYY HH:mm';
const FORMAT_DATE_TIME = 'YYYY-MM-DD HH:mm';
const FORMAT_ALERT_DATE_TIME = IS_IOS
  ? 'YYYY-MM-DDTHH:mm:00.000Z'
  : 'YYYY-MM-DDTHH:mm:ss.sss[Z]';
const URL_LINK_TO_APP =
  Configs.prefixesDeepLink[IS_IOS ? 1 : 0] +
  (IS_ANDROID ? '/' : '') +
  Configs.routePath.TaskDetail.split(':')[0];

function Reminder(props) {
  const {task, trans, isDark, customColors} = props;
  const notes = trans('project_management:note_update_task');
  const notes_2 = trans('project_management:note_update_task_2');

  const [loading, setLoading] = useState(true);
  const [showReminder, setShowReminder] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [dataAlarmAndroid, setDataAlarmAndroid] = useState([]);
  const [alarmsAndroid, setAlarmsAndroid] = useState([]);
  const [pickerDate, setPickerDate] = useState({
    start: moment(task.startDate, DEFAULT_FORMAT_DATE_4).format(
      FORMAT_DATE_TIME,
    ),
    end: moment(task.endDate, DEFAULT_FORMAT_DATE_4).format(FORMAT_DATE_TIME),
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowReminder(!showReminder);
  };

  const handleUpdateEvent = async () => {
    let notesResult = '',
      url = URL_LINK_TO_APP + task.taskID;
    notesResult = notes + url + notes_2;
    try {
      let title = trans('project_management:title_update_task') + task.taskID;
      let dataEvent = {
        // For create event
        calendarId: reminder.calendar,
        title,
        startDate: moment(task.startDate, DEFAULT_FORMAT_DATE_4).format(
          FORMAT_ALERT_DATE_TIME,
        ),
        endDate: moment(pickerDate.end).format(FORMAT_ALERT_DATE_TIME),
        notes: notesResult, // available iOS
        description: notesResult, // available Android
        url, // available iOS
        allDay: false,
      };
      if (reminder.event) {
        // For update event
        dataEvent.id = reminder.event;
      }
      if (IS_IOS) {
        dataEvent.alarms = [
          {date: moment(pickerDate.start).format(FORMAT_ALERT_DATE_TIME)},
          {date: moment(pickerDate.end).format(FORMAT_ALERT_DATE_TIME)},
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
      alert(trans, 'project_management:alert_change_permission_calendar', () =>
        Linking.openURL('app-settings:'),
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
                  moment(event.alarms[0].date).format(
                    FORMAT_ALERT_DATE_TIME,
                  ) === moment(pickerDate.end).format(FORMAT_ALERT_DATE_TIME)
                ) {
                  tmp = event.alarms[1].date;
                }
                setPickerDate({
                  ...pickerDate,
                  start: moment(tmp, FORMAT_ALERT_DATE_TIME).format(
                    FORMAT_DATE_TIME,
                  ),
                });
              } else {
                let tmpAlarmsAndroid = [],
                  item,
                  minute,
                  findAlarm;
                for (item of event.alarms) {
                  minute = -moment(task.startDate, DEFAULT_FORMAT_DATE_4).diff(
                    moment(item.date, FORMAT_ALERT_DATE_TIME),
                    'minutes',
                  );
                  findAlarm = Configs.alarmsAndroid.find(
                    f => f.value === minute,
                  );
                  if (findAlarm) {
                    tmpAlarmsAndroid.push(findAlarm);
                  }
                }
                setDataAlarmAndroid(tmpAlarmsAndroid);
                setAlarmsAndroid(tmpAlarmsAndroid);
              }
              onDone({
                calendar: dtpCalendar.calendar,
                event: find.id,
                data: event,
              });
            } else {
              onDone({...reminder, calendar: dtpCalendar.calendar});
            }
          } else {
            onDone({...reminder, calendar: dtpCalendar.calendar});
          }
        } else {
          await onSaveLocal(dtpCalendar.calendar, task.taskID, null);
          onDone({...reminder, calendar: dtpCalendar.calendar});
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
              await onSaveLocal(idCalendar, task.taskID, null);
              onDone({...reminder, calendar: idCalendar});
            } catch (e) {
              console.log('[LOG] === error create calendar ===> ', e);
              onDone();
            }
          } else {
            await onSaveLocal(findCalendar.id, task.taskID, null);
            onDone({...reminder, calendar: findCalendar.id});
          }
        }
      }
    } else {
      onDone();
    }
  };

  const onDone = reminderObj => {
    if (reminderObj) {
      setReminder(reminderObj);
    }
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
    await saveLocalInfo({key: DTP_CALENDAR, value: checkLocal});
  };

  const onChangeDateRequest = newDate => {
    if (newDate) {
      setPickerDate({
        ...pickerDate,
        start: moment(newDate).format(FORMAT_DATE_TIME),
      });
    }
    onTogglePicker();
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => onCheckPermission(), []);

  /************
   ** RENDER **
   ************/
  if (loading) {
    return <CActivityIndicator />;
  }
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
  return (
    <View>
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
                    ? trans('project_management:none_reminder')
                    : moment(
                        reminder.data.alarms[1].date,
                        FORMAT_ALERT_DATE_TIME,
                      ).format(FORMAT_SHOW_DATE)
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
                      ? trans('project_management:none_reminder')
                      : moment(
                          reminder.data.alarms[0].date,
                          FORMAT_ALERT_DATE_TIME,
                        ).format(FORMAT_SHOW_DATE)
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
                  customLabel={trans('project_management:none_reminder')}
                />
              )}
              {dataAlarmAndroid.length > 0 &&
                dataAlarmAndroid.map((item, index) => {
                  return <CText key={index.toString()} label={item.label} />;
                })}
            </View>
          )
        }
        iconOnPress={
          <CIcon
            style={cStyles.pl10}
            name={Icons.alarm}
            size={'small'}
            color={'red'}
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
              <CIcon name={Icons.close} size={'medium'} color={'red'} />
            </TouchableOpacity>
            <TouchableOpacity style={cStyles.p10} onPress={handleUpdateEvent}>
              <CIcon
                name={Icons.doubleCheck}
                size={'medium'}
                color={'primary'}
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
                  customLabel={moment(pickerDate.start).format(
                    FORMAT_SHOW_DATE,
                  )}
                />
              )}
              {IS_ANDROID &&
                alarmsAndroid.length > 0 &&
                alarmsAndroid.map((item, index) => {
                  return <CText key={index.toString()} label={item.label} />;
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

      {IS_ANDROID && (
        <CAlert
          show={showAlert}
          title={trans('project_management:title_choose_alarms')}
          customContent={
            <View style={cStyles.p16}>
              {Configs.alarmsAndroid.map(item => {
                let isChoose = alarmsAndroid.find(f => f.value === item.value);
                return (
                  <TouchableOpacity
                    onPress={() => handleChangeAlarmAndroid(item, !isChoose)}>
                    <View
                      style={[cStyles.row, cStyles.itemsCenter, cStyles.py10]}>
                      <View style={cStyles.px16}>
                        {isChoose ? (
                          <CIcon
                            name={Icons.dot}
                            size={'small'}
                            color={'primary'}
                          />
                        ) : (
                          <CIcon name={Icons.circle} size={'small'} />
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
      )}

      {/** Date Picker */}
      {IS_IOS && (
        <CDateTimePicker
          show={showPicker}
          date={dateTime.value}
          minimumDate={new Date()}
          maximumDate={dateTime.maximun}
          mode={'datetime'}
          onChangeDate={onChangeDateRequest}
        />
      )}
    </View>
  );
}

Reminder.propTypes = {
  trans: PropTypes.func,
  isDark: PropTypes.bool,
  customColors: PropTypes.object,
  task: PropTypes.object,
};

export default Reminder;
