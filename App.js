import React, { useState } from 'react';
import { Text, View, Button,TextInput } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

// Initialize Apollo Client

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/subscriptions',
  connectionParams: {
    authToken: user.authToken,
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
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

const ADD_ACCOUNT = gql`
mutation CreateAccount($name: String) {
  createAccount(name: $name) {
    name
  }
}
`;
const ACCOUNTS_SUBSCRIPTION = gql`
  subscription OnAccountAdded($id: Int!) {
    accountAdded(id: $id) {
      id
      name
    }
  }
`;

function LatestAccount({ text }) {
  const { data, loading } = useSubscription(
    ACCOUNTS_SUBSCRIPTION,
    { variables: { text } }
  );
  return <Text>New Account: {!loading && data.accountAdded.name}</Text>;
}

const COMMENTS_QUERY = gql`
  query CommentsForPost($postID: ID!) {
    post(postID: $postID) {
      comments {
        id
        content
      }
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

function AddAccount() {
  const [accountText,setAccountText] = useState("");
  const { loading, error, data,refetch } = useQuery(GET_ACCOUNTS);
  const [CreateAccount, { }] = useMutation(ADD_ACCOUNT);
  return (
    <View  style={{ marginTop: 100 ,marginLeft:30}}>
     <TextInput placeholder='account name' value={accountText} onChange={(e)=>setAccountText(e.nativeEvent.text)}></TextInput>
      <Button
        onPress={() => { CreateAccount({
          variables: { name: accountText }});refetch()}}
        title="Add Account"
        color="#841584"
      />
    </View>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <ExchangeRates />
      <AddAccount />
      
    </ApolloProvider>
  );
}

