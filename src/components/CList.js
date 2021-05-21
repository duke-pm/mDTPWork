/**
 ** Name: CList
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef, useState, useRef} from 'react';
import {StyleSheet, View, FlatList, Animated} from 'react-native';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CFooterList from './CFooterList';
/* COMMON */
import {IS_ANDROID} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import CIconButton from './CIconButton';

let listRef = createRef();

function CList(props) {
  const {
    style = {},
    contentStyle = {},
    showScrollTop = true,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  const animButtonToTop = useRef(new Animated.Value(cStyles.deviceHeight))
    .current;

  const [scrollDown, setScrollDown] = useState({
    status: false,
    offsetY: 0,
  });

  const handleScrollToTop = () => {
    listRef.scrollToOffset({animated: true, offset: 0});
  };

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
        initialNumToRender={10}
        scrollEventThrottle={16}
        onScroll={onScroll}
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

      {showScrollTop &&
        <CIconButton
          style={[
            styles.button_scroll_to_top,
            {
              transform: [
                {
                  translateX: animButtonToTop,
                },
              ],
            },
          ]}
          iconName={'arrow-up'}
          iconColor={colors.WHITE}
          onPress={handleScrollToTop}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  button_scroll_to_top: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: colors.SECONDARY,
  },
});

export default CList;
