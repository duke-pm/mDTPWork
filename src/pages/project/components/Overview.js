/**
 ** Name: Overview page
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Overview.js
 **/
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Layout, Text, Avatar, Tooltip, Icon, ListItem
} from '@ui-kitten/components';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import 'moment/locale/en-sg';
/* COMPONENTS */
import CAvatar from '~/components/CAvatar';
import CText from '~/components/CText';
import Status from './Status';
import Percentage from './Percentage';
import FileAttach from './FileAttach';
/* COMMON */
import {Commons} from '~/utils/common';
import {cStyles, colors} from '~/utils/style';
import {Assets} from '~/utils/asset';
import {checkEmpty} from '~/utils/helper';
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_9,
} from '~/configs/constants';

const RenderDescriptionIcon = props => (
  <Icon {...props} name="list-outline" />
);

const RenderStatusIcon = props => (
  <Icon {...props} name="flash-outline" />
);

const RenderProjectIcon = props => (
  <Icon {...props} name="credit-card-outline" />
);

const RenderTimeIcon = props => (
  <Icon {...props} name="clock-outline" />
);

const RenderPercentIcon = props => (
  <Icon {...props} name="trending-up-outline" />
);

const RenderPersonIcon = props => (
  <Icon {...props} name="person-outline" />
);

const RenderPeopleIcon = props => (
  <Icon {...props} name="people-outline" />
);

const RenderPiorityIcon = props => (
  <Icon {...props} name="flag-outline" />
);

const RenderSectorIcon = props => (
  <Icon {...props} name="archive-outline" />
);

const RenderGradeIcon = props => (
  <Icon {...props} name="award-outline" />
);

const RenderComponentIcon = props => (
  <Icon {...props} name="book-outline" />
);

const RenderPushlisherIcon = props => (
  <Icon {...props} name="people-outline" />
);

const RenderOwnershipIcon = props => (
  <Icon {...props} name="people-outline" />
);

const RenderFileIcon = props => (
  <Icon {...props} name="file-outline" />
);

const RenderAuthorIcon = props => (
  <Icon {...props} name="person-outline" />
);

