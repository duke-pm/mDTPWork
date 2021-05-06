/**
 ** Name: Allocation
 ** Author: 
 ** CreateAt: 2021
 ** Description: Description of Allocation.js
 **/
import React, { useState, useEffect } from 'react';
import {
  FlatList
} from 'react-native';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import Item from './components/Item';
/** COMMON */
import MockupData from './common/mockup';
import { cStyles } from '~/utils/style';
import { IS_ANDROID } from '~/utils/helper';


function Allocation(props) {

  const [loading, setLoading] = useState(true);

  /** HANDLE FUNC */
  const handleItem = (data) => {
    props.navigation.navigate(data);
  };

  /** LIFE CYCLE */
  useEffect(() => {
    setLoading(false);
  }, []);

  /** RENDER */
  return (
    <CContainer
      safeArea={{
        top: true,
        bottom: false,
      }}
      loading={loading}
      title={'approved:assets'}
      header
      hasBack
      content={
        <CContent padder>
          <FlatList
            style={cStyles.flex1}
            data={MockupData.Approved}
            renderItem={({ item, index }) => {
              return (
                <Item
                  index={index}
                  data={item}
                  onPress={handleItem}
                />
              )
            }}
            keyExtractor={(item, index) => index.toString()}
            removeClippedSubviews={IS_ANDROID}
          />
        </CContent>
      }
    />
  )
};

export default Allocation;
