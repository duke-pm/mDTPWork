/**
 ** Name: CList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef} from 'react';
import { useColorScheme } from 'react-native-appearance';
import {StyleSheet, View, FlatList, SectionList} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CText from './CText';
import CFooterList from './CFooterList';
/* COMMON */
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import { THEME_DARK } from '~/config/constants';

/** All refs of CList */
let listRef = createRef();

function CList(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {
    style = {},
    contentStyle = {},
    sectionList = false,
    textEmpty = null,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  /************
   ** RENDER **
   ************/
  return (
    <View style={cStyles.flex1}>
      {!sectionList && (
        <FlatList
          ref={ref => (listRef = ref)}
          style={[cStyles.flex1, style]}
          contentContainerStyle={[cStyles.px16, cStyles.pb16, contentStyle]}
          data={props.data}
          renderItem={propsItem =>
            props.item({
              item: propsItem.item,
              index: propsItem.index,
            })
          }
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={IS_ANDROID}
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={'interactive'}
          initialNumToRender={10}
          scrollEventThrottle={16}
          refreshing={props.refreshing}
          onRefresh={onRefresh}
          onEndReachedThreshold={0.1}
          onEndReached={onLoadmore}
          ListEmptyComponent={
            <CEmpty
              label={'common:empty_data'}
              description={textEmpty || 'common:cannot_find_data_filter'}
            />
          }
          ListFooterComponent={props.loadingmore ? <CFooterList /> : null}
          {...props}
        />
      )}

      {sectionList && (
        <SectionList
          style={[cStyles.flex1, style]}
          contentContainerStyle={[cStyles.px16, cStyles.pb16, contentStyle]}
          renderItem={propsItem => {
            return props.item({
              item: propsItem.item,
              index: propsItem.index,
            });
          }}
          renderSectionFooter={({section}) => {
            return (
              <View
                style={[
                  cStyles.flexCenter,
                  cStyles.py10,
                  cStyles.row,
                  cStyles.itemsCenter,
                  styles.title,
                ]}>
                <View
                  style={[
                    cStyles.borderDashed,
                    cStyles.borderAll,
                    cStyles.mr10,
                    isDark && cStyles.borderAllDark,
                    {borderRadius: 1, width: '15%'},
                  ]}
                />
                <View
                  style={[
                    cStyles.py5,
                    cStyles.px16,
                    cStyles.rounded5,
                    {backgroundColor: colors.STATUS_ON_HOLD_OPACITY},
                  ]}>
                  <CText styles={'textMeta'} customLabel={section.title} />
                </View>
                <View
                  style={[
                    cStyles.borderDashed,
                    cStyles.borderAll,
                    cStyles.ml10,
                    isDark && cStyles.borderAllDark,
                    {borderRadius: 1, width: '15%'},
                  ]}
                />
              </View>
            );
          }}
          sections={props.data}
          keyExtractor={(item, index) => item.lineNum.toString()}
          removeClippedSubviews={IS_ANDROID}
          keyboardShouldPersistTaps={'handled'}
          initialNumToRender={1000}
          maxToRenderPerBatch={undefined}
          refreshing={props.refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <CEmpty
              label={'common:empty_data'}
              description={textEmpty || 'common:cannot_find_data_filter'}
            />
          }
          ListFooterComponent={props.loadingmore ? <CFooterList /> : null}
          {...props}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {marginHorizontal: -moderateScale(16)},
});

export default CList;
