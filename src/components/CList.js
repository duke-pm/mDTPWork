/**
 ** Name: CList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native-appearance';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, FlatList, SectionList} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CText from './CText';
import CFooterList from './CFooterList';
import CLoading from './CLoading';
/* COMMON */
import {IS_ANDROID} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

/** All refs of CList */
let listRef = createRef();
let sectionlistRef = createRef();

function CList(props) {
  const isDark = useColorScheme() === THEME_DARK;
  const {customColors} = useTheme();
  const {
    style = {},
    contentStyle = {},
    scrollToBottom = false,
    sectionList = false,
    textEmpty = null,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  /** Use state */
  const [loading, setLoading] = useState(
    scrollToBottom && sectionList ? true : false,
  );

  /************
   ** FUNC **
   ************/
  const onContentChange = () => {
    if (scrollToBottom && !sectionList) {
      listRef.scrollToEnd({animated: true});
    }
  };

  /******************
   ** LIFE CYCLE **
   ******************/
  useEffect(() => {
    if (props.data && scrollToBottom && sectionList) {
      setTimeout(() => {
        if (props.data.length > 0) {
          sectionlistRef.scrollToLocation({
            animated: true,
            itemIndex: props.data[props.data.length - 1].data.length - 1,
            sectionIndex: props.data.length - 1,
          });
        }
        setLoading(false);
      }, 1800);
    }
  }, [props.data, scrollToBottom, sectionList, setLoading]);

  /**************
   ** RENDER **
   **************/
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
          onContentSizeChange={onContentChange}
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
          ref={ref => (sectionlistRef = ref)}
          style={[cStyles.flex1, style]}
          contentContainerStyle={[cStyles.px16, cStyles.pb16, contentStyle]}
          sections={props.data}
          renderItem={propsItem => {
            return props.item({
              item: propsItem.item,
              index: propsItem.index,
            });
          }}
          renderSectionHeader={({section}) => {
            return (
              <View style={[cStyles.flexCenter, cStyles.py10, styles.title]}>
                <View
                  style={[
                    cStyles.py4,
                    cStyles.px16,
                    cStyles.rounded5,
                    {
                      backgroundColor: isDark
                        ? colors.GRAY_700
                        : colors.GRAY_200,
                    },
                  ]}>
                  <CText styles={'textMeta'} customLabel={section.title} />
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={IS_ANDROID}
          keyboardShouldPersistTaps={'handled'}
          stickySectionHeadersEnabled={true}
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

      {props.data && scrollToBottom && sectionList && (
        <CLoading visible={loading} customColors={customColors} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {marginHorizontal: -16},
});

export default CList;
