/**
 ** Name: Custom Post Images
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of .js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Layout, Button, List, Text} from '@ui-kitten/components';
import {StyleSheet, LayoutAnimation, UIManager, View} from 'react-native';
import ImageView from 'react-native-image-view';
import FastImage from 'react-native-fast-image';
import IoniIcon from 'react-native-vector-icons/Ionicons';
/* COMMON */
import {colors, cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale, SCREEN_WIDTH} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/** All init */
const SIZE_IMAGE_FULL = {
  height: moderateScale(250),
  width: SCREEN_WIDTH,
};

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderFooterFullImage = (images, curIndex) => {
  return (
    <SafeAreaView style={[cStyles.itemsCenter, {backgroundColor: colors.TRANSPARENT}]}>
      <List
        style={{backgroundColor: colors.TRANSPARENT}}
        horizontal
        pagingEnabled
        data={images}
        renderItem={info => {
          return (
            <>
              <FastImage
                style={styles.con_images_mini}
                source={{
                  uri: info.item.source.uri,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              {curIndex === info.index && (
                <View style={[cStyles.center, cStyles.abs, cStyles.inset0, {backgroundColor: colors.BG_BACKDROP}]}>
                  <IoniIcon
                    name={'eye'}
                    color={colors.WHITE}
                    size={moderateScale(18)}
                  />
                </View>
              )}
            </>
          )
        }}
        keyExtractor={(item, index) => item.source.uri + index}
        extraData={curIndex}
        ItemSeparatorComponent={() => <View style={[cStyles.px1]} />}
      />
    </SafeAreaView>
  )
};

/********************
 ** MAIN COMPONENT **
 ********************/
function CPostImages(props) {
  const {
    images = [],
  } = props;

  /** Use state */
  const [loading, setLoading] = useState(true);
  const [indexFullImage, setIndexFullImage] = useState(0);
  const [alertFullImage, setAlertFullImage] = useState(false);
  const [imagesPost, setImagesPost] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const toggleAlertFullImage = indexActive => {
    setIndexFullImage(indexActive);
    setAlertFullImage(!alertFullImage);
  };

  /**********
   ** FUNC **
   **********/
  const onChangeFullImage = newIndex => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIndexFullImage(newIndex);
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (images.length > 0) {
      let image = null, tmpImages = [], objImage = {source: '', height: 0, width: 0};
      for (image of images) {
        objImage = {source: {}, height: 0, width: 0};
        objImage.source = {uri: image};
        objImage.width = SIZE_IMAGE_FULL.width;
        objImage.height = SIZE_IMAGE_FULL.height;
        tmpImages.push(objImage);
      }
      setImagesPost(tmpImages);
      setLoading(false);
    }
  }, []);

  /************
   ** RENDER **
   ************/
  if (images.lenght === 0) return null;
  return (
    <Layout style={[cStyles.flex1, cStyles.fullWidth, styles.con_images]} >
      {images.length === 1 && (
        <Button
          style={[cStyles.px1, cStyles.py1]}
          appearance={'ghost'}
          status={'basic'}
          onPress={() => toggleAlertFullImage(0)}>
          {evaProps => (
            <Layout style={cStyles.flex1} >
              <FastImage
                style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.rounded1]}
                source={{
                  uri: images[0],
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            </Layout>
          )}
        </Button>
      )}

      {images.length === 2 && (
        <Layout style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter]} >
          <Button
            style={[cStyles.flex1, cStyles.px0, cStyles.py1]}
            appearance={'ghost'}
            status={'basic'}
            onPress={() => toggleAlertFullImage(0)}>
            {evaProps => (
              <View style={cStyles.flex1}>
                <FastImage
                  style={[
                    cStyles.fullWidth,
                    cStyles.fullHeight,
                    cStyles.roundedTopLeft1,
                    cStyles.roundedBottomLeft1,
                  ]}
                  source={{
                    uri: images[0],
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            )}
          </Button>
          <Button
            style={[cStyles.flex1, cStyles.px0, cStyles.py1]}
            appearance={'ghost'}
            status={'basic'}
            onPress={() => toggleAlertFullImage(1)}>
            {evaProps => (
              <View style={cStyles.flex1}>
                <FastImage
                  style={[
                    cStyles.fullWidth,
                    cStyles.fullHeight,
                    cStyles.roundedTopRight1,
                    cStyles.roundedBottomRight1,
                  ]}
                  source={{
                    uri: images[1],
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </View>
            )}
          </Button>
        </Layout>
      )}

      {images.length === 3 && (
        <Layout style={cStyles.flex1} >
          <Layout style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter]} >
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(0)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedTopLeft1]}
                    source={{
                      uri: images[0],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(1)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedTopRight1]}
                    source={{
                      uri: images[1],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
          </Layout>
          <Layout style={cStyles.flex1} >
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(2)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[
                      cStyles.fullWidth,
                      cStyles.fullHeight,
                      cStyles.roundedBottomLeft1,
                      cStyles.roundedBottomRight1,
                    ]}
                    source={{
                      uri: images[2],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
          </Layout>
        </Layout>
      )}

      {images.length === 4 && (
        <Layout style={cStyles.flex1} >
          <Layout style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter]} >
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(0)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedTopLeft1]}
                    source={{
                      uri: images[0],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(1)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedTopRight1]}
                    source={{
                      uri: images[1],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
          </Layout>
          <Layout style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter]} >
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(2)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedBottomLeft1]}
                    source={{
                      uri: images[2],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(3)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedBottomRight1]}
                    source={{
                      uri: images[3],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
          </Layout>
        </Layout>
      )}

      {images.length > 4 && (
        <Layout style={cStyles.flex1} >
          <Layout style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter]} >
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(0)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedTopLeft1]}
                    source={{
                      uri: images[0],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(1)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedTopRight1]}
                    source={{
                      uri: images[1],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
          </Layout>
          <Layout style={[cStyles.flex1, cStyles.row, cStyles.itemsCenter]} >
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(2)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedBottomLeft1]}
                    source={{
                      uri: images[2],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              )}
            </Button>
            <Button
              style={[cStyles.flex1, cStyles.px0, cStyles.py0]}
              appearance={'ghost'}
              status={'basic'}
              onPress={() => toggleAlertFullImage(3)}>
              {evaProps => (
                <View style={cStyles.flex1}>
                  <FastImage
                    style={[cStyles.fullWidth, cStyles.fullHeight, cStyles.roundedBottomRight1]}
                    source={{
                      uri: images[3],
                      priority: FastImage.priority.high,
                      cache: FastImage.cacheControl.immutable,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                  <View
                    style={[
                      cStyles.flexCenter,
                      cStyles.abs,
                      cStyles.inset0,
                      styles.backdrop,
                      cStyles.roundedBottomRight1,
                    ]}>
                    <Text style={styles.txt_white} category="h6">
                      {`+${images.length - 4}`}
                    </Text>
                  </View>
                </View>
              )}
            </Button>
          </Layout>
        </Layout>
      )}

      {!loading && (
        <ImageView
          isVisible={alertFullImage}
          glideAlways
          controls={{close: true, next: true, prev: true}}
          animationType="fade"
          images={imagesPost}
          imageIndex={indexFullImage}
          onClose={() => toggleAlertFullImage(0)}
          renderFooter={props => RenderFooterFullImage(imagesPost, indexFullImage)}
          onImageChange={onChangeFullImage}
        />
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  con_images: {
    height: moderateScale(200),
  },
  con_images_mini: {
    height: moderateScale(40),
    width: moderateScale(60),
  },
  backdrop: {
    backgroundColor: colors.BG_BACKDROP,
  },
  txt_white: {
    color: colors.WHITE,
  }
});

CPostImages.propTypes = {
  images: PropTypes.array,
};

export default CPostImages;