const RenderToDate = (delay, data, onPress) => {
  return (
    <TouchableOpacity disabled={delay === 0} onPress={onPress}>
      <Text status={delay > 0 ? 'danger' : 'basic'}>
        {moment(data, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}
      </Text>
    </TouchableOpacity>
  );
}

function Overview(props) {
  const {t} = useTranslation();
  const {
    loading = false,
    update = false,
    permissionChangeStatus = false,
    language = 'vi',
    refreshToken = '',
    navigation = {},
    task = null,
    onStartUpdate = () => null,
    onEndUpdate = () => null,
    onNeedUpdate = () => null,
  } = props;

  const [tooltipDelay, setTooltipDelay] = useState(false);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleTooltipDelay = () => setTooltipDelay(!tooltipDelay);

  /**********
   ** FUNC **
   **********/

  /************
   ** RENDER **
   ************/
  if (!task) return null;

  let delay = 0,
    arrAvatarParticipant = [],
    showPercentage = task.taskTypeID === Commons.TYPE_TASK.TASK.value;
  if (showPercentage && task.statusID < Commons.STATUS_PROJECT[4]["value"]) {
    if (task.endDate && task.endDate !== '') {
      delay = moment().diff(task.endDate, 'days');
    }
  }
  if (task.lstUserInvited.length > 0) {
    arrAvatarParticipant = task.lstUserInvited.map(itemA =>
      Assets.iconUser
    );
  }

  return (
    <KeyboardAwareScrollView contentInsetAdjustmentBehavior={'automatic'}>
      {!loading && (
        <Layout style={[cStyles.flex1, cStyles.py10, cStyles.pr10]}>
          {task.taskTypeID !==
            Commons.TYPE_TASK.MILESTONE.value && (
            <ListItem
              title={propsT =>
                <Text appearance="hint">{t('project_management:status')}</Text>}
              accessoryLeft={RenderStatusIcon}
              accessoryRight={propsR =>
                <Status
                  disabled={update}
                  isUpdate={permissionChangeStatus}
                  language={language}
                  refreshToken={refreshToken}
                  navigation={navigation}
                  task={task}
                  onStartUpdate={onStartUpdate}
                  onEndUpdate={onEndUpdate}
                  onNeedUpdate={onNeedUpdate}
                />
              }
            />
          )}
          
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:main_title')}</Text>}
            accessoryLeft={RenderProjectIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text style={cStyles.textRight}>{task.prjName}</Text>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:estimated_time')}</Text>}
            accessoryLeft={RenderTimeIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
                <Text>
                  {moment(task.startDate, DEFAULT_FORMAT_DATE_4).format(DEFAULT_FORMAT_DATE_9)}
                </Text>
                <Text>  &#8594;  </Text>
                <Tooltip
                  backdropStyle={styles.con_backdrop}
                  visible={tooltipDelay}
                  onBackdropPress={toggleTooltipDelay}
                  anchor={() => RenderToDate(delay, task.endDate, toggleTooltipDelay)}>
                  {`${t('project_management:delay_date_1')} ${delay} ${t('project_management:delay_date_2')}`}
                </Tooltip>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:holder_task_percentage')}</Text>}
            accessoryLeft={RenderPercentIcon}
            accessoryRight={propsR =>
              <Percentage
                disabled={update}
                navigation={navigation}
                language={language}
                refreshToken={refreshToken}
                task={task}
                onStartUpdate={onStartUpdate}
                onEndUpdate={onEndUpdate}
              />
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:assignee')}</Text>}
            accessoryLeft={RenderPersonIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter, cStyles.justifyEnd]}>
                <Avatar size="tiny" source={Assets.iconUser} />
                <Text style={cStyles.ml10}>{task.ownerName}</Text>
              </View>
            }
          />
          {arrAvatarParticipant.length > 0 && (
            <ListItem
              title={propsT =>
                <Text appearance="hint">{t('project_management:user_invited')}</Text>}
              accessoryLeft={RenderPeopleIcon}
              accessoryRight={propsR =>
                <CAvatar
                  style={cStyles.justifyEnd}
                  absolute={false}
                  sources={arrAvatarParticipant}
                  size="tiny"
                />
              }
            />
          )}
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:piority')}</Text>}
            accessoryLeft={RenderPiorityIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text
                  style={cStyles.textRight}
                  status={Commons.PRIORITY_TASK[task.priority]['color']}>
                  {checkEmpty(task.priorityName)}
                </Text>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:sector')}</Text>}
            accessoryLeft={RenderSectorIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text style={cStyles.textRight}>{checkEmpty(task.sectorName)}</Text>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:grade')}</Text>}
            accessoryLeft={RenderGradeIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text style={cStyles.textRight}>{checkEmpty(task.gradeName)}</Text>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:component')}</Text>}
            accessoryLeft={RenderComponentIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text style={cStyles.textRight}>{checkEmpty(task.componentName)}</Text>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:origin_publisher')}</Text>}
            accessoryLeft={RenderPushlisherIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text style={cStyles.textRight}>{checkEmpty(task.originPublisher)}</Text>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:owner_ship_dtp')}</Text>}
            accessoryLeft={RenderOwnershipIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text style={cStyles.textRight}>{checkEmpty(task.ownershipDTP)}</Text>
              </View>
            }
          />
          <ListItem
            title={propsT =>
              <Text appearance="hint">{t('project_management:author')}</Text>}
            accessoryLeft={RenderAuthorIcon}
            accessoryRight={propsR =>
              <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                <Text style={cStyles.textRight}>{checkEmpty(task.author)}</Text>
              </View>
            }
          />
          {task.attachFiles !== '' && (
            <ListItem
              title={propsT =>
                <Text appearance="hint">{t('project_management:files_attach')}</Text>}
              accessoryLeft={RenderFileIcon}
              accessoryRight={propsR =>
                <View style={[cStyles.flex1, cStyles.itemsEnd]}>
                  <FileAttach file={task.attachFiles} />
                </View>
              }
            />
          )}
          <ListItem
            style={cStyles.itemsStart}
            title={propsT =>
              <Text appearance="hint">
                {t('project_management:description')}
              </Text>}
            description={propsD =>
              <View style={cStyles.mt10}>
                <CText>
                  {checkEmpty(task.descr, t('project_management:empty_description'))}
                </CText>
              </View>
            }
            accessoryLeft={RenderDescriptionIcon}
          />
        </Layout>
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  con_flex: {flex: 0.48},
  con_backdrop: {backgroundColor: colors.BACKGROUND_MODAL},
});

export default Overview;
