/**
 ** Name: Dashboard
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Dashboard.js
 **/
import React, {useState, useEffect} from 'react';
import {FlatList} from 'react-native';
/** COMPONENTS */
import CContainer from '~/components/CContainer';
import CContent from '~/components/CContent';
import Item from './components/Item';
/** COMMON */
import Common from './common';
import {cStyles} from '~/utils/style';
import {IS_ANDROID} from '~/utils/helper';

function Dashboard(props) {
  const [loading, setLoading] = useState(true);

  /** HANDLE FUNC */
  const handleItem = data => {
    props.navigation.navigate(data);
  };

  /** LIFE CYCLE */
  useEffect(() => {
    setLoading(false);
  }, []);

  /** RENDER */
  return (
    <CContainer
      loading={loading}
      header
      title={'dashboard:title'}
      content={
        <CContent padder>
          <FlatList
            style={cStyles.flex1}
            data={Common.Data}
            renderItem={({item, index}) => {
              return <Item index={index} data={item} onPress={handleItem} />;
            }}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            removeClippedSubviews={IS_ANDROID}
          />
        </CContent>
      }
    />
  );
}

export default Dashboard;
