/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter of project
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of FilterProject.js
 **/
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native-appearance';
import {SafeAreaView} from 'react-native-safe-area-context';
import {BlurView} from '@react-native-community/blur';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
/* COMPONENTS */
import CHeader from '~/components/CHeader';
import CText from '~/components/CText';
import CRowLabel from '~/components/CRowLabel';
import CLoading from '~/components/CLoading';
/* COMMON */
import {THEME_DARK} from '~/config/constants';
import {colors, cStyles} from '~/utils/style';
import {IS_IOS, scalePx} from '~/utils/helper';

// const RowToggle = (
//   isDark,
//   customColors,
//   label,
//   active,
//   onToggle,
//   isLast = true,
//   isFirst = false,
// ) => {
//   return (
//     <View
//       style={[
//         cStyles.row,
//         cStyles.itemsCenter,
//         cStyles.justifyBetween,
//         cStyles.pl16,
//         styles.row_header,
//         isLast && isDark && cStyles.borderBottomDark,
//         isLast && !isDark && cStyles.borderBottom,
//         isFirst && isDark && cStyles.borderTopDark,
//         isFirst && !isDark && cStyles.borderTop,
//         {backgroundColor: customColors.card},
//       ]}>
//       <CText label={label} />
//       <Switch
//         style={cStyles.mr16}
//         trackColor={{false: '#767577', true: customColors.green}}
//         thumbColor={'#f4f3f4'}
//         onValueChange={onToggle}
//         value={active}
//       />
//     </View>
//   );
// };

const RowSelect = (
  isDark,
  customColors,
  value,
  label,
  active,
  onPress,
  isBorder = true,
  isFirst,
  isLast,
) => {
  const handleChange = () => onPress(value);

  return (
    <TouchableOpacity key={value + label} onPress={handleChange}>
      <View
        style={[
          cStyles.row,
          cStyles.itemsCenter,
          styles.row_header,
          isFirst && isDark && cStyles.borderTopDark,
          isFirst && !isDark && cStyles.borderTop,
          isLast && isDark && cStyles.borderBottomDark,
          isLast && !isDark && cStyles.borderBottom,
          {backgroundColor: customColors.card},
        ]}>
        <View style={styles.left_row_select} />

        <View
          style={[
            cStyles.fullHeight,
            cStyles.fullWidth,
            cStyles.row,
            cStyles.itemsCenter,
            cStyles.justifyBetween,
            cStyles.pr32,
            !isLast && isBorder && isDark && cStyles.borderBottomDark,
            !isLast && isBorder && !isDark && cStyles.borderBottom,
          ]}>
          <CText label={label} />
          {active && (
            <Icon
              name={'check'}
              color={customColors.primary}
              size={scalePx(3)}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

function FilterProject(props) {
  const {t} = useTranslation();
  const {customColors} = useTheme();
  const isDark = useColorScheme() === THEME_DARK;
  const {
    visible = false,
    data = {
      status: [],
      owner: [],
    },
    onFilter = () => {},
  } = props;

  /** Use state */
  const [loading, setLoading] = useState(false);
  const [owner, setOwner] = useState({
    data: [],
    active: [],
  });
  const [status, setStatus] = useState({
    data: [],
    active: [],
  });

  /** HANDLE FUNC */
  const handleReset = () => {
    let tmpStatus = [],
      tmpOwner = [],
      i = null;
    for (i of props.data.owner) {
      tmpOwner.push(i.value);
    }
    for (i of props.data.status) {
      tmpStatus.push(i.value);
    }

    setStatus({...status, active: tmpStatus});
    setOwner({...owner, active: tmpOwner});
  };

  const handleFilter = () => {
    onFilter(owner.active, status.active);
  };

  /** FUNC */
  const onChangeOwner = value => {
    if (owner.active.length >= 1) {
      setLoading(true);
      let newOwner = [...owner.active];
      let find = newOwner.indexOf(value);
      if (find !== -1) {
        if (owner.active.length !== 1) {
          newOwner.splice(find, 1);
        }
      } else {
        newOwner.push(value);
      }
      setOwner({...owner, active: newOwner});
      setLoading(false);
    }
  };

  const onChangeStatus = value => {
    if (status.active.length >= 1) {
      setLoading(true);
      let newStatus = [...status.active];
      let find = newStatus.indexOf(value);
      if (find !== -1) {
        if (status.active.length !== 1) {
          newStatus.splice(find, 1);
        }
      } else {
        newStatus.push(value);
      }
      setStatus({...status, active: newStatus});
      setLoading(false);
    }
  };

  /** LIFE CYCLE */
  useEffect(() => {
    let tmp = [];
    for (let i of props.data.owner) {
      tmp.push(i.value);
    }
    setOwner({data: props.data.owner, active: tmp});

    let tmp2 = [];
    for (let i of props.data.status) {
      tmp2.push(i.value);
    }
    setStatus({data: props.data.status, active: tmp2});
  }, []);

  /** RENDER */
  return (
    <Modal
      style={cStyles.m0}
      isVisible={visible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      backdropOpacity={0}>
      <SafeAreaView
        style={[
          cStyles.flex1,
          {
            backgroundColor: isDark
              ? customColors.header
              : customColors.primary,
          },
        ]}
        edges={['right', 'left', 'top']}>
        {isDark && IS_IOS && (
          <BlurView
            style={[cStyles.abs, cStyles.inset0]}
            blurType={'extraDark'}
            reducedTransparencyFallbackColor={colors.BLACK}
          />
        )}
        <View
          style={[cStyles.flex1, {backgroundColor: customColors.background}]}>
          {/** Header of filter */}
          <CHeader
            centerStyle={cStyles.center}
            left={
              <TouchableOpacity
                style={[cStyles.itemsStart, cStyles.pl16]}
                onPress={handleReset}>
                <CText styles={'colorWhite'} label={'common:reset'} />
              </TouchableOpacity>
            }
            right={
              <TouchableOpacity
                style={[cStyles.itemsEnd, cStyles.pr16]}
                onPress={handleFilter}>
                <CText styles={'colorWhite'} label={'common:apply'} />
              </TouchableOpacity>
            }
            title={'project_management:filter'}
          />

          {/** Content of filter */}
          <ScrollView
            style={cStyles.flex1}
            keyboardShouldPersistTaps={'handled'}>
            <CRowLabel label={t('project_management:title_owner')} />
            {data.owner.map((item, index) => {
              let isActive = owner.active.indexOf(item.value);
              return RowSelect(
                isDark,
                customColors,
                item.value,
                item.label,
                isActive !== -1,
                onChangeOwner,
                true,
                index === 0,
                index === data.owner.length - 1,
              );
            })}

            <CRowLabel label={t('status:title')} />
            {data.status.map((item, index) => {
              let isActive = status.active.indexOf(item.value);
              return RowSelect(
                isDark,
                customColors,
                item.value,
                item.label,
                isActive !== -1,
                onChangeStatus,
                true,
                index === 0,
                index === data.status.length - 1,
              );
            })}
          </ScrollView>
        </View>
        <CLoading customColors={customColors} visible={loading} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: cStyles.toolbarHeight,
    top: 0,
    left: 0,
    right: 0,
  },
  row_header: {height: 50},
  left_row_select: {width: 16},
});

export default FilterProject;
