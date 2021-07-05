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
import ListProject from '../list/Project';
import CLabel from '~/components/CLabel';
/* COMMON */
import {cStyles} from '~/utils/style';
import {checkEmpty, fS, IS_ANDROID} from '~/utils/helper';
import {DEFAULT_FORMAT_DATE_4} from '~/config/constants';
import Colors from '~/utils/style/Colors';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const PADDING_CHILDREN = 12;
const PADDING_2_CHILDREN = 6;
const BOTTOM_CHILDREN = 10;

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
  const handleItem = () => {
    if (data.countChild > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowChildren(!showChildren);
    } else {
      onPress(data);
    }
  };

  const handleHeaderItem = () => {
    onLongPress(data);
  };

  /**************
   ** RENDER **
   **************/
  return (
    <View style={cStyles.mb20}>
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
                  <CLabel label={'project_management:owner'} />
                  <CLabel medium customLabel={checkEmpty(data.ownerName)} />
                </View>

                {/** Status */}
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_right]}>
                  <CLabel label={'project_management:status'} />
                  <View style={[cStyles.row, cStyles.itemsCenter, cStyles.ml2]}>
                    <View
                      style={[
                        cStyles.mr2,
                        styles.status,
                        {
                          backgroundColor: isDark
                            ? data.colorDarkCode
                            : data.colorCode,
                        },
                      ]}
                    />
                    <CLabel
                      bold
                      color={isDark ? data.colorDarkCode : data.colorCode}
                      customLabel={data.statusName}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={[cStyles.row, cStyles.itemsCenter]}>
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
                  name={data.isPublic ? 'checkmark-circle' : 'alert-circle'}
                  color={
                    data.isPublic ? customColors.green : customColors.orange
                  }
                  size={fS(14)}
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
              width: widthCard,
              bottom: -BOTTOM_CHILDREN,
              backgroundColor: isDark ? Colors.GRAY_860 : Colors.GRAY_200,
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
          <View style={[cStyles.flex1, cStyles.ml12]}>
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
  row_left: {flex: 0.55},
  row_right: {flex: 0.45},
  line_child: {height: '100%', borderRadius: 1},
  card: {zIndex: 100},
  card_children: {height: 50},
  owner: {width: '65%'},
  status: {
    height: 8,
    width: 8,
    borderRadius: 8,
  },
});

export default ProjectItem;
