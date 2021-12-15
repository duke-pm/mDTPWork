/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: FilterTags
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: All tags of filter requests
 **/
import PropTypes from 'prop-types';
import React, {createRef, useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
/* COMPONENTS */
import CIcon from '~/components/CIcon';
import CText from '~/components/CText';
import CIconButton from '~/components/CIconButton';
import CActionSheet from '~/components/CActionSheet';
import CInput from '~/components/CInput';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {colors, cStyles} from '~/utils/style';
import {DEFAULT_FORMAT_DATE_2} from '~/config/constants';
import {moderateScale, verticalScale} from '~/utils/helper';

/** All ref */
const asResourceRef = createRef();

/** All init */
const TXT_AS_SIZE = moderateScale(18);

function FilterTags(props) {
  const {
    customColors = {},
    formatDateView = DEFAULT_FORMAT_DATE_2,
    fromDate = '',
    toDate = '',
    search = '',
    resourcesMaster = [],
    resource = {}, // for filter by 1 resource
    resources = [], // for filter by some resource
    primaryColor = undefined,
    translation = () => null,
    onChangeReSrc = () => null,
    onPressRemoveReSrc = () => null,
  } = props;

  /** use states */
  const [dataResources, setDataResources] = useState(resourcesMaster);
  const [findResource, setFindResource] = useState('');
  const [reSrc, setReSrc] = useState(0);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleResource = () => asResourceRef.current?.show();

  const handleChangeResource = () => {
    let tmpResource = null;
    if (findResource === '') {
      tmpResource = dataResources[reSrc];
    } else {
      if (dataResources.length > 0) {
        tmpResource = dataResources[reSrc];
      }
    }
    if (tmpResource) {
      onChangeReSrc(tmpResource);
    }
    asResourceRef.current?.hide();
  };

  /**********
   ** FUNC **
   **********/
  const onChangeResource = index => setReSrc(index);

  const onSearchResources = text => {
    if (text) {
      const newData = dataResources.filter(function (item) {
        const itemData = item.resourceName
          ? item.resourceName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setDataResources(newData);
      setFindResource(text);
      if (newData.length > 0) {
        setReSrc(0);
      }
    } else {
      setDataResources(resourcesMaster);
      setFindResource(text);
      setReSrc(0);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (resource.id && resourcesMaster.length > 0) {
      let findResrc = resourcesMaster.findIndex(
        f => f.resourceID === resource.id,
      );
      if (findResrc !== -1) {
        setReSrc(findResrc);
      }
    }
  }, [resource.id]);

  /************
   ** RENDER **
   ************/
  return (
    <View
      style={[
        cStyles.flexWrap,
        cStyles.row,
        cStyles.itemsCenter,
        cStyles.px6,
        cStyles.pt10,
        cStyles.pb6,
      ]}>
      <CIcon name={Icons.tags} />
      {!resource.id && (
        <View
          style={[
            cStyles.px6,
            cStyles.py2,
            cStyles.mx4,
            cStyles.rounded1,
            {backgroundColor: primaryColor},
          ]}>
          <CText
            styles={'textCaption2'}
            customLabel={`${translation('common:from_date')}${
              fromDate !== '' ? moment(fromDate).format(formatDateView) : '#'
            }\n${translation('common:to_date')}${
              toDate !== '' ? moment(toDate).format(formatDateView) : '#'
            }`}
          />
        </View>
      )}

      {!resource.id && search !== '' && (
        <View
          style={[
            cStyles.px6,
            cStyles.py2,
            cStyles.mx4,
            cStyles.mt3,
            cStyles.rounded1,
            {backgroundColor: primaryColor},
          ]}>
          <CText
            styles={'textCaption2 colorBlack'}
            customLabel={`${translation('common:find')}: "${search}"`}
          />
        </View>
      )}

      {resource.id && (
        <View
          style={[
            cStyles.px6,
            cStyles.mx4,
            cStyles.mt3,
            cStyles.rounded1,
            cStyles.row,
            cStyles.itemsCenter,
            {backgroundColor: primaryColor},
          ]}>
          <CText
            styles={'textCaption2 colorBlack pr4'}
            customLabel={`${translation('bookings:resource')}: ${
              resource.name
            }`}
          />
          <CIconButton iconName={Icons.change} onPress={handleResource} />
          <CIconButton iconName={Icons.remove} onPress={onPressRemoveReSrc} />
        </View>
      )}

      {!resource.id &&
        resources &&
        resources !== 'all' &&
        resources.map((itemResrc, index) => {
          return (
            <View
              key={itemResrc.label + index}
              style={[
                cStyles.px6,
                cStyles.py2,
                cStyles.mr4,
                cStyles.mt8,
                cStyles.rounded1,
                {backgroundColor: primaryColor},
              ]}>
              <CText
                styles={'textCaption2 colorBlack'}
                customLabel={itemResrc.label}
              />
            </View>
          );
        })}

      {!resource.id && resources && resources === 'all' && (
        <View
          style={[
            cStyles.px6,
            cStyles.py2,
            cStyles.mr4,
            cStyles.mt8,
            cStyles.rounded1,
            {backgroundColor: primaryColor},
          ]}>
          <CText
            styles={'textCaption2'}
            customLabel={`${translation('bookings:resource')}: ${translation(
              'common:all',
            )}`}
          />
        </View>
      )}

      {resource.id && (
        <CActionSheet
          headerChoose
          actionRef={asResourceRef}
          headerChooseTitle={'bookings:choose_resource'}
          onConfirm={handleChangeResource}>
          <View style={cStyles.px16}>
            <CInput
              containerStyle={cStyles.my10}
              styleFocus={styles.input_focus}
              holder={'add_booking:holder_find_resource'}
              returnKey={'search'}
              icon={Icons.search}
              value={findResource}
              onChangeValue={onSearchResources}
            />
            <Picker
              style={[styles.action, cStyles.fullWidth, cStyles.justifyCenter]}
              itemStyle={{
                fontSize: TXT_AS_SIZE,
                color: customColors.text,
              }}
              selectedValue={reSrc}
              onValueChange={onChangeResource}>
              {dataResources.length > 0 ? (
                dataResources.map((value, i) => (
                  <Picker.Item
                    label={value.resourceName}
                    value={i}
                    key={value.resourceID}
                  />
                ))
              ) : (
                <View style={[cStyles.center, styles.content_picker]}>
                  <CText
                    styles={'textCaption1'}
                    label={'add_booking:holder_empty_resource'}
                  />
                </View>
              )}
            </Picker>
          </View>
        </CActionSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input_focus: {borderColor: colors.SECONDARY},
  action: {height: verticalScale(180)},
  content_picker: {height: '40%'},
});

FilterTags.propTypes = {
  customColors: PropTypes.object,
  formatDateView: PropTypes.string,
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  search: PropTypes.string,
  resourcesMaster: PropTypes.array,
  resource: PropTypes.any,
  resources: PropTypes.array,
  primaryColor: PropTypes.string,
  translation: PropTypes.func,
  onChangeReSrc: PropTypes.func,
  onPressRemoveReSrc: PropTypes.func,
};

export default FilterTags;
