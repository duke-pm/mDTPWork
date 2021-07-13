/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: CList
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CList.js
 **/
import React, {createRef, useRef, useState, useEffect} from 'react';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {
  StyleSheet,
  View,
  FlatList,
  SectionList,
  Animated,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
/* COMPONENTS */
import CEmpty from './CEmpty';
import CText from './CText';
import CFooterList from './CFooterList';
/* COMMON */
import {IS_ANDROID, IS_IOS, moderateScale, verticalScale} from '~/utils/helper';
import {colors, cStyles} from '~/utils/style';
import {THEME_DARK} from '~/config/constants';

/** All refs of CList */
let listRef = createRef();

function CList(props) {
  // const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    style = {},
    viewRef = null,
    contentStyle = {},
    sectionList = false,
    textEmpty = null,
    onRefresh = null,
    onLoadmore = null,
  } = props;

  // let animTranslateY = useRef(new Animated.Value(0)).current;

  // const [showSTT, setShowSTT] = useState({
  //   status: false,
  //   offsetY: 0,
  // });

  /*****************
   ** HANDLE FUNC **
   *****************/
  // const handleScrollToTop = () => {
  //   setShowSTT({status: false, offsetY: 0});
  //   listRef.scrollToLocation({
  //     animated: true,
  //     viewPosition: 0,
  //     itemIndex: 0,
  //     sectionIndex: 0,
  //     viewOffset: 0,
  //   });
  //   Animated.timing(animTranslateY, {
  //     toValue: 0,
  //     duration: 100,
  //   }).start();
  // };

  /**********
   ** FUNC **
   **********/
  // const onSectionScrollEndDrag = ({nativeEvent}) => {
  //   if (showSTT.offsetY < nativeEvent.contentOffset.y) {
  //     setShowSTT({status: false, offsetY: nativeEvent.contentOffset.y});
  //   }

  //   if (showSTT.offsetY > nativeEvent.contentOffset.y) {
  //     setShowSTT({status: true, offsetY: nativeEvent.contentOffset.y});
  //   }
  // };

  // useEffect(() => {
  //   Animated.timing(animTranslateY, {
  //     toValue: showSTT.status ? 1 : 0,
  //     duration: 100,
  //   }).start();
  // }, [showSTT.status, showSTT.offsetY]);
  /************
   ** RENDER **
   ************/
  if (!sectionList) {
    return (
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
    );
  }
  if (sectionList) {
    // const Touchable = IS_IOS ? TouchableOpacity : TouchableNativeFeedback;
    return (
      <View style={cStyles.flex1}>
        <SectionList
          ref={viewRef || (ref => (listRef = ref))}
          style={[cStyles.flex1, style]}
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
                <View
                  style={[
                    cStyles.borderDashed,
                    cStyles.borderAll,
                    cStyles.mr10,
                    isDark && cStyles.borderAllDark,
                    styles.title_section,
                  ]}
                />
                <View
                  style={[
                    cStyles.py5,
                    cStyles.px16,
                    cStyles.rounded5,
                    {backgroundColor: colors.STATUS_IN_PROGRESS_OPACITY},
                  ]}>
                  <CText styles={'textMeta'} customLabel={section.title} />
                </View>
                <View
                  style={[
                    cStyles.borderDashed,
                    cStyles.borderAll,
                    cStyles.ml10,
                    isDark && cStyles.borderAllDark,
                    styles.title_section,
                  ]}
                />
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
          initialNumToRender={1000}
          scrollEventThrottle={16}
          maxToRenderPerBatch={undefined}
          refreshing={props.refreshing}
          onRefresh={onRefresh}
          // onScrollEndDrag={onSectionScrollEndDrag}
          ListEmptyComponent={
            <CEmpty
              label={'common:empty_data'}
              description={textEmpty || 'common:cannot_find_data_filter'}
            />
          }
          ListFooterComponent={props.loadingmore ? <CFooterList /> : null}
          {...props}
        />

        {/* <Animated.View
          style={[
            cStyles.abs,
            cStyles.rounded10,
            cStyles.ofHidden,
            {
              bottom: verticalScale(10),
              left: cStyles.deviceWidth / 2 - moderateScale(20),
              opacity: animTranslateY,
            },
          ]}>
          <Touchable
            style={cStyles.rounded10}
            disabled={!showSTT.status}
            onPress={handleScrollToTop}>
            <View
              style={[
                cStyles.center,
                cStyles.rounded10,
                {
                  height: moderateScale(40),
                  width: moderateScale(40),
                  backgroundColor: customColors.card,
                },
              ]}>
              <Icon
                name={'arrow-down-outline'}
                size={moderateScale(25)}
                color={customColors.primary}
              />
            </View>
          </Touchable>
        </Animated.View> */}
      </View>
    );
  }

  return <View />;
}

const styles = StyleSheet.create({
  title: {marginHorizontal: -moderateScale(16), height: moderateScale(50)},
  title_section: {borderRadius: 1, width: '15%'},
});

export default CList;
