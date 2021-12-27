/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Custom Form
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of CForm.js
 **/
import PropTypes from 'prop-types';
import React, {
  createRef,
  forwardRef,
  useContext,
  useState,
  useEffect,
  useImperativeHandle,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Input,
  Button,
  Icon,
  Spinner,
  Select,
  SelectItem,
  Toggle,
  RadioGroup,
  Radio,
  useTheme,
  Datepicker,
  IndexPath,
} from '@ui-kitten/components';
import {MomentDateService} from '@ui-kitten/moment';
import {
  TouchableWithoutFeedback,
  View,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import moment from 'moment';
/** COMPONENTS */
import CText from './CText';
/* COMMON */
import {ThemeContext} from '~/configs/theme-context';
import {cStyles} from '~/utils/style';
import {IS_ANDROID, validatEemail} from '~/utils/helper';

if (IS_ANDROID) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

/*********************
 ** OTHER COMPONENT **
 *********************/
const RenderIconPassword = (props, secureTextEntry, onToggleSecureEntry) => (
  <TouchableWithoutFeedback onPress={onToggleSecureEntry}>
    <Icon {...props} name={secureTextEntry ? 'eye-off' : 'eye'} />
  </TouchableWithoutFeedback>
);

const RenderLoadingIndicator = props => (
  <View style={[props.style, cStyles.center]}>
    <Spinner size="small" status="control" />
  </View>
);

const RenderCalendarIcon = props => <Icon {...props} name="calendar" />;

/********************
 ** MAIN COMPONENT **
 ********************/
const CForm = forwardRef((props, ref) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const themeContext = useContext(ThemeContext);
  const {
    containerStyle = {},
    loading = false,
    inputs = [
      {
        style: {},
        id: 'text',
        type: '',
        position: '',
        label: '',
        holder: '',
        value: '',
        values: [],
        multiline: false,
        horizontal: false, // for Radio type
        required: true,
        email: false,
        phone: false,
        password: false,
        number: false,
        next: false,
        return: 'done',
        validate: {type: '', helper: ''},
      },
      {
        style: {},
        id: 'select',
        type: 'select',
        label: 'Select box 1',
        holder: 'Select one of below',
        value: '',
        values: ['Option 1', 'Option 2', 'Option 3'],
        required: false,
        password: false,
        email: false,
        phone: false,
        number: false,
        next: false,
        return: 'done',
      },
      {
        style: {},
        id: 'toggle',
        type: 'toggle',
        position: 'left',
        label: 'Toggle',
        value: '',
        required: false,
        password: false,
        email: false,
        phone: false,
        number: false,
        next: false,
        return: 'done',
      },
      {
        id: 'radio',
        style: {},
        type: 'radio',
        label: 'Radio button',
        value: '',
        values: ['Option 1', 'Option 2', 'Option 3'],
        required: false,
        password: false,
        email: false,
        phone: false,
        number: false,
        next: false,
        return: 'done',
      },
    ],
    customAddingForm = null,
    disabledButton = false,
    statusButton2 = 'primary',
    labelButton = '',
    labelButton2 = undefined,
    typeButton = 'filled',
    typeButton2 = 'filled',
    onSubmit = () => {},
    onSubmit2 = undefined,
  } = props;

  /** Use state */
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState(null);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const onToggleSecureEntry = idxInput => {
    let tmpValues = [...values];
    tmpValues[idxInput].secureTextEntry = !tmpValues[idxInput].secureTextEntry;
    setValues(tmpValues);
  };

  const handleChangeValue = (idxInput, newValue) => {
    let tmpValues = [...values];
    tmpValues[idxInput].value = newValue + '';
    setValues(tmpValues);
  };

  const handleSubmitEditing = (idxInput, isNext) => {
    if (isNext) {
      values[idxInput] && values[idxInput + 1].ref.current.focus();
    }
  };

  const handleSelectedIndex = (idxInput, newIndex, isChooseTime) => {
    let tmpValues = [...values];
    if (!isChooseTime) tmpValues[idxInput].value = newIndex - 1;
    else tmpValues[idxInput].value.time = newIndex - 1;
    setValues(tmpValues);
  };

  const handleChangeRadioIndex = (idxInput, newIndex) => {
    let tmpValues = [...values];
    tmpValues[idxInput].value = newIndex;
    setValues(tmpValues);
  };

  const handleToggle = idxInput => {
    let tmpValues = [...values];
    tmpValues[idxInput].value = !tmpValues[idxInput].value;
    setValues(tmpValues);
  };

  const handleChangeDatePicker = (idxInput, newDate, isChooseTime) => {
    let tmpValues = [...values];
    if (!isChooseTime) tmpValues[idxInput].value = newDate;
    else tmpValues[idxInput].value.date = newDate;
    setValues(tmpValues);
  };

  /**********
   ** FUNC **
   **********/
  const onCheckValidate = () => {
    let tmpIsError = false;
    let i,
      tmpErrors = [...errors];

    for (i = 0; i < values.length; i++) {
      /** Check required */
      if (values[i].required && values[i].type === 'text') {
        if (values[i].value.trim() === '') {
          tmpIsError = true;
          tmpErrors[i].status = true;
          tmpErrors[i].type = 'required';
          tmpErrors[i].helper = t('error:empty_length');
        } else if (
          values[i].value.trim() !== '' &&
          tmpErrors[i].type === 'required'
        ) {
          tmpIsError = false;
          tmpErrors[i].status = false;
          tmpErrors[i].type = '';
          tmpErrors[i].helper = '';
        } else if (tmpErrors[i].status) {
          tmpIsError = true;
        }
      }
      if (values[i].required && values[i].type === 'select') {
        if (values[i].value === '') {
          tmpIsError = true;
          tmpErrors[i].status = true;
          tmpErrors[i].type = 'required';
          tmpErrors[i].helper = t('error:empty_length');
        } else if (
          values[i].value !== '' &&
          tmpErrors[i].type === 'required'
        ) {
          tmpIsError = false;
          tmpErrors[i].status = false;
          tmpErrors[i].type = '';
          tmpErrors[i].helper = '';
        } else if (tmpErrors[i].status) {
          tmpIsError = true;
        }
      }
      if (values[i].required
        && values[i].type === 'datePicker'
        && typeof values[i].value === 'object') {
        if (values[i].value.time === '') {
          tmpIsError = true;
          tmpErrors[i].status = true;
          tmpErrors[i].type = 'required';
          tmpErrors[i].helper = t('error:empty_length');
        } else if (
          values[i].value.time !== '' &&
          tmpErrors[i].type === 'required'
        ) {
          tmpIsError = false;
          tmpErrors[i].status = false;
          tmpErrors[i].type = '';
          tmpErrors[i].helper = '';
        } else if (tmpErrors[i].status) {
          tmpIsError = true;
        }
      }

      /** Check is email */
      if (values[i].validate === 'format_email') {
        let isTrueValue = validatEemail(values[i].value.trim());
        if (!isTrueValue) {
          tmpIsError = true;
          tmpErrors[i].status = true;
          tmpErrors[i].type = 'format_email';
          tmpErrors[i].helper = t('error:format_email');
        } else if (tmpErrors[i].type === 'format_email') {
          tmpIsError = false;
          tmpErrors[i].status = false;
          tmpErrors[i].type = '';
          tmpErrors[i].helper = '';
        } else if (tmpErrors[i].status) {
          tmpIsError = true;
        }
      }

      /** Check min length */
      if (values[i].validate === 'min_length') {
        let isTrueValue = values[i].value.trim();
        isTrueValue = isTrueValue.length >= Number(values[i].validateHelper);
        if (!isTrueValue) {
          tmpIsError = true;
          tmpErrors[i].status = true;
          tmpErrors[i].type = 'min_length';
          tmpErrors[i].helper =
            t('error:min_length') +
            ' ' +
            values[i].validateHelper +
            ' ' +
            t('common:character');
        } else if (tmpErrors[i].type === 'min_length') {
          tmpIsError = false;
          tmpErrors[i].status = false;
          tmpErrors[i].type = '';
          tmpErrors[i].helper = '';
        } else if (tmpErrors[i].status) {
          tmpIsError = true;
        }
      }

      /** Check confirm like */
      if (values[i].validate === 'like') {
        let curValue = values[i].value.trim();
        let preValue = values[i - 1] ? values[i - 1].value.trim() : null;
        if (!preValue) return;
        else {
          if (curValue !== preValue) {
            tmpIsError = true;
            tmpErrors[i].status = true;
            tmpErrors[i].type = 'like';
            tmpErrors[i].helper = t('error:not_like');
          } else if (tmpErrors[i].type === 'like') {
            tmpIsError = false;
            tmpErrors[i].status = false;
            tmpErrors[i].type = '';
            tmpErrors[i].helper = '';
          } else if (tmpErrors[i].status) {
            tmpIsError = true;
          }
        }
      }

      if (tmpIsError) {
        return setErrors(tmpErrors);
      }
    }
    if (!tmpIsError) {
      setErrors(tmpErrors);
      return onSubmit(values);
    } else {
      return setErrors(tmpErrors);
    }
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (inputs.length > 0) {
      let tmpInput = null,
        tmpValue = {},
        tmpValues = [];
      let tmpError = {},
        tmpErrors = [];

      for (tmpInput of inputs) {
        let tmpInputRef = createRef();
          tmpValue = {};
          tmpError = {};
        let fValue = -1;
        if (tmpInput.values && tmpInput.type !== 'datePicker') {
          fValue = tmpInput.values.findIndex(f =>
            f[tmpInput.keyToCompare] === tmpInput.value
          );
        }
        if (tmpInput.values && tmpInput.type === 'datePicker' && tmpInput.chooseTime) {
          fValue = tmpInput.values.findIndex(f =>
            f[tmpInput.keyToCompare] === tmpInput.valueTime
          );
        }
        
        tmpValue = {
          ref: tmpInputRef,
          id: tmpInput.id,
          type: tmpInput.type,
          value: fValue !== -1 ? fValue : tmpInput.value,
          values: tmpInput.values,
          required: tmpInput.required,
          validate: tmpInput.validate ? tmpInput.validate.type : '',
          validateHelper: tmpInput.validate ? tmpInput.validate.helper : '',
          secureTextEntry: tmpInput.password,
        };
        if (tmpInput.type === 'datePicker' && tmpInput.chooseTime) {
          tmpValue.value = {date: tmpValue.value, time: tmpInput.timeValue};
        }

        tmpError = {
          status: false,
          type: tmpInput.required
            ? 'required'
            : tmpInput.validate
            ? tmpInput.validate.type
            : '',
          helper: '',
        };
        tmpValues.push(tmpValue);
        tmpErrors.push(tmpError);
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setValues(tmpValues);
      setErrors(tmpErrors);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    onCallbackValue() {
      return {valuesAll: values, errorsAll: errors};
    },
  }));

  /************
   ** RENDER **
   ************/
  let kbType = 'default';
  if (inputs.length === 0) {
    return;
  }
  if (!values) {
    return <View />;
  }
  return (
    <View style={containerStyle}>
      {inputs.map((item, index) => {
        kbType = 'default';
        if (item.email) {
          kbType = 'email-address';
        }
        if (item.phone) {
          kbType = 'phone-pad';
        }
        if (item.number) {
          kbType = 'number-pad';
        }

        if (item.type === 'text') {
          return (
            <Input
              key={item.type + item.id + '_' + index}
              ref={values[index].ref}
              style={[cStyles.mt16, item.style]}
              selectionColor={theme['color-primary-500']}
              nativeID={item.id}
              disabled={loading || item.disabled}
              value={values[index].value}
              label={propsL => (
                <View style={[propsL.style, cStyles.row, cStyles.itemsStart]}>
                  <CText {...propsL}>{t(item.label)}</CText>
                  {item.required && <CText status="danger">{' *'}</CText>}
                </View>
              )}
              placeholder={t(item.holder)}
              keyboardAppearance={themeContext.themeApp}
              keyboardType={kbType}
              returnKeyType={item.return}
              multiline={item.multiline}
              secureTextEntry={values[index].secureTextEntry}
              accessoryRight={
                item.password
                  ? propsR =>
                      RenderIconPassword(
                        propsR,
                        values[index].secureTextEntry,
                        () => onToggleSecureEntry(index),
                      )
                  : undefined
              }
              status={errors && errors[index].status ? 'danger' : 'basic'}
              caption={
                errors && errors[index].status
                  ? errors[index].helper
                  : undefined
              }
              onChangeText={newValue => handleChangeValue(index, newValue)}
              onSubmitEditing={() => handleSubmitEditing(index, item.next)}
            />
          );
        }
        if (item.type === 'select') {
          return (
            <Select
              style={[cStyles.mt16, item.style]}
              label={propsL => (
                <View style={[propsL.style, cStyles.row, cStyles.itemsStart]}>
                  <CText {...propsL}>{t(item.label)}</CText>
                  {item.required && <CText status="danger">{' *'}</CText>}
                </View>
              )}
              status={errors && errors[index].status ? 'danger' : 'basic'}
              caption={
                errors && errors[index] && errors[index].status
                  ? errors[index].helper
                  : undefined
              }
              placeholder="Select one of below..."
              disabled={loading || item.disabled}
              value={(item.values && values[index].value > -1 && item.values[values[index].value])
                ? item.values[values[index].value][item.keyToShow]
                : '-'}
              selectedIndex={new IndexPath(values[index].value)}
              onSelect={idxSelect => handleSelectedIndex(index, idxSelect)}>
              {item.values && item.values.map((itemSelect, indexSelect) => {
                return (
                  <SelectItem
                    key={itemSelect[item.keyToShow] + indexSelect}
                    title={itemSelect[item.keyToShow]}
                  />
                );
              })}
            </Select>
          );
        }
        if (item.type === 'toggle') {
          return (
            <View
              style={[
                item.position === 'left' && cStyles.itemsStart,
                item.position === 'right' && cStyles.itemsEnd,
                item.position === 'center' && cStyles.itemsCenter,
                cStyles.mt16,
                item.style,
                ,
              ]}>
              <Toggle
                disabled={loading || item.disabled}
                checked={values[index].value}
                onChange={() => handleToggle(index)}>
                {item.label}
              </Toggle>
            </View>
          );
        }
        if (item.type === 'radio') {
          return (
            <View style={[cStyles.mt16, item.style]}>
              <CText
                style={{color: theme['color-basic-600']}}
                category={"s1"}>
                {t(item.label)}
              </CText>
              <RadioGroup
                style={
                  item.horizontal ? [cStyles.row, cStyles.itemsCenter] : {}
                }
                selectedIndex={values[index].value}
                onChange={indexRadio => handleChangeRadioIndex(index, indexRadio)}>
                {item.values && item.values.map((itemRadio, indexRadio) => {
                  return (
                    <Radio disabled={loading || item.disabled} key={itemRadio + indexRadio}>
                      {t(itemRadio[item.keyToShow])}
                    </Radio>
                  );
                })}
              </RadioGroup>
            </View>
          );
        }
        if (item.type === 'datePicker') {
          return (
            <View
              style={[
                cStyles.mt16,
                item.chooseTime && cStyles.row,
                item.chooseTime && cStyles.itemsCenter,
                item.chooseTime && cStyles.justifyBetween,
                item.style,
              ]}>
              <View style={{flex: 0.55}}>
              <Datepicker
                dateService={new MomentDateService('vi')}
                label={propsL => (
                  <View style={[propsL.style, cStyles.row, cStyles.itemsStart]}>
                    <CText {...propsL}>{t(item.label)}</CText>
                    {item.required && <CText status="danger">{' *'}</CText>}
                  </View>
                )}
                placeholder={t(item.holder)}
                status={!item.chooseTime
                  ? errors && errors[index].status ? 'danger' : 'basic'
                  : 'basic'}
                caption={!item.chooseTime
                  ?  errors && errors[index].status
                    ? errors[index].helper
                    : undefined
                  : undefined}
                disabled={loading || item.disabled}
                date={!item.chooseTime
                  ? moment(values[index].value)
                  : moment(values[index].value.date)
                }
                min={item.min || moment('2010-01-01')}
                max={item.max || moment('2030-12-31')}
                onSelect={newDate => handleChangeDatePicker(index, newDate, item.chooseTime)}
                accessoryRight={RenderCalendarIcon}
              />
              </View>
              {item.chooseTime && (
                <View style={{flex: 0.4}}>
                  <Select
                    label={propsL => (
                      <View style={[propsL.style, cStyles.row, cStyles.itemsStart]}>
                        <CText {...propsL}>{t(item.timeLabel)}</CText>
                        {item.required && <CText status="danger">{' *'}</CText>}
                      </View>
                    )}
                    caption={item.chooseTime
                      ?  errors && errors[index].status
                        ? errors[index].helper
                        : undefined
                      : undefined}
                    status={errors && errors[index].status ? 'danger' : 'basic'}
                    placeholder="Select one of below..."
                    disabled={loading || item.disabled}
                    value={(item.values &&
                      values[index].value.time > -1 &&
                      item.values[values[index].value.time])
                      ? item.values[values[index].value.time][item.keyToShow]
                      : '-'}
                    selectedIndex={new IndexPath(values[index].value.time)}
                    onSelect={idxSelect => handleSelectedIndex(index, idxSelect, item.chooseTime)}>
                    {item.values && item.values.map((itemSelect, indexSelect) => {
                      return (
                        <SelectItem
                          key={itemSelect[item.keyToShow] + indexSelect}
                          title={itemSelect[item.keyToShow]}
                        />
                      );
                    })}
                  </Select>
                </View>
              )}
            </View>
          );
        }
        return null;
      })}

      {/** Custom adding for form */}
      {customAddingForm}

      {/** Buttons */}
      {labelButton !== '' && !labelButton2 && (
        <Button
          style={cStyles.mt24}
          appearance={typeButton}
          // accessoryLeft={loading && RenderLoadingIndicator}
          disabled={disabledButton}
          onPress={onCheckValidate}>
          {t(labelButton)}
        </Button>
      )}
      {labelButton !== '' && labelButton2 && (
        <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.mt24]}>
          <Button
            style={{flex: 0.45}}
            appearance={typeButton2}
            status={statusButton2}
            disabled={disabledButton}
            onPress={onSubmit2}>
            {t(labelButton2)}
          </Button>
          <Button
            style={{flex: 0.45}}
            appearance={typeButton}
            // accessoryLeft={loading && RenderLoadingIndicator}
            disabled={disabledButton}
            onPress={onCheckValidate}>
            {t(labelButton)}
          </Button>
        </View>
      )}
    </View>
  );
});

CForm.propTypes = {
  containerStyle: PropTypes.object,
  type: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  inputs: PropTypes.array.isRequired,
  customAddingForm: PropTypes.any,
  disabledButton: PropTypes.bool,
  labelButton: PropTypes.string,
  labelButton2: PropTypes.string,
  typeButton: PropTypes.oneOf(['filled', 'outline', 'ghost']),
  typeButton2: PropTypes.oneOf(['filled', 'outline', 'ghost']),
  onSubmit: PropTypes.func.isRequired,
  onSubmit2: PropTypes.func,
};

export default CForm;
