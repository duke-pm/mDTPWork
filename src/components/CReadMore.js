/**
 ** Name: CReadMore
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CReadMore.js
 **/
import React from 'react';
import {StyleSheet, Text, View, UIManager, LayoutAnimation} from 'react-native';
import {IS_ANDROID, moderateScale} from '~/utils/helper';
if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const INIT = {
  textShowMore: 'Read more...',
  textShowLess: 'Read less...',
};

export default class CReadMore extends React.Component {
  state = {
    measured: false,
    shouldShowReadMore: false,
    showAllText: false,
  };

  async componentDidMount() {
    this._isMounted = true;
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    // Get the height of the text with no restriction on number of lines
    const fullHeight = await measureHeightAsync(this._text);
    this.setState({measured: true});
    await nextFrameAsync();

    if (!this._isMounted) {
      return;
    }

    // Get the height of the text now that number of lines has been set
    const limitedHeight = await measureHeightAsync(this._text);

    if (fullHeight > limitedHeight) {
      this.setState({shouldShowReadMore: true}, () => {
        this.props.onReady && this.props.onReady();
      });
    } else {
      this.props.onReady && this.props.onReady();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let {measured, showAllText} = this.state;

    let {numberOfLines} = this.props;

    return (
      <View>
        <Text
          numberOfLines={measured && !showAllText ? numberOfLines : 0}
          style={this.props.textStyle}
          ref={text => {
            this._text = text;
          }}>
          {this.props.children}
        </Text>

        {this._maybeRenderReadMore()}
      </View>
    );
  }

  _handlePressReadMore = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({showAllText: true});
  };

  _handlePressReadLess = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({showAllText: false});
  };

  _maybeRenderReadMore() {
    let {shouldShowReadMore, showAllText} = this.state;

    if (shouldShowReadMore && !showAllText) {
      if (this.props.renderTruncatedFooter) {
        return this.props.renderTruncatedFooter(this._handlePressReadMore);
      }

      return (
        <Text
          style={[styles.button, this.props.textMoreStyle]}
          onPress={this._handlePressReadMore}>
          {this.props.textShow || INIT.textShowMore}
        </Text>
      );
    } else if (shouldShowReadMore && showAllText) {
      if (this.props.renderRevealedFooter) {
        return this.props.renderRevealedFooter(this._handlePressReadLess);
      }

      return (
        <Text
          style={[styles.button, this.props.textMoreStyle]}
          onPress={this._handlePressReadLess}>
          {this.props.textHide || INIT.textShowLess}
        </Text>
      );
    }
  }
}

function measureHeightAsync(component) {
  return new Promise(resolve => {
    component.measure((x, y, w, h) => {
      resolve(h);
    });
  });
}

function nextFrameAsync() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

const styles = StyleSheet.create({
  button: {
    color: '#888',
    marginTop: moderateScale(5),
  },
});
