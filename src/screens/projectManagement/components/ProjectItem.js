/**
 ** Name: Project Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import React, {useState} from 'react';
import {StyleSheet, View, LayoutAnimation, UIManager} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import ListProject from '../list/Project';
import CLabel from '~/components/CLabel';
/* COMMON */
import {cStyles} from '~/utils/style';
import {checkEmpty, IS_ANDROID, IS_IOS} from '~/utils/helper';

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

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleProjectItem = () => {
    if (data.countChild > 0) {
      setShowChildren(!showChildren);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else {
      onPress(data);
    }
  };

  /**************
   ** RENDER **
   **************/
  return (
    <View style={isPrevIsParent && !showChildren ? cStyles.mt16 : {}}>
      <CCard
        key={index}
        containerStyle={styles.card}
        customLabel={`#${data.prjID} ${data.prjName}`}
        onLayout={event => {
          var {width} = event.nativeEvent.layout;
          setWidthCard(width - 12);
        }}
        onPress={handleProjectItem}
        content={
          <View>
            <View
              style={[
                cStyles.row,
                cStyles.itemsCenter,
                cStyles.justifyBetween,
              ]}>
              {/** Status */}
              <View style={[cStyles.row, cStyles.itemsCenter]}>
                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_left]}>
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

                <View
                  style={[cStyles.row, cStyles.itemsCenter, styles.row_right]}>
                  <CLabel label={'project_management:owner'} />
                  <CLabel medium customLabel={checkEmpty(data.ownerName)} />
                </View>
              </View>
            </View>

            {/** Description */}
            <View
              style={[cStyles.row, cStyles.itemsStart, cStyles.justifyStart]}>
              <CLabel label={'project_management:description'} />
              <CLabel customLabel={checkEmpty(data.descr)} />
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
            <ListProject data={data.lstProjectItem} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row_left: {flex: 0.5},
  row_right: {flex: 0.5},
  line_child: {height: '100%'},
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
