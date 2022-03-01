import {View, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import React from 'react';
import ProductItem from '../../components/ProductItem';
import {gql, useQuery} from '@apollo/client';

// import products from '../../data/products';

const ALL_PRODUCTS = gql`
  query AllProducts {
    allProducts {
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

const HomeScreen = ({searchValue}: {searchValue: string}) => {
  const {data, loading} = useQuery(ALL_PRODUCTS);
  console.log(searchValue);
  // console.log('products', data.allProducts);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.page}>
      {/* Render product component */}
      <FlatList
        data={data.allProducts}
        renderItem={({item}) => <ProductItem item={item} />}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
});

export default HomeScreen;
