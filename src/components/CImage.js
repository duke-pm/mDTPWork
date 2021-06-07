/**
 ** Name: CImage
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of CImage.js
 **/
import React from 'react';
import PropTypes from 'prop-types';
import {Animated, ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image';
/** COMMON */
import {Assets} from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {borderRadius} from '~/utils/helper';

const durationLoading = 500;
const styles = {
  con_loading: {backgroundColor: 'transparent'},
  con_avatar_small: {
    width: 50,
    height: 50,
    borderRadius: borderRadius(50),
  },
  con_avatar_medium: {
    width: 100,
    height: 100,
    borderRadius: borderRadius(100),
  },
  con_avatar_large: {
    width: 150,
    height: 150,
    borderRadius: borderRadius(150),
  },
  image: {overflow: 'hidden'},
};

class CImage extends React.Component {
  static propTypes = {
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    resizeMode: PropTypes.string,
    isAvatar: PropTypes.bool,
    isPost: PropTypes.bool,
    isCategory: PropTypes.bool,
    isSmall: PropTypes.bool,
    isMedium: PropTypes.bool,
    isLarge: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      _loading: true,
      _source: props.source,
      _animOpacity: new Animated.Value(1),
    };
  }

  /* FUNCTIONS */
  _onLoad = () => {
    this.setState({_loading: false}, () => {
      let animationParams = {
        toValue: 0,
        duration: durationLoading,
        useNativeDriver: true,
      };
      Animated.timing(this.state._animOpacity, animationParams).start();
    });
  };

  _onError = () => {
    this.setState({
      _source: this.props.sourceFailed
        ? this.props.sourceFailed
        : Assets.iconImageDefault,
      _loading: false,
    });
  };

  /* LIFE CYCLES */
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.source != this.props.source) {
      this.setState({_source: this.props.source});
    }
  }

  /* RENDER */
  render() {
    let {
      style,
      resizeMode,
      children,
      isAvatar,
      isPost,
      isCategory,
      isSmall,
      isMedium,
      isLarge,
    } = this.props;
    let {_source} = this.state;

    return (
      <FastImage
        style={[
          style,
          isAvatar && isSmall && styles.con_avatar_small,
          isAvatar && isMedium && styles.con_avatar_medium,
          isAvatar && isLarge && styles.con_avatar_large,
          styles.image,
        ]}
        source={
          _source.uri
            ? {
                uri: _source.uri,
                priority: FastImage.priority.normal,
              }
            : _source
        }
        resizeMode={isAvatar || isPost || isCategory ? 'cover' : resizeMode}
        cache={FastImage.cacheControl.immutable}
        onLoadStart={this._onLoadStart}
        onLoad={this._onLoad}
        onError={this._onError}>
        <Animated.View
          style={[
            cStyles.flex1,
            cStyles.abs,
            cStyles.inset0,
            styles.con_loading,
            {opacity: this.state._animOpacity},
          ]}>
          <ActivityIndicator />
        </Animated.View>
        {children}
      </FastImage>
    );
  }
}

CImage.defaultProps = {
  style: {},
  source: Assets.iconImageDefault,
  resizeMode: 'contain',
  isSmall: false,
  isMedium: false,
  isLarge: false,
  isAvatar: false,
  isPost: false,
  isCategory: false,
};

export default CImage;
