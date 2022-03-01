import React, {useEffect, useState} from 'react';
import {Image, View, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QuantitySelector from '../QuantitySelector';
import styles from './styles';
import {gql, useMutation} from '@apollo/client';

const UPDATE_ORDER_ITEM = gql`
  mutation UpdateOrderItem($id: ID!, $input: UpdateOrderItemInput!) {
    updateOrderItem(id: $id, input: $input) {
      _id
      quantity
      option
    }
  }
`;

const DELETE_ORDER_ITEM = gql`
  mutation DeleteOrderItem($id: ID!) {
    deleteOrderItem(id: $id) {
      message
    }
  }
`;

interface CartProductItemProps {
  cartItem: {
    _id: string;
    quantity: number;
    option?: string;
    product: {
      _id: string;
      title: string;
      image: string;
      avgRating: number;
      ratings: number;
      price: number;
      oldPrice?: number;
    };
  };
  dbOrderItem: any;
  setDbOrderItem: (newData: any) => void;
}

const CartProductItem = ({cartItem}: CartProductItemProps) => {
  const {_id: orderItemId, quantity: quantityProp, product} = cartItem;
  const [updateOrderItem] = useMutation(UPDATE_ORDER_ITEM);
  const [deleteOrderItem] = useMutation(DELETE_ORDER_ITEM, {
    refetchQueries: ['GetAllOrderItemNotComplete'],
  });

  const [quantity, setQuantity] = useState(quantityProp);
  console.log('quantity ', quantity);
  console.log('quantity prop', quantityProp);

  useEffect(() => {
    setQuantity(quantityProp);
  }, [quantityProp, cartItem]);

  const updateQuantity = quantity => {
    if (quantity === 0) {
      console.log('delete...');
      // delete order item
      deleteOrderItem({
        variables: {
          id: orderItemId,
        },
        onCompleted: () => {
          console.log('se elimino');
          // update response
        },
      });
    } else {
      // update with the new quantity value
      updateOrderItem({
        variables: {
          id: orderItemId,
          input: {
            quantity,
          },
        },
        onCompleted: () => {
          console.log('se actualizo');
          // update response
        },
      });
      setQuantity(quantity);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <Image style={styles.image} source={{uri: product.image}} />
        <View style={styles.rightContainer}>
          <Text style={styles.title} numberOfLines={3}>
            {product.title}
          </Text>
          {/* Ratings */}
          <View style={styles.ratingsContainer}>
            {[0, 0, 0, 0, 0].map((el, i) => (
              <FontAwesome
                key={i}
                style={styles.star}
                name={i < Math.floor(product.avgRating) ? 'star' : 'star-o'}
                size={18}
                color={'#e47911'}
              />
            ))}
            <Text>{product.ratings}</Text>
          </View>
          <Text style={styles.price}>
            from ${product.price}
            {product.oldPrice && (
              <Text style={styles.oldPrice}> ${product.oldPrice}</Text>
            )}
          </Text>
        </View>
      </View>
      <View style={styles.quantityContainer}>
        <QuantitySelector quantity={quantity} setQuantity={updateQuantity} />
      </View>
    </View>
  );
};

export default CartProductItem;
