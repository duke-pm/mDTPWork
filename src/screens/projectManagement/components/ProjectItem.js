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
import CAvatar from '~/components/CAvatar';
import ListProject from '../list/Project';
/* COMMON */
import Icons from '~/config/Icons';
import {colors, cStyles} from '~/utils/style';
import {checkEmpty, moderateScale, IS_ANDROID} from '~/utils/helper';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowChildren(!showChildren);
    } else {
      onPress(data);
    }
  };

  /************
   ** RENDER **
   ************/
  return (
    <View>
      <CCard
        key={index}
        index={index}
        containerStyle={styles.card}
        customLabel={`#${data.prjID} ${data.prjName}`}
        onLayout={event => {
          var {width} = event.nativeEvent.layout;
          setWidthCard(width - PADDING_CHILDREN);
        }}
        onPress={handleItem}
        onLongPress={handleHeaderItem}
        content={
          <View>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                {/** Owner */}
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_left]}>
                  <CAvatar size={'vsmall'} label={data.ownerName} />
                  <CLabel
                    style={cStyles.pl6}
                    customLabel={checkEmpty(data.ownerName)}
                  />
                </View>

                {/** Status */}
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_right]}>
                  <Icon
                    name={'ellipse'}
                    color={isDark ? data.colorDarkCode : data.colorCode}
                    size={moderateScale(14)}
                  />
                  <CLabel
                    style={cStyles.ml4}
                    bold
                    color={isDark ? data.colorDarkCode : data.colorCode}
                    customLabel={data.statusName}
                  />
                </View>
              </View>
            </View>

            <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt5]}>
              {/** Date start */}
              <View style={[cStyles.row, cStyles.itemsCenter, styles.row_left]}>
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
              backgroundColor: isDark ? colors.GRAY_860 : colors.GRAY_200,
              zIndex: 1,
            },
          ]}
        />
      )}

      {/** If project have children -> Show */}
      {showChildren && data.countChild > 0 && (
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <View
            style={[
              cStyles.borderAll,
              isDark && cStyles.borderAllDark,
              cStyles.borderDashed,
              styles.line_child,
            ]}
          />
          <View style={[cStyles.flex1, cStyles.ml12, cStyles.mt10]}>
            <ListProject
              formatDateView={formatDateView}
              data={data.lstProjectItem}
            />
          </View>
        </View>
      )}
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
});

export default ProjectItem;
