import { Button } from 'react-native';
import * as React from 'react';
import  {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from "expo-web-browser";
import * as Google from 'expo-auth-session/providers/google'
import AsyncStorage from '@react-native-async-storage/async-storage';


import MapView from 'react-native-maps';

WebBrowser.maybeCompleteAuthSession();
export default function App() {

  const [location, setLocation] = useState();

  useEffect(() =>{

    const getPermission = async() => {
      let { status} = await Location.requestForegroundPermissionAsync();
      if  (status !== 'granted') {
        console.log("Please grant location Permission");
        return;
      }
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation)
        console.log("Location");
        console.log(currentLocation);
    };
    getPermission();

  }, []);

  const [userInfo, setUserInfo] = React.useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({

        webClientId: 
         "500031332647-tfpfq4n40hglb3ueq8o9kuo46kcddo7d.apps.googleusercontent.com",
        androidClientId:
         "500031332647-fvanpq8qiecooimnm39bl9a8mt1t4mr7.apps.googleusercontent.com",

  })

  React.useEffect(() => {

    handleSignInWithGoogle();
  }, [response]);

  async function handleSignInWithGoogle(){
   const user =  await AsyncStorage.getItem("@user");

   if(!user){
    if(response?.type === "success"){
      await getUserInfo(response.authentication.accessToken);
    }
   }else{
    setUserInfo(JSON.parse(user))
   }

  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try{
      const response =await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user",JSON.stringify(user));
      setUserInfo(user);
    }catch(error){
        // error message
    }
  };

  return (
    <View style={styles.container}>
        <MapView style={styles.map} />
        <Text>Hospital Near Me</Text>
      <Button title="Sign in With Google" onPress={ () => promptAsync()} />
      <Button 
      title="Delete Local Storage" 
      onPress={ () => AsyncStorage.removeItem("@user")} 

      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '80%',
  },
});

