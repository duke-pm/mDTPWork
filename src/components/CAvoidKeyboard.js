/**
 ** Name: CAvoidKeyboard
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CAvoidKeyboard.js
 **/
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Animated, Keyboard} from 'react-native';
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
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    );
  }

  setViewHeightOnce = event => {
    const {height} = event.nativeEvent.layout;
    if (this.state.viewHeight === 0) {
      this.setState({
        viewHeight: height,
        animatedViewHeight: new Animated.Value(height),
      });
    }
  };

  keyboardWillShow = e => {
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
  };

  keyboardWillHide = () => {
    requestAnimationFrame(() => {
      Animated.timing(this.state.animatedViewHeight, {
        toValue: this.state.viewHeight,
        duration: 300,
        useNativeDriver: IS_ANDROID,
      }).start();
    });
  };

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
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
