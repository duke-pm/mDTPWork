/**
 ** Name: CAvoidKeyboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAvoidKeyboard.js
 **/
import React, {Component} from 'react';
import {Animated, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
/** COMMON */
import {cStyles} from '~/utils/style';
import {IS_ANDROID, moderateScale} from '~/utils/helper';

class CAvoidKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedViewHeight: new Animated.Value(0),
      viewHeight: 0,
    };

    this.setViewHeightOnce = this.setViewHeightOnce.bind(this);
    this.keyboardWillShow = this.keyboardWillShow.bind(this);
    this.keyboardWillHide = this.keyboardWillHide.bind(this);
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  setViewHeightOnce(event) {
    const {height} = event.nativeEvent.layout;
    if (this.state.viewHeight === 0) {
      const avoidPaddingBottom = moderateScale(64);
      this.setState({
        viewHeight: height + avoidPaddingBottom,
        animatedViewHeight: new Animated.Value(height + avoidPaddingBottom),
      });
    }
  }

  keyboardWillShow(e) {
    const {viewHeight} = this.state;
    if (viewHeight) {
      requestAnimationFrame(() => {
        Animated.timing(this.state.animatedViewHeight, {
          toValue: viewHeight - e.endCoordinates.height,
          duration: 300,
          useNativeDriver: IS_ANDROID,
        }).start();
      });
    }
  }

  keyboardWillHide() {
    requestAnimationFrame(() => {
      Animated.timing(this.state.animatedViewHeight, {
        toValue: this.state.viewHeight,
        duration: 300,
        useNativeDriver: IS_ANDROID,
      }).start();
    });
  }

  render() {
    let animatedHeight;
    const {viewHeight} = this.state;
    if (viewHeight > 0) {
      animatedHeight = {maxHeight: this.state.animatedViewHeight};
    }
    return (
      <Animated.View
        style={[cStyles.flex1, cStyles.justifyEnd, animatedHeight]}
        onLayout={this.setViewHeightOnce}>
        {this.props.children}
      </Animated.View>
    );
  }
}

CAvoidKeyboard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CAvoidKeyboard;
