/**
 ** Name: CList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef} from 'react';
import {useColorScheme} from 'react-native-appearance';
import {StyleSheet, View, FlatList, SectionList} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CText from './CText';
import CFooterList from './CFooterList';
/* COMMON */
import {IS_ANDROID, moderateScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

/** All refs of CList */
let listRef = createRef();

function CList(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {
    listStyle = {},
    viewRef = null,
    contentStyle = {},
    sectionList = false,
    textEmpty = null,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  if (!sectionList) {
    return (
      <FlatList
        ref={ref => (listRef = ref)}
        style={[cStyles.flex1, listStyle]}
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
        keyboardDismissMode={'on-drag'}
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
        ItemSeparatorComponent={() => <View style={cStyles.py6} />}
        {...props}
      />
    );
  }
  if (sectionList) {
    return (
      <SectionList
        ref={viewRef || (ref => (listRef = ref))}
        style={[cStyles.flex1, listStyle]}
        contentContainerStyle={[cStyles.px16, cStyles.pb16, contentStyle]}
        sections={props.data}
        renderSectionFooter={({section}) => {
          return (
            <View
              style={[
                cStyles.flexCenter,
                cStyles.row,
                cStyles.itemsCenter,
                styles.title,
              ]}>
              <View style={[cStyles.py5, cStyles.px16, cStyles.rounded5]}>
                <CText
                  customStyles={[
                    cStyles.textMeta,
                    cStyles.fontMedium,
                    {color: isDark ? colors.GRAY_700 : colors.GRAY_600},
                  ]}
                  customLabel={section.title}
                />
              </View>
            </View>
          );
        }}
        renderItem={propsItem => {
          return props.item({
            item: propsItem.item,
            index: propsItem.index,
          });
        }}
        keyExtractor={(item, index) => item.lineNum.toString()}
        removeClippedSubviews={IS_ANDROID}
        keyboardShouldPersistTaps={'handled'}
        keyboardDismissMode={'on-drag'}
        initialNumToRender={1000}
        scrollEventThrottle={16}
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
        ItemSeparatorComponent={() => <View style={cStyles.py4} />}
        {...props}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  title: {marginHorizontal: -moderateScale(16), height: moderateScale(50)},
});

export default CList;
