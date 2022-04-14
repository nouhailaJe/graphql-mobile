import React from 'react';
import { Text, View, Button } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});
const GET_ACCOUNTS = gql`
  query ExampleQuery {
    Accounts {
      id,
      name,
      balance
      transactions {
        id
        amount
        created_at
      }
    }
  }
`;
const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($deleteAccountId: Int!) {
    deleteAccount(id: $deleteAccountId) {
      id
    }
  }
`;
function ExchangeRates() {
  const { loading, error, data,refetch } = useQuery(GET_ACCOUNTS);
  const [DeleteAccount, { }] = useMutation(DELETE_ACCOUNT);

  return data !== undefined && data.Accounts.map(({ id, name, balance }) => (
    <View key={id} style={{ marginTop: 100 }}>
      <Text>
        {name}:{balance}
      </Text>
      <Button
        onPress={() => {DeleteAccount({variables: { deleteAccountId: id }});refetch()}}
        title="Delete"
        color="#841584"
      />
    </View>
  ));
}
export default function App() {
  return (
    <ApolloProvider client={client}>
      <ExchangeRates />
    </ApolloProvider>
  );
}

