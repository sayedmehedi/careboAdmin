import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({navigation}) => {
  
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    try {
      AsyncStorage.getItem('userType').then(value => {
        if (value != null) {
          var userType = value;
          if (userType == 'delivery_boy') {
            navigation.replace('riderHome');
          }
          if (userType == 'Admin') {
            navigation.replace('home');
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    messaging()
      .getToken()
      .then(fcmToken => {
        if (fcmToken) {
          console.log('device token', fcmToken);
          setDeviceToken(fcmToken);
        } else {
        }
      });
  }, []);

  const submitButtonPress = async () => {
    if (userName.length == 0 || password.length == 0) {
      Alert.alert('Please enter all the fields');
    } else {
      setIsLoading(true);

      try {
        var user = {
          UserName: userName,
          Password: password,
        };
        await AsyncStorage.setItem('UserData', JSON.stringify(user));
        const settings = {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userName,
            password: password,
          }),
        };
        const response = await fetch(
          'https://www.api-care-box.click/api/token/Admin_Deliveryboy/',
          settings,
        );
        const responseJson = await response.json();

        if (
          responseJson.UserType == 'Admin' ||
          responseJson.UserType == 'delivery_boy'
        ) {
          await AsyncStorage.setItem('token', responseJson.access);
          await AsyncStorage.setItem('userType', responseJson.UserType);

          if (responseJson.access) {
            const api =
              'https://api-care-box.click/api/user/assignDeviceRegIdAPI/';
            const body = {
              Device_Registration_Id: deviceToken,
            };
            try {
              axios
                .put(api, body, {
                  headers: {
                    Authorization: `Bearer ${responseJson.access}`,
                  },
                })
                .then(res => {
                  setIsLoading(false);
                  if (responseJson.UserType == 'Admin') {
                    navigation.replace('home');
                  }
                  if (responseJson.UserType == 'delivery_boy') {
                    navigation.replace('riderHome');
                  }
                })
                .catch(error => console.log('error', error));
            } catch (error) {
              console.log('error in getting order data : ', error);
            }
          }
        } else {
          setIsLoading(false);
          Alert.alert('Please check username and password');
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        Alert.alert('Error', 'Something went wrong');
      }
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-around',
      }}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 28, color: 'black',}}>Care-Box</Text>
        <Text style={{color: '#BA0051', fontSize: 30}}>
          Admin <Text style={{color: 'black'}}>App</Text>{' '}
        </Text>
      </View>

      <View style={{alignSelf: 'center'}}>
        <Text style={{fontSize: 25, marginVertical: 10}}>Login</Text>
        <TextInput
          onChangeText={text => setUserName(text)}
          placeholder="User Name"
          style={styles.inputStyle}
        />
        <TextInput
          secureTextEntry
          onChangeText={text => setPassword(text)}
          placeholder="Password"
          style={[styles.inputStyle, {marginTop: 10}]}
        />

        <TouchableOpacity
          onPress={submitButtonPress}
          style={styles.loginButton}>
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{color: 'white', fontSize: 18, fontWeight: '300'}}>
              Login
            </Text>
          )}
        </TouchableOpacity>
      </View>
      <View style={{alignSelf: 'center'}}>
        <Image
          source={require('../assets/Carebox_logo.png')}
          style={{height: 80, width: 150}}
        />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputStyle: {
    height: 60,
    width: 280,
    backgroundColor: '#ECECEC',
    borderRadius: 5,
    padding: 10,
  },
  loginButton: {
    height: 40,
    width: 100,
    backgroundColor: '#BD0451',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
});
