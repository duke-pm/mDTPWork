/* eslint-disable react-hooks/exhaustive-deps */
/**
 ** Name: Filter request
 ** Author: DTP-Education
 ** CreateAt: 2021
 ** Description: Description of Filter.js
 **/
import PropTypes from 'prop-types';
import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Select, SelectItem, Button, Icon, Divider,
  Layout, IndexPath, Spinner, Avatar,
} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import moment from 'moment';
/* COMPONENTS */
import CText from '~/components/CText';
/* COMMON */
import {Assets } from '~/utils/asset';
import {cStyles} from '~/utils/style';
import {sW} from '~/utils/helper';
import {DATA_YEAR_FILTER} from '~/configs/constants';

const RenderCheckIcon = props => (
  <Icon {...props} name="done-all-outline" />
);

const RenderAvatar = props => (
  <Avatar size="tiny" source={Assets.iconUser} />
);

function Filter(props) {
  const {t} = useTranslation();
  const {
    isYear = false,
    isSector = false,
    data = {
      ownerID: null,
      statusID: null,
      sectorID: null,
    },
    masterData = {
      users: [],
      status: [],
      sectors: [],
    },
    onFilter = () => null,
  } = props;
  let startCheckData = {
    year: true,
    sector: true,
    owner: true,
    status: true,
  };

  /** Use State */
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(-1);
  const [selectedOwner, setSelectedOwner] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);

  /*****************
   ** HANDLE FUNC **
   *****************/
  const handleFilter = () => {
    let tmpSectorsID = [], tmpOwnersID = [], tmpStatusID = [];
    if (isSector && selectedSector.length > 0) {
      for (let select of selectedSector) {
        tmpSectorsID.push(masterData.sectors[select - 1]['sectorID']);
      }
    }
    if (selectedOwner.length > 0) {
      for (let select of selectedOwner) {
        tmpOwnersID.push(masterData.users[select - 1]['empID']);
      }
    }
    if (selectedStatus.length > 0) {
      for (let select of selectedStatus) {
        tmpStatusID.push(masterData.status[select - 1]['statusID']);
      }
    }

    return onFilter(
      isYear ? Number(DATA_YEAR_FILTER[year - 1]) : null,
      tmpSectorsID.join(),
      tmpOwnersID.join(),
      tmpStatusID.join(),
    );
  };

  /****************
   ** LIFE CYCLE **
   ****************/
  useEffect(() => {
    if (isYear) {
      if (loading && year === -1) {
        let fYear = DATA_YEAR_FILTER.findIndex(f => f == data.year);
        if (fYear === -1) {
          fYear = DATA_YEAR_FILTER.findIndex(f => f == moment().year());
        }
        setYear(new IndexPath(fYear));
        startCheckData.year = false;
      }
    }
  }, [
    loading,
    isYear,
    year,
  ]);

  useEffect(() => {
    if (loading && data.ownerID) {
      let arrOwner = data.ownerID.split(','),
        tmpSelected = [];
      for (let item of arrOwner) {
        let fOwner = masterData.users.findIndex(f => f.empID == item);
        if (fOwner !== -1) tmpSelected.push(new IndexPath(fOwner));
      }
      setSelectedOwner(tmpSelected);
      startCheckData.owner = false;
    } else {
      startCheckData.owner = false;
    }
  }, [
    loading,
    data.ownerID,
  ]);

  useEffect(() => {
    if (loading && data.statusID) {
      let arrStatus = data.statusID.split(','),
        tmpSelected = [];
      for (let item of arrStatus) {
        let fStatus = masterData.status.findIndex(f => f.statusID == item);
        if (fStatus !== -1) tmpSelected.push(new IndexPath(fStatus));
      }
      setSelectedStatus(tmpSelected);
      startCheckData.status = false;
    } else {
      startCheckData.status = false;
    }
  }, [
    loading,
    data.statusID,
  ]);

  useEffect(() => {
    if (loading && data.sectorID) {
      let arrSector = data.sectorID.split(','),
        tmpSelected = [];
      for (let item of arrSector) {
        let fSector = masterData.sectors.findIndex(f => f.sectorID == item);
        if (fSector !== -1) tmpSelected.push(new IndexPath(fSector));
      }
      setSelectedSector(tmpSelected);
      startCheckData.sector = false;
    } else {
      startCheckData.sector = false;
    }
  }, [
    loading,
    data.sectorID,
  ]);

  useEffect(() => {
    if (loading && isYear) {
      if (!startCheckData.year && !startCheckData.owner && !startCheckData.status) {
        setLoading(false);
      } 
    }
    if (loading && isSector) {
      if (!startCheckData.sector && !startCheckData.owner && !startCheckData.status) {
        setLoading(false);
      } 
    }
  }, [
    loading,
    isYear,
    isSector,
    startCheckData
  ]);

  /************
   ** RENDER **
   ************/
  const displayYear = DATA_YEAR_FILTER[year - 1];
  const displayOwner = selectedOwner.map(index => {
    return masterData.users[index.row]['empName'];
  });
  const displayStatus = selectedStatus.map(index => {
    return masterData.status[index.row]['statusName'];
  });
  const displaySector = selectedSector.map(index => {
    return masterData.sectors[index.row]['sectorName'];
  });
  return (
    <Layout style={[cStyles.pb20, styles.con_filter]}>
      <View style={[cStyles.row, cStyles.itemsCenter, cStyles.justifyBetween, cStyles.pb5]}>
        <CText category="s1">{t('common:filter').toUpperCase()}</CText>
        <Button
          appearance="ghost"
          accessoryLeft={RenderCheckIcon}
          onPress={handleFilter}
        />
      </View>
      <Divider />
      <View style={[cStyles.flex1, cStyles.mt16]}>
        {loading && 
          <View style={cStyles.flexCenter}>
            <Spinner style={cStyles.py10} />
          </View>
        }
        {!loading && isYear && (
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Select
              style={cStyles.flex1}
              label={t('project_management:year')}
              placeholder={t('project_management:holder_year')}
              value={displayYear}
              selectedIndex={year}
              onSelect={setYear}>
              {DATA_YEAR_FILTER.map((itemY, indexY) => (
                <SelectItem key={itemY + '_' + indexY} title={itemY} />
              ))}
            </Select>
          </View>
        )}
        {!loading && isSector && masterData.sectors.length > 0 && (
          <View style={[cStyles.row, cStyles.itemsCenter]}>
            <Select
              style={cStyles.flex1}
              label={t('project_management:sector')}
              placeholder={t('project_management:holder_sector')}
              multiSelect={true}
              value={displaySector.join(', ')}
              selectedIndex={selectedSector}
              onSelect={setSelectedSector}>
              {masterData.sectors.map((itemS, indexS) => (
                <SelectItem key={itemS.sectorID + '_' + indexS}
                  title={itemS.sectorName}
                />
              ))}
            </Select>
          </View>
        )}
        {!loading && masterData.users.length > 0 && (
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
            <Select
              style={cStyles.flex1}
              label={t('project_management:title_owner')}
              placeholder={t('project_management:holder_owner')}
              multiSelect={true}
              value={displayOwner.join(', ')}
              selectedIndex={selectedOwner}
              onSelect={setSelectedOwner}>
              {masterData.users.map((itemO, indexO) => (
                <SelectItem key={itemO.empID + '_' + indexO}
                  title={propsT => 
                    <View style={[cStyles.row, cStyles.itemsCenter, propsT.style]}>
                      {RenderAvatar()}
                      <CText style={[propsT.style]}>{itemO.empName}</CText>
                    </View>
                  }
                />
              ))}
            </Select>
          </View>
        )}

        {!loading && masterData.status.length > 0 && (
          <View style={[cStyles.row, cStyles.itemsCenter, cStyles.mt16]}>
            <Select
              style={cStyles.flex1}
              label={t('project_management:status_filter')}
              placeholder={t('project_management:holder_status')}
              multiSelect={true}
              value={displayStatus.join(', ')}
              selectedIndex={selectedStatus}
              onSelect={setSelectedStatus}>
              {masterData.status.map((itemS, indexS) => (
                <SelectItem key={itemS.statusID + '_' + indexS}
                  title={propsT =>
                    <View style={propsT.style}>
                      <CText
                        style={{color: itemS.colorCode}}
                        category="s1">
                        {itemS.statusName}
                      </CText>
                    </View>
                  }
                />
              ))}
            </Select>
          </View>
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  con_filter: {width: sW('80%')},
});

Filter.propTypes = {
  isYear: PropTypes.bool.isRequired,
  isSector: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default Filter;
