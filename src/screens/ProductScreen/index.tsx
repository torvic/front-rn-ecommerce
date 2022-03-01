import {Text, ScrollView, View, Alert, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {useRoute} from '@react-navigation/native';
import {gql, useQuery, useMutation} from '@apollo/client';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

// import product from '../../data/product';
import QuantitySelector from '../../components/QuantitySelector';
import Button from '../../components/Button';
import ImageCarousel from '../../components/ImageCarousel';

const PRODUCT = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      _id
      title
      description
      image
      images
      options
      avgRating
      ratings
      price
      oldPrice
      createdAt
      updatedAt
    }
  }
`;

const ADD_ORDER_ITEM = gql`
  mutation AddNewOrderItem($input: OrderItemInput!) {
    addNewOrderItem(input: $input) {
      _id
    }
  }
`;

const ProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id} = route.params;
  const {data, loading} = useQuery(PRODUCT, {
    variables: {id},
  });
  const [addOrderItem, {data: dataOrderItem, loading: loadingOrderItem}] =
    useMutation(ADD_ORDER_ITEM, {
      refetchQueries: ['GetAllOrderItemNotComplete'],
    });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  console.log('id', id);
  console.log('data', data);

  useEffect(() => {
    if (data?.getProductById?.options) {
      setSelectedOption(data.getProductById.options[0]);
    }
  }, [data?.getProductById]);

  const addToCartHandler = () => {
    // add new order item
    addOrderItem({
      variables: {
        input: {
          quantity,
          option: selectedOption,
          product: id,
        },
      },
      onCompleted: () => {
        navigation.navigate('HomeScreen');
        Alert.alert('Added successfully');
      },
    });
  };

  /* if (error || errorOrderItem) {
    Alert.alert('There was a problem, please try again later');
  } */

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>{data.getProductById.title}</Text>
      {/* Image carousel */}
      <ImageCarousel images={data.getProductById.images} />
      {/* Option Selector */}
      <Picker
        selectedValue={selectedOption}
        onValueChange={itemValue => setSelectedOption(itemValue)}>
        {data.getProductById.options.map((option: any, index: any) => (
          <Picker.Item label={option} value={option} key={index} />
        ))}
      </Picker>
      {/* Price */}
      <Text style={styles.price}>
        from ${data.getProductById.price}
        {data.getProductById.oldPrice && (
          <Text style={styles.oldPrice}>${data.getProductById.oldPrice}</Text>
        )}
      </Text>
      {/* Description */}
      <Text style={styles.description}>{data.getProductById.description}</Text>
      {/* Quantity Selector*/}
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      {/* Button */}
      <Button
        text={'Add To Cart'}
        onPress={addToCartHandler}
        containerStyles={{backgroundColor: '#e3c905'}}
      />
      {loadingOrderItem && (
        <View>
          <Text>Añadiendo al carrito...</Text>
        </View>
      )}
      {/* <Button
        text={'Buy Now'}
        onPress={() => {
          console.warn('Buy now');
        }}
      /> */}
    </ScrollView>
  );
};

export default ProductScreen;
