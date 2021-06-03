/**
 ** Name: Project Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import React, {useState} from 'react';
import {StyleSheet, View, LayoutAnimation, UIManager} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CText from '~/components/CText';
import ListProject from '../list/Project';
/* COMMON */
import {cStyles} from '~/utils/style';
import {IS_ANDROID, sW} from '~/utils/helper';
import Commons from '~/utils/common/Commons';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

function ProjectItem(props) {
  const {index, data, customColors, isDark, isPrevIsParent, onPress} = props;

  /** Use state */
  const [showChildren, setShowChildren] = useState(false);

  /** HANDLE FUNC */
  const handleProjectItem = () => {
    if (data.countChild > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShowChildren(!showChildren);
    } else {
      // onPress(data);
    }
  };

  /** RENDER */
  let status = Commons.STATUS_PROJECT.IN_PROCESS; // default is New
  switch (data.statusID) {
    case Commons.STATUS_PROJECT.REJECTED.value:
      status = Commons.STATUS_PROJECT.REJECTED;
      break;
    case Commons.STATUS_PROJECT.CLOSED.value:
      status = Commons.STATUS_PROJECT.CLOSED;
      break;
    default:
      status = Commons.STATUS_PROJECT.IN_PROCESS;
      break;
  }

  return (
    <View style={isPrevIsParent && !showChildren ? cStyles.mt16 : {}}>
      <CCard
        key={index}
        containerStyle={[data.prjParentID > 0 && cStyles.ml16, styles.card]}
        customLabel={data.prjName}
        customColors={customColors}
        isDark={isDark}
        onPress={handleProjectItem}
        cardContent={
          <View>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              {/** Sector, date created */}
              <View
                style={[cStyles.pr5, cStyles.itemsStart, styles.con_info_left]}>
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:sector'}
                  />
                  <CText
                    styles={'textMeta fontRegular'}
                    customLabel={data.sectorName}
                  />
                </View>

                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:date_created'}
                  />
                  <CText
                    styles={'textMeta fontRegular'}
                    customLabel={data.crtdDate}
                  />
                </View>
              </View>

              {/** Status, public */}
              <View
                style={[
                  cStyles.pr5,
                  cStyles.itemsStart,
                  styles.con_info_right,
                ]}>
                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsStart,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:status'}
                  />
                  <CText
                    customStyles={[
                      cStyles.textMeta,
                      cStyles.fontBold,
                      {color: customColors[status.color]},
                    ]}
                    label={status.label}
                  />
                </View>

                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyStart,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:owener'}
                  />
                  <CText
                    styles={'textMeta fontRegular'}
                    customLabel={data.ownerName}
                  />
                </View>
              </View>
            </View>

            {/** Description */}
            <View
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
              <CText
                styles={'textMeta'}
                label={'project_management:description'}
              />
              <CText styles={'textMeta fontRegular'} customLabel={data.descr} />
            </View>
          </View>
        }
      />

      {!showChildren &&
        data.countChild > 0 &&
        data.lstProjectItem.map((item, index) => {
          return (
            <View
              style={[
                cStyles.rounded2,
                !isDark && cStyles.shadowListItem,
                isDark && cStyles.borderAllDark,
                cStyles.abs,
                cStyles.left0,
                styles.card_children,
                {
                  width: sW('90%') - 6 * index,
                  zIndex: -index,
                  marginLeft: 3 * (index + 1),
                  bottom: -6 * (index + 1),
                  backgroundColor: customColors.card,
                },
              ]}
            />
          );
        })}

      {showChildren && data.countChild > 0 && (
        <View style={[cStyles.row, cStyles.itemsCenter]}>
          <View
            style={[
              cStyles.borderAll,
              isDark && cStyles.borderAllDark,
              styles.line_child,
            ]}
          />
          <ListProject data={data.lstProjectItem} showScrollTop={false} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  con_info_left: {flex: 0.5},
  con_info_right: {flex: 0.5},
  line_child: {height: '95%'},
  card: {zIndex: 100},
  card_children: {height: 16},
});

export default ProjectItem;
