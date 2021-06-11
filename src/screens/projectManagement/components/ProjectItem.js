/**
 ** Name: Project Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import React, {useState} from 'react';
import {StyleSheet, View, LayoutAnimation, UIManager} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CText from '~/components/CText';
import CAvatar from '~/components/CAvatar';
import ListProject from '../list/Project';
/* COMMON */
import {cStyles} from '~/utils/style';
import {IS_ANDROID, IS_IOS} from '~/utils/helper';
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
  const [widthCard, setWidthCard] = useState(0);

  /** HANDLE FUNC */
  const handleProjectItem = () => {
    if (data.countChild > 0) {
      setShowChildren(!showChildren);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else {
      onPress(data);
    }
  };

  /** RENDER */
  let status = Commons.STATUS_PROJECT.IN_PROGRESS; // default is In progress
  if (!data.statusColor) {
    switch (data.statusID) {
      case Commons.STATUS_PROJECT.REJECTED.value:
        status = Commons.STATUS_PROJECT.REJECTED;
        break;
      case Commons.STATUS_PROJECT.CLOSED.value:
        status = Commons.STATUS_PROJECT.CLOSED;
        break;
      default:
        status = Commons.STATUS_PROJECT.IN_PROGRESS;
        break;
    }
  }
  let createAt = moment(data.crtdDate, 'YYYY-MM-DDTHH:mm:ss').format(
    'DD/MM/YYYY',
  );
  return (
    <View style={isPrevIsParent && !showChildren ? cStyles.mt16 : {}}>
      <CCard
        key={index}
        containerStyle={styles.card}
        customLabel={`#${data.prjID} ${data.prjName}`}
        customColors={customColors}
        isDark={isDark}
        onLayout={event => {
          var {width} = event.nativeEvent.layout;
          setWidthCard(width - 12);
        }}
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
                    customLabel={data.sectorName !== '' ? data.sectorName : '-'}
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
                    customLabel={createAt}
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
                      {color: data.statusColor || customColors[status.color]},
                    ]}
                    label={status.label}
                  />
                </View>

                <View
                  style={[
                    cStyles.row,
                    cStyles.itemsCenter,
                    cStyles.justifyStart,
                    styles.owner,
                  ]}>
                  <CText
                    styles={'textMeta'}
                    label={'project_management:owner'}
                  />
                  <CAvatar
                    customColors={customColors}
                    size={'vsmall'}
                    label={data.ownerName}
                  />
                  <CText
                    styles={'textMeta fontMedium pl6'}
                    customLabel={data.ownerName !== '' ? data.ownerName : '-'}
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
              key={index.toString()}
              style={[
                cStyles.rounded2,
                !isDark && IS_IOS && cStyles.shadowListItem,
                !isDark && IS_ANDROID && cStyles.borderAll,
                isDark && cStyles.borderAllDark,
                cStyles.abs,
                cStyles.right0,
                styles.card_children,
                {
                  width: widthCard,
                  zIndex: -index,
                  bottom: -10 * (index + 1),
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
          <View style={[cStyles.flex1, cStyles.ml12]}>
            <ListProject data={data.lstProjectItem} scrollToTop={false} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  con_info_left: {flex: 0.5},
  con_info_right: {flex: 0.5},
  line_child: {height: '100%'},
  card: {zIndex: 100},
  card_children: {height: 100},
  owner: {width: '65%'},
});

export default ProjectItem;
