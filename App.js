import React, { useState } from 'react';
import { Text, View, Button, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const QUERY_ALL_USERS = gql`
query getusers{
users {
   ...on UsersSuccessfulResult{
   users {
    id
    age
    name
    nationality
    username
   }
   }
   ...on UsersErrorResult{
   message
   }

}
}
`

const CREATE_USER_MUTATION = gql`
mutation CreateUser($input:createUserInput!) {
  createUser(input:$input) {
  name
  username
  age 
  nationality
  }
}
`

function ExchangeRates() {
  const { loading, error, data, refetch } = useQuery(QUERY_ALL_USERS);
  const [createUser] = useMutation(CREATE_USER_MUTATION)
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");


  return <ScrollView style={{ marginTop: 100 }}>
    {data !== undefined && data.users.users.map(({ name }) => (
      <Text>
        {name}
      </Text>))}
      <View style={{ height: 300 }}>
      <TextInput placeholder='name ' value={name} onChange={(e)=>{setName(e.nativeEvent.text)}} style={{borderWidth:1,borderColor:"blue",marginVertical:5}} />
      <TextInput placeholder='username ' value={username} onChange={(e)=>{setUserName(e.nativeEvent.text)}} style={{borderWidth:1,borderColor:"blue",marginVertical:5}} />
      <TextInput placeholder='age ' value={age} onChange={(e)=>{setAge(Number(e.nativeEvent.text))}} style={{borderWidth:1,borderColor:"blue",marginVertical:5}} />
      <TextInput placeholder='nationality ' value={nationality} onChange={(e)=>{setNationality(e.nativeEvent.text.toUpperCase())}} style={{borderWidth:1,borderColor:"blue",marginVertical:5}} />
      <TouchableOpacity onPress={()=>{
        createUser({
          variables: {
              input: {
                  name,
                  username,
                  age,
                  nationality
              }
          }
      })
      refetch()
      }} style={{justifyContent:"center",alignItems:"center",alignSelf:"center",width:150,height:50}}>
        <Text>Add User</Text>
      </TouchableOpacity>
    </View>
    <View style={{ height: 300 }}>
      <Text> </Text>
    </View>
  </ScrollView>
}



export default function App() {
  return (
    <ApolloProvider client={client}>
      <ExchangeRates />


    </ApolloProvider>
  );
}

