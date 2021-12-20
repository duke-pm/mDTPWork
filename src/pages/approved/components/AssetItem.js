/* eslint-disable no-extend-native */
/* eslint-disable eqeqeq */
/* eslint-disable no-bitwise */
/**
 ** Name: Asset Item
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of AssetItem.js
 **/
 import PropTypes from 'prop-types';
 import React from 'react';
 import {useTheme, Button} from '@ui-kitten/components';
 import {Keyboard, TextInput} from 'react-native';
 import CurrencyInput from 'react-native-currency-input';
 /** COMPONENTS */
 import CIcon from '~/components/CIcon';
 /* COMMON */
 import {cStyles} from '~/utils/style';
 
 Number.prototype.format = function (n, x) {
   if (n == 0) {
     return '';
   }
   let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
   return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
 };
 
 function AssetItem(props) {
   const theme = useTheme();
   const {isDetail, rowIndex, cellIndex, onChangeCellItem, onRemoveRow} = props;
 
   if (cellIndex === 0) {
     if (isDetail) {
       return null;
     }
     return (
       <Button
         appearance="ghost"
         size="small"
         status="danger"
         accessoryLeft={propsL => CIcon(propsL, 'eva', 'close', theme['color-danger-500'])}
         onPress={() => onRemoveRow(rowIndex)}
       />
     );
   }
   if (cellIndex === 3 || cellIndex === 4) {
     return (
       <CurrencyInput
         style={[
           cStyles.p4,
           cStyles.flexWrap,
           cStyles.textRight,
           cStyles.textBody,
           styleText,
           {color: theme['text-basic-color']}
         ]}
         value={props.cellData}
         selectionColor={theme['text-basic-color']}
         editable={!props.disabled}
         onChangeValue={value => onChangeCellItem(value, rowIndex, cellIndex)}
         // prefix="đ"
         delimiter={','}
         separator={'.'}
         precision={0}
       />
     );
   }
   let styleText =
     cellIndex === 1
       ? cStyles.textLeft
       : cellIndex === 2 || cellIndex === 0
       ? cStyles.textCenter
       : cStyles.textRight;
   return (
     <TextInput
       style={[
         cStyles.p4,
         cStyles.textBody,
         {color: theme['text-basic-color']},
         styleText,
       ]}
       keyboardType={cellIndex !== 1 ? 'number-pad' : 'default'}
       returnKeyType={'done'}
       selectionColor={theme['text-basic-color']}
       multiline
       editable={!props.disabled}
       value={
         typeof props.cellData === 'number'
           ? props.cellData + ''
           : props.cellData
       }
       onSubmitEditing={Keyboard.dismiss}
       onChangeText={value => onChangeCellItem(value, rowIndex, cellIndex)}
     />
   );
 }
 
 AssetItem.propTypes = {
   disabled: PropTypes.bool,
   isDetail: PropTypes.bool,
   rowIndex: PropTypes.number,
   cellIndex: PropTypes.number,
   cellData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
   onChangeCellItem: PropTypes.func,
   onRemoveRow: PropTypes.func,
 };
 
 export default AssetItem;
 