/**
 ** Name: Item Dashboard
 ** Author:
 ** CreateAt: 2021
 ** Description: Description of Item.js
 **/
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
/* COMPONENTS */
import CText from '~/components/CText';
import CContent from '~/components/CContent';
/** COMMON */
import {cStyles, colors} from '~/utils/style';
import {sW} from '~/utils/helper';
/* REDUX */

function Item(props) {
  const {data = null, onPress = () => {}} = props;

  if (!data) {
    return null;
  }

  return (
    <CContent>
      <View style={[cStyles.flex1, cStyles.mt10]}>
        <FlatList
          columnWrapperStyle={cStyles.justifyStart}
          data={data.children}
          renderItem={({item, index}) => {
            return (
              <View style={[cStyles.itemsCenter, styles.item]}>
                <TouchableOpacity onPress={() => onPress(item.name)}>
                  <Image
                    style={styles.image_item}
                    source={item.icon}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>

                <CText
                  styles={'pt10 textCenter'}
                  label={item.title}
                  numberOfLines={3}
                />
              </View>
            );
          }}
          numColumns={4}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </CContent>
  );
}

const styles = StyleSheet.create({
  container: {
    height: sW('20%'),
    width: sW('20%'),
    backgroundColor: colors.WHITE,
  },
  item: {flex: 0.33, width: sW('21%')},
  image_item: {
    height: sW('21%'),
    width: sW('21%'),
  },
});

export default Item;
