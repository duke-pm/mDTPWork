/**
 ** Name: CList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import PropTypes from 'prop-types';
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
    onRefresh = undefined,
    onLoadmore = undefined,
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
        initialNumToRender={1000}
        keyboardShouldPersistTaps={'handled'}
        keyboardDismissMode={'on-drag'}
        scrollEventThrottle={16}
        refreshing={props.refreshing || false}
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
        ItemSeparatorComponent={() => <View style={cStyles.py10} />}
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
              <View style={[cStyles.py5, cStyles.px16]}>
                <CText
                  customStyles={[
                    cStyles.textCaption1,
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
        initialNumToRender={1000}
        keyboardShouldPersistTaps={'handled'}
        keyboardDismissMode={'on-drag'}
        refreshing={props.refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <CEmpty
            style={cStyles.mt60}
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

CList.propTypes = {
  viewRef: PropTypes.any,
  listStyle: PropTypes.object,
  contentStyle: PropTypes.object,
  data: PropTypes.array,
  item: PropTypes.func,
  sectionList: PropTypes.bool,
  refreshing: PropTypes.bool,
  textEmpty: PropTypes.string,
  loadingmore: PropTypes.bool,
  onRefresh: PropTypes.func,
  onLoadmore: PropTypes.func,
};

export default React.memo(CList);
