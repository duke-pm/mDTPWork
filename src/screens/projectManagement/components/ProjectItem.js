/* eslint-disable react-native/no-inline-styles */
/**
 ** Name: Project Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import React, {useState} from 'react';
import {StyleSheet, View, LayoutAnimation, UIManager} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CLabel from '~/components/CLabel';
import CUser from '~/components/CUser';
import CStatusTag from '~/components/CStatusTag';
import ListProject from '../list/Project';
/* COMMON */
import Icons from '~/config/Icons';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, IS_ANDROID} from '~/utils/helper';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
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

const PADDING_CHILDREN = moderateScale(14);
const PADDING_2_CHILDREN = moderateScale(6);
const BOTTOM_CHILDREN = moderateScale(10);

function ProjectItem(props) {
  const {
    index,
    data,
    formatDateView,
    customColors,
    isDark,
    onPress,
    onLongPress,
  } = props;

  /** Use state */
  const [showChildren, setShowChildren] = useState(false);
  const [widthCard, setWidthCard] = useState(0);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleHeaderItem = () => onLongPress(data);

  const handleItem = () => {
    if (data.countChild > 0) {
      LayoutAnimation.configureNext(CustomLayoutAnimated);
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
  return (
    <View
      style={[
        cStyles.row,
        cStyles.itemsStart,
        data.prjParentID > 0 && cStyles.ml12,
      ]}>
      {/** Arrow childrens */}
      {/* {data.prjParentID > 0 && (
        <View style={styles.con_arrow}>
          <View
            style={[
              styles.top_arrow,
              {borderRightColor: customColors.cardHolder},
            ]}
          />
          <View
            style={[
              styles.bottom_arrow,
              {borderTopColor: customColors.cardHolder},
            ]}
          />
        </View>
      )} */}

      {/** Project card */}
      <View style={[cStyles.flex1, data.countChild > 0 ? cStyles.mb10 : {}]}>
        <CCard
          key={index}
          index={index}
          containerStyle={styles.card}
          customLabel={`#${data.prjID} ${data.prjName}`}
          detail={true}
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

              <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt5]}>
                {/** Date start */}
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_left]}>
                  <CLabel label={'project_management:date_created'} />
                  <CLabel
                    customLabel={moment(
                      data.crtdDate,
                      DEFAULT_FORMAT_DATE_4,
                    ).format(formatDateView)}
                  />
                </View>

                {/** Is public */}
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_right]}>
                  <CLabel label={'project_management:is_public'} />
                  <Icon
                    name={data.isPublic ? Icons.checkCircle : Icons.alert}
                    color={
                      data.isPublic ? customColors.green : customColors.orange
                    }
                    size={moderateScale(14)}
                  />
                </View>
              </View>
            </View>
          }
        />

        {!showChildren && data.countChild > 0 && (
          <View
            style={[
              cStyles.rounded2,
              cStyles.abs,
              styles.card_children,
              {
                right: PADDING_2_CHILDREN,
                bottom: -BOTTOM_CHILDREN,
                width: widthCard,
                backgroundColor: customColors.cardHolder,
                zIndex: 1,
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
    </View>
  );
}

const styles = StyleSheet.create({
  row_left: {flex: 0.6},
  row_right: {flex: 0.4},
  line_child: {height: '100%', borderRadius: 1},
  card: {zIndex: 100},
  card_children: {height: moderateScale(50)},
  owner: {width: '65%'},
  status: {
    height: moderateScale(8),
    width: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  con_arrow: {
    backgroundColor: colors.TRANSPARENT,
    overflow: 'visible',
    width: moderateScale(15),
    height: moderateScale(25),
  },
  top_arrow: {
    backgroundColor: colors.TRANSPARENT,
    width: 0,
    height: 0,
    borderTopWidth: moderateScale(9),
    borderTopColor: colors.TRANSPARENT,
    borderRightWidth: moderateScale(9),
    borderStyle: 'solid',
    transform: [{rotate: '10deg'}],
    position: 'absolute',
    bottom: moderateScale(9),
    right: moderateScale(8),
    left: 0,
    overflow: 'visible',
  },
  bottom_arrow: {
    backgroundColor: colors.TRANSPARENT,
    position: 'absolute',
    borderBottomColor: colors.TRANSPARENT,
    borderLeftColor: colors.TRANSPARENT,
    borderRightColor: colors.TRANSPARENT,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: moderateScale(3),
    borderStyle: 'solid',
    borderTopLeftRadius: moderateScale(12),
    top: moderateScale(5),
    left: -moderateScale(8),
    width: moderateScale(10),
    height: moderateScale(15),
    transform: [{rotate: '45deg'}],
  },
});

export default React.memo(ProjectItem);
