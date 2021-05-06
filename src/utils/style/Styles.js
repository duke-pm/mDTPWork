/**
 ** Name: Styles of App
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of styles.js
 **/
import { isIphoneX } from "react-native-iphone-x-helper";
import { Platform, Dimensions } from 'react-native';
import { RFPercentage } from '~/utils/helper';
import Colors from './Colors';

const fBold = 'Roboto-Bold';
const fMedium = 'Roboto-Medium';
const fRegular = 'Roboto-Regular';
const fLight = 'Roboto-Light';

const PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const toolbarHeight = platform === PLATFORM.IOS ? 64 : 56;
const toolbarDefaultBorder = Colors.PRIMARY;

const main = {
  flex1: { flex: 1 },
  flexWrap: { flexWrap: 'wrap' },
  flexNoWrap: { flexWrap: 'nowrap' },
  flexGrow: { flexGrow: 1 },
  flexWrapReverse: { flexWrap: 'wrap-reverse' },
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  flexCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  itemsStretch: { alignItems: 'stretch' },
  itemsBaseline: { alignItems: 'baseline' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  itemsCenter: { alignItems: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyStart: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  fullWidth: { width: '100%' },
  platform,
  isIphoneX,
  toolbarHeight,
  toolbarDefaultBorder,
  deviceHeight,
  deviceWidth,
}

const padding = {
  pl0: { paddingLeft: 0 },
  pl1: { paddingLeft: 1 },
  pl2: { paddingLeft: 2 },
  pl3: { paddingLeft: 3 },
  pl4: { paddingLeft: 4 },
  pl5: { paddingLeft: 5 },
  pl6: { paddingLeft: 6 },
  pl8: { paddingLeft: 8 },
  pl10: { paddingLeft: 10 },
  pl12: { paddingLeft: 12 },
  pl16: { paddingLeft: 16 },
  pl20: { paddingLeft: 20 },
  pl24: { paddingLeft: 24 },
  pl28: { paddingLeft: 28 },
  pl32: { paddingLeft: 32 },
  pl36: { paddingLeft: 36 },
  pl40: { paddingLeft: 40 },
  pl44: { paddingLeft: 44 },
  pl48: { paddingLeft: 48 },
  pl52: { paddingLeft: 52 },
  pl56: { paddingLeft: 56 },
  pl60: { paddingLeft: 60 },

  pr0: { paddingRight: 0 },
  pr1: { paddingRight: 1 },
  pr2: { paddingRight: 2 },
  pr3: { paddingRight: 3 },
  pr4: { paddingRight: 4 },
  pr5: { paddingRight: 5 },
  pr6: { paddingRight: 6 },
  pr8: { paddingRight: 8 },
  pr10: { paddingRight: 10 },
  pr12: { paddingRight: 12 },
  pr16: { paddingRight: 16 },
  pr20: { paddingRight: 20 },
  pr24: { paddingRight: 24 },
  pr28: { paddingRight: 28 },
  pr32: { paddingRight: 32 },
  pr36: { paddingRight: 36 },
  pr40: { paddingRight: 40 },
  pr44: { paddingRight: 44 },
  pr48: { paddingRight: 48 },
  pr52: { paddingRight: 52 },
  pr56: { paddingRight: 56 },
  pr60: { paddingRight: 60 },

  pt0: { paddingTop: 0 },
  pt1: { paddingTop: 1 },
  pt2: { paddingTop: 2 },
  pt3: { paddingTop: 3 },
  pt4: { paddingTop: 4 },
  pt5: { paddingTop: 5 },
  pt6: { paddingTop: 6 },
  pt8: { paddingTop: 8 },
  pt10: { paddingTop: 10 },
  pt12: { paddingTop: 12 },
  pt16: { paddingTop: 16 },
  pt20: { paddingTop: 20 },
  pt24: { paddingTop: 24 },
  pt28: { paddingTop: 28 },
  pt32: { paddingTop: 32 },
  pt36: { paddingTop: 36 },
  pt40: { paddingTop: 40 },
  pt44: { paddingTop: 44 },
  pt48: { paddingTop: 48 },
  pt52: { paddingTop: 52 },
  pt56: { paddingTop: 56 },
  pt60: { paddingTop: 60 },

  pb0: { paddingBottom: 0 },
  pb1: { paddingBottom: 1 },
  pb2: { paddingBottom: 2 },
  pb3: { paddingBottom: 3 },
  pb4: { paddingBottom: 4 },
  pb5: { paddingBottom: 5 },
  pb6: { paddingBottom: 6 },
  pb8: { paddingBottom: 8 },
  pb10: { paddingBottom: 10 },
  pb12: { paddingBottom: 12 },
  pb16: { paddingBottom: 16 },
  pb20: { paddingBottom: 20 },
  pb24: { paddingBottom: 24 },
  pb28: { paddingBottom: 28 },
  pb32: { paddingBottom: 32 },
  pb36: { paddingBottom: 36 },
  pb40: { paddingBottom: 40 },
  pb44: { paddingBottom: 44 },
  pb48: { paddingBottom: 48 },
  pb52: { paddingBottom: 52 },
  pb56: { paddingBottom: 56 },
  pb60: { paddingBottom: 60 },

  py0: { paddingVertical: 0 },
  py1: { paddingVertical: 1 },
  py2: { paddingVertical: 2 },
  py3: { paddingVertical: 3 },
  py4: { paddingVertical: 4 },
  py5: { paddingVertical: 5 },
  py6: { paddingVertical: 6 },
  py8: { paddingVertical: 8 },
  py10: { paddingVertical: 10 },
  py12: { paddingVertical: 12 },
  py16: { paddingVertical: 16 },
  py20: { paddingVertical: 20 },
  py24: { paddingVertical: 24 },
  py28: { paddingVertical: 28 },
  py32: { paddingVertical: 32 },
  py36: { paddingVertical: 36 },
  py40: { paddingVertical: 40 },
  py44: { paddingVertical: 44 },
  py48: { paddingVertical: 48 },
  py52: { paddingVertical: 52 },
  py56: { paddingVertical: 56 },
  py60: { paddingVertical: 60 },

  px0: { paddingHorizontal: 0 },
  px1: { paddingHorizontal: 1 },
  px2: { paddingHorizontal: 2 },
  px3: { paddingHorizontal: 3 },
  px4: { paddingHorizontal: 4 },
  px5: { paddingHorizontal: 5 },
  px6: { paddingHorizontal: 6 },
  px8: { paddingHorizontal: 8 },
  px10: { paddingHorizontal: 10 },
  px12: { paddingHorizontal: 12 },
  px16: { paddingHorizontal: 16 },
  px20: { paddingHorizontal: 20 },
  px24: { paddingHorizontal: 24 },
  px28: { paddingHorizontal: 28 },
  px32: { paddingHorizontal: 32 },
  px36: { paddingHorizontal: 36 },
  px40: { paddingHorizontal: 40 },
  px44: { paddingHorizontal: 44 },
  px48: { paddingHorizontal: 48 },
  px52: { paddingHorizontal: 52 },
  px56: { paddingHorizontal: 56 },
  px60: { paddingHorizontal: 60 },

  p0: { padding: 0 },
  p1: { padding: 1 },
  p2: { padding: 2 },
  p3: { padding: 3 },
  p4: { padding: 4 },
  p5: { padding: 5 },
  p6: { padding: 6 },
  p8: { padding: 8 },
  p10: { padding: 10 },
  p12: { padding: 12 },
  p16: { padding: 16 },
  p20: { padding: 20 },
  p24: { padding: 24 },
  p28: { padding: 28 },
  p32: { padding: 32 },
  p36: { padding: 36 },
  p40: { padding: 40 },
  p44: { padding: 44 },
  p48: { padding: 48 },
  p52: { padding: 52 },
  p56: { padding: 56 },
  p60: { padding: 60 },
};

const margin = {
  ml0: { marginLeft: 0 },
  ml1: { marginLeft: 1 },
  ml2: { marginLeft: 2 },
  ml3: { marginLeft: 3 },
  ml4: { marginLeft: 4 },
  ml5: { marginLeft: 5 },
  ml6: { marginLeft: 6 },
  ml8: { marginLeft: 8 },
  ml10: { marginLeft: 10 },
  ml12: { marginLeft: 12 },
  ml16: { marginLeft: 16 },
  ml20: { marginLeft: 20 },
  ml24: { marginLeft: 24 },
  ml28: { marginLeft: 28 },
  ml32: { marginLeft: 32 },
  ml36: { marginLeft: 36 },
  ml40: { marginLeft: 40 },
  ml44: { marginLeft: 44 },
  ml48: { marginLeft: 48 },
  ml52: { marginLeft: 52 },
  ml56: { marginLeft: 56 },
  ml60: { marginLeft: 60 },

  mr0: { marginRight: 0 },
  mr1: { marginRight: 1 },
  mr2: { marginRight: 2 },
  mr3: { marginRight: 3 },
  mr4: { marginRight: 4 },
  mr5: { marginRight: 5 },
  mr6: { marginRight: 6 },
  mr8: { marginRight: 8 },
  mr10: { marginRight: 10 },
  mr12: { marginRight: 12 },
  mr16: { marginRight: 16 },
  mr20: { marginRight: 20 },
  mr24: { marginRight: 24 },
  mr28: { marginRight: 28 },
  mr32: { marginRight: 32 },
  mr36: { marginRight: 36 },
  mr40: { marginRight: 40 },
  mr44: { marginRight: 44 },
  mr48: { marginRight: 48 },
  mr52: { marginRight: 52 },
  mr56: { marginRight: 56 },
  mr60: { marginRight: 60 },

  mt0: { marginTop: 0 },
  mt1: { marginTop: 1 },
  mt2: { marginTop: 2 },
  mt3: { marginTop: 3 },
  mt4: { marginTop: 4 },
  mt5: { marginTop: 5 },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  mt10: { marginTop: 10 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  mt24: { marginTop: 24 },
  mt28: { marginTop: 28 },
  mt32: { marginTop: 32 },
  mt36: { marginTop: 36 },
  mt40: { marginTop: 40 },
  mt44: { marginTop: 44 },
  mt48: { marginTop: 48 },
  mt52: { marginTop: 52 },
  mt56: { marginTop: 56 },
  mt60: { marginTop: 60 },

  mb0: { marginBottom: 0 },
  mb1: { marginBottom: 1 },
  mb2: { marginBottom: 2 },
  mb3: { marginBottom: 3 },
  mb4: { marginBottom: 4 },
  mb5: { marginBottom: 5 },
  mb6: { marginBottom: 6 },
  mb8: { marginBottom: 8 },
  mb10: { marginBottom: 10 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  mb24: { marginBottom: 24 },
  mb28: { marginBottom: 28 },
  mb32: { marginBottom: 32 },
  mb36: { marginBottom: 36 },
  mb40: { marginBottom: 40 },
  mb44: { marginBottom: 44 },
  mb48: { marginBottom: 48 },
  mb52: { marginBottom: 52 },
  mb56: { marginBottom: 56 },
  mb60: { marginBottom: 60 },

  my0: { marginVertical: 0 },
  my1: { marginVertical: 1 },
  my2: { marginVertical: 2 },
  my3: { marginVertical: 3 },
  my4: { marginVertical: 4 },
  my5: { marginVertical: 5 },
  my6: { marginVertical: 6 },
  my8: { marginVertical: 8 },
  my10: { marginVertical: 10 },
  my12: { marginVertical: 12 },
  my16: { marginVertical: 16 },
  my20: { marginVertical: 20 },
  my24: { marginVertical: 24 },
  my28: { marginVertical: 28 },
  my32: { marginVertical: 32 },
  my36: { marginVertical: 36 },
  my40: { marginVertical: 40 },
  my44: { marginVertical: 44 },
  my48: { marginVertical: 48 },
  my52: { marginVertical: 52 },
  my56: { marginVertical: 56 },
  my60: { marginVertical: 60 },

  mx0: { marginHorizontal: 0 },
  mx1: { marginHorizontal: 1 },
  mx2: { marginHorizontal: 2 },
  mx3: { marginHorizontal: 3 },
  mx4: { marginHorizontal: 4 },
  mx5: { marginHorizontal: 5 },
  mx6: { marginHorizontal: 6 },
  mx8: { marginHorizontal: 8 },
  mx10: { marginHorizontal: 10 },
  mx12: { marginHorizontal: 12 },
  mx16: { marginHorizontal: 16 },
  mx20: { marginHorizontal: 20 },
  mx24: { marginHorizontal: 24 },
  mx28: { marginHorizontal: 28 },
  mx32: { marginHorizontal: 32 },
  mx36: { marginHorizontal: 36 },
  mx40: { marginHorizontal: 40 },
  mx44: { marginHorizontal: 44 },
  mx48: { marginHorizontal: 48 },
  mx52: { marginHorizontal: 52 },
  mx56: { marginHorizontal: 56 },
  mx60: { marginHorizontal: 60 },

  m0: { margin: 0 },
  m1: { margin: 1 },
  m2: { margin: 2 },
  m3: { margin: 3 },
  m4: { margin: 4 },
  m5: { margin: 5 },
  m6: { margin: 6 },
  m8: { margin: 8 },
  m10: { margin: 10 },
  m12: { margin: 12 },
  m16: { margin: 16 },
  m20: { margin: 20 },
  m24: { margin: 24 },
  m28: { margin: 28 },
  m32: { margin: 32 },
  m36: { margin: 36 },
  m40: { margin: 40 },
  m44: { margin: 44 },
  m48: { margin: 48 },
  m52: { margin: 52 },
  m56: { margin: 56 },
  m60: { margin: 60 },
};

const position = {
  abs: { position: 'absolute' },
  rel: { position: 'relative' },
  inset0: { top: 0, bottom: 0, right: 0, left: 0 },
  insetY0: { top: 0, bottom: 0 },
  insetX0: { right: 0, left: 0 },
  top0: { top: 0 },
  bottom0: { bottom: 0 },
  right0: { right: 0 },
  left0: { left: 0 },
};

const shadow = {
  shadowHeader: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  shadow1: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  shadow2: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  shadow3: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
};

const text = {
  colorPrimary: { color: '#003737' },
  colorSecondary: { color: '#ff9910' },
  colorTransparent: { color: 'transparent' },
  colorBlack: { color: 'black' },
  colorWhite: { color: 'white' },
  colorGray100: { color: '#f7fafc' },
  colorGray200: { color: '#edf2f7' },
  colorGray300: { color: '#e2e8f0' },
  colorGray400: { color: '#cbd5e0' },
  colorGray500: { color: '#a0aec0' },
  colorGray600: { color: '#718096' },
  colorGray700: { color: '#4a5568' },
  colorGray800: { color: '#2d3748' },
  colorGray900: { color: '#1a202c' },
  colorRed: { color: '#E3342F' },
  colorGreen: { color: '#38C172' },
  colorOrange: { color: '#F6993F' },
  colorYellow: { color: '#FFED4A' },
  colorBlue: { color: '#3490DC' },
  colorTeal: { color: '#4DC0B5' },
  colorIndigo: { color: '#6574CD' },
  colorPurple: { color: '#9561E2' },
  colorPink: { color: '#F66D9B' },

  H1: { fontSize: RFPercentage(5), color: 'black', fontFamily: fBold, lineHeight: 34 },
  H2: { fontSize: RFPercentage(4.5), color: 'black', fontFamily: fBold, lineHeight: 32 },
  H3: { fontSize: RFPercentage(4), color: 'black', fontFamily: fBold, lineHeight: 30 },
  H4: { fontSize: RFPercentage(3.5), color: 'black', fontFamily: fBold, lineHeight: 28 },
  H5: { fontSize: RFPercentage(3), color: 'black', fontFamily: fMedium, lineHeight: 26 },
  H6: { fontSize: RFPercentage(2.5), color: 'black', fontFamily: fMedium, lineHeight: 23 },
  textTitle: {
    fontSize: RFPercentage(2.3),
    color: 'black',
    fontFamily: fMedium,
    lineHeight: platform === PLATFORM.IOS ? 23 : 24
  },
  textMeta: {
    fontSize: RFPercentage(1.8),
    color: '#4a5568',
    fontFamily: fLight,
    lineHeight: 20
  },
  textDefault: {
    fontSize: RFPercentage(2.3),
    color: 'black',
    fontFamily: fRegular,
    lineHeight: platform === PLATFORM.IOS ? 23 : 24,
  },
  textButton: {
    fontSize: RFPercentage(2),
    color: 'white',
    fontFamily: fBold,
    lineHeight: 20
  },
  fontBold: { fontFamily: fBold },
  fontMedium: { fontFamily: fMedium },
  fontRegular: { fontFamily: fRegular },
  fontLight: { fontFamily: fLight },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  textCenter: { textAlign: 'center' },
  textJustify: { textAlign: 'justify' },
  textUnderline: { textDecorationLine: 'underline' },
  textItalic: { fontStyle: 'italic' },
  textBold: { fontWeight: 'bold' },
};

const border = {
  rounded1: { borderRadius: 5 },
  rounded2: { borderRadius: 10 },
  rounded3: { borderRadius: 15 },
  rounded4: { borderRadius: 20 },
  rounded5: { borderRadius: 25 },
  rounded6: { borderRadius: 30 },
  rounded7: { borderRadius: 35 },
  rounded8: { borderRadius: 40 },
  rounded9: { borderRadius: 45 },
  rounded10: { borderRadius: 50 },

  roundedTopLeft1: { borderTopLeftRadius: 5 },
  roundedTopLeft2: { borderTopLeftRadius: 10 },
  roundedTopLeft3: { borderTopLeftRadius: 15 },
  roundedTopLeft4: { borderTopLeftRadius: 20 },
  roundedTopLeft5: { borderTopLeftRadius: 25 },
  roundedTopLeft6: { borderTopLeftRadius: 30 },
  roundedTopLeft7: { borderTopLeftRadius: 35 },
  roundedTopLeft8: { borderTopLeftRadius: 40 },
  roundedTopLeft9: { borderTopLeftRadius: 45 },
  roundedTopLeft10: { borderTopLeftRadius: 50 },

  roundedTopRight1: { borderTopRightRadius: 5 },
  roundedTopRight2: { borderTopRightRadius: 10 },
  roundedTopRight3: { borderTopRightRadius: 15 },
  roundedTopRight4: { borderTopRightRadius: 20 },
  roundedTopRight5: { borderTopRightRadius: 25 },
  roundedTopRight6: { borderTopRightRadius: 30 },
  roundedTopRight7: { borderTopRightRadius: 35 },
  roundedTopRight8: { borderTopRightRadius: 40 },
  roundedTopRight9: { borderTopRightRadius: 45 },
  roundedTopRight10: { borderTopRightRadius: 50 },

  roundedBottomLeft1: { borderBottomLeftRadius: 5 },
  roundedBottomLeft2: { borderBottomLeftRadius: 10 },
  roundedBottomLeft3: { borderBottomLeftRadius: 15 },
  roundedBottomLeft4: { borderBottomLeftRadius: 20 },
  roundedBottomLeft5: { borderBottomLeftRadius: 25 },
  roundedBottomLeft6: { borderBottomLeftRadius: 30 },
  roundedBottomLeft7: { borderBottomLeftRadius: 35 },
  roundedBottomLeft8: { borderBottomLeftRadius: 40 },
  roundedBottomLeft9: { borderBottomLeftRadius: 45 },
  roundedBottomLeft10: { borderBottomLeftRadius: 50 },

  roundedBottomRight1: { borderBottomRightRadius: 5 },
  roundedBottomRight2: { borderBottomRightRadius: 10 },
  roundedBottomRight3: { borderBottomRightRadius: 15 },
  roundedBottomRight4: { borderBottomRightRadius: 20 },
  roundedBottomRight5: { borderBottomRightRadius: 25 },
  roundedBottomRight6: { borderBottomRightRadius: 30 },
  roundedBottomRight7: { borderBottomRightRadius: 35 },
  roundedBottomRight8: { borderBottomRightRadius: 40 },
  roundedBottomRight9: { borderBottomRightRadius: 45 },
  roundedBottomRight10: { borderBottomRightRadius: 50 },

  borderAll: { borderColor: Colors.GRAY_500, borderWidth: 0.5 },
  borderTop: { borderTopColor: Colors.GRAY_500, borderTopWidth: 0.5 },
  borderBottom: { borderBottomColor: Colors.GRAY_500, borderBottomWidth: 0.5 },
  borderRight: { borderRightColor: Colors.GRAY_500, borderRightWidth: 0.5 },
  borderLeft: { borderLeftColor: Colors.GRAY_500, borderLeftWidth: 0.5 },

}

export default {
  ...main,
  ...padding,
  ...margin,
  ...position,
  ...shadow,
  ...text,
  ...border,
};