import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import CartProductItem from '../../components/CartProductItem';
import {useNavigation} from '@react-navigation/native';
import Button from '../../components/Button';
import {gql, useQuery} from '@apollo/client';

import products from '../../data/cart';

const ALL_ORDER_ITEMS = gql`
  query GetAllOrderItemNotComplete {
    getAllOrderItemNotComplete {
      _id
      quantity
      option
      product {
        _id
        title
        image
        avgRating
        ratings
        price
        oldPrice
      }
    }
  }
`;

const ShopingCartScreen = () => {
  const {data, loading} = useQuery(ALL_ORDER_ITEMS);
  const navigation = useNavigation();
  const [dbOrderItem, setDbOrderItem] = useState(null);

  // console.log('response ', response);

  useEffect(() => {
    if (data) {
      setDbOrderItem(data.getAllOrderItemNotComplete);
    }
  }, [data]);

  console.log('data', data);

  const onCheckout = () => {
    navigation.navigate('Address');
  };

  if (loading) {
    return (
      <View>
        <Text>Cargando...</Text>
      </View>
    );
  }
  const totalPrice = data.getAllOrderItemNotComplete.reduce(
    (summedPrice, product) =>
      summedPrice + product.product.price * product.quantity,
    0,
  );

  return (
    <View style={styles.page}>
      {/* Render Product Componet */}
      <FlatList
        data={dbOrderItem}
        renderItem={({item}) => (
          <CartProductItem
            cartItem={item}
            dbOrderItem={dbOrderItem}
            setDbOrderItem={setDbOrderItem}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <Text style={{fontSize: 18}}>
              Subtotal ({dbOrderItem && dbOrderItem.length} items):{' '}
              <Text style={{color: '#e47911', fontWeight: 'bold'}}>
                ${totalPrice.toFixed(2)}
              </Text>
            </Text>
            <Button
              text="Proceed to checkout"
              onPress={onCheckout}
              containerStyles={{
                backgroundColor: '#f7e300',
                borderColor: '#c7b702',
              }}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
});

export default ShopingCartScreen;
