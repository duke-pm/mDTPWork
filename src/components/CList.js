/**
 ** Name: CList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef} from 'react';
import {StyleSheet, View, FlatList, SectionList} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CText from './CText';
import CFooterList from './CFooterList';
/* COMMON */
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

/** All refs of CList */
let listRef = createRef();

function CList(props) {
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
    <>
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
                  cStyles.pt24,
                  styles.title,
                ]}>
                <View
                  style={[
                    cStyles.py4,
                    cStyles.px16,
                    cStyles.rounded5,
                    {backgroundColor: colors.STATUS_ON_HOLD_OPACITY},
                  ]}>
                  <CText styles={'textMeta'} customLabel={section.title} />
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          sections={props.data}
          removeClippedSubviews={IS_ANDROID}
          keyboardShouldPersistTaps={'handled'}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
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
    </>
  );
}

const styles = StyleSheet.create({
  title: {marginHorizontal: -moderateScale(16)},
});

export default CList;
