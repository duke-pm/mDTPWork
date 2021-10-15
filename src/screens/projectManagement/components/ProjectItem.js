/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Project Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {StyleSheet, View, LayoutAnimation, UIManager} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CLabel from '~/components/CLabel';
import CUser from '~/components/CUser';
import CText from '~/components/CText';
import CIcon from '~/components/CIcon';
import CStatusTag from '~/components/CStatusTag';
import ListProject from '../list/Project';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID} from '~/utils/helper';
import {
  DEFAULT_FORMAT_DATE_4,
  DEFAULT_FORMAT_DATE_1,
  DEFAULT_FORMAT_DATE_2,
} from '~/config/constants';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const C_LAYOUT_ANIM = {
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
const PADDING_CHILDREN = moderateScale(14);
const PADDING_2_CHILDREN = moderateScale(6);
const BOTTOM_CHILDREN = moderateScale(10);

function ProjectItem(props) {
  const {
    index = -1,
    data = null,
    formatDateView = DEFAULT_FORMAT_DATE_2,
    customColors = {},
    isDark = false,
    onPress = () => null,
    onPressDetail = () => null,
    onPressPlan = () => null,
  } = props;

  /** Use state */
  const [showChildren, setShowChildren] = useState(false);
  const [widthCard, setWidthCard] = useState(0);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleHeaderItem = () => onPressDetail(data);

  const handleProjectPlan = () => onPressPlan(data);

  const handleItem = () => {
    if (data.countChild > 0) {
      LayoutAnimation.configureNext(C_LAYOUT_ANIM);
      setShowChildren(!showChildren);
    } else {
      onPress(data);
    }
  };

  const onLayoutCard = event => {
    setWidthCard(event.nativeEvent.layout.width - PADDING_CHILDREN);
  };

  /************
   ** RENDER **
   ************/
  let appraisalTime = null;
  if (data.appraisalTime) {
    appraisalTime = data.appraisalTime.split('T')[0];
    appraisalTime = moment(appraisalTime, DEFAULT_FORMAT_DATE_1).format(
      formatDateView,
    );
  }
  return (
    <View style={[cStyles.flex1, data.prjParentID > 0 ? cStyles.ml12 : {}]}>
      <CCard
        key={index}
        index={index}
        containerStyle={styles.card}
        detail
        customLabel={`#${data.prjID} ${data.prjName}`}
        onLayout={onLayoutCard}
        onPress={handleItem}
        onDetailPress={handleHeaderItem}
        content={
          <View>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.flex1]}>
                {/** Owner */}
                <CUser style={styles.row_left} label={data.ownerName} />

                {/** Status */}
                <View style={[cStyles.itemsStart, styles.row_right]}>
                  <CStatusTag
                    customLabel={data.statusName}
                    color={isDark ? data.colorDarkCode : data.colorCode}
                  />
                </View>
              </View>
            </View>

            <View
              style={[
                cStyles.flex1,
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.mt10,
              ]}>
              {/** Date start - end */}
              <View
                style={[
                  data.priorityLevel > 0 && styles.row_left_1,
                  data.priorityLevel === 0 && styles.row_left,
                ]}>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CLabel label={'project_management:start_date'} />
                  <CLabel
                    customLabel={
                      data.startDate
                        ? moment(data.startDate, DEFAULT_FORMAT_DATE_4).format(
                            formatDateView,
                          )
                        : '-'
                    }
                  />
                </View>
                <View style={[cStyles.row, cStyles.itemsCenter]}>
                  <CLabel label={'project_management:end_date'} />
                  <CLabel
                    customLabel={
                      data.endDate
                        ? moment(data.endDate, DEFAULT_FORMAT_DATE_4).format(
                            formatDateView,
                          )
                        : '-'
                    }
                  />
                </View>
                {appraisalTime && (
                  <View style={[cStyles.row, cStyles.itemsCenter]}>
                    <CLabel label={'project_management:appraisal_time'} />
                    <CLabel customLabel={appraisalTime} />
                  </View>
                )}
              </View>

              {/** Is piority */}
              {data.priorityLevel > 0 && (
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsCenter,
                    styles.row_middle_1,
                  ]}>
                  <CLabel label={'project_management:piority_item'} />
                  <CIcon
                    style={cStyles.ml5}
                    name={Icons.flag}
                    color={'green'}
                    size={'smaller'}
                  />
                  <View
                    style={[
                      cStyles.center,
                      cStyles.rounded5,
                      styles.piority_number,
                      {backgroundColor: customColors.red},
                    ]}>
                    <CText
                      styles={'textBadge colorWhite'}
                      customLabel={data.priorityLevel}
                    />
                  </View>
                </View>
              )}

              {/** Is public */}
              <View
                style={[
                  cStyles.row,
                  cStyles.itemsCenter,
                  data.priorityLevel > 0 && styles.row_right_1,
                  data.priorityLevel === 0 && styles.row_right,
                ]}>
                <CLabel label={'project_management:is_public'} />
                <CIcon
                  name={data.isPublic ? Icons.checkCircle : Icons.alert}
                  color={data.isPublic ? 'green' : 'orange'}
                  size={'small'}
                />
              </View>
            </View>
          </View>
        }
        customIconHeader={
          data.countChild === 0
            ? [
                {
                  id: 'projectPlan',
                  name: 'Project Plan',
                  icon: Icons.barChart,
                  onPress: handleProjectPlan,
                },
              ]
            : []
        }
      />

      {!showChildren && data.countChild > 0 && (
        <View
          style={[
            cStyles.rounded1,
            cStyles.abs,
            styles.card_children,
            {
              width: widthCard,
              backgroundColor: customColors.cardDisable,
            },
          ]}
        />
      )}

      {/** If project have children -> Show */}
      {data.countChild > 0 && (
        <View
          style={[
            cStyles.flex1,
            cStyles.row,
            cStyles.itemsCenter,
            !showChildren && cStyles.abs,
            {opacity: showChildren ? 1 : 0},
          ]}>
          <View
            style={[
              cStyles.borderAll,
              styles.line_child,
              isDark && cStyles.borderAllDark,
            ]}
          />
          <ListProject
            formatDateView={formatDateView}
            data={data.lstProjectItem}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row_left: {flex: 0.6},
  row_right: {flex: 0.4},
  row_left_1: {flex: 0.45},
  row_middle_1: {flex: 0.35},
  row_right_1: {flex: 0.2},
  line_child: {height: '100%', borderRadius: 1},
  card: {zIndex: 100},
  card_children: {
    height: moderateScale(50),
    right: PADDING_2_CHILDREN,
    bottom: -BOTTOM_CHILDREN,
    zIndex: 1,
  },
  owner: {width: '65%'},
  status: {
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  piority_number: {
    maxWidth: moderateScale(32),
    minWidth: moderateScale(16),
  },
});

ProjectItem.propTypes = {
  index: PropTypes.number,
  data: PropTypes.object,
  formatDateView: PropTypes.string,
  customColors: PropTypes.object,
  isDark: PropTypes.bool,
  onPress: PropTypes.func,
  onPressDetail: PropTypes.func,
  onPressPlan: PropTypes.func,
};

export default React.memo(ProjectItem);
