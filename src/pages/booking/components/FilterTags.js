/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: FilterTags
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: All tags of filter requests
 **/
import PropTypes from 'prop-types';
import React, {createRef, useState, useEffect} from 'react';
import {Button, Icon, Layout, useTheme, Text} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import Picker from '@gregfrench/react-native-wheel-picker';
import moment from 'moment';
import 'moment/locale/en-sg';
/* COMMON */
import Icons from '~/utils/common/Icons';
import {colors, cStyles} from '~/utils/style';
import {moderateScale, verticalScale} from '~/utils/helper';

/** All ref */
const asResourceRef = createRef();

/** All init */
const TXT_AS_SIZE = moderateScale(18);

const RenderCloseIcon = props => (
  <Icon {...props} name="close-circle-outline" />
);

const RenderChangeIcon = props => (
  <Icon {...props} name="repeat-outline" />
);

function FilterTags(props) {
  const theme = useTheme();
  const {
    resourcesMaster = [],
    resource = {}, // for filter by 1 resource
    resources = [], // for filter by some resource
    trans = () => null,
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
  if (!resource.id) return null;
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
      {resource.id && (
        <Layout
          style={[
            cStyles.p6,
            cStyles.mx4,
            cStyles.rounded1,
            cStyles.row,
            cStyles.itemsCenter,
          ]}>
          <Text style={cStyles.ml5}>{resource.name}</Text>
          <Button
            style={cStyles.ml5}
            appearance="ghost"
            size="small"
            status="primary"
            accessoryLeft={RenderChangeIcon}
            onPress={handleResource}
          />
          <Button
            appearance="ghost"
            size="small"
            status="danger"
            accessoryLeft={RenderCloseIcon}
            onPress={onPressRemoveReSrc}
          />
        </Layout>
      )}
    </View>
  );
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
          <Text
            styles={'textCaption2'}
            customLabel={`${trans('common:from_date')}${
              fromDate !== '' ? moment(fromDate).format(formatDateView) : '#'
            }\n${trans('common:to_date')}${
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
          <Text
            styles={'textCaption2 colorBlack'}
            customLabel={`${trans('common:find')}: "${search}"`}
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
          <Text
            styles={'textCaption2 colorBlack pr4'}
            customLabel={`${trans('bookings:resource')}: ${
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
              <Text
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
          <Text
            styles={'textCaption2'}
            customLabel={`${trans('bookings:resource')}: ${trans(
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
                  <Text
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
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
  search: PropTypes.string,
  resourcesMaster: PropTypes.array,
  resource: PropTypes.any,
  resources: PropTypes.array,
  trans: PropTypes.func,
  onChangeReSrc: PropTypes.func,
  onPressRemoveReSrc: PropTypes.func,
};

export default FilterTags;
