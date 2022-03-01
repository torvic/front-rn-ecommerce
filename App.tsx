/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {View, StatusBar, useColorScheme} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Router from './src/router';

const httpLink = createHttpLink({
  uri: 'https://torvic-ecommerce.herokuapp.com/graphql',
});

const authLink = setContext((_, {headers}) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : '',
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyMTdjYTU3Yjk1MGI2ZmRlN2JkNzlkNSIsImlhdCI6MTY0NjE0NzI3MiwiZXhwIjoxNjQ2MjMzNjcyfQ.pdkTA_xG2gCHIZdBuxT4V2dLKunle2ON37w4ScAPphc',
    },
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <ApolloProvider client={client}>
      <View style={backgroundStyle}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Router />
      </View>
    </ApolloProvider>
  );
};

export default App;
