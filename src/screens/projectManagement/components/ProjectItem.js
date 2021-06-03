/**
 ** Name: Project Item
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of ProjectItem.js
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
/* COMPONENTS */
import CCard from '~/components/CCard';
import CText from '~/components/CText';
import ListProject from '../list/Project';
/* COMMON */
import {cStyles} from '~/utils/style';

function ProjectItem(props) {
  const {index, data, customColors, isDark, onPress} = props;

  return (
    <View>
      <CCard
        key={index}
        customLabel={data.prjName}
        customColors={customColors}
        isDark={isDark}
        onPress={() => onPress(data)}
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
                  {data.statusID === 1 ? (
                    <CText
                      styles={'textMeta fontBold colorGreen'}
                      label={'project_management:status_on_track'}
                    />
                  ) : (
                    <CText
                      styles={'textMeta fontBold colorOrange'}
                      label={'project_management:status_pending'}
                    />
                  )}
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

      {data.countChild > 0 && <ListProject data={data.lstProjectItem} />}
    </View>
  );
}

const styles = StyleSheet.create({
  con_info_left: {flex: 0.5},
  con_info_right: {flex: 0.5},
});

export default ProjectItem;
