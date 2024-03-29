/**
 ** Name: CBackgroundSharp
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CBackgroundSharp.js
 **/
import React from 'react';
import {useColorScheme} from 'react-native-appearance';
import {Dimensions, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/** COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';

const Circle = React.memo(({size, color, position}) => {
  let style = {
    wrapper: {
      flexDirection: 'row',
      ...position,
    },
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
    },
  };
  return (
    <View style={style.wrapper}>
      <View style={style.circle} />
    </View>
  );
});

const Donut = React.memo(({size, color, position}) => {
  let style = {
    wrapper: {
      flexDirection: 'row',
      ...position,
    },
    donut: {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: size / 4,
      borderColor: color,
    },
  };
  return (
    <View style={style.wrapper}>
      <View style={style.donut} />
    </View>
  );
});

const Triangle = React.memo(({size, color, position}) => {
  let style = {
    wrapper: {
      flexDirection: 'row',
      ...position,
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: size / 2,
      borderRightWidth: size / 2,
      borderBottomWidth: size,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: color,
      transform: [{rotate: '180deg'}],
    },
  };
  return (
    <View style={style.wrapper}>
      <View style={style.triangle} />
    </View>
  );
});

const DiamondNarrow = React.memo(({size, color, position}) => {
  let style = {
    wrapper: {
      flexDirection: 'row',
      ...position,
    },
    diamondNarrow: {},
    diamondNarrowTop: {
      width: 0,
      height: 0,
      borderTopWidth: 0,
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      borderLeftWidth: size / 2,
      borderRightColor: 'transparent',
      borderRightWidth: size / 2,
      borderBottomColor: color,
      borderBottomWidth: size / 1.42,
    },
    diamondNarrowBottom: {
      width: 0,
      height: 0,
      borderTopWidth: size / 1.42,
      borderTopColor: color,
      borderLeftColor: 'transparent',
      borderLeftWidth: size / 2,
      borderRightColor: 'transparent',
      borderRightWidth: size / 2,
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
    },
  };
  return (
    <View style={style.wrapper}>
      <View style={style.diamondNarrow}>
        <View style={style.diamondNarrowTop} />
        <View style={style.diamondNarrowBottom} />
      </View>
    </View>
  );
});

const CutDiamond = React.memo(({size, color, position}) => {
  let style = {
    wrapper: {
      flexDirection: 'row',
      ...position,
    },
    cutDiamond: {},
    cutDiamondTop: {
      width: size,
      height: 0,
      borderTopWidth: 0,
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
      borderLeftWidth: size / 4,
      borderRightColor: 'transparent',
      borderRightWidth: size / 4,
      borderBottomColor: color,
      borderBottomWidth: size / 4,
    },
    cutDiamondBottom: {
      width: 0,
      height: 0,
      borderTopWidth: size / 1.42,
      borderTopColor: color,
      borderLeftColor: 'transparent',
      borderLeftWidth: size / 2,
      borderRightColor: 'transparent',
      borderRightWidth: size / 2,
      borderBottomColor: 'transparent',
      borderBottomWidth: 0,
    },
  };
  return (
    <View style={style.wrapper}>
      <View style={style.cutDiamond}>
        <View style={style.cutDiamondTop} />
        <View style={style.cutDiamondBottom} />
      </View>
    </View>
  );
});

const Shapes = React.memo(
  ({primaryColor, secondaryColor, height, figures, borderRadius, style}) => {
    const isDark = useColorScheme() === THEME_DARK;
    const config = {
      primaryColor: primaryColor || colors.PRIMARY,
      secondaryColor: secondaryColor || colors.SECONDARY,
      height: Dimensions.get('window').height / (height || 3.5),
      sizefigure: 100,
      figures: figures || [
        {name: 'circle', position: 'center', size: 60},
        {name: 'donut', position: 'flex-start', axis: 'top', size: 80},
        {name: 'cutDiamond', position: 'center', axis: 'right', size: 100},
      ],
      borderRadius: borderRadius !== undefined ? borderRadius : 30,
    };

    const arrFigures = [];
    const buildFigures = () => {
      config.figures.forEach((e, i) => {
        let position = {
          alignItems: e.position,
        };

        const sizefigure = e.size || config.sizefigure;

        switch (e.axis) {
          case 'left':
            position.left = -sizefigure / 2;
            break;
          case 'right':
            position.right = -sizefigure / 2;
            break;
          case 'top':
            position.top = -sizefigure / 2;
            break;
          case 'bottom':
            position.bottom = -sizefigure / 2;
            break;
          default:
            break;
        }

        if (e.name === 'circle') {
          arrFigures.push(
            <Circle
              key={i}
              size={sizefigure}
              color={config.secondaryColor}
              position={position}
            />,
          );
        }
        if (e.name === 'donut') {
          arrFigures.push(
            <Donut
              key={i}
              size={sizefigure}
              color={config.secondaryColor}
              position={position}
            />,
          );
        }
        if (e.name === 'triangle') {
          arrFigures.push(
            <Triangle
              key={i}
              size={sizefigure}
              color={config.secondaryColor}
              position={position}
            />,
          );
        }
        if (e.name === 'diamondNarrow') {
          arrFigures.push(
            <DiamondNarrow
              key={i}
              size={sizefigure}
              color={config.secondaryColor}
              position={position}
            />,
          );
        }
        if (e.name === 'cutDiamond') {
          arrFigures.push(
            <CutDiamond
              key={i}
              size={sizefigure}
              color={config.secondaryColor}
              position={position}
            />,
          );
        }
      });

      return arrFigures;
    };

    return (
      <LinearGradient
        style={[
          cStyles.abs,
          cStyles.inset0,
          cStyles.flex1,
          cStyles.row,
          cStyles.justifyBetween,
          {
            height: config.height,
            borderBottomLeftRadius: config.borderRadius,
            borderBottomRightRadius: config.borderRadius,
          },
        ]}
        colors={[primaryColor, isDark ? '#000' : '#FFF']}>
        <View
          style={[
            cStyles.abs,
            cStyles.inset0,
            cStyles.flex1,
            cStyles.row,
            cStyles.justifyBetween,
            {
              height: config.height,
              borderBottomLeftRadius: config.borderRadius,
              borderBottomRightRadius: config.borderRadius,
              ...style,
            },
          ]}>
          <>{buildFigures()}</>
        </View>
      </LinearGradient>
    );
  },
);

export {Shapes};
