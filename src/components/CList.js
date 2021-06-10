/**
 ** Name: CList
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef, useState, useRef} from 'react';
import {StyleSheet, View, FlatList, Animated, KeyboardAvoidingView} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CFooterList from './CFooterList';
import CIconButton from './CIconButton';
/* COMMON */
import {IS_ANDROID} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';

let listRef = createRef();

function CList(props) {
  const {
    style = {},
    contentStyle = {},
    showScrollTop = true,
    scrollToBottom = false,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  /** Use ref */
  const animButtonToTop = useRef(new Animated.Value(cStyles.deviceHeight))
    .current;

  /** Use state */
  const [scrollDown, setScrollDown] = useState({
    status: false,
    offsetY: 0,
  });

  /** HANDLE FUNC */
  const handleScrollToTop = () => {
    listRef.scrollToOffset({animated: true, offset: 0});
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
    if (scrollToBottom) {
      listRef.scrollToEnd({animated: true});
    }
  };

  /** RENDER */
  return (
    <View style={cStyles.flex1}>
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
        onScroll={showScrollTop ? onScroll : null}
        onContentSizeChange={onContentChange}
        refreshing={props.refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={0.1}
        onEndReached={onLoadmore}
        ListEmptyComponent={
          <CEmpty
            label={'common:empty_data'}
            description={'common:cannot_find_data_filter'}
          />
        }
        ListFooterComponent={props.loadingmore ? <CFooterList /> : null}
        {...props}
      />

      {showScrollTop && (
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
