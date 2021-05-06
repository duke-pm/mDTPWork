/**
 ** Name: ModalProcess
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of ModalProcess.js
 **/
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity
} from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import Assets from '~/utils/asset/Assets';
import { colors, cStyles } from '~/utils/style';
import moment from 'moment';
/* REDUX */


function ModalProcess(props) {
  const { t } = useTranslation();

  const {
    onPressClose
  } = props;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  /** FUNC */
  const onPrepareData = () => {
    let dataProcess = props.dataProcess;
    let dataRequest = props.dataRequest;
    let tmpFilter = [];

    if (dataProcess && dataProcess.length > 0) {
      let filter = dataProcess.filter(f => f.requestID === dataRequest.requestID);
      if (filter.length > 0) {
        let tmpItem = {};
        for (let item of filter) {
          tmpItem = {};
          tmpItem.time = `${moment(item.approveDate, 'DD/MM/YYYY - HH:mm')
            .format('DD/MM/YYYY')}\n${moment(item.approveDate, 'DD/MM/YYYY - HH:mm')
              .format('HH:mm')}`;
          tmpItem.title = item.requestTypeName;
          tmpItem.description = t('approved_lost_damaged:person_approved') + item.personApproveName;
          tmpItem.reason =
            (!item.statusID && item.reason)
              ? t('approved_lost_damaged:person_approved') + item.reason
              : '';

          if (!item.statusID && !item.reason) {
            tmpItem.circleColor = colors.ORANGE;
          } else if (item.statusID && !item.reason) {
            tmpItem.circleColor = colors.GREEN;
          } else if (!item.statusID && item.reason) {
            tmpItem.circleColor = colors.RED;
          } else if (item.statusID && item.reason) {
            tmpItem.circleColor = colors.YELLOW;
          }
          tmpFilter.push(tmpItem);
        }
      }
    }
    setData(tmpFilter);
    setLoading(false);
  }

  /** LIFE CYCLE */
  useEffect(() => {
    onPrepareData();
  }, [
    props.show,
  ]);

  /** RENDER */
  return (
    <Modal
      visible={props.show}
      animationType={'fade'}
      onRequestClose={onPressClose}
      transparent
    >
      <TouchableOpacity
        style={[cStyles.flex1, cStyles.center, styles.bg]}
        activeOpacity={1}
        onPress={onPressClose}>
        <View style={[cStyles.rounded1, styles.container]}>
          <View style={[
            cStyles.py10,
            cStyles.px60,
            cStyles.itemsCenter,
            cStyles.roundedTopLeft1,
            cStyles.roundedTopRight1,
            styles.header,
          ]}>
            <CText styles={'H6 colorWhite'} label={'approved_lost_damaged:show_timeline'} />
          </View>

          <View style={cStyles.p16}>
            {loading &&
              <View style={[cStyles.py16, cStyles.itemsCenter]}>
                <ActivityIndicator color={colors.GRAY_500} />
              </View>
            }

            {!loading &&
              <Timeline
                style={cStyles.pt20}
                data={data}
                separator={true}
                circleSize={20}
                circleColor='rgb(45,156,219)'
                lineColor={colors.PRIMARY}
                timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
                timeStyle={[
                  cStyles.textMeta,
                  cStyles.rounded1,
                  cStyles.fontBold,
                  cStyles.colorWhite,
                  cStyles.p6,
                  cStyles.textCenter,
                  { backgroundColor: colors.SECONDARY, overflow: 'hidden' }
                ]}
                descriptionStyle={{ color: 'gray' }}
                options={{
                  style: { paddingTop: 5 }
                }}
              />
            }
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bg: {
    backgroundColor: colors.BACKGROUND_MODAL,
  },
  container: {
    backgroundColor: colors.WHITE,
  },
  header: {
    backgroundColor: colors.PRIMARY,
  }
});

export default ModalProcess;
