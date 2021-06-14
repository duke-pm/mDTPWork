/**
 ** Name: CList
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef, useState, useEffect, useRef} from 'react';
import {StyleSheet, View, FlatList, Animated, SectionList} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CText from './CText';
import CFooterList from './CFooterList';
import CIconButton from './CIconButton';
/* COMMON */
import {IS_ANDROID, IS_IOS} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import CLoading from './CLoading';

let listRef = createRef();
let sectionlistRef = createRef();

function CList(props) {
  const {
    style = {},
    customColors,
    contentStyle = {},
    scrollToTop = true,
    scrollToBottom = false,
    sectionList = false,
    textEmpty = null,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  /** Use ref */
  const animButtonToTop = useRef(new Animated.Value(cStyles.deviceHeight))
    .current;

  /** Use state */
  const [loading, setLoading] = useState(
    scrollToBottom && sectionList ? true : false,
  );
  const [scrollDown, setScrollDown] = useState({
    status: false,
    offsetY: 0,
  });

  /** HANDLE FUNC */
  const handleScrollToTop = () => {
    if (!sectionList) {
      listRef.scrollToOffset({animated: true, offset: 0});
    } else {
      sectionlistRef.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex: 0,
      });
    }
  };

  /** FUNC */
  const onScroll = event => {
    if (!scrollDown.status) {
      if (scrollDown.offsetY < event.nativeEvent.contentOffset.y) {
        Animated.timing(animButtonToTop, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
        setScrollDown({
          status: true,
          offsetY: event.nativeEvent.contentOffset.y,
        });
      }
    } else {
      if (
        scrollDown.offsetY !== 0 &&
        scrollDown.offsetY > event.nativeEvent.contentOffset.y
      ) {
        Animated.timing(animButtonToTop, {
          toValue: 100,
          duration: 150,
          useNativeDriver: true,
        }).start();
        setScrollDown({
          status: false,
          offsetY: 0,
        });
      }
    }
  };

  const onContentChange = () => {
    if (scrollToBottom && !sectionList) {
      listRef.scrollToEnd({animated: true});
    }
  };

  /** RENDER */
  useEffect(() => {
    if (props.data && scrollToBottom && sectionList) {
      setTimeout(
        () => {
          if (props.data.length > 0) {
            sectionlistRef.scrollToLocation({
              animated: true,
              itemIndex: props.data[props.data.length - 1].data.length - 1,
              sectionIndex: props.data.length - 1,
            });
          }
          setLoading(false);
        },
        IS_IOS ? 1000 : 1500,
      );
    }
  }, [props.data, scrollToBottom, sectionList, setLoading]);

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
          onScroll={scrollToTop ? onScroll : null}
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
              <View
                style={[
                  cStyles.flexCenter,
                  cStyles.py10,
                  {backgroundColor: customColors.background},
                ]}>
                <View
                  style={[
                    cStyles.py4,
                    cStyles.px16,
                    cStyles.rounded5,
                    {backgroundColor: customColors.card},
                  ]}>
                  <CText styles={'textMeta'} customLabel={section.title} />
                </View>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={IS_ANDROID}
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={'interactive'}
          initialNumToRender={10}
          scrollEventThrottle={16}
          onScroll={scrollToTop ? onScroll : null}
          onContentSizeChange={onContentChange}
          stickySectionHeadersEnabled={true}
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

      {scrollToTop && (
        <CIconButton
          style={[
            cStyles.abs,
            styles.button_scroll_to_top,
            {transform: [{translateX: animButtonToTop}]},
          ]}
          iconName={'arrow-up'}
          iconColor={colors.WHITE}
          onPress={handleScrollToTop}
        />
      )}

      {props.data && scrollToBottom && sectionList && (
        <CLoading visible={loading} customColors={customColors} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button_scroll_to_top: {
    right: 30,
    bottom: 30,
    backgroundColor: colors.SECONDARY,
  },
});

export default CList;
